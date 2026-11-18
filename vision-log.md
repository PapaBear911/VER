## 2026-11-15 — Release v2.1.2: Release packaging, CI automation, and local receipt hygiene
- **Learning:** Isolating local-only feedback receipts from git tracking via .gitignore ensures developer learning loops compound without polluting upstream repositories.
- **Next V seed:** Monitor GitHub Actions CI workflow execution on first push of dev/v2.1.2.

## 2026-11-15 — Added refine/distill.md: external-to-reference distillation pass
- **Learning:** References are most useful when they are earned — distilled from real sources you read and judged, not copied wholesale. The distill pass enforces extraction, compression, deduplication, and VER-shape formatting so every reference in `references/` carries its weight.
- **Next V seed:** Use the distill pass on a real external source to validate the process end-to-end.

## Distilled: V.E.R. Core

Source: V.E.R. Repository (v2.1.2)
Rules extracted: 10
Deduplicated against: references/karpathy-principles.md, references/ponytail-ladder.md, references/brownfield.md, references/dependencies.md, references/security-gates.md, references/testing-strategies.md, references/ux-checklist.md
Landing: references/ver-core.md

## 2026-11-15 — Documentation sync, decluttering, and architectural refinement
- **Learning:** Eliminating auxiliary lookup tables like TRIGGERS.md that duplicate primary router rules in AGENTS.md prevents dual-source-of-truth drift and tightens codebase surface.
- **Next V seed:** Keep all reference lists in README and CONTEXT synchronized whenever a new pass or reference lands.

## 2026-11-15 — Humanized simplification comment: ponytail: to ceiling:
- **Learning:** Renaming internal framework jargon to intuitive industry terms (`ceiling:`) ensures code comments remain professional, readable to external human reviewers, and compact (1 token).
- **Next V seed:** Validate that all agent walkthroughs and prompt examples reflect the ceiling: convention.

## 2026-11-15 — Contract-First Evolution & Multi-Agent Hardening
- **Learning:** Defining discrete Execution Slices and Contract Boundaries in the Minimal Spec eliminates multi-file drift in solo runs and enables deterministic handoffs in multi-agent swarms without adding state-machine bloat.
- **Next V seed:** Test the pre-commit hook in a fresh cloned repository to verify zero-friction onboarding.

## 2026-11-15 — Cross-Domain Governance: Dual Truth Standard and Bounded Undo
- **Learning:** Extending V.E.R. to civic policy, empirical research, and physical commissioning requires decoupling the truth standard into current-session code execution for software versus witnessed, authoritative execution records for non-code, paired with a Three-Part Bounded Undo when atomic reversal is physically impossible.
- **Next V seed:** Evaluate community feedback on candidate domains (procurement, continuity, audit) before establishing new profiles.

## 2026-11-15 — Release v2.2.0: .ver-rules Subfolder Consolidation, Manifest Colocation, and Automated Migration
- **Learning:** Encapsulating all framework rule files, documentation, and manifest into a single `.ver-rules/` folder with automated legacy directory migration and root manifest colocation completely eliminates repository root clutter while preserving user project documents.
- **Next V seed:** Validate multi-repo project onboarding across various workspace structures.

## 2026-11-15 - VER 2.2.0 external release verification
- **Learning:** A green source audit cannot prove package migration safety. Install the packed CLI into an external fixture that starts from the last published version, then verify update and undo.

## 2026-11-15 - README installation and npm verification
- **Learning:** Name the npm binary explicitly in copyable install commands, then exercise the commands against the tarball in a separate Git repository.

## 2026-11-15 - README banner verification
- **Learning:** Use a small public image with a stable URL when the README also ships as installed documentation, and verify the rendered image points to the published asset.

## 2026-11-15 — Delivery pivot closes the docs gap in one change
- **Learning:** A delivery-mechanism change is not complete until the docs (README, INSTALL, AGENTS, hook) land in the same change as the DECISIONS supersede entry and the INVARIANTS + CONTEXT override. Reviewing the working tree alone — however green — left DECISIONS.md, CHANGELOG 2.2.0, INVARIANTS #9, and CONTEXT.md silently contradicting the shipped commands. The invariant's own mandate ("write into DECISIONS.md, then update INVARIANTS.md and CONTEXT.md in the same change") is what closed the drift, not the audit.
- **Next V seed:** When a review names a delivery-record gap, check all four record files (DECISIONS, CHANGELOG, INVARIANTS, CONTEXT) for the same override in one pass, not just the doc the diff touched.

## 2026-11-17 — Release v2.2.1: version bump and tag pins
- **Learning:** A patch release that only bumps a version still hardcodes that version in install commands, ownership markers, and the context summary — a "docs-only" bump has a mechanical surface (README/INSTALL clone pins, `<!-- VER -->` markers) that must move in lockstep with VERSION, package.json, package-lock, AGENTS header, and a new CHANGELOG section. Skipping the marker/lockfile sweep leaves installs pointing at the previous tag.
- **Next V seed:** Automate the version bump as a single `npm version` / scripted sweep so every pin (except historical records) moves in one step.
