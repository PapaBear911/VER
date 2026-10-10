# V.E.R. — v2.0.1

> See it. Build it. Ship it. Every release feeds the next vision.

Four clauses. Every rule in this file serves one of them. If a rule cannot be traced to a clause, it does not belong here.

| Clause | Phase | Promise |
|---|---|---|
| **See it** | Visualize | Understand before you touch |
| **Build it** | Engineer | Smallest thing that works |
| **Ship it** | Release | Do not ship a lie |
| **Every release feeds the next vision** | The edge | The loop compounds |

Three phases: **Visualize → Engineer → Release**. Each ends in a HARD GATE. A gate is evidence,
not narration: you do not proceed because you say you're done, you proceed because you can show it.

Two rule-sets are always active — every phase, every turn, no opt-out:

**Karpathy principles** — think before you code; simplicity first; surgical changes;
goal-driven execution; restate the problem before solving it.

**Ponytail ladder** — stop at the first rung that holds. Never climb a rung before checking
the one below it.

1. Does this need to exist at all? (YAGNI)
2. Is it already in the codebase?
3. Does the standard library do it?
4. Does the native platform feature do it?
5. Is an already-installed dependency doing it?
6. Can it be one line?
7. Minimum code that works.

---

## Task Routing (runs before Phase 1)

Read the task. Match keywords against the domain table. Load the matching profile from
`profiles/` before starting Phase 1. Profiles add gates to existing phases; they never
replace the loop.

| Domain | Profile | Keywords |
|---|---|---|
| programming | `profiles/programming.md` | function, class, refactor, bug, API, logic, module |
| security | `profiles/security.md` | auth, secret, token, input, deletion, admin, permission, session |
| ui | `profiles/ui.md` | component, render, layout, style, button, form, modal |
| ux | `profiles/ux.md` | flow, state, empty, loading, error, copy, undo, first-use |
| data | `profiles/data.md` | query, schema, migration, pipeline, dataset, model, experiment |
| devops | `profiles/devops.md` | deploy, infra, config, terraform, container, CI, pipeline |
| testing | `profiles/testing.md` | test, spec, coverage, mock, fixture |
| docs | `profiles/docs.md` | readme, doc, comment, changelog, tutorial |

**Override:** `@domain` forces a profile; `@domain+domain` forces several.
Example: `@security+ux add a password reset flow`.

**Stacking rule:** when two profiles add gates to the same phase, the stricter gate wins.

No match → run the base loop. A pure question → answer directly, load nothing.

---

## Phase 1 — VISUALIZE

**1. Visualize.** Restate the task as an outcome: what does "done" look like, observable and
checkable? Name what you do not know.

**2. Validate.** Read the codebase before proposing. Surface existing dependencies, existing
patterns, existing helpers. Name every assumption explicitly. Rung 1: does this need to exist?

**3. Vision.** Present the smallest plan that satisfies the outcome, with tradeoffs stated
plainly (option chosen, option rejected, why). Ask clarifying questions now — one round, not a
stream. Then stop talking and wait.

Loaded profiles may add gates here. Complete them before presenting.

### HARD GATE 1 — Vision approved

Approval tokens: `yes`, `go`, `approved`, `ship it`, `looks good`.
Anything else, including silence, is **not** approval. No approval → no Phase 2.

---

## Phase 2 — ENGINEER

**1. Establish.** Re-read the files you are about to touch. Confirm the APIs, signatures, and
imports you intend to use actually exist — by reading them, not recalling them.

**2. Engineering.** Build the smallest thing that satisfies the approved Vision. One file until
it hurts. No unrequested abstractions, no scaffolding for later, no config for a value that never
changes. Delete before you add. Boring over clever.

Never simplify away: validation at trust boundaries, error handling that prevents data loss,
security, accessibility.

Annotate deliberate simplifications with a `ponytail:` comment naming the ceiling and upgrade path:

```python
# ponytail: max 3 retries, fixed backoff — exponential when we see real 5xx volume
```

**3. Execution.** Run it. Tests, script, REPL, server — whatever proves the claim. Running code
is the only truth. A test you did not run is a hypothesis.

**TDD inner loop:**

```
write smallest failing test → run → RED
write minimum code          → run → GREEN
refactor                    → run → GREEN
```

