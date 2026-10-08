# VerifyID

**Zero-Trust Student Document Issuance and Verifiable QR Credential Platform**

VerifyID lets students request official college documents online, lets staff review and approve them, and issues each document as a digitally signed PDF with a QR code. Anyone can scan the QR code to check, without logging in, whether the document is genuine, revoked or expired.

T.Y. B.Sc. IT, Semester V — Field Project (capstone brief BIT-09), KES' Shroff College, 2026–27.

- **Live frontend:** https://zero-trust-student-document-issuanc.vercel.app
- **API documentation:** Swagger UI at `/swagger-ui/index.html` on the backend, plus [docs/api](docs/api)

---

## Why this project exists

Requests for bonafide letters, transcripts and similar documents are usually handled through office visits and email. Students cannot see the status of a request, staff keep manual records, and a printed or PDF certificate is easy to copy or edit, so a recipient has no reliable way to check it.

VerifyID replaces that with one authenticated, audited workflow, and makes every issued document independently verifiable.

## How it works

```text
Student            Staff / Admin                     Public verifier
   |                    |                                  |
 login                login                                |
   |                    |                                  |
 request a document     |                                  |
   |------------------> review request                     |
   |                    |-- approve or reject (with reason)|
   |                    |-- issue credential               |
   |                    |      1. generate credential PDF  |
   |                    |      2. SHA-256 hash of the PDF  |
   |                    |      3. RSA-2048 sign "id:hash"  |
   |                    |      4. store PDF, hash, signature
   | download PDF + QR  |                                  |
   |<-------------------|                                  |
   |                                          scan QR ---->| GET /api/verify/{id}
   |                                                       | signature, revoked, expired?
```

A credential ID looks like `VID-XXXXXXXX`. The signature covers `credentialId:documentHash`, so changing the PDF or the record makes verification fail.

### Verification results

`GET /api/verify/{credentialId}` is public and checks in this order:

| Result | Meaning |
|---|---|
| `CREDENTIAL_NOT_FOUND` | No credential with that ID |
| `SIGNATURE_INVALID` | Stored hash or signature does not match |
| `CREDENTIAL_REVOKED` | Withdrawn by the college |
| `CREDENTIAL_EXPIRED` | Older than its one-year validity |
| `CREDENTIAL_VALID` | Genuine and active |

## Features

**Students:** register and log in, choose a document type, submit a request with a purpose, track request status, view and download issued credentials.

**Staff and admin:** see pending and approved requests, approve or reject (a reason is stored on rejection), issue credentials, revoke credentials, view dashboard statistics and the audit log.

**Public verifiers:** scan the QR code or enter a credential ID on the verify page. No account is needed.

**Platform:** stateless JWT authentication, BCrypt password hashing, role-based access control, a student ownership check, an audit log, Swagger UI, GitHub Actions CI and Docker configuration.

## Zero-trust controls

Zero trust is treated here as an approach, not one feature. What the code does and does not implement:

| Capability | Status |
|---|---|
| Authentication on every protected request (JWT signature, expiry, user reloaded from the database) | Implemented |
| Role-based access (`STUDENT`, `STAFF`, `ADMIN`) enforced on the server | Implemented |
| Least privilege: staff routes limited to staff/admin; revoke limited to staff/admin; students can open only their own requests and credentials (HTTP 403 otherwise) | Implemented |
| Document integrity (SHA-256) and authenticity (RSA signature) | Implemented |
| Independent public verification, revocation and expiry checks | Implemented |
| Audit logging of requests, approvals, rejections, issues and revocations | Implemented |
| Continuous session or device re-evaluation | Not implemented |
| Device posture assessment | Not implemented |
| Risk-adaptive policy and step-up authentication | Not implemented (future work) |

## Technology

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS 4, React Router, TanStack Query, Axios, Lucide icons |
| Backend | Java 21, Spring Boot, Spring Security, Spring Data JPA / Hibernate, jjwt, springdoc-openapi |
| Database | PostgreSQL 18 (PDF stored as `bytea`) |
| Cryptography | SHA-256, RSA-2048 with `SHA256withRSA`, BCrypt |
| Tooling | Maven Wrapper, GitHub Actions, Docker, Docker Compose, nginx |

## Repository layout

```text
backend/    Spring Boot API (controllers, services, security, entities, repositories)
frontend/   React client (pages, components, services) with Dockerfile and nginx.conf
database/   schema/schema.sql and seed/seed.sql (reference model and sample data)
docs/       api, architecture, security, testing, evaluation, deployment, guides, system card
.github/    workflows/backend-ci.yml
docker-compose.yml, .env.example
```

## API summary

Base path `/api`. Full details are in [docs/api/api-reference.md](docs/api/api-reference.md) and Swagger UI.

