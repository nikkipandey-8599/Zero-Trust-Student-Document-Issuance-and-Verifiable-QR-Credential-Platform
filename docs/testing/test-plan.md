# VerifyID Test Plan

## 1. Objective

Validate the integrated request, approval, issuance, verification, revocation and authorization workflow.

## 2. Functional tests

| ID | Test | Expected result |
|---|---|---|
| F01 | Student login | Authenticated student session |
| F02 | Staff login | Authenticated staff session |
| F03 | Submit request | Request created as SUBMITTED |
| F04 | List student requests | Student sees own requests |
| F05 | Staff pending requests | STAFF receives pending requests |
| F06 | Approve request | Request becomes APPROVED |
| F07 | Reject request | Request becomes REJECTED |
| F08 | Issue credential | Credential is generated |
| F09 | Download PDF | PDF is returned |
| F10 | Generate QR | QR points to verification route |
| F11 | Public verification | Credential status and integrity are displayed |
| F12 | Revoke credential | Credential becomes REVOKED |
| F13 | Verify revoked credential | Public verifier reports revoked state |

## 3. Authorization tests

| ID | Test | Expected result |
|---|---|---|
| A01 | Missing JWT on staff endpoint | Unauthorized |
| A02 | STUDENT token on staff endpoint | Forbidden |
| A03 | STAFF token on staff endpoint | HTTP 200 |
| A04 | Student accesses another student ID | Forbidden |
| A05 | Public verification without JWT | Allowed |
| A06 | Non-admin accesses admin endpoint | Forbidden |

## 4. Credential tests

| ID | Test | Expected result |
|---|---|---|
| C01 | Issue credential | RSA signature stored |
| C02 | Verify unchanged credential | Signature validates |
| C03 | Download issued PDF | Readable PDF |
| C04 | Revoke credential | Status changes |
| C05 | Verify revoked credential | Revoked state displayed |

## 5. Failure cases

Test invalid credentials, missing/invalid JWTs, unauthorized roles, unknown request IDs, unknown credential IDs, revoked credentials and backend/database unavailability.

## 6. Evidence captured

The demonstration captured evidence for student submission, staff review, approval, credential issuance, QR verification, PDF download, revocation, audit activity and an authenticated staff API request returning HTTP 200.

## 7. Automation

Backend tests are executed with Maven. GitHub Actions runs backend CI using Java 21 and PostgreSQL.
