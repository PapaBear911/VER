# VER 2.2.0 assessment and Claude Fable 5.2 workflow

## Visualize

The release goal is a verified 2.2.0 GitHub commit and npm package. An installed v2.1.1 project must upgrade through the packed CLI, pass the audit, and uninstall without deleting unrelated content or restoring old package-owned files. All execution takes place in a separate Git repository and disposable install targets.

This assessment was authored by Codex. The configured Claude endpoint returned HTTP 404 for the explicit model ID claude-fable-5-2. No Fable output is included.

## Architecture and file organization

| Surface | Responsibility and contract |
| --- | --- |
| AGENTS.md and BOOTSTRAP.md | Session entry, task routing, and instructions for invoking the loop. Installed projects resolve the full rule set under .ver-rules. |
| phases, profiles, references, refine | Phase methods, additive domain gates, shared rules, and optional refinement. A profile can strengthen a gate. |
| ver-gates and bin/ver.js | Static audit contracts and the dependency-free install, update, check, hook, and uninstall CLI. The manifest records ownership and SHA-256 hashes. |
| Root documentation and examples | Canonical documentation in Git and the tarball. Install maps docs into .ver-rules/docs and keeps examples with the rules. |
| package.json, package-lock.json, VERSION | Version 2.2.0, binary entry point, minimum Node version, and shipped-file allowlist. The CLI reports the package manifest version. |
| test and GitHub Actions | Node CLI tests and static audit. The CI matrix covers Node 18, 20, and 22 on Linux and Windows. |

The session path is AGENTS.md → applicable profiles → Visualize → Engineer → Release. The distribution path is Git commit → npm tarball → CLI → consumer rule bundle and manifest. The static audit checks file and marker contracts. Session approval, executed tests, and publication require separate evidence.

## Comments

- The zero-dependency, one-shot CLI fits a rules package. Keep its command surface small and test normal entry points.
- Audit output should distinguish a skipped optional receipt from a passed receipt. A clean static audit cannot prove the installer is safe.
- Identical gate filenames in distinct directories are expected. The staged root/docs mirrors were duplicate sources with independent drift potential.

## Gaps and recommendations

| Priority | Gap | Recommendation and disposition |
| --- | --- | --- |
| P0 | Legacy migration could move unrelated directories, overwrite collisions, and follow a Windows junction. | Implemented manifest-scoped migration, collision preservation, and redirected-path protection. |
| P0 | Update could read stale legacy keys, lose uninstall provenance, or install the global bundle at an extra nesting level. | Implemented ownership preservation and a shared global install/update entry point. |
| P1 | Lockfile version lagged. Docs were duplicated, CLI examples drifted, and some links referenced files absent from the tarball. | Updated metadata, canonicalized documentation, and verified the installed tarball. |
| P1 | Source tests and a static audit could pass while a published predecessor failed to upgrade. | Add the external tarball/predecessor smoke to CI as a follow-up. Compare the tested tarball integrity with npm after publication. |
| P1 | Release still depends on a usable npm authentication method. | Configure repository-bound npm trusted publishing as a follow-up, with GitHub CI and an explicit release job. |
| P2 | The ownership manifest has no transaction lock. Concurrent writers to the same target or interruptions during manifest writes can leave mixed versions. | A future manifest revision should first add atomic manifest replacement, then introduce per-target locking if concurrent installs are needed. |
| P2 | Modified files retained after rollback can contain old configuration references. | Test exports from each supported agent and document manual cleanup for customized blocks. Keep modified files recoverable. |

## Fable 5.2 workflow

1. **Visualize.** Provide the exact candidate SHA or diff, package inventory, root instructions, and external test results. Ask Fable 5.2 to trace fresh install, published-version upgrade, uninstall, and package distribution. Require findings with paths, call sites, evidence, and an explicit statement of unverified steps.
2. **Engineer.** Ask for the smallest reproducer and test oracle per defect. Run each reproducer against a disposable external repository and test repaired behavior there. Keep implementation scoped to the failing contract.
3. **Release.** Give the reviewer the final diff, CI matrix results, tarball hash, and smoke output. Ask for a release verdict and a rollback plan. Verify the GitHub tag SHA and npm integrity independently of the model.
4. **Record.** Save the model ID, candidate SHA, verdict, and review date. Stop the model run on a missing model or access error and record the actual reviewer.

Example prompt for an available Claude endpoint:

> Review this VER release candidate read-only using Claude Fable 5.2. Trace the three VER phases and all installer entry points, including Windows and published-version upgrade. Return architecture, file and version drift, comments, gaps, prioritized recommendations, and a release verdict. Cite exact paths and checked evidence. Treat assumptions and unrun checks as unverified. Do not edit, commit, or publish.

[Anthropic model documentation](https://platform.claude.com/docs/en/models/fable-5-2/overview)

## Rollback

Revert the release merge in a normal pull request. If npm 2.2.0 has shipped and must be withdrawn from default installs, an authorized maintainer can run npm dist-tag add @papabear911/ver@2.1.1 latest. Consumers can pin 2.1.1. A dist-tag change leaves the already published version and existing installs in place.
