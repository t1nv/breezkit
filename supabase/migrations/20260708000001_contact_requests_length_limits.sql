-- Cap field sizes on contact_requests so authenticated users cannot
-- insert unbounded payloads (abuse / storage exhaustion).
ALTER TABLE public.contact_requests
  ADD CONSTRAINT cr_company_len CHECK (char_length(company) BETWEEN 1 AND 200),
  ADD CONSTRAINT cr_name_len CHECK (char_length(name) BETWEEN 1 AND 200),
  ADD CONSTRAINT cr_email_len CHECK (char_length(email) BETWEEN 3 AND 320),
  ADD CONSTRAINT cr_team_size_len CHECK (char_length(team_size) <= 50),
  ADD CONSTRAINT cr_message_len CHECK (char_length(message) <= 4000);
