# Phase 1 — VISUALIZE

Deep dive. `AGENTS.md` stays authoritative; this file adds method.

Sub-steps: **Visualize**, **Validate**, **Vision**. Ends in one hard gate.
Clause served: **See it.**

Loaded profiles may add gates here. Complete them before presenting the Vision.

## 0. Router

Before anything else, route the task. Match keywords against the domain table in `AGENTS.md`, or
honor an explicit `@domain` / `@domain+domain` override. Load the matching profiles from
`profiles/`. No match → run the base loop.

State which profiles loaded. A silent profile is a missed gate.

## 1. Visualize — goal restatement

### Goal restatement template

```
In one sentence: done looks like ___.
Observable? [what a person could check]
Checkable?  [the exact command or observation]
```

A deadline is not an outcome. "Refactor the auth module" is not an outcome. "Password reset
returns 400 on unknown email instead of 500, verified by the auth suite" is.

### Success criterion template

```
Pass when:  [exact command] → [exact expected output]
Fail when:  [what a broken version would print instead]
```

If you cannot state the failing output, you cannot tell success from a lucky pass.

## 2. Validate — assumption-surfacing protocol

1. **Read.** Open the files the task would touch. Name them.
2. **Inventory.** What already exists that covers part of this — dependencies, helpers, patterns.
3. **Assumptions.** Every assumption as a falsifiable sentence: *"Assumes the API returns a list,
   not a single object."* Assumptions are statements, not vibes.
4. **Risk.** Which assumption, if wrong, invalidates the plan?
5. **Ladder, rung 1.** Does this need to exist at all? "Do nothing" is a valid approved outcome.

### "Does this need to exist?" check

Ask all three. Any "no" stops the task:

- Is there a user or system that needs this **now**?
- Would the smallest version of this be enough?
- Is the request a solution to a problem someone else already solved here?

## 3. Vision — one question at a time

### One-question-at-a-time rule

Ask **one** clarifying question, wait for the answer, then ask the next only if the answer
changed the plan. Never a list of five. Each question you can answer by reading the code is not a
question — go read.

### Tradeoff presentation format

```
Option A — [name]: [one line]
  Cost: [what we give up]
Option B — [name]: [one line]
  Cost: [what we give up]
Chosen: A because [reason about this outcome]
Rejected: B because [cost we won't pay]
Out of scope: [explicitly not touching]
```

"Cleaner" is not a reason. The reason must be about this task's outcome.

### Minimal spec template

```markdown
## Vision: [task name]

**Profiles loaded:** [from router, or "base loop"]
**Done looks like:** [one observable sentence]
**Approach:** [one sentence]
**Files touched:** [list, or "discovered in Establish"]
**Assumptions:**
- [falsifiable sentence]
**Out of scope:** [deliberately not changing]
**Verification:** [exact command that proves it]
```

## Profile gates

Profiles commonly add here:

- **security** — a threat model: what can be abused, and by whom.
- **ux** — the Five-State Check: first use, success, failure, waiting, undo.
- **data** — a data contract and versioning statement.
- **devops** — a change plan and its blast radius.
- **ui** — a layout and state contract.
- **programming** — a contract check: what does this function promise its callers?

When two profiles add gates to this phase, the stricter gate wins.

## HARD GATE 1 — Vision approved

- [ ] Task routed; profiles loaded and named.
- [ ] Outcome stated as an observable sentence with a success criterion.
- [ ] Read step completed; existing code and dependencies inventoried.
- [ ] Every assumption written as a falsifiable sentence.
- [ ] Rung 1 answered — does this need to exist?
- [ ] At least two options with costs; choice justified against this outcome.
- [ ] Profile gates for this phase completed.
- [ ] Approval token received: `yes`, `go`, `approved`, `ship it`, `looks good`.

Silence is not approval. A plan that changed after approval needs approval again.

## Skip conditions

Skip Phase 1 only when all four hold: the instruction fully specifies the change; under 20 lines,
one known file, no new behavior, no new dependency; reversible; and no design decision remains.

## When this gate fails twice

Two failures mean the Vision itself is wrong. Stop and report. Do not iterate a third Vision.
