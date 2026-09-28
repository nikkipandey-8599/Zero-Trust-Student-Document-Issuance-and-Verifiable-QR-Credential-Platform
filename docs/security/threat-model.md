# VerifyID Threat Model

## Assets

- Student identity and request data
- Generated academic documents
- Credential signatures and hashes
- Authentication tokens
- Audit records
- RSA private key material

## Threats and controls

| Threat | Control |
|---|---|
| Unauthorized staff endpoint access | JWT + role authorization |
| Student accesses another student's request | Authenticated student-ID ownership check |
| Credential document tampering | SHA-256 document hash |
| Credential forgery | RSA digital signature verification |
| Use of revoked credential | Revocation status checked during verification |
| Secret leakage in source | Environment variables and ignored key files |
| Missing workflow accountability | Audit logging |
| Backend/database outage | Health endpoint and failure handling |

## Residual risks

The prototype does not claim production-grade protection against every threat. Future work includes centralized identity, device posture signals, risk-adaptive policies, rate limiting, secure key vault/HSM integration, TLS and automated application security scanning.
