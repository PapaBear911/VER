# TRIGGERS

Table mapping user phrases to files loaded. When a user message contains one of these phrases,
load the corresponding file and act on it.

Trigger files themselves — referencing any of these loads the rest of their chain:

- `AGENTS.md`
- `refine/validate.md`
- `refine/enhance.md`
- `refine/review.md`
- `phases/visualize.md`
- `OPEN-THREADS.md`
- `DECISIONS.md`

## Phrase map

| Phrase | File | Scope |
|---|---|---|
| "Build X" / "Add X" / "Fix X" | `AGENTS.md` | Full loop: Visualize → Engineer → Release. |
| "Plan X" / "What should we build?" | `phases/visualize.md` | Phase 1 detail: assumptions, tradeoffs, spec. |
| "Refine this" | `refine/validate.md` + `refine/enhance.md` + `refine/review.md` | Full refine pass, in order. |
| "Validate this" | `refine/validate.md` | Built work vs. original Vision — gaps, drift. |
| "Simplify this" | `refine/enhance.md` | Re-climb the Ponytail ladder; delete aggressively. |
| "Review this diff" | `refine/review.md` | End-to-end read of the diff; verdict Ship or Loop. |
| "What's open?" | `OPEN-THREADS.md` | Live TODO and pending items. |
| "What did we decide about X?" | `DECISIONS.md` | ADR log; search by topic. |
