# VerifyID API Overview

Base URL during local development: `http://localhost:8080/api`

## Public

- `GET /health` — backend/database health.
- `POST /auth/login` — authenticate a user.
- `POST /auth/register` — register a user.
- `GET /documents/types` — list active document types.
- `GET /verify/{credentialId}` — publicly verify a credential.
- `GET /qr/{credentialId}` — retrieve the credential QR image.

## Student

Protected with a STUDENT JWT.

- Student request creation/listing endpoints.
- Student-specific request access is checked against the authenticated user ID.

## Staff

Protected with STAFF or ADMIN authorization.

- `GET /staff/requests/pending`
- `GET /staff/requests/approved`
- Staff approval/rejection operations.
- Credential issuance.
- Staff dashboard statistics and audit-log views.

## Credential operations

Protected credential operations include:

- Credential PDF download.
- Credential revocation.

Public verification does not expose the protected staff workflow and is intended to be usable by an external verifier.

## Authentication

Protected calls use:

`Authorization: Bearer <JWT>`

The backend validates the JWT and its database-backed user role before allowing protected operations.
