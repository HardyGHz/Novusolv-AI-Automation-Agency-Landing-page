BEGIN;
ALTER TABLE public.call_bookings
  ADD COLUMN timeline text,
  ADD COLUMN project_details text,
  ADD CONSTRAINT booking_timeline_allowed CHECK (timeline IS NULL OR timeline IN ('asap','one_to_three_months','exploring')),
  ADD CONSTRAINT booking_details_length CHECK (project_details IS NULL OR char_length(project_details) <= 500);
GRANT INSERT (timeline,project_details) ON public.call_bookings TO anon;
-- Existing website_guard validates total payload, field lengths, control
-- characters and contact/global budgets; existing n8n payload includes NEW.
COMMIT;
