# Phase 1 — VISUALIZE

Deep dive. `AGENTS.md` stays authoritative; this file adds method.

Phase 1 has three sub-steps — **Visualize**, **Validate**, **Vision** — and ends in one hard
gate. The Karpathy principles and the 7-rung Ponytail ladder are active throughout.

## 1. Visualize — restate the outcome

Write one sentence: *Done looks like ___*, observable and checkable. A deadline is not an
outcome. "Refactor the auth module" is not an outcome. "Password reset returns 400 on unknown
email instead of 500, verified by the existing auth test suite" is.

Then list what you do not know. Unnamed gaps get filled silently, and silent gaps become bugs.

## 2. Validate — assumption-surfacing protocol

Before proposing anything, run this protocol and show the output:

1. **Read.** Open the files the task would touch. Name them.
2. **Inventory.** What already exists that covers part of this? Dependencies, helpers, patterns,
   near-identical code elsewhere.
3. **Assumptions.** Every assumption as an explicit sentence: *"Assumes the API returns a list,
   not a single object."* Assumptions are falsifiable statements, not vibes.
4. **Risk.** Which assumption, if wrong, invalidates the plan?
5. **Ladder, rung 1.** Does this need to exist at all? If the honest answer is no, say so and
   stop — a Vision of "do nothing" is a valid, approved outcome.

## 3. Vision — present it

### Clarifying-questions rule

Ask clarifying questions **once**, as one grouped round, then stop. Do not trickle questions
across turns. Each round after the first is a gate failure, because it means Phase 1 was not
completed when it was presented.

Ask only questions whose answers change the plan. Questions you can answer by reading the code
are not questions — go read.

### Tradeoff presentation format

Every Vision presents at least two options, in this shape:

```
Option A — [name]: [one line what it does]
  Cost: [what we give up]
Option B — [name]: [one line what it does]
  Cost: [what we give up]
Chosen: A because [the one reason it wins for this Vision]
Rejected: B because [the cost we are not willing to pay]
Out of scope: [explicitly not touching these]
```

"Chosen because it's cleaner" is not a reason. The reason has to be about this task's outcome.

### Minimal spec template

```markdown
## Vision: [task name]

**Done looks like:** [one observable sentence]
**Approach:** [one sentence]
**Files touched:** [list, or "discovered in Establish"]
**Assumptions:**
- [sentence]
- [sentence]
**Out of scope:** [what is deliberately not changing]
**Verification:** [the exact command or observation that proves it]
```

Small enough to read aloud. If it can't be read aloud, it isn't minimal yet.

## HARD GATE 1 — Vision approved

- [ ] Outcome stated as an observable sentence.
- [ ] Read step completed; existing code and dependencies inventoried.
- [ ] Every assumption written as a falsifiable sentence.
- [ ] Rung 1 of the ladder answered — does this need to exist?
- [ ] At least two options with costs; choice justified against this outcome.
- [ ] Clarifying questions asked, in one round, and answered.
- [ ] Approval token received: `yes`, `go`, `approved`, `ship it`, `looks good`.

Silence is not approval. A plan that changed after approval needs approval again.

## Skip conditions

Phase 1 may be skipped only when all four hold: the instruction already fully specifies the
change; single file, ≤10 lines, no new behavior, no new dependency; no new public surface; and
it is trivially reversible with the user present. See `AGENTS.md`.

## When this gate fails twice

Two failures on this gate mean the Vision itself is wrong — the task is underspecified, or the
frame is off. Stop and report. Do not iterate a third Vision in the same turn.
