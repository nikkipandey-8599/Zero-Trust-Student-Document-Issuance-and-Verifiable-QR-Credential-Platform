# VerifyID System Card

## System purpose

VerifyID is an academic prototype for issuing and verifying student credentials through a controlled digital workflow.

## Intended users

- Students requesting institutional documents
- Authorized staff reviewing and issuing credentials
- External verifiers checking credential authenticity/status

## Inputs

- Authenticated user identity
- Document type
- Request purpose
- Workflow actions
- Credential identifier during verification

## Outputs

- Request status
- Digitally generated PDF credential
- SHA-256 document hash
- RSA-backed verification result
- QR verification route
- Audit events

## Security properties

The prototype implements authentication, server-side role authorization, student ownership checks, cryptographic signing, public verification, revocation and audit logging.

## Data handling

Development uses synthetic/demo records. Secrets and RSA key files are kept outside source control through environment configuration and ignore rules.

## Limitations

This is not a production institutional identity system. It does not claim production-grade key management, device posture enforcement, risk-adaptive authentication, high availability or complete compliance coverage.

## Evaluation

System behavior should be evaluated using repeatable functional, authorization, credential-integrity and failure tests documented in the repository.
