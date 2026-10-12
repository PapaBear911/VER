# Phase 3 — RELEASE

Deep dive. `AGENTS.md` stays authoritative; this file adds method.

Sub-steps: **Refinement**, **Rollout**, **Release**. Ends in one hard gate.
Clause served: **Ship it.**

Loaded profiles may add gates here. Complete them before Gate 3.

## 1. Refinement — deletion checklist

Read the entire diff top to bottom. For every changed line:

- Does the approved Vision require it?
- Does anything call it?
- Does it duplicate something already in the codebase?
- Is there a simpler rung on the Ponytail ladder that still holds?
- Does the comment explain *why*, not narrate *what* the code says?
- Is there generated or temporary output that should not ship?

Delete when the answer is no. Re-run narrowest verification after deletion.

## 2. Rollout — 3× sanity check

1. **Verification:** re-run the narrowest test or command. Show output.
2. **Public surface:** check exported names, signatures, config keys, CLI flags, schema. Name
   every changed surface; confirm the rest stayed unchanged.
3. **Drift:** naming, comments, and behavior agree.

## 3. Release — layered security and rollback

### Layered security walkthrough

Every release runs through the model:

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

See `references/security-gates.md`.

### Release note template

```markdown
## Shipped
[Observable behavior now present.]

## Skipped
[Scope deferred, or "Nothing."]

## Watch
[Known risk or follow-up, or "Nothing."]

## Verification
[Exact command and observed result.]

## To undo
[Command or process to reverse this release completely.]
```

The rollback line is **mandatory**. Every release note must say how to undo it.

### `vision-log.md` format

```markdown
## YYYY-MM-DD — [task name]
- **Learning:** (one sentence)
- **Recurs:** YYYY-MM-DD — [prior task name] (optional; requires `Promoted:`)
- **Promoted:** [path] — [exact phrase added to the target] (optional)
- **Next V seed:** (one sentence, optional)
```

The learning must be about this work. The optional seed feeds the next Visualize.

### Lesson graduation

Strike 1 logs the lesson only. Strike 2 writes `Recurs:` pointing to the prior entry plus
`Promoted:` naming the target path and the exact phrase added to it; an ungraduated recurrence
fails Gate 3. If the same lesson reaches a third occurrence, the promotion did not hold: escalate
per the invariant-override protocol in `INVARIANTS.md`.

| Lesson type | Promotion target |
|---|---|
| Architectural | `INVARIANTS.md` and `DECISIONS.md` |
| Mechanically checkable | `ver-gates/` and `bin/ver.js` |
| Domain trap | `profiles/` |

## Profile gates

Profiles commonly add here:

- **security** — all three layers passed; no unresolved escalation.
- **ux** — Copy Audit: every message tells the user what happened and what to do next.
- **devops** — rollback tested or stated; observability check complete.
- **testing** — coverage delta reported; no regression.
- **docs** — links verified; examples verified against current code.
- **data** — migration rollback plan tested or dry-run.

When two profiles add gates to this phase, the stricter gate wins.

## HARD GATE 3 — Shipped and logged

- [ ] Narrowest verification re-run after refinement; output shown.
- [ ] Security gate completed (Layer 1 always; Layer 2/3 if required).
- [ ] Public surface inspected; all changes named explicitly.
- [ ] Drift check complete — code, tests, comments, approved Vision agree.
- [ ] Profile gates for this phase completed.
- [ ] Release note answers all sections including the rollback line.
- [ ] `vision-log.md` updated with one learning and optional next-V seed.
