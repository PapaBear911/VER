# INVARIANTS

Rules that never change unless explicitly overridden. An override must be written down in
`DECISIONS.md` with its rationale and alternatives rejected — it is not something that happens
by drift.

1. **The tagline is frozen:** “See it. Build it. Ship it. Every release feeds the next vision.”
2. Visualize always precedes Engineer.
3. Engineer always precedes Release.
4. The Ponytail ladder is always active.
5. The Karpathy principles are always active.
6. Running code is the only truth.
7. Every release writes one line to `vision-log.md`.
8. No new dependency when the stdlib or the platform already does it.
9. Phase names, sub-step names, and refine-pass names are frozen. 1.x froze the delivery
   mechanism (root `AGENTS.md`, no CLI); v2.0.0 supersedes that clause — delivery is now npm +
   installer CLI, per the dated `DECISIONS.md` entry.
10. The router shape is frozen: keyword/domain table plus `@domain` / `@domain+domain`.
11. Profiles are additive: they add gates to existing phases; they never replace the loop.
12. The security gate runs on every Release. Non-negotiable.
13. Every release note includes a rollback line.
14. Installation appends; it never replaces existing agent config. In v2.0.0, this is enforced by
   the installer CLI (`bin/ver.js`), not by convention alone.
15. Author attribution is Ver Sangil.
16. A recurring lesson must graduate to enforcement. An entry marking recurrence without
   promotion fails Gate 3.

## On being overridden

An invariant can be overridden only by a deliberate act: write the change, the reason, and the
alternatives rejected into `DECISIONS.md`, then update this file and `CONTEXT.md` in the same
change. Two files updated in different changes means one of them is wrong.

If you find yourself wanting to bypass an invariant mid-task, that is a Gate-Failure signal, not
a license. Two failed gates means the Vision is wrong — go back to Phase 1.
