# INVARIANTS

Rules that never change unless explicitly overridden. An override must be written down in
`DECISIONS.md` with its rationale — it is not something that happens by drift.

1. Visualize always precedes Engineer.
2. Engineer always precedes Release.
3. The Ponytail ladder is always active.
4. The Karpathy principles are always active.
5. Running code is the only truth.
6. Every release writes one line to `vision-log.md`.
7. No new dependency when the stdlib or the platform already does it.
8. The three phase names — Visualize, Engineer, Release — are frozen for all 1.x releases.
9. No hooks, CLIs, or runtimes are introduced in 1.x.
10. Author attribution is Ver Sangil.

## On being overridden

An invariant can be overridden only by a deliberate act: write the change, the reason, and the
alternatives rejected into `DECISIONS.md`, then update this file and `CONTEXT.md` in the same
change. Two files updated in different changes means one of them is wrong.

If you find yourself wanting to bypass an invariant mid-task, that is a Gate-Failure signal, not
a license. Two failed gates means the Vision is wrong — go back to Phase 1.
