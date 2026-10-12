# CONTEXT

Seed document for V.E.R. Read this to understand the project's purpose and frozen contracts.

## Core Vision

> See it. Build it. Ship it. Every release feeds the next vision.

The tagline is frozen. It is the constitution, not decoration: every rule, gate, and profile must serve one of its four clauses. See it means understand before touching. Build it means choose the smallest working change. Ship it means do not ship a lie. The final clause makes each release seed the next Vision.

## Facts

- **Version:** 2.1.1 — the npm + installer-CLI release
- **Author:** Ver Sangil
- **License:** MIT
- **Root file:** `AGENTS.md` — universal rule; delivered via `@papabear911/ver` with `ver` installer CLI. Still no daemon or inference-time runtime.
- **Loop:** Visualize → Engineer → Release → Visualize.
- **Router:** classify the task before Phase 1; load relevant additive profiles from `profiles/`.
- **Stacking:** profiles stack; where gates overlap, the stricter gate wins.
- **Security:** every Release runs automated scanning; sensitive surfaces escalate to a context-aware guard; uncertainty or irreversible/highest-severity changes escalate to a human.
- **UX:** Five-State Check in Visualize, Human-Path Test in Engineer, Copy Audit in Release.
- **Rollback:** every release note ends with `To undo: [command or process]`.

## What counts as a task

- **File changes** (code, config, schema, docs, rules) run the loop. Docs use the `docs` profile.
- **Questions** get answered directly. No loop, no gate, no log.
- **Reviews** get a verdict. Fixes required by the verdict become a separate task.
- **Packaging** (commit message, PR description, release note) is derived from existing work; it does not restart the loop.
- **Unclear** requests get one clarifying question — never a silent default.

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
- **Delivery:** npm package `@papabear911/ver` with a one-shot `ver` CLI; no daemon or inference-time runtime.
- **Install paths:** project (`ver --project [dir]`), user-global (`ver --global`), or agent config (`ver --agent claude|cursor|gemini`).
- **Installation:** append, never replace any existing agent configuration or user content.

## Stability commitment (1.x)

Phase names, sub-step names, refine-pass names, tagline, acronym, and router syntax remain frozen.
The 1.x delivery freeze is superseded in 2.0.0 by the npm package and one-shot installer CLI,
per the dated decision in `DECISIONS.md`. 1.x's other stability commitments remain unchanged.

Trust layers must not shift under their users. This commitment is recorded in `INVARIANTS.md`
and `DECISIONS.md`.
