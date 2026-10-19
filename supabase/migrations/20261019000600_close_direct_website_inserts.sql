-- Cutover only AFTER the protected frontend is deployed and verified.
-- Site Crafter client_submissions and internal service_role access stay intact.
BEGIN;
REVOKE INSERT ON public.leads, public.call_bookings, public.newsletter_subscribers FROM anon, authenticated, PUBLIC;
DO $$ DECLARE t text; cols text; BEGIN
  FOREACH t IN ARRAY ARRAY['leads','call_bookings','newsletter_subscribers'] LOOP
    SELECT string_agg(quote_ident(column_name),',') INTO cols FROM information_schema.columns WHERE table_schema='public' AND table_name=t;
    EXECUTE format('REVOKE INSERT (%s) ON public.%I FROM anon, authenticated, PUBLIC',cols,t);
  END LOOP;
END $$;
COMMIT;
