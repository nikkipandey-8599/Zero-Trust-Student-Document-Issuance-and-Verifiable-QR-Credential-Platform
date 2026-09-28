# VerifyID Evaluation Dossier

## 1. Problem validation

The project addresses student document requests that can otherwise involve manual communication, uncertain status, delivery handling and manual verification.

## 2. Integrated MVP

The demonstrated workflow is:

Student login -> document request -> staff review -> approval/rejection -> credential issuance -> QR/public verification -> PDF download -> revocation.

## 3. Security evidence

Evidence includes JWT authentication, role-based authorization, student ownership checks, RSA signing, SHA-256 hashing, credential revocation and audit events.

## 4. Engineering evidence

The repository includes:

- Separate frontend and backend
- PostgreSQL persistence
- Maven backend tests
- GitHub Actions CI
- Dockerfiles and Docker Compose configuration
- Environment-based secrets
- Git development branch
- Reproducible database schema/seed references
- Architecture, security, testing and API documentation

## 5. Baseline comparison

The comparison in `docs/evaluation/baseline-comparison.md` contrasts the integrated prototype with a conventional manual request and verification workflow.

## 6. Measured evaluation

The final report should record measurements from repeatable runs for:

- request completion time
- staff processing time
- verification response time
- authorization-test outcomes
- credential verification success
- revocation detection
- audit event coverage
- automated test/build results

No unmeasured performance claim should be presented as an experimental result.

## 7. Limitations

The current implementation is an academic prototype. Production deployment would require stronger identity infrastructure, secure key storage, TLS, centralized monitoring, formal institutional integration and additional security testing.

## 8. Demonstration evidence

Screenshots captured during development cover the major end-to-end stages, including request management, credential issuance, QR/public verification and the staff dashboard.
