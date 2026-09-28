-- VerifyID synthetic local/demo seed.
-- Do not use these credentials in production.
-- Password values are placeholders for reference; the running application
-- should create users through its authentication/bootstrap mechanism.

INSERT INTO document_type (id, name, description, active)
VALUES
(1, 'Bonafide Certificate', 'Official certificate confirming that the student is enrolled in the institution.', TRUE),
(2, 'Transcript', 'Academic transcript document.', TRUE),
(3, 'Migration Certificate', 'Certificate for academic migration.', TRUE),
(4, 'Character Certificate', 'Institution-issued character certificate.', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Example synthetic workflow records can be created through the application.
-- This avoids committing real student information or production passwords.
