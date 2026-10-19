-- Add the verified server path first. Public INSERT is closed in 000600 only
-- after the CAPTCHA-enabled frontend is live.
BEGIN;
CREATE OR REPLACE FUNCTION website_private.guard_submission()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE v jsonb; k text; val text; identity_key text; limit_chars integer;
BEGIN
  -- PostgREST's SET ROLE remains the caller role inside a SECURITY DEFINER function.
  -- Service-role writes (including n8n) are not subject to public form rules.
  IF current_setting('role', true) NOT IN ('anon','authenticated') AND current_setting('website.public_submission', true) IS DISTINCT FROM 'on' THEN RETURN NEW; END IF;
  v := to_jsonb(NEW);
  IF octet_length(v::text) > (CASE WHEN TG_TABLE_NAME = 'client_submissions' THEN 65536 ELSE 16384 END) THEN
    RAISE SQLSTATE 'PT400' USING MESSAGE = 'Invalid submission.';
  END IF;
  FOR k, val IN SELECT key, value FROM jsonb_each_text(v) LOOP
    limit_chars := CASE WHEN k IN ('message','business_description','additional_notes') THEN 5000
      WHEN k IN ('referrer','landing_page','current_website','logo_url','favicon_url') THEN 2048
      WHEN k IN ('trusted_brands','pricing_plans','testimonials') THEN 16000
      WHEN k IN ('email','contact_email') THEN 254
      WHEN k = 'phone' THEN 40 ELSE 500 END;
    IF length(val) > limit_chars OR val ~ '[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]' THEN
      RAISE SQLSTATE 'PT400' USING MESSAGE = 'Invalid submission.';
    END IF;
  END LOOP;
  IF TG_TABLE_NAME IN ('leads','call_bookings') THEN
    NEW.name := btrim(NEW.name);
    IF length(NEW.name) NOT BETWEEN 1 AND 120 THEN RAISE SQLSTATE 'PT400' USING MESSAGE = 'Invalid submission.'; END IF;
    IF NEW.source IS NULL OR NEW.source !~ '^[A-Za-z0-9_-]{1,100}$' THEN RAISE SQLSTATE 'PT400' USING MESSAGE = 'Invalid submission.'; END IF;
  END IF;
  IF TG_TABLE_NAME = 'call_bookings' THEN
    NEW.company := btrim(NEW.company); NEW.phone := btrim(NEW.phone);
    IF length(NEW.company) NOT BETWEEN 1 AND 200 OR NEW.phone !~ '^[+0-9 ().-]{6,40}$'
       OR length(regexp_replace(NEW.phone,'[^0-9]','','g')) NOT BETWEEN 6 AND 20 THEN
      RAISE SQLSTATE 'PT400' USING MESSAGE = 'Invalid submission.';
    END IF;
    -- Older callers may omit the problem; supplied choices must match the UI.
    IF NEW.main_problem IS NOT NULL AND NEW.main_problem NOT IN
      ('problem_lost_leads','problem_slow_reply','problem_manual_work','problem_weak_website','problem_scattered','problem_unsure') THEN
      RAISE SQLSTATE 'PT400' USING MESSAGE = 'Invalid submission.';
    END IF;
    identity_key := regexp_replace(NEW.phone,'[^0-9]','','g');
  END IF;
  IF TG_TABLE_NAME IN ('leads','call_bookings','newsletter_subscribers') THEN
    NEW.email := nullif(lower(btrim(NEW.email)), '');
    IF (TG_TABLE_NAME IN ('leads','newsletter_subscribers') AND NEW.email IS NULL)
       OR (NEW.email IS NOT NULL AND (length(NEW.email) > 254 OR NEW.email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$')) THEN
      RAISE SQLSTATE 'PT400' USING MESSAGE = 'Invalid submission.';
    END IF;
    identity_key := coalesce(identity_key, NEW.email);
  END IF;
  IF TG_TABLE_NAME = 'client_submissions' THEN
    -- The deployed Site Crafter sends status='pending'; preserve that contract,
    -- but never accept a caller-selected approval/workflow state.
    IF NEW.status IS DISTINCT FROM 'pending' THEN RAISE SQLSTATE 'PT400' USING MESSAGE = 'Invalid submission.'; END IF;
    NEW.brand_name := btrim(NEW.brand_name);
    IF length(NEW.brand_name) NOT BETWEEN 1 AND 200 THEN RAISE SQLSTATE 'PT400' USING MESSAGE = 'Invalid submission.'; END IF;
    NEW.contact_email := nullif(lower(btrim(NEW.contact_email)), '');
    IF NEW.contact_email IS NOT NULL AND NEW.contact_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' THEN
      RAISE SQLSTATE 'PT400' USING MESSAGE = 'Invalid submission.';
    END IF;
    identity_key := coalesce(NEW.contact_email, lower(NEW.brand_name));
  END IF;
  -- Atomic shared budgets also apply to direct REST calls and multi-row INSERTs.
  DELETE FROM website_private.rate_buckets WHERE window_start < statement_timestamp() - interval '2 days';
  PERFORM website_private.consume_limit(TG_TABLE_NAME || ':minute',60,60);
  PERFORM website_private.consume_limit(TG_TABLE_NAME || ':day',86400,500);
  PERFORM website_private.consume_limit(TG_TABLE_NAME || ':identity:' || md5(identity_key),900,5);
  IF TG_TABLE_NAME = 'newsletter_subscribers' THEN
    -- Serialize the same normalized address so concurrent requests cannot expose
    -- the UNIQUE constraint. Duplicates have the same HTTP result as new entries.
    PERFORM pg_advisory_xact_lock(hashtextextended(NEW.email, 1901));
    IF EXISTS (SELECT 1 FROM public.newsletter_subscribers s WHERE lower(btrim(s.email)) = NEW.email) THEN RETURN NULL; END IF;
  END IF;
  RETURN NEW;
END;
$function$;

REVOKE ALL ON FUNCTION website_private.guard_submission() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.website_take_ip_budget(p_hash text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF p_hash IS NULL OR p_hash !~ '^[0-9a-f]{64}$' THEN RAISE SQLSTATE 'PT400' USING MESSAGE='Invalid request.'; END IF;
  DELETE FROM website_private.rate_buckets WHERE window_start < statement_timestamp() - interval '2 days';
  BEGIN
    -- Shared across forms and Edge instances, consumed before CAPTCHA validation.
    PERFORM website_private.consume_limit('website:attempts:minute',60,120);
    PERFORM website_private.consume_limit('website:ip:10m:' || p_hash,600,20);
    PERFORM website_private.consume_limit('website:ip:day:' || p_hash,86400,100);
  EXCEPTION WHEN SQLSTATE 'PT429' THEN RETURN false;
  END;
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.website_take_ip_budget(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.website_take_ip_budget(text) TO service_role;

CREATE OR REPLACE FUNCTION public.website_insert_verified(p_kind text,p_data jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE allowed text[]; required text[]; k text; old_mode text;
BEGIN
  IF p_data IS NULL OR jsonb_typeof(p_data) <> 'object' OR octet_length(p_data::text) > 16384 THEN RAISE SQLSTATE 'PT400' USING MESSAGE='Invalid submission.'; END IF;
  IF p_kind='booking' THEN
    allowed:=ARRAY['name','company','phone','email','main_problem','timeline','project_details','source','utm_source','utm_medium','utm_campaign','utm_content','utm_term','landing_page','referrer'];
    required:=ARRAY['name','company','phone','source'];
  ELSIF p_kind='lead' THEN
    allowed:=ARRAY['name','email','message','source']; required:=ARRAY['name','email','source'];
  ELSIF p_kind='newsletter' THEN
    allowed:=ARRAY['email']; required:=ARRAY['email'];
  ELSE RAISE SQLSTATE 'PT400' USING MESSAGE='Invalid submission.';
  END IF;
  FOR k IN SELECT jsonb_object_keys(p_data) LOOP
    IF NOT k=ANY(allowed) OR jsonb_typeof(p_data->k) NOT IN ('string','null') THEN RAISE SQLSTATE 'PT400' USING MESSAGE='Invalid submission.'; END IF;
  END LOOP;
  FOREACH k IN ARRAY required LOOP
    IF nullif(btrim(p_data->>k),'') IS NULL THEN RAISE SQLSTATE 'PT400' USING MESSAGE='Invalid submission.'; END IF;
  END LOOP;
  old_mode:=current_setting('website.public_submission',true);
  PERFORM set_config('website.public_submission','on',true);
  IF p_kind='booking' THEN
    INSERT INTO public.call_bookings(name,company,phone,email,main_problem,timeline,project_details,source,utm_source,utm_medium,utm_campaign,utm_content,utm_term,landing_page,referrer)
    VALUES(p_data->>'name',p_data->>'company',p_data->>'phone',p_data->>'email',p_data->>'main_problem',p_data->>'timeline',p_data->>'project_details',p_data->>'source',p_data->>'utm_source',p_data->>'utm_medium',p_data->>'utm_campaign',p_data->>'utm_content',p_data->>'utm_term',p_data->>'landing_page',p_data->>'referrer');
  ELSIF p_kind='lead' THEN
    INSERT INTO public.leads(name,email,message,source) VALUES(p_data->>'name',p_data->>'email',p_data->>'message',p_data->>'source');
  ELSE
    INSERT INTO public.newsletter_subscribers(email) VALUES(p_data->>'email');
  END IF;
  PERFORM set_config('website.public_submission',coalesce(old_mode,''),true);
  RETURN jsonb_build_object('ok',true);
END;
$$;
REVOKE ALL ON FUNCTION public.website_insert_verified(text,jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.website_insert_verified(text,jsonb) TO service_role;
COMMIT;
