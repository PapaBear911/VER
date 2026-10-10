# Phase 3 — RELEASE

Deep dive. `AGENTS.md` stays authoritative; this file adds method.

Three sub-steps — **Refinement**, **Rollout**, **Release** — ending in one hard gate. The
Karpathy principles and the 7-rung Ponytail ladder remain active. Shipping is not a reward for
finishing; it is a claim that must be checked.

## 1. Refinement — deletion checklist

Read the entire diff top to bottom. Ask of every changed line:

- Does the approved Vision require it?
- Does anything call it?
- Does it duplicate something already in the codebase?
- Is there a simpler rung on the Ponytail ladder that still holds?
- Does the comment explain *why*, rather than narrate *what* the code says?
- Is there generated or temporary output that should not ship?

Delete the line when the answer is no. Re-run the narrowest verification after deletion.

## 2. Rollout — 3× sanity check

Three checks. All three, in this order:

1. **Verification:** run the narrowest relevant test or command one more time. Show the output.
   The final diff is not the diff you tested before cleanup.
2. **Public surface:** inspect exported names, function signatures, config keys, CLI flags,
   schemas, and documented behavior. State every new or changed surface; confirm the rest stayed
   unchanged.
3. **Drift:** naming, comments, and behavior agree. No plan left behind in the code; no test
   left behind in the plan.

## 3. Release — close the arc

Answer these four questions:

1. What shipped? One sentence, naming the behavior, not the files.
2. What was deliberately skipped? Say "nothing" if nothing.
3. What should the user watch? Say "nothing" if nothing.
4. What did you learn? One sentence. Write it to `vision-log.md`.

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
```

### `vision-log.md` format

Append one entry; never rewrite a previous entry:

```markdown
## YYYY-MM-DD — [task name]
- **Learning:** (one sentence)
- **Next V seed:** (one sentence, optional)
```

The learning must be about this work — not "tests pass," not "task complete." A good learning
is reusable: *"The existing parser already normalizes CRLF; test that before adding a second
normalization pass."* The optional seed is a question or observation for the next Visualize, not
a disguised task assignment.

## HARD GATE 3 — Shipped and logged

- [ ] Narrowest verification re-run after refinement; output shown.
- [ ] Public surface inspected; any change named explicitly.
- [ ] Drift check complete — code, tests, comments, and approved Vision agree.
- [ ] Release note answers all four closing-arc questions.
- [ ] `vision-log.md` updated with one learning and optional next-V seed.

If the log cannot be written, Gate 3 is open. A release without a learning is not a closed loop.
