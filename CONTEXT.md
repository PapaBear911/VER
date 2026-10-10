# CONTEXT

Seed document for V.E.R. Read this to understand the project's purpose and frozen contracts.

## Core Vision

> See it. Build it. Ship it. Every release feeds the next vision.

The tagline is frozen. It is the constitution, not decoration: every rule, gate, and profile must serve one of its four clauses. See it means understand before touching. Build it means choose the smallest working change. Ship it means do not ship a lie. The final clause makes each release seed the next Vision.

## Facts

- **Version:** 1.1.0 — the Router release
- **Author:** Ver Sangil
- **License:** MIT
- **Root file:** `AGENTS.md` — universal rule; one file, no hooks, CLI, or runtime.
- **Loop:** Visualize → Engineer → Release → Visualize.
- **Router:** classify the task before Phase 1; load relevant additive profiles from `profiles/`.
- **Stacking:** profiles stack; where gates overlap, the stricter gate wins.
- **Security:** every Release runs automated scanning; sensitive surfaces escalate to a context-aware guard; uncertainty or irreversible/highest-severity changes escalate to a human.
- **UX:** Five-State Check in Visualize, Human-Path Test in Engineer, Copy Audit in Release.
- **Rollback:** every release note ends with `To undo: [command or process]`.

## What counts as a task

- **Code, configuration, schema, or dependency changes run the loop.** Route the task, complete loaded profile gates, and pass all three phase gates.
- **Pure questions are answered directly.** No phases, gates, or log entry.
- **Documentation changes** run the loop with the `docs` profile; a simple factual answer does not.

## User approval

An approval is one of: `yes`, `go`, `approved`, `ship it`, `looks good`.

Anything else is not approval. Silence, an emoji, or a topic change is not approval. Approval
applies only to the Vision as presented. A changed Vision needs approval again.

## Task Router

The frozen router shape is a keyword/domain table plus `@domain` and `@domain+domain`
overrides. The router selects profiles; profiles only add gates and never replace the base loop.
The eight v1.1.0 profiles are programming, security, ui, ux, data, devops, testing, and docs.
No match runs the base loop. A pure question bypasses routing.

## Refine Pass

Optional, three passes, each one file:

| Pass | File | Purpose |
|---|---|---|
| Validate | `refine/validate.md` | Compare built work with the approved Vision. |
| Enhance | `refine/enhance.md` | Re-climb the Ponytail ladder; shrink the diff. |
| Review | `refine/review.md` | Read end to end; return Ship or Loop. |

## Frozen facts

- **Tagline:** “See it. Build it. Ship it. Every release feeds the next vision.”
- **Acronym:** V.E.R. = Visualize → Engineer → Release.
- **Phase names:** Visualize, Engineer, Release.
- **Sub-step names:** Visualize / Validate / Vision; Establish / Engineering / Execution; Refinement / Rollout / Release.
- **Refine names:** Validate, Enhance, Review.
- **Router shape:** domain keyword table and `@domain` / `@domain+domain` syntax; profile additions are allowed, syntax changes are not.
- **Always-active rules:** Karpathy principles and the 7-rung Ponytail ladder.
- **Delivery:** root `AGENTS.md`; no hooks, CLI, or runtime in 1.x.
- **Installation:** append, never replace any existing agent configuration or user content.

## Stability commitment (v1.1.0)

Phase names, sub-step names, refine-pass names, tagline, acronym, delivery mechanism, and router
syntax are frozen for all 1.x releases. Router and Profiles are the sole structural addition
permitted in 1.x. Profiles may be added; the router syntax may not change. Other additions may
only be new references, examples, or clarifications — never new phases, gates, or mechanisms.

Trust layers must not shift under their users. This commitment is recorded in `INVARIANTS.md`
and `DECISIONS.md`.
