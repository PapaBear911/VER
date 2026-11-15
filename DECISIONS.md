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

## 2026-10-11 — Recurring lessons must graduate (invariant #16)

- **Decision:** Add `Recurs:` and `Promoted:` tags to the `vision-log.md` entry format. A latest
  entry carrying `Recurs:` must also carry `Promoted:` resolving to a file that contains the
  quoted phrase. `ver --check` enforces the pointer; invariant #16 records the rule.
- **Rationale:** Logging a lesson twice without promoting it is how a loop stops compounding.
  Detecting recurrence stays agent judgment — wording varies and fuzzy matching would fire on
  unrelated entries — so the gate enforces the consequence once the agent commits to the judgment
  by writing the tag. The pointer asserts the artifact, not its address: existence alone would
  pass on a path typed but never written.
- **Rejected alternatives:** Fuzzy/similarity detection of recurring lessons (false positives);
  existence-only pointer checks (the lie this replaces); a seventh gate directory (the receipt-log
  gate already owns `vision-log.md`); scanning all history on every check (a later edit to a
  promoted rule would retroactively break old pointers); runtime or hook enforcement (invariant #8
  and the no-runtime promise).
- **Distinct from:** "2026-10-10 — Two-strike gate failure". That rule counts *gate failures*
  within one task and stops after two. This rule counts *lesson recurrences* across releases and
  escalates after two. Different counters, different failure modes.
- **Rollback plan:** To undo: remove the `Recurs:`/`Promoted:` block from the `receipt-log`
  section of `bin/ver.js`, revert the format block in `AGENTS.md`, and delete this entry's
  invariant #16.

## 2026-10-12 — CLI binary renamed to ver-rules; installer audit gaps closed

- **Decision:** Rename the package binary in `package.json` from `ver` to `ver-rules`. Close four
  installer safety defects: (1) restore 0-byte pre-existing files without unlinking them; (2) require
  `ver-gates/` to exist inside the target directory during `--check` (no silent package fallback);
  (3) narrow marker detection to `/<!-- VER v\d/` so user comments containing `<!-- VER ` do not abort
  installation; (4) guard ancestor-directory pruning against path traversal.
- **Rationale:** On Windows, `cmd.exe` has an internal `ver` command that shadows PATH resolution.
  Any package publishing a `ver` bin silently fails when invoked bare via cmd.exe or `npx`, printing
  the Windows version banner and ignoring arguments. `ver-rules` has no shell collisions and is the
  only bin, so `npx @papabear911/ver` resolves unambiguously. The four installer fixes ensure the
  contract "appends and never replaces" holds on zero-byte files, false-positive marker comments,
  and uninstalled audits.
- **Rejected alternatives:**
  - Keeping `ver` as an alias alongside `ver-rules`: rejected because npm auto-selects the binary
    matching the package name (`ver`), re-introducing the cmd.exe collision on Windows.
  - Runtime wrapper script detecting Windows: unnecessary complexity; a distinct bin name is the
    native npm pattern.
- **Rollback plan:** To undo: restore `"ver": "bin/ver.js"` in `package.json`, revert `bin/ver.js`
  changes, and update `CONTEXT.md` facts.

## 2026-11-15 — v2.1.2: Release packaging, CI automation, and local receipt hygiene

- **Decision:** Release v2.1.2 as a patch release. Consolidate the `ver-rules` Windows CLI rename, installer safety fixes, GitHub Actions CI workflow, `package-lock.json`, native test coverage script, Keep a Changelog documentation, and explicit exclusion of local-only receipts (`vision-log.md`) via `.gitignore`.
- **Rationale:** Patch release accurately reflects backward-compatible installer bugfixes, shell collision protection on Windows, and developer automation improvements without altering core rule syntax or the three-phase loop.
- **Alternatives rejected:** v2.2.0 minor release (rejected to maintain conservative SemVer, as no breaking API or core router syntax changed).
- **Rollback plan:** To undo: checkout v2.1.1 tag or revert this release commit.

## 2026-11-15 — Fourth Refine Pass: Distill, Core Reference, and TRIGGERS.md Declutter

- **Decision:** Formalize `refine/distill.md` as the fourth refine pass alongside Validate, Enhance, and Review. Add `references/ver-core.md` as the universal single-page reference for the VER loop. Retire and delete redundant `TRIGGERS.md`.
- **Rationale:** 
  - `distill.md` operationalizes the pattern of taking external material (articles, guides, examples) and compressing them into VER-native references with deduplication and verification gates.
  - `ver-core.md` provides an earned, one-page reference summarizing all loop rules, hard gates, and anti-patterns for quick lookup.
  - `TRIGGERS.md` was an early static lookup table that duplicated the Task Router in `AGENTS.md` and caused dual-source-of-truth maintenance friction.
- **Alternatives rejected:**
  - Keeping `TRIGGERS.md` alongside `AGENTS.md`: rejected due to redundant maintenance and inevitable drift.
  - Leaving `distill.md` untracked or outside the formal refine pass list: rejected because Invariant #9 requires all refine-pass additions to be recorded.
