# Changelog

All notable changes to the V.E.R. project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.2] - 2026-11-15

### Changed
- Renamed CLI binary from `ver` to `ver-rules` to avoid collisions with the built-in `ver` command in `cmd.exe` on Windows.
- Narrowed marker detection to `/<!-- VER v\d/` so user comments containing `<!-- VER ` do not abort installation.
- Excluded local `vision-log.md` from git tracking via `.gitignore`.

### Fixed
- Installer now restores 0-byte pre-existing files without unlinking them during uninstall.
- Enforced `ver-gates/` existence inside target directory during `--check` (no silent package fallback).
- Guarded ancestor-directory pruning against path traversal.

### Added
- Fourth refine pass: `refine/distill.md` for compressing external knowledge into VER-native references.
- Universal core reference: `references/ver-core.md` summarizing the entire loop, gates, and anti-patterns.
- GitHub Actions CI workflow (`.github/workflows/ci.yml`) testing Node 18, 20, 22 on Ubuntu and Windows.
- Reproducible `package-lock.json` with zero dependencies.
- Native standard library test coverage script (`npm run test:coverage`) at 97.74% line coverage.
- Keep a Changelog documentation (`CHANGELOG.md`).
- Six regression tests in `test/ver.test.js`.

### Removed
- Retired redundant `TRIGGERS.md` lookup table in favor of the single-source Task Router in `AGENTS.md`.

## [2.1.1] - 2026-10-12

### Added
- Restructure agent rules and implement ownership tracking.
- Static verification gates in `ver-gates/` (`contracts`, `file-existence`, `receipt-log`, `deploy-aware`, `run-before-done`, `spec-before-edit`).
- Audit command: `ver-rules --check [dir]` for verifying rules, contracts, and invariants.
- Recurring-lesson graduation (Invariant #16): `Recurs:` and `Promoted:` tags in `vision-log.md`.

## [2.1.0] - 2026-10-11

### Added
- Static verification gates in `ver-gates/` (`contracts`, `file-existence`, `receipt-log`, `deploy-aware`, `run-before-done`, `spec-before-edit`).
- Audit command: `ver-rules --check [dir]` for verifying rules, contracts, and invariants.
- Recurring-lesson graduation (Invariant #16): `Recurs:` and `Promoted:` tags in `vision-log.md`.

## [2.0.0] - 2026-10-10

### Added
- npm distribution via package `@papabear911/ver`.
- One-shot installer CLI (`bin/ver.js`) with `--project`, `--global`, `--agent`, and `--uninstall`.
- Unit test suite for CLI installation and uninstallation behaviors.

### Changed
- Superseded 1.x delivery invariant: delivery is now npm package with installer CLI rather than manual copy only.
- Invariant #14: append-never-replace enforced by installer CLI.

## [1.1.0] - 2026-10-10

### Added
- 15-line Task Router with keyword table and `@domain` / `@domain+domain` override syntax.
- Additive domain profiles in `profiles/`: programming, security, ui, ux, data, devops, testing, docs.
- Stacking rule: domain profiles add gates; stricter gate wins on overlap.
- Three-tier layered security model (automated scan, security guard, human escalation).
- First-class UX verification: Five-State Check, Human-Path Test, Copy Audit.
- Installation guides in `INSTALL.md`.

## [1.0.0] - 2026-10-10

### Added
- Initial release of V.E.R. (Visualize → Engineer → Release).
- Core constitution and rules in `AGENTS.md`.
- Karpathy principles and 7-rung Ponytail ladder in `references/`.
- Three sequential phases (`phases/visualize.md`, `phases/engineer.md`, `phases/release.md`).
- Optional refine passes (`refine/validate.md`, `refine/enhance.md`, `refine/review.md`).
- Project invariants in `INVARIANTS.md` and seed facts in `CONTEXT.md`.
