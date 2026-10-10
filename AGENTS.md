# V.E.R. — v1.0.0

> See it. Build it. Ship it. Every release feeds the next vision.

Three phases: **Visualize → Engineer → Release**. Each phase ends in a HARD GATE. A gate is
evidence, not narration: you do not proceed because you say you're done, you proceed because
you can show it.

Two rule-sets are always active — in every phase, on every turn, no opt-out:

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

## Phase 1 — VISUALIZE

**1. Visualize.** Restate the task as an outcome: what does "done" look like, observable and
checkable? Name what you do not know.

**2. Validate.** Read the codebase before proposing. Surface existing dependencies, existing
patterns, existing helpers — anything that already solves part of this. Name every assumption
explicitly. Rung 1 of the ladder: does this need to exist?

**3. Vision.** Present the smallest plan that satisfies the outcome, with tradeoffs stated
plainly (option chosen, option rejected, why). Ask clarifying questions now — one round, not a
stream. Then stop talking and wait.

### HARD GATE 1 — Vision approved

Approval tokens: `yes`, `go`, `approved`, `ship it`, `looks good`.
Anything else, including silence, is **not** approval. Do not infer approval from a pause, an
emoji, or a change of subject. No approval → no Phase 2.

---

## Phase 2 — ENGINEER

**1. Establish.** Re-read the files you are about to touch. Confirm the APIs, signatures, and
imports you intend to use actually exist in this codebase — by reading them, not recalling them.

**2. Engineering.** Build the smallest thing that satisfies the approved Vision. One file until
it hurts. No unrequested abstractions, no scaffolding for later, no config for a value that never
changes. Delete before you add. Boring over clever. When you simplify away something real —
trust-boundary validation, data-loss handling, security, accessibility — leave it alone.

Annotate every deliberate simplification with a `ponytail:` comment naming the ceiling and the
upgrade path:

```python
# ponytail: max 3 retries, fixed backoff — raise to exponential when we see real 5xx volume
```

**3. Execution.** Run it. Tests, script, REPL, server — whatever proves the claim. Running code
is the only truth. A test you did not run is a hypothesis.

**TDD inner loop** (per unit of behavior):

```
write smallest failing test → run → RED
write minimum code        → run → GREEN
refactor                  → run → GREEN
                          → repeat
```

**One-hypothesis debugging.** One hypothesis at a time. State it, name the observation that
would falsify it, run exactly that check, then update. Never change two things to see what
happens — you learn nothing and can't undo it.

### HARD GATE 2 — Evidence shown

- [ ] Read-first completed; no API, signature, or import asserted from memory.
- [ ] Vision implemented as approved — no scope added, none silently dropped.
- [ ] Tests actually executed in this session; output shown, not summarized.
- [ ] The claimed behavior was observed running, not inferred from reading the code.

Failure to show evidence is a gate failure, not a formality. See Gate-Failure Protocol.

---

## Phase 3 — RELEASE

**1. Refinement.** Read the diff top to bottom. Delete anything that isn't needed. Re-climb the
ladder on what you built — a rung that now holds gets taken.

**2. Rollout.** Three sanity checks: run the narrowest verification once more; check the public
surface (exports, signatures, config keys, CLI flags, schema) for unintended change; check
naming and comments for drift from what the code now does.

**3. Release.** State what shipped, what was skipped, and what to watch. Write the log.

**`vision-log.md` is mandatory before this gate closes.** One entry, one learning, one optional
seed for the next cycle:

```markdown
## YYYY-MM-DD — [task name]
- **Learning:** (one sentence)
- **Next V seed:** (one sentence, optional)
```

### HARD GATE 3 — Shipped and logged

- [ ] Narrowest verification re-run green.
- [ ] No unintended public-surface change (or the change is stated explicitly).
- [ ] `vision-log.md` updated with one learning.

---

## When Visualize may be skipped

Skip Phase 1 only when **all four** are true:

1. The user's instruction already specifies the change completely — the instruction *is* the Vision.
2. Single file, ≤10 lines, no new behavior, no new dependency.
3. No new public surface: no API, config key, schema field, or CLI flag.
4. Trivially reversible, and the user is present to correct course.

A pure question is not a task. Answer it directly — no loop, no gate.

---

## Gate-Failure Protocol

**One failure:** fix the specific deficiency the gate named, then re-present the gate. Once.

**Two failures on the same gate: STOP.** Do not loop. Do not try a third variation. Report to
the user: what the gate required, what evidence was missing, and your diagnosis of the cause.
Two failed gates means the Vision is wrong — not that the Engineer is weak. The fix belongs
upstream, in Phase 1.

---

## Optional: VER Refine Pass

Run any pass on demand, or before Gate 3.

| Pass | File | Trigger phrases | Gate |
|---|---|---|---|
| Validate | `refine/validate.md` | "validate", "does this match the vision?", "on target?" | No silent acceptance of gap or drift. |
| Enhance | `refine/enhance.md` | "tighten it", "simplify", "delete what's unneeded" | Diff is the smallest coherent change. |
| Review | `refine/review.md` | "review the diff", "read it end to end", "ready to ship?" | Verdict must be **Ship** before Release. |

---

## Core Rules

Invoke these before responding to any task.

1. **Take the smallest thing** that moves the task forward. The first rung that holds.
2. **One file** — or one module, one abstraction — **until it hurts.** Split on evidence, not anticipation.
3. **Boring tools, boring code.** Proven over novel; explicit over clever.
4. **Code is a tutorial.** A reader learns the domain and the intent by reading it top to bottom.
5. **Delete aggressively.** Deletion beats addition. Dead code, dead config, dead comments.
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
| "The spec is clear enough — I'll fill the gaps myself." | Surface assumptions in Visualize. Gaps you fill silently become bugs. |
| "Two failures — one more variation should do it." | Two failures = stop and report. The Vision is wrong. |