- **Amended invariants:** #9 — refine-pass names expanded to include `Distill`.
- **Rollback plan:** To undo: remove `refine/distill.md` and `references/ver-core.md`, restore `TRIGGERS.md`, revert Invariant #9, and update `CONTEXT.md`.

## 2026-11-15 — Humanized simplification comment: ponytail: renamed to ceiling:

- **Decision:** Rename the comment convention for deliberate simplifications from `ponytail:` to `ceiling:`.
- **Rationale:** While the Ponytail ladder remains the underlying 7-rung framework name, application code is read by external developers, auditors, and clients who do not need internal framework jargon. `ceiling:` directly expresses the required information (the operational ceiling and upgrade path), consumes 1 token across all modern tokenizers, and carries no negative code smell connotations in automated review.
- **Alternatives rejected:** `shortcut:` (perceived as tech debt or sloppiness in audits), `tradeoff:` (2 tokens, less explicit about scale limit), `hack:` (triggers security/linter warnings).
- **Rollback plan:** To undo: replace `ceiling:` back with `ponytail:` in `references/ponytail-ladder.md`, `phases/engineer.md`, and `refine/enhance.md`.

## 2026-11-15 — Contract-First Evolution: The Three Traps, Execution Slices, and --hook installer

- **Decision:** Enhance the core loop across three dimensions: (1) Add The Three Traps check to `phases/visualize.md` for sensitive surfaces and multi-agent handoffs; (2) Add Execution Slices (Contract ➔ Implementation ➔ Integration) and Context Budget rules to `phases/engineer.md` for changes >2 files; (3) Add a zero-dependency, append-only git pre-commit hook installer (`ver-rules --hook [dir]`) in `bin/ver.js`.
- **Rationale:** 
  - Prevents premature planning on ambiguous, high-risk features by forcing boundary, ceiling, and irreversibility resolution upfront.
  - Slices complex multi-file engineering into verifiable contract checkpoints without introducing task-queue or state-machine file bloat (honoring "No GSD state machine").
  - `ver-rules --hook` turns static gate audits into an unbypassable, automated local git gate.
- **Alternatives rejected:** Full GSD-style `.planning/` task state machine (rejected per invariant); open-ended conversational "grill-me" loops on trivial tasks (rejected to avoid reviewer fatigue).
- **Rollback plan:** To undo: revert changes in `bin/ver.js`, `phases/visualize.md`, `phases/engineer.md`, and `profiles/devops.md`.

## 2026-11-15 — Cross-Domain Governance: Dual Truth Standard and Bounded Undo

- **Decision:** Extend V.E.R. beyond software and digital content creation to govern real-world implementation deliverables, interventions, and procedures (initiating with `@policy` and `@research` profiles and a facilities commissioning walkthrough). Override Invariant #6 to establish a dual execution standard: current-session code execution remains mandatory for software and scripts, while observed physical/field execution or inspecting an authoritative, dated execution record is the standard for non-code interventions. Clarify Invariant #13: when complete physical or institutional reversal is unavailable, the mandatory `To undo:` line requires the Three-Part Bounded Undo (responsible authority, concrete mitigation/suspension steps, and disclosed irreversible residual effects). Update `INVARIANTS.md` and `CONTEXT.md` in lockstep.
- **Rationale:** 
  - V.E.R.'s core principles (See it, Build it, Ship it; Karpathy principles; Ponytail ladder; hard gates) apply universally to engineering, governance, empirical research, and physical commissioning.
  - In non-software domains, requiring command-line exit code 0 forces artificial scripts or simulated outputs, violating the spirit of "do not ship a lie". Conversely, abolishing code execution for software would cause regression. The dual standard preserves uncompromising rigor in software while recognizing authoritative execution evidence in physical and institutional domains.
  - Real-world interventions (e.g., enacted civic policies, published research, physical equipment installations) cannot be rolled back atomically via `git revert`. Defining the Three-Part Bounded Undo ensures accountability without requiring impossible reversal.
- **Alternatives rejected:**
  - Profiles-only addition without invariant override: rejected because Invariant #6 and Gate 2 would still statically demand terminal command execution, trapping non-code domains in fake script execution.
  - Relaxing software test requirements: rejected because running code in the current session remains the sole truth for software.
  - Creating job-title persona profiles (CEO, HR, PM): rejected to avoid profile bloat and roleplay; V.E.R. profiles govern artifact disciplines, while institutional authorities sign off.
- **Amended invariants:** #6 — dual truth standard (code execution for software; observed execution or authoritative records for real-world interventions); #13 — Three-Part Bounded Undo when complete reversal is unavailable.
- **Rollback plan:** To undo: revert this entry in `DECISIONS.md`, restore Invariants #6 and #13 in `INVARIANTS.md`, revert `CONTEXT.md`, and remove `@policy` and `@research` profiles.
