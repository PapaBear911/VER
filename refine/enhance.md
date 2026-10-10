# Refine Pass — Enhance

Deep dive. `AGENTS.md` stays authoritative; this file adds method.

Run when: "tighten it", "simplify", "delete anything unnecessary", "make the diff smaller".

## Purpose

Re-climb the 7-rung Ponytail ladder on the finished work. A change written under momentum
frequently holds at a simpler rung when viewed whole.

## Profile gates (v1.1.0)

Rung 1 is the strongest rung, but it never deletes a gate a profile added. Before removing a
line, ask: did a loaded profile require it? If yes, it is not optional and not deletable.

## Steps

1. Read the diff top to bottom.
2. For every block of code, start at Rung 1 and climb until a rung holds:
   - Does this block need to exist at all?
   - Is it already in the codebase?
   - Does the stdlib do it?
   - Does the platform do it?
   - Is an already-installed dependency doing it?
   - Can it be one line?
   - Is it the minimum code that works?
3. Delete dead lines, speculative wrappers, redundant checks, and comments that restate the code.
4. Verify every deliberate simplification has a `ponytail:` comment with ceiling and upgrade path.
5. Audit the diff: is it the smallest coherent change that meets the approved Vision?

## Output before/after line count and summary

```markdown
## Enhancement summary

Diff before: +[added] -[removed]
Diff after:  +[added] -[removed]
Net change:  [delta lines]

Removed:
- [item, reason]

Preserved deliberate simplifications:
- [item: ponytail comment present and audited]
```

## HARD GATE — smallest coherent change

Diff must be the smallest coherent change that meets the approved Vision. If a simpler rung
holds, take it before proceeding.
