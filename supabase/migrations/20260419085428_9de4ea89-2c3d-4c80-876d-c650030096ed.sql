DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;

CREATE POLICY "Anyone can submit valid contact form"
  ON public.contact_submissions FOR INSERT
  WITH CHECK (
    char_length(name) BETWEEN 2 AND 80
    AND char_length(email) BETWEEN 5 AND 160
    AND email LIKE '%@%.%'
    AND char_length(subject) BETWEEN 3 AND 120
    AND char_length(message) BETWEEN 10 AND 1000
  );