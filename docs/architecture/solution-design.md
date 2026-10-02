# VerifyID — Solution Design

## 1. Project Overview

VerifyID is a Zero-Trust Student Document Issuance and Verifiable QR Credential Platform.

The platform digitizes the process of requesting, reviewing, approving, issuing and verifying official student documents.

The system supports:

- Student document requests
- Staff approval and rejection
- Credential issuance
- Digitally signed credentials
- QR-based public verification
- Credential revocation
- Role-based access control
- Student resource authorization
- Security audit logging
- PostgreSQL persistence

---

## 2. Problem Being Addressed

Traditional student document issuance can require students to visit administrative offices or communicate through email.

This can result in:

- Unclear request status
- Manual approval processes
- Delayed document delivery
- Difficulty verifying issued documents
- Risk of unauthorized access to student requests
- Limited auditability

VerifyID provides a centralized workflow where the request lifecycle and credential verification process can be tracked digitally.

---

## 3. System Architecture

VerifyID follows a three-layer web application architecture.

```text
                    ┌─────────────────────────┐
                    │       Student / Staff    │
                    │        Web Browser       │
                    └────────────┬────────────┘
                                 │
                                 │ HTTP / REST
                                 ▼
                    ┌─────────────────────────┐
                    │     React Frontend      │
                    │                         │
                    │ React + Vite + Tailwind │
                    │ React Router             │
                    │ Axios API Client         │
                    └────────────┬────────────┘
                                 │
                                 │ REST API
                                 │ JWT
                                 ▼
                    ┌─────────────────────────┐
                    │    Spring Boot Backend  │
                    │                         │
                    │ Authentication          │
                    │ Authorization            │
                    │ Request Workflow         │
                    │ Credential Issuance      │
                    │ Verification             │
                    │ Audit Logging            │
                    └────────────┬────────────┘
                                 │
                                 │ JPA / JDBC
                                 ▼
                    ┌─────────────────────────┐
                    │      PostgreSQL DB       │
                    │                         │
                    │ Users                     │
                    │ Document Requests         │
                    │ Document Types            │
                    │ Credentials               │
                    │ Audit Logs                │
                    └─────────────────────────┘