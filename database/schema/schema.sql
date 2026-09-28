-- VerifyID reference PostgreSQL schema
-- The Spring Boot application also maintains this model through JPA/Hibernate.

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS document_type (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS document_request (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES users(id),
    document_type_id BIGINT NOT NULL REFERENCES document_type(id),
    status VARCHAR(40) NOT NULL,
    purpose TEXT,
    rejection_reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_log (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id VARCHAR(255),
    ip_address VARCHAR(100),
    details TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS credential (
    id BIGSERIAL PRIMARY KEY,
    credential_id VARCHAR(100) NOT NULL UNIQUE,
    request_id BIGINT NOT NULL UNIQUE REFERENCES document_request(id),
    document_hash VARCHAR(255) NOT NULL,
    signature TEXT NOT NULL,
    status VARCHAR(30) NOT NULL,
    issued_at TIMESTAMP NOT NULL,
    expires_at TIMESTAMP,
    document_pdf BYTEA
);

CREATE INDEX IF NOT EXISTS idx_document_request_student ON document_request(student_id);
CREATE INDEX IF NOT EXISTS idx_document_request_status ON document_request(status);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_credential_status ON credential(status);