| Method and path | Access |
|---|---|
| `GET /health` | Public |
| `POST /auth/register`, `POST /auth/login` | Public |
| `GET /documents/types` | Public |
| `GET /verify/{credentialId}`, `GET /qr/{credentialId}` | Public |
| `POST /requests/student/{studentId}`, `GET /requests/student/{studentId}` | Student, own ID only |
| `GET /requests/pending` | Staff, admin |
| `GET /staff/requests/pending`, `GET /staff/requests/approved` | Staff, admin |
| `POST /staff/requests/{id}/approve`, `/reject?reason=`, `/issue` | Staff, admin |
| `GET /staff/dashboard/stats`, `GET /staff/dashboard/audit-logs` | Staff, admin |
| `GET /credentials/request/{requestId}` | Authenticated |
| `GET /credentials/{credentialId}/pdf` | Owner, staff or admin |
| `POST /credentials/{credentialId}/revoke` | Staff, admin |

## Run it locally

You need Java 21, Node.js 22, PostgreSQL 18 and Git.

**1. Database.** Create a database named `verifyid_db`. Tables are created by Hibernate on first start. `database/schema/schema.sql` and `database/seed/seed.sql` are a reference copy of the model; the four document types are also seeded automatically.

**2. Backend.**

```bash
cd backend
export DB_URL=jdbc:postgresql://localhost:5432/verifyid_db
export DB_USERNAME=postgres
export DB_PASSWORD=<your password>
export JWT_SECRET=<a long random string, at least 32 characters>
./mvnw spring-boot:run          # Windows: mvnw.cmd spring-boot:run
```

The API is at `http://localhost:8080`; check `http://localhost:8080/api/health`.

**3. Frontend.**

```bash
cd frontend
npm install
npm run dev
```

The app is at `http://localhost:5173`. It calls `http://localhost:8080/api` unless `VITE_API_URL` is set.

**4. Tests.** `cd backend && ./mvnw test` (needs the database variables above).

### Docker Compose

```bash
docker compose up --build
```

This starts PostgreSQL, the backend on port 8080 and the frontend (nginx) on port 5173. The compose file contains development-only passwords; do not reuse it as-is in production.

## Configuration

| Variable | Used by | Purpose |
|---|---|---|
| `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` | backend | PostgreSQL connection |
| `JWT_SECRET` | backend | HMAC key for tokens (required, no default) |
| `JWT_EXPIRATION` | backend | Token lifetime in ms (default 86400000) |
| `FRONTEND_URL` | backend | Address encoded in QR codes; must be the public frontend URL |
| `CORS_ALLOWED_ORIGIN` | backend | Allowed browser origin; must match the frontend URL |
| `VITE_API_URL` | frontend (build time) | Public backend address ending in `/api` |

Secrets, `.env` files and the `keys/` directory are excluded from Git.

## Deployment notes

- The frontend is deployed on Vercel (`frontend/vercel.json` rewrites all routes to `index.html`). Set `VITE_API_URL` in the Vercel project settings, then redeploy, because Vite embeds it at build time.
- Host the backend and PostgreSQL anywhere that can run Java 21 or Docker. Set `FRONTEND_URL` and `CORS_ALLOWED_ORIGIN` to the Vercel address, otherwise QR codes point to localhost and browsers block API calls.
- **Keep the signing keys.** On first start the backend generates an RSA key pair in a `keys/` folder (`/app/keys` in Docker). Put that folder on a persistent volume and back it up. If the keys are lost, every credential issued earlier will report `SIGNATURE_INVALID`.
- A demo staff account (`staff@verifyid.local`) is created at startup by `DataInitializer`. Change its password, or remove the seeding, before any real use.
- Use HTTPS in front of the backend.

## Testing and evidence

- **Automated:** the Backend CI workflow runs `./mvnw test` against a PostgreSQL 18 service on every push and pull request. The suite currently contains one Spring Boot context-load test. Runs #4–#25 passed (22 in a row after three early configuration failures).
- **Manual:** functional, authorization and failure scenarios are recorded in [docs/testing/test-plan.md](docs/testing/test-plan.md) and [docs/security/security-and-testing.md](docs/security/security-and-testing.md).
- **Further documents:** [threat model](docs/security/threat-model.md), [security architecture](docs/security/security-architecture.md), [baseline comparison](docs/evaluation/baseline-comparison.md), [evaluation dossier](docs/evaluation/evaluation-dossier.md), [user and admin guide](docs/guides/user-and-admin-guide.md), [system card](docs/system-card.md).

## Known limitations

1. Device posture, risk-adaptive policy and continuous session re-evaluation are not implemented.
2. Automated test coverage is minimal; business rules were verified manually.
3. Approve and reject do not check a request's current status, so a decided request could be moved to another state by staff.
4. The RSA private key is a file on disk, not in a key vault, and there is no key rotation.
5. The credential PDF comes from a small custom PDF writer with a plain layout.
6. No rate limiting on login, and Swagger UI is public.
7. `spring.jpa.hibernate.ddl-auto=update` is used instead of database migrations.
8. Only synthetic demonstration data has been used; there is no student information system integration.

## Future work

Device-posture and risk-based policy decisions with step-up authentication, status guards on workflow actions, broader unit and integration tests, key storage in a vault or HSM, rate limiting, database migrations, notifications, and integration with the college student information system.

## Author

Nikki Arvind Pandey and Arun Dravid Sunder, T.Y. B.Sc. IT, KES' Shroff College. Guide: Mr. Manish Kumar Singh.