# Security Gates — The Layered Model

Security is not one gate. It is three, applied in order, each escalating to the next only when
it must.

Clause served: **Ship it — do not ship a lie.**

```text
Diff created
     │
     ▼
Layer 1: Automated Gate (runs on EVERY release)
  - OWASP-class patterns (SQLi, XSS, SSRF, path traversal)
  - Hardcoded secrets, keys, credentials
  - Insecure deserialization, unvalidated input
     │
     ├─ PASS ──► sensitive surface touched?
     │                ├─ NO  ──► proceed
     │                └─ YES ──► Layer 2
     ▼
Layer 2: Security Guard (fires on sensitive surfaces)
  - Sensitive surfaces: auth, secrets, user input, data deletion, admin/permissions, sessions
  - Contextual checks: logic flaws, data flow, privilege escalation, excessive agency
     │
     ├─ CONFIDENT PASS ──► proceed
     └─ UNCERTAIN OR SEVERE ──► Layer 3
     ▼
Layer 3: Human-in-the-Loop (fires on escalation only)
  - Guard lacks confidence
  - Change is irreversible or highest severity
  - Novel pattern
```

## Why layered, not single

- **Automated** catches volume: the known, patterned flaws that tools catch cheaply.
- **Guard** catches context: logic flaws, authorization gaps, privilege escalation that
  linters miss because the code is syntactically valid.
- **Human** catches novelty: the zero-day, the architectural abuse, the assumption nobody coded
  a rule for.

Running the human on every task causes reviewer fatigue — which turns humans into rubber stamps.
The layers protect the human's attention so it is real when called.

## Sensitive surface list

A change touching any of these triggers Layer 2:

- **Authentication** — login, signup, password reset, MFA, session creation/destruction.
- **Secrets** — API keys, credentials, tokens, connection strings, certificates.
- **User input** — any data arriving from an external boundary (HTTP, query, upload, webhook).
- **Data deletion** — dropping rows, tables, files, or state. Irreversible by nature.
- **Admin / Permissions** — role changes, privilege checks, ACLs, tenant boundaries.
- **Session handling** — cookies, storage, token issuance, expiry, invalidation.

If the diff touches none of these, Layer 1 passing is sufficient. If it touches any, Layer 2
is mandatory.

## Escalation rules

Escalate to Layer 2 when:
- Layer 1 passes, but a sensitive surface was touched.

Escalate to Layer 3 (human) when:
- The guard cannot reach high confidence in its assessment.
- The change is irreversible (e.g. schema migration dropping columns, key rotation without fallback).
- A privilege boundary changes (e.g. new role, widened permission).
- The vulnerability severity is High or Critical.

A gate failure at any layer stops the release. Do not loop — report and return the fix upstream.
