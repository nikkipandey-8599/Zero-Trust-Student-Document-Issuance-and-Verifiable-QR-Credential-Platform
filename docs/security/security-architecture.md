# VerifyID Security Architecture

## 1. Security objectives

VerifyID is designed around:

- Authentication
- Role-based authorization
- Least-privilege endpoint access
- Student resource ownership checks
- Cryptographic credential integrity
- Credential revocation
- Auditability
- Secret separation from source code

## 2. Authentication

Users authenticate through the backend authentication API.

Successful authentication produces a JWT containing the authenticated identity and role.

The frontend stores the token for the active session and sends it as:

`Authorization: Bearer <token>`

The backend JWT filter validates the token and loads the corresponding database user.

## 3. Authorization

Backend endpoints are protected according to role.

| Area | Access |
|---|---|
| Authentication | Public |
| Public credential verification | Public |
| QR verification | Public |
| Student request APIs | STUDENT |
| Staff request APIs | STAFF / ADMIN |
| Admin APIs | ADMIN |

Authorization is enforced server-side. Frontend route protection is not treated as the security boundary.

## 4. Student ownership protection

Student request endpoints compare the authenticated user's ID with the requested student ID.

A mismatch results in HTTP 403 Forbidden.

This protects against a student changing an ID in a URL and attempting to access another student's requests.

## 5. Credential integrity

Issued credentials use:

- SHA-256 document hashing
- RSA digital signatures
- Persistent RSA key material stored outside source control
- Signature verification during public verification

The document hash allows the generated PDF to be represented by a deterministic integrity value.

The signature provides cryptographic evidence that the credential was issued by the VerifyID backend.

## 6. Revocation

Issued credentials have an active/revoked lifecycle.

A staff-authorized revocation changes the credential status to REVOKED.

Public verification reports the current credential state rather than treating issuance as permanently valid.

## 7. Secret management

Database credentials and JWT secrets are supplied through environment variables.

Example variables:

- DB_URL
- DB_USERNAME
- DB_PASSWORD
- JWT_SECRET
- JWT_EXPIRATION

Secrets are excluded from Git through the repository's ignore rules.

RSA key files are also excluded from source control.

## 8. Audit trail

Important workflow actions are recorded as audit events.

Examples include:

- DOCUMENT_REQUEST_CREATED
- REQUEST_APPROVED
- REQUEST_REJECTED
- CREDENTIAL_ISSUED
- CREDENTIAL_REVOKED

The staff dashboard displays recorded audit activity.

## 9. Security limitations

The current prototype is intended for academic demonstration and controlled testing.

Future hardening can include:

- OAuth2 / OpenID Connect
- Keycloak
- Hardware-backed key storage
- Device posture evaluation
- Risk-adaptive policies
- Rate limiting
- Centralized log monitoring
- Automated dependency and DAST scanning
- Production TLS and secure secret storage
