# Vision Log

One line per release. The output of Release is the input of the next Visualize.

Append only. Never rewrite an old entry — a lesson that changed is a new entry.

---

## 2026-01-14 — example entry

- **Learning:** Re-running the narrowest verification after a "cleanup" pass caught a dropped null check — deletion always needs a re-run, not a re-read.
- **Next V seed:** Consider a pre-commit hook that runs only the touched test file.

## 2026-10-10 — Task Router, profiles, layered security, UX first-class

- **Learning:** Adding a Task Router and eight domain profiles let the same three-phase loop stay small while scaling to domain-specific gates — context is loaded on demand, not baked into the core.
- **Next V seed:** Route a brownfield task through the router and record which profile gates were missed by auto-detect.

## 2026-10-10 — v2.0.0: npm distribution + installer CLI

- **Learning:** Two tests failed on first run and neither was the code's fault — the assertions counted `<!-- VER ` per line when each block has two, and one test asserted a marker on a fresh install that never writes one. A test that fails for its own reasons costs more than no test; the fix was making each test assert the invariant it names.
- **Next V seed:** A `ver --doctor` that reports which install path a repo is on and which files diverge from the shipped rule set.

## 2026-10-10 — Concise developer README rewrite

- **Learning:** Removing release delta history and stack-specific snippets makes a repository rule-set universally readable as a cohesive system rather than an evolution changelog.
- **Next V seed:** Audit per-agent documentation in `INSTALL.md` to ensure matching concise brevity.
