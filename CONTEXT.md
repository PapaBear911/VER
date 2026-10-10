# CONTEXT

Seed document for V.E.R. Read this to know what the project is without reading everything else.

## Facts

- **Version:** 1.0.0 (first stable release)
- **Author:** Ver Sangil
- **License:** MIT
- **Root file:** `AGENTS.md` — the delivery mechanism. Everything else is reference.
- **Loop:** Visualize → Engineer → Release → Visualize.

## What a task is

- **Code changes run the loop.** Any change to code, config, schema, or dependencies goes
  through all three phases and their hard gates.
- **Pure questions are answered directly.** No phases, no gates, no log entry. The loop exists
  to ship work, not to discuss it.

## What "user approval" means

An approval is one of: `yes`, `go`, `approved`, `ship it`, `looks good`.

Everything else is not approval. Silence is not approval. An emoji is not approval. A topic
change is not approval. A previous approval does not carry over to a changed plan — a Vision
that changed needs to be approved again.

Approval applies to the Vision as presented, including its stated tradeoffs and exclusions.
Approving a plan that says "we will not touch the config layer" is approval of that exclusion.

## Refine Pass

Optional, three passes, each one file:

| Pass | File | Purpose |
|---|---|---|
| Validate | `refine/validate.md` | Built work vs. approved Vision — gap and drift. |
| Enhance | `refine/enhance.md` | Re-climb the Ponytail ladder on finished work. |
| Review | `refine/review.md` | Read the diff end to end; verdict Ship or Loop. |

Any pass may be skipped. `refine/review.md` returning **Ship** is the only substitute for the
final look before Gate 3.

## Frozen facts

These do not change in 1.x:

- **Acronym:** V.E.R. = Visualize → Engineer → Release.
- **Phase names:** Visualize, Engineer, Release — and their sub-steps: Visualize / Validate /
  Vision; Establish / Engineering / Execution; Refinement / Rollout / Release.
- **Always-active rule-sets:** the Karpathy principles and the 7-rung Ponytail ladder. They
  apply in every phase on every turn and cannot be suspended for a phase.
- **Delivery mechanism:** `AGENTS.md`.
- **Learning artifact:** `vision-log.md`, one line per release.

## Stability commitment (v1.0.0)

V.E.R. 1.0.0 is the first stable release and the floor for all of 1.x.

- Phase names, gate count, and gate order are frozen.
- `AGENTS.md` stays the delivery mechanism. No hooks, no CLI, no runtime in 1.x.
- Additions in 1.x may only be new reference files, new examples, or clarifications — never new
  phases, new gates, or new mechanisms.

A trust layer that shifts under its users stops being a trust layer. The same commitment is
stated in `README.md`, `INVARIANTS.md`, and `DECISIONS.md`.
