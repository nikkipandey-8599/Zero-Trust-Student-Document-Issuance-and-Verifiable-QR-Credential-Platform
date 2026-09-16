-- ============================================
-- DATABASE MIGRATION SCRIPT
-- Zero-Trust Student Document Platform
-- ============================================
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. FIX USERS TABLE
-- ============================================

-- Add phone column if not exists
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- Add status column if not exists
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE';

-- Add created_at column if not exists
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT NOW();

-- Add updated_at column if not exists
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;

-- ============================================
-- 2. FIX STUDENTS TABLE (CRITICAL - FIXES CURRENT ERROR)
-- ============================================

-- Add roll_no column if not exists
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS roll_no VARCHAR(50) NOT NULL DEFAULT '';

-- Add semester column if not exists
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS semester INTEGER NOT NULL DEFAULT 1;

-- Add dob column if not exists
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS dob DATE NOT NULL DEFAULT '2000-01-01';

-- Add address column if not exists (THIS IS THE COLUMN CAUSING THE ERROR)
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS address VARCHAR(500) NOT NULL DEFAULT '';

-- Add phone column if not exists
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- Add admission_year column if not exists
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS admission_year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE);

-- Add status column if not exists
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE';

-- Add created_at column if not exists
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT NOW();

-- Add updated_at column if not exists
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;

-- Add unique constraint on roll_no if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'students_roll_no_key'
    ) THEN
        ALTER TABLE students 
        ADD CONSTRAINT students_roll_no_key UNIQUE (roll_no);
    END IF;
END $$;

-- ============================================
-- 3. CREATE DOCUMENT_TYPES TABLE IF NOT EXISTS
-- ============================================

CREATE TABLE IF NOT EXISTS document_types (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP
);

-- Fix existing rows in document_types if they have null created_at
UPDATE document_types 
SET created_at = NOW(), updated_at = NOW(), is_active = TRUE
WHERE created_at IS NULL OR is_active IS NULL;

-- Insert default document types if table is empty
INSERT INTO document_types (name, description, created_at, updated_at, is_active)
SELECT 
    unnest(ARRAY['Bonafide Certificate', 'Marksheet', 'Degree Certificate', 'Internship Certificate', 'Transfer Certificate']),
    unnest(ARRAY['Bonafide Certificate', 'Marksheet', 'Degree Certificate', 'Internship Certificate', 'Transfer Certificate']),
    NOW(),
    NOW(),
    TRUE
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 4. CREATE VERIFICATION_LOGS TABLE IF NOT EXISTS
-- ============================================

CREATE TABLE IF NOT EXISTS verification_logs (
    id BIGSERIAL PRIMARY KEY,
    credential_id BIGINT REFERENCES credentials(id) ON DELETE SET NULL,
    verifier_type VARCHAR(20) NOT NULL,
    verification_method VARCHAR(20) NOT NULL,
    result VARCHAR(20) NOT NULL,
    verified_at TIMESTAMP NOT NULL DEFAULT NOW(),
    ip_address VARCHAR(45),
    user_agent TEXT
);

-- ============================================
-- 5. CREATE REVOKED_CREDENTIALS TABLE IF NOT EXISTS
-- ============================================

CREATE TABLE IF NOT EXISTS revoked_credentials (
    id BIGSERIAL PRIMARY KEY,
    credential_id BIGINT NOT NULL UNIQUE REFERENCES credentials(id) ON DELETE CASCADE,
    revoked_by BIGINT REFERENCES users(id),
    reason VARCHAR(500) NOT NULL,
    revoked_at TIMESTAMP NOT NULL DEFAULT NOW(),
    remarks TEXT
);

-- ============================================
-- 6. FIX CREDENTIALS TABLE IF NEEDED
-- ============================================

-- Add credential_name column if not exists
ALTER TABLE credentials 
ADD COLUMN IF NOT EXISTS credential_name VARCHAR(200) NOT NULL DEFAULT '';

-- Add created_by column if not exists
ALTER TABLE credentials 
ADD COLUMN IF NOT EXISTS created_by BIGINT REFERENCES users(id);

-- Add created_at column if not exists
ALTER TABLE credentials 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT NOW();

-- Add updated_at column if not exists
ALTER TABLE credentials 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;

-- ============================================
-- 7. UPDATE EXISTING DATA WITH SAFE DEFAULTS
-- ============================================

-- Update students with safe defaults for new required columns
UPDATE students 
SET 
    roll_no = COALESCE(NULLIF(roll_no, ''), 'TEMP-' || id),
    semester = COALESCE(semester, 1),
    dob = COALESCE(dob, '2000-01-01'),
    address = COALESCE(NULLIF(address, ''), 'Address not provided'),
    admission_year = COALESCE(admission_year, EXTRACT(YEAR FROM created_at)),
    status = COALESCE(status, 'ACTIVE')
WHERE roll_no IS NULL OR roll_no = '' 
   OR semester IS NULL 
   OR dob IS NULL 
   OR address IS NULL OR address = ''
   OR admission_year IS NULL
   OR status IS NULL;

-- Update users with safe defaults
UPDATE users 
SET 
    status = COALESCE(status, 'ACTIVE')
WHERE status IS NULL;

-- Update credentials with safe defaults
UPDATE credentials 
SET 
    credential_name = COALESCE(NULLIF(credential_name, ''), 'Credential-' || credential_id),
    created_at = COALESCE(created_at, issued_at)
WHERE credential_name IS NULL OR credential_name = ''
   OR created_at IS NULL;

-- ============================================
-- 8. VERIFY DATA INTEGRITY
-- ============================================

-- Check for any remaining NULL values in critical columns
SELECT 'students with NULL roll_no' as check_name, COUNT(*) as count FROM students WHERE roll_no IS NULL OR roll_no = ''
UNION ALL
SELECT 'students with NULL address' as check_name, COUNT(*) as count FROM students WHERE address IS NULL OR address = ''
UNION ALL
SELECT 'students with NULL dob' as check_name, COUNT(*) as count FROM students WHERE dob IS NULL
UNION ALL
SELECT 'users with NULL status' as check_name, COUNT(*) as count FROM users WHERE status IS NULL
UNION ALL
SELECT 'credentials with NULL credential_name' as check_name, COUNT(*) as count FROM credentials WHERE credential_name IS NULL OR credential_name = '';
