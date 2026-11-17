# CONTEXT

Seed document for V.E.R. Read this to understand the project's purpose and frozen contracts.

## Core Vision

> See it. Build it. Ship it. Every release feeds the next vision.

The tagline is frozen. It is the constitution, not decoration: every rule, gate, and profile must serve one of its four clauses. See it means understand before touching. Build it means choose the smallest working change. Ship it means do not ship a lie. The final clause makes each release seed the next Vision.

## Facts

- **Version:** 2.2.1 — cross-domain governance profiles, dual truth standard, and .ver-rules subfolder consolidation
- **Author:** Ver Sangil
- **License:** MIT
- **Root file:** `AGENTS.md` — universal rule; delivered via `@papabear911/ver` with `ver-rules` installer CLI. Still no daemon or inference-time runtime.
- **Loop:** Visualize → Engineer → Release → Visualize.
- **Router:** classify the task before Phase 1; load relevant additive profiles from `profiles/`.
- **Stacking:** profiles stack; where gates overlap, the stricter gate wins.
- **Security:** every Release runs automated scanning; sensitive surfaces escalate to a context-aware guard; uncertainty or irreversible/highest-severity changes escalate to a human. On non-software surfaces, security protects against privacy/PII leaks, institutional liability, and physical safety hazards.
- **UX:** Five-State Check in Visualize, Human-Path Test in Engineer, Copy Audit in Release.
- **Rollback:** every release note ends with `To undo: [command or process]`. For non-code interventions where atomic reversal is impossible, `To undo:` follows the Three-Part Bounded Undo (responsible authority, concrete mitigation/suspension steps, disclosed irreversible residual effects).

## What counts as a task

- **Deliverables and interventions** (code, config, schema, docs, rules, institutional policies, research protocols, physical commissioning) run the loop. Docs use the `docs` profile; policies use `policy`; studies use `research`.
- **Questions and lookups** get answered directly. No loop, no gate, no log.
- **Reviews** get a verdict. Fixes required by the verdict become a separate task.
- **Packaging** (commit message, PR description, release note) is derived from existing work; it does not restart the loop.
- **Unclear** requests get one clarifying question — never a silent default.

## User approval

An approval is one of: `yes`, `go`, `approved`, `ship it`, `looks good`.

Anything else is not approval. Silence, an emoji, or a topic change is not approval. Approval
applies only to the Vision as presented. A changed Vision needs approval again. Chat approval
authorizes the agent's preparation scope; consequential real-world interventions require
institutional authorization recorded in the Vision.

## Task Router

The frozen router shape is a keyword/domain table plus `@domain` and `@domain+domain`
overrides. The router selects profiles; profiles only add gates and never replace the base loop.
The ten domain profiles are programming, security, ui, ux, data, devops, testing, docs, policy, and research.
Action-based disambiguation routes software policies to programming/security and code investigation to lookup/programming.
No match runs the base loop. A pure question bypasses routing.

## Refine Pass

Optional, four passes, each one file:

| Pass | File | Purpose |
|---|---|---|
| Validate | `refine/validate.md` | Compare built work with the approved Vision. |
| Enhance | `refine/enhance.md` | Re-climb the Ponytail ladder; shrink the diff. |
| Review | `refine/review.md` | Read end to end; return Ship or Loop. |
| Distill | `refine/distill.md` | Compress external material into a VER-native reference. |

## Frozen facts

- **Tagline:** “See it. Build it. Ship it. Every release feeds the next vision.”
- **Acronym:** V.E.R. = Visualize → Engineer → Release.
- **Phase names:** Visualize, Engineer, Release.
- **Sub-step names:** Visualize / Validate / Vision; Establish / Engineering / Execution; Refinement / Rollout / Release.
- **Refine names:** Validate, Enhance, Review, Distill.
- **Router shape:** domain keyword table and `@domain` / `@domain+domain` syntax; profile additions are allowed, syntax changes are not.
- **Always-active rules:** Karpathy principles and the 7-rung Ponytail ladder.
- **Delivery:** Git tag checkout (`git clone --depth 1 --branch <tag> .../VER.git ../ver-source`) run via `node ../ver-source/bin/ver.js`; a one-shot `ver-rules` installer CLI with no daemon or inference-time runtime. The npm package remains available but is not the documented primary route.
- **Install paths:** project (`ver-rules --project [dir]`), update (`ver-rules --update [dir]`), git hook (`ver-rules --hook [dir]`), user-global (`ver-rules --global`), or agent config (`ver-rules --agent claude|cursor|gemini`).
- **Rule layout:** Supporting rule directories (`profiles/`, `phases/`, `refine/`, `references/`, `ver-gates/`, `docs/`) and `ver-manifest.json` are consolidated in `.ver-rules/` (`~/.ver-rules/` globally). Legacy root VER folders are automatically migrated into `.ver-rules/`.
- **Installation:** append, never replace any existing agent configuration or user content.

## Stability commitment (1.x)

Phase names, sub-step names, refine-pass names, tagline, acronym, and router syntax remain frozen.
The 1.x delivery freeze is superseded in 2.0.0 by the npm package and one-shot installer CLI; the
npm delivery is in turn superseded in 2.2.0 by the Git tag checkout, per the dated decisions in
`DECISIONS.md`. 1.x's other stability commitments remain unchanged.

Trust layers must not shift under their users. This commitment is recorded in `INVARIANTS.md`
and `DECISIONS.md`.