**One-hypothesis debugging.** One hypothesis at a time. State it, name the observation that would
falsify it, run exactly that check, update. Never change two things to see what happens.

Loaded profiles may add gates here. Complete them before presenting.

### HARD GATE 2 — Evidence shown

- [ ] Read-first completed; no API, signature, or import asserted from memory.
- [ ] Vision implemented as approved — no scope added, none silently dropped.
- [ ] Tests actually executed in this session; output shown, not summarized.
- [ ] Claimed behavior observed running, not inferred from reading the code.

---

## Phase 3 — RELEASE

**1. Refinement.** Read the diff top to bottom. Delete anything that isn't needed. Re-climb the
ladder — a rung that now holds gets taken.

**2. Rollout.** Three sanity checks: run the narrowest verification once more; check the public
surface for unintended change; check naming and comments for drift.

**3. Release.** State what shipped, what was skipped, and what to watch. Write the log.

**Security gate — three layers, every Release:**

1. **Automated** — scan the diff for OWASP-class patterns, hardcoded secrets, injection. Always runs.
2. **Guard** — fires if a sensitive surface was touched (auth, secrets, user input, deletion,
   admin/permission, session). Checks logic, data flow, privilege escalation. Escalate if unsure.
3. **Human** — fires only when the guard lacks confidence or the change is irreversible.

See `references/security-gates.md`.

**Rollback line — mandatory.** Every release note ends with:
`To undo: [command or process]`.

**`vision-log.md` is mandatory before this gate closes.** One entry, one learning:

```markdown
## YYYY-MM-DD — [task name]
- **Learning:** (one sentence)
- **Next V seed:** (one sentence, optional)
```

### HARD GATE 3 — Shipped and logged

- [ ] Narrowest verification re-run green.
- [ ] Security gate run; escalations resolved.
- [ ] No unintended public-surface change (or the change is stated explicitly).
- [ ] Release note includes a rollback line.
- [ ] `vision-log.md` updated with one learning.

---

## When Visualize may be skipped

All four must be true:

1. The instruction already specifies the change completely.
2. Under 20 lines, one known file, no new behavior, no new dependency.
3. Reversible.
4. Obvious — no design decision to make.

A pure question is not a task. Answer it directly — no loop, no gate.

---

## Gate-Failure Protocol

**One failure:** fix the specific deficiency the gate named, then re-present the gate. Once.

**Two failures on the same gate: STOP.** Do not loop. Do not try a third variation. Report what
the gate required, what evidence was missing, and your diagnosis. Two failed gates means the
Vision is wrong — not that the Engineer is weak. The fix belongs upstream, in Phase 1.

---

## Optional: VER Refine Pass

| Pass | File | Trigger phrases | Gate |
|---|---|---|---|
| Validate | `refine/validate.md` | "validate", "does this match the vision?" | No silent acceptance of gap or drift. |
| Enhance | `refine/enhance.md` | "tighten it", "simplify", "delete what's unneeded" | Diff is the smallest coherent change. |
| Review | `refine/review.md` | "review the diff", "ready to ship?" | Verdict must be **Ship** before Release. |

---

## Core Rules

1. **Take the smallest thing** that moves the task forward. First rung that holds.
2. **One file** — or one module, one abstraction — **until it hurts.**
3. **Boring tools, boring code.** Proven over novel; explicit over clever.
4. **Code is a tutorial.** A reader learns the domain and intent top to bottom.
5. **Delete aggressively.** Deletion beats addition.
6. **Running code is the only truth.** Everything else is a claim.
7. **One learning per release.** If nothing went in `vision-log.md`, the loop didn't close.

---

## Anti-Patterns

| Thought | Reality |
|---|---|
| "I already know how this works." | Read the code. You don't — not this repo, not today. |
| "It's a small change, no need to plan." | Small changes are where silent drift starts. |
| "I'll refactor while I'm here." | Surgical changes. The diff stays reviewable. |
| "The tests pass, so it works." | Did you run them, or did you assume? |
| "I'll add a layer for flexibility." | YAGNI. Delete it; add it when it hurts. |
| "The spec is clear enough — I'll fill gaps myself." | Surface assumptions in Visualize. |
| "Two failures — one more variation should do it." | Stop and report. The Vision is wrong. |
