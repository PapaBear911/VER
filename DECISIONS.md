# DECISIONS

Append-only decision record for V.E.R. Each entry records the date, decision, rationale, and
alternatives rejected. Do not rewrite a past decision; supersede it with a new dated entry.

## 2026-10-10 — Founding decision: author and name

- **Decision:** The project is V.E.R. (Visualize → Engineer → Release), authored by Ver Sangil.
  The shared root between the author's name and the project name is intentional.
- **Rationale:** V.E.R. is a signature: the author and the loop carry the same root.
- **Alternatives rejected:** Anonymous authorship; a different project name; treating the
  shared root as coincidence.

## 2026-10-10 — The tagline is the architecture, not a slogan

- **Decision:** The tagline — "See it. Build it. Ship it. Every release feeds the next vision." —
  is the repo's core vision and the test for relevance of every rule, profile, and gate.
- **Rationale:** A tagline that is only a slogan is decoration. A tagline that is the
  architecture is a contract. Every enhancement in v1.1.0 maps to one of the four clauses. None
  of them adds a fifth. None of them changes the tagline.
- **Alternatives rejected:**
  - Revising the tagline to mention Router/Security/UX (dilutes the tagline, adds nothing — the
    tagline already contains them).
  - Treating the tagline as decorative and keeping the architecture separate (creates two
    sources of truth).
  - Adding a fifth clause for "verify it" or "secure it" (unnecessary — verification and security
    are part of "Ship it"; UX is part of "See it").

## 2026-10-10 — Three phases

- **Decision:** Use three ordered phases: Visualize, Engineer, Release.
- **Rationale:** They are the minimum complete loop: define the outcome, build and prove it,
  then ship and learn. Two phases omit either the vision or the learning loop; four adds a
  boundary without a distinct necessary responsibility.
- **Alternatives rejected:** Two phases, which collapse a required responsibility; four or more,
  which split work without improving the gates.

## 2026-10-10 — Optional Refine Pass

- **Decision:** Validate, Enhance, and Review are optional passes, not mandatory phases.
- **Rationale:** A simple change should not pay the cost of a second workflow. Invoke a pass
  when the work needs comparison, simplification, or an end-to-end review.
- **Alternatives rejected:** Mandatory refinement on every task; adding the passes to the frozen
  phase sequence.

## 2026-10-10 — AGENTS.md delivery

- **Decision:** Deliver the always-on rule as root `AGENTS.md`.
- **Rationale:** A plain file is inspectable, portable, and requires no runtime or installation
  beyond placing it in the repository. Tools that support the open convention can read it natively.
- **Alternatives rejected:** A hook, which depends on platform integration; a CLI, which adds
  installation and execution; a runtime, which adds a mechanism the rule does not need.

## 2026-10-10 — Two-strike gate failure

- **Decision:** Fix one gate failure once; after a second failure on the same gate, stop and report.
- **Rationale:** Repeated attempts without revisiting the Vision encourage invented work and
  endless loops. Two failures are evidence that the upstream definition may be wrong.
- **Alternatives rejected:** Unlimited retries; stopping after one failure without a chance to
  correct a concrete deficiency.

## 2026-10-10 — No GSD state machine

- **Decision:** V.E.R. does not adopt GSD's state machine.
- **Rationale:** V.E.R. is a lightweight trust layer, not a project-management framework. Hard
  gates and a learning log close the loop without persistent orchestration state.
- **Alternatives rejected:** A `.planning/` directory, phase state machine, subagent
  orchestration, or other framework machinery.

## 2026-10-10 — v1.1.0: Task Router

- **Decision:** Add a 15-line keyword-matching router with `@domain` / `@domain+domain` override
  syntax to load domain profiles on demand.
- **Rationale:** Delivers universality across diverse engineering disciplines without bloating
  the universal `AGENTS.md` core rule.
- **Alternatives rejected:** Monolithic `AGENTS.md` containing all domain gates (exceeds token
  caps, adds friction to unrelated tasks); runtime agent switcher (violates no-runtime promise).

## 2026-10-10 — v1.1.0: Additive domain profiles and stacking rule

- **Decision:** Domain profiles add gates to existing phases; they never replace the loop. When
  two profiles add gates to the same phase, the stricter gate wins.
- **Rationale:** Prevents fragmented parallel workflows and ensures composite tasks (e.g.
  security + UX) enforce the highest standard of verification without conflicts.
- **Alternatives rejected:** Exclusive profiles (forcing a choice between security and UX);
  priority ordering where one profile disables another.

## 2026-10-10 — v1.1.0: Layered security model

- **Decision:** Security gate operates in three layers: automated scan (every release), security
  guard (when sensitive surfaces are touched), and human-in-the-loop (uncertainty or irreversible
  changes).
- **Rationale:** Automated catches volume; guard catches context; human catches novelty. Overuse
  of human review causes reviewer fatigue and rubber-stamping.
- **Alternatives rejected:** Single automated linter (misses logic flaws and privilege
  escalation); mandatory human sign-off on every task (unusable, causes review fatigue).

## 2026-10-10 — v1.1.0: UX as a first-class concern

- **Decision:** Formalize UX quality through the Five-State Check, Human-Path Test, and Copy
  Audit.
- **Rationale:** Software fails most frequently in empty, loading, and error states that tests
  rarely cover. Human-path verification catches usability gaps before release.
- **Alternatives rejected:** Treating UX as subjective styling outside the loop; deferring UX
  checks to post-release bug reports.

## 2026-10-10 — v1.1.0: Installation appends and never replaces

- **Decision:** Installation must append or import into existing agent configuration files
  (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, etc.) and never overwrite or delete user files.
- **Rationale:** Users adopting VER in active repositories must not lose existing rules,
  preferences, or domain workflows. Overwriting destroys user work and creates adoption friction.
- **Alternatives rejected:** Overwrite existing config files; skip installation if files exist;
  force symlinks that replace existing files.

## 2026-10-10 — v1.1.0: Stability amendment

- **Decision:** Router and Profiles are the sole structural addition permitted in 1.x. All phase
  names, sub-step names, refine-pass names, tagline, acronym, and delivery mechanism remain
  strictly frozen.
- **Rationale:** Trust layers must not shift under their users. 1.x stability guarantees that the
  core rule remains stable across minor versions.
- **Alternatives rejected:** Semantic versioning with breaking changes in 1.x; adding hooks or
  runtimes in future 1.x minor releases.

## 2026-10-10 — v2.0.0: npm distribution and installer CLI

- **Decision:** Ship V.E.R. as `@papabear911/ver` with a one-shot installer CLI, and bump the
  major version to 2.0.0.
- **Rationale:** npm is the lowest-friction distribution channel; the installer respects
  append-never-replace; the CLI is a file placer, not a runtime.
- **Rejected alternatives:** curl-only stays supported but is not the primary path; no
  `postinstall` hook — writing to a user's repo without an explicit command is replacement by
  surprise; no runtime, hook, or daemon.
- **Rollback plan:** *"To undo v2.0.0: run `npm uninstall -g @papabear911/ver`, then follow §7
  Uninstall in `INSTALL.md` to remove the appended VER blocks. The curl path in §2 remains valid
  and requires no rollback."*
- **Amended invariants:** #9 — delivery mechanism becomes npm + CLI at 2.0.0; #14 —
  append-never-replace is now enforced by an installer, not by convention.
- **Supersedes:** "2026-10-10 — AGENTS.md delivery", whose rejection of a CLI applied to the 1.x
  stability line. That rejection is now itself superseded, by deliberate act, in this entry — not
  by drift.
