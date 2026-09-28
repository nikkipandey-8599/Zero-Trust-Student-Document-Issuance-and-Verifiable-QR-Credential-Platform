# VerifyID System Architecture

## 1. Purpose

VerifyID is a zero-trust student document issuance and verifiable QR credential platform. It digitizes the workflow from student document request through staff review, credential issuance, public verification, PDF download, and credential revocation.

## 2. High-level architecture

```
Student / Staff / Verifier
          |
          v
   React + Vite Frontend
          |
          | REST / JSON + JWT
          v
   Spring Boot Backend
      |          |
      |          +--> RSA signing / SHA-256
      |
      +--> PostgreSQL
      |
      +--> PDF generation
      |
      +--> QR generation
      |
      +--> Audit logging

Public verifier
      |
      v
GET /api/verify/{credentialId}
      |
      v
Cryptographic signature verification
      |
      v
Credential validity response
```

## 3. Frontend

The frontend is a React 18 + Vite application.

Main responsibilities:

- Authentication and session state
- Student document request workflow
- Staff request management
- Credential display
- QR presentation
- Public credential verification
- PDF download
- Credential revocation
- Staff dashboard and audit trail

Routing is handled with React Router.

Axios is used for REST API communication. The authentication token is stored in browser local storage under `verifyid_token` and attached as a Bearer token for protected requests.

## 4. Backend

The backend is a Java 21 Spring Boot application.

Major layers:

- Controllers: REST endpoints
- Services: business and credential logic
- Repositories: PostgreSQL persistence
- Entities: domain model
- Security: JWT authentication and role authorization
- Cryptography: RSA key management and signature verification
- PDF service: digitally generated credential document
- QR service: verification QR generation
- Audit service: security and workflow events

## 5. Database

PostgreSQL stores:

- Users
- Document types
- Document requests
- Credentials
- Audit logs

The application uses JPA/Hibernate for persistence.

## 6. Request lifecycle

1. Student authenticates.
2. Student selects a document type and provides a purpose.
3. Backend creates a SUBMITTED request.
4. Staff authenticates with a STAFF role.
5. Staff retrieves pending requests.
6. Staff approves or rejects the request.
7. For an approved request, the backend generates the credential PDF.
8. SHA-256 is calculated over the generated PDF.
9. The credential data is digitally signed using RSA.
10. A credential identifier and QR code are generated.
11. The QR code points to the public verification route.
12. A verifier can validate the credential without logging in.
13. Staff can revoke an issued credential.
14. Audit events record important workflow actions.

## 7. Security boundaries

Protected operations require authentication and role authorization.

- STUDENT: student operations
- STAFF: document review and credential operations
- ADMIN: administrative operations
- Public: health, document types, QR lookup and credential verification

Student request access also verifies that the authenticated student owns the requested student identifier, reducing the risk of insecure direct object reference (IDOR).

## 8. Deployment model

The repository contains Dockerfiles for the frontend and backend and a Docker Compose configuration for PostgreSQL, backend and frontend services.

Local development can also run the backend and frontend directly.

## 9. Observability

The staff dashboard exposes operational counters and audit events including request, credential and security activity.

The backend also exposes a health endpoint:

`GET /api/health`

which reports backend and database availability.
