-- Additive and backwards-compatible: old bookings keep an empty service list.
BEGIN;
ALTER TABLE public.call_bookings
  ADD COLUMN requested_services text[] NOT NULL DEFAULT '{}'::text[],
  ADD CONSTRAINT booking_services_allowed CHECK (
    cardinality(requested_services) <= 6
    AND coalesce(array_ndims(requested_services),1) = 1
    AND array_position(requested_services,NULL) IS NULL
    AND requested_services <@ ARRAY['marketing','website','automation','leads','communication','guidance']::text[]
  );
COMMENT ON COLUMN public.call_bookings.requested_services IS
  'Visitor-selected services. Stable codes; empty for legacy submissions. Marketing is a service, not an inferred main_problem.';
-- No new anon/authenticated grants. Writes still require the verified gateway.
CREATE OR REPLACE FUNCTION public.website_insert_verified(p_kind text,p_data jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE allowed text[]; required text[]; k text; old_mode text;
BEGIN
  IF p_data IS NULL OR jsonb_typeof(p_data) <> 'object' OR octet_length(p_data::text) > 16384 THEN RAISE SQLSTATE 'PT400' USING MESSAGE='Invalid submission.'; END IF;
  IF p_kind='booking' THEN
    allowed:=ARRAY['name','company','phone','email','main_problem','requested_services','timeline','project_details','source','utm_source','utm_medium','utm_campaign','utm_content','utm_term','landing_page','referrer'];
    required:=ARRAY['name','company','phone','source'];
  ELSIF p_kind='lead' THEN
    allowed:=ARRAY['name','email','message','source']; required:=ARRAY['name','email','source'];
  ELSIF p_kind='newsletter' THEN
    allowed:=ARRAY['email']; required:=ARRAY['email'];
  ELSE RAISE SQLSTATE 'PT400' USING MESSAGE='Invalid submission.';
  END IF;
  FOR k IN SELECT jsonb_object_keys(p_data) LOOP
    IF NOT k=ANY(allowed) THEN RAISE SQLSTATE 'PT400' USING MESSAGE='Invalid submission.'; END IF;
    IF k='requested_services' AND p_kind='booking' THEN
      IF jsonb_typeof(p_data->k) <> 'array' OR jsonb_array_length(p_data->k) NOT BETWEEN 1 AND 6 THEN
        RAISE SQLSTATE 'PT400' USING MESSAGE='Invalid submission.';
      END IF;
      IF EXISTS (SELECT 1 FROM jsonb_array_elements(p_data->k) item WHERE jsonb_typeof(item) <> 'string') THEN
        RAISE SQLSTATE 'PT400' USING MESSAGE='Invalid submission.';
      END IF;
    ELSIF jsonb_typeof(p_data->k) NOT IN ('string','null') THEN
      RAISE SQLSTATE 'PT400' USING MESSAGE='Invalid submission.';
    END IF;
  END LOOP;
  FOREACH k IN ARRAY required LOOP
    IF nullif(btrim(p_data->>k),'') IS NULL THEN RAISE SQLSTATE 'PT400' USING MESSAGE='Invalid submission.'; END IF;
  END LOOP;
  old_mode:=current_setting('website.public_submission',true);
  PERFORM set_config('website.public_submission','on',true);
  IF p_kind='booking' THEN
    INSERT INTO public.call_bookings(name,company,phone,email,main_problem,requested_services,timeline,project_details,source,utm_source,utm_medium,utm_campaign,utm_content,utm_term,landing_page,referrer)
    VALUES(p_data->>'name',p_data->>'company',p_data->>'phone',p_data->>'email',p_data->>'main_problem',ARRAY(SELECT jsonb_array_elements_text(coalesce(p_data->'requested_services','[]'::jsonb))),p_data->>'timeline',p_data->>'project_details',p_data->>'source',p_data->>'utm_source',p_data->>'utm_medium',p_data->>'utm_campaign',p_data->>'utm_content',p_data->>'utm_term',p_data->>'landing_page',p_data->>'referrer');
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
