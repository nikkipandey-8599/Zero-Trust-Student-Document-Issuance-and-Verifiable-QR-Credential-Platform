# VerifyID — Evaluation Dossier

## 1. Project Information

**Project:** VerifyID — Zero-Trust Student Document Issuance and Verifiable QR Credential Platform

**Project Type:** Web-based security-focused document issuance and verification prototype

**Development Branch:** `development`

**Primary Technologies:**

- React
- Vite
- Tailwind CSS
- Java 21
- Spring Boot
- Spring Security
- JWT
- PostgreSQL
- RSA cryptography
- SHA-256
- GitHub Actions
- Docker configuration

---

# 2. Problem Statement

Student documents such as bonafide certificates, transcripts and migration certificates can involve manual requests, administrative review and physical or email-based delivery.

This can create problems involving:

- Request status visibility
- Processing delays
- Manual verification
- Document authenticity
- Unauthorized access
- Limited auditability

VerifyID provides a digital workflow for requesting, approving, issuing and verifying student credentials.

---

# 3. Proposed Solution

VerifyID provides a centralized workflow:

```text
Student
   |
   v
Document Request
   |
   v
Staff Review
   |
   +----------+
   |          |
 Approve    Reject
   |
   v
Credential Issuance
   |
   +----------+
   |          |
   v          v
  PDF        QR
   |          |
   +-----+----+
         |
         v
Credential Verification
         |
         v
Credential Status