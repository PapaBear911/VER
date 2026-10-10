# DECISIONS

Append-only decision record for V.E.R. Each entry records the date, decision, rationale, and alternatives rejected. Do not rewrite a past decision; supersede it with a new dated entry.

## 2026-10-10 — Founding decision: author and name

- **Decision:** The project is V.E.R. (Visualize → Engineer → Release), authored by Ver Sangil. The shared root between the author's name and the project name is intentional.
- **Rationale:** V.E.R. is a signature: the author and the loop carry the same root.
- **Alternatives rejected:** Anonymous authorship; a different project name; treating the shared root as coincidence.

## 2026-10-10 — Three phases

- **Decision:** Use three ordered phases: Visualize, Engineer, Release.
- **Rationale:** They are the minimum complete loop: define the outcome, build and prove it, then ship and learn. Two phases omit either the vision or the learning loop; four adds a boundary without a distinct necessary responsibility.
- **Alternatives rejected:** Two phases, which collapse a required responsibility; four or more, which split work without improving the gates.

## 2026-10-10 — Optional Refine Pass

- **Decision:** Validate, Enhance, and Review are optional passes, not mandatory phases.
- **Rationale:** A simple change should not pay the cost of a second workflow. Invoke a pass when the work needs comparison, simplification, or an end-to-end review.
- **Alternatives rejected:** Mandatory refinement on every task; adding the passes to the frozen phase sequence.

## 2026-10-10 — AGENTS.md delivery

- **Decision:** Deliver the always-on rule as root `AGENTS.md`.
- **Rationale:** A plain file is inspectable, portable, and requires no runtime or installation beyond placing it in the repository. Tools that support the open convention can read it natively.
- **Alternatives rejected:** A hook, which depends on platform integration; a CLI, which adds installation and execution; a runtime, which adds a mechanism the rule does not need.

## 2026-10-10 — Two-strike gate failure

- **Decision:** Fix one gate failure once; after a second failure on the same gate, stop and report.
- **Rationale:** Repeated attempts without revisiting the Vision encourage invented work and endless loops. Two failures are evidence that the upstream definition may be wrong.
- **Alternatives rejected:** Unlimited retries; stopping after one failure without a chance to correct a concrete deficiency.

## 2026-10-10 — No GSD state machine

- **Decision:** V.E.R. does not adopt GSD's state machine.
- **Rationale:** V.E.R. is a lightweight trust layer, not a project-management framework. Hard gates and a learning log close the loop without persistent orchestration state.
- **Alternatives rejected:** A `.planning/` directory, phase state machine, subagent orchestration, or other framework machinery.

## 2026-10-10 — v1.0.0 stability commitment

- **Decision:** Freeze the phase names, sub-step names, refine-pass names, and `AGENTS.md` delivery mechanism for all 1.x releases. Additions may only be reference files, examples, or clarifications — never phases, gates, or mechanisms.
- **Rationale:** Trust layers must not shift under users. Stable names and behavior make it possible to adopt the rule without fearing that its core workflow will change in a minor release.
- **Alternatives rejected:** Semantic versioning with breaking changes allowed inside 1.x; feature-flagged variants that fragment the rule and its guarantees.
