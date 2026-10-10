# Refine Pass — Validate

Deep dive. `AGENTS.md` stays authoritative; this file adds method.

Run when: "validate", "does this match the vision?", "are we still on target?"

## Purpose

Confirm that what was built matches the original approved Vision. Not whether it is good; not
whether it could be better. Did it change, and where?

## Steps

1. Re-read the original Vision (outcome, scope, non-scope, constraints).
2. Re-read the actual diff and the changed public surface.
3. Compare: list each expected item, each built item, and each absent or extra item.
4. Classify each diff as gap, drift, expected change, or unnecessary addition.
5. Decide what to fix now, what to accept, and what to defer; make unnecessary additions
   justified or deleted.

## Output verdict paragraph

```markdown
## Validation verdict

Matches Vision: yes / no / partially.

| Item | Expected | Built | Status |
|---|---|---|---|
| [expected] | [expectation] | [actual] | [gap / drift / expected / extra] |

Decisions:
- Fix now: [items]
- Accept: [items, with reason]
- Defer: [items, with reason]
- Delete: [extra items removed]
```

No table row may remain without a status. No extra item may survive without an explicit reason.

## HARD GATE — no silent acceptance

Any gap or drift not explicitly accepted or fixed before Gate 3 blocks release.
