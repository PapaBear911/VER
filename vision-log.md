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
