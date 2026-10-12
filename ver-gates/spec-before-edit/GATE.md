# Gate: Spec Before Edit

**Phase:** Phase 1 — VISUALIZE (Hard Gate 1)  
**Invariant:** Visualize always precedes Engineer.

---

## The Rule

An agent must never modify source code, configurations, schemas, or dependencies before the Vision and its contract are explicitly approved.

## Falsifiable Checks

1. **Explicit Approval:** Approval token (`yes`, `go`, `approved`, `ship it`, `looks good`) received in session.
2. **Defined Blast Radius:** The files intended for editing are named in the Vision. Unnamed files must not be touched.
3. **No Speculative Scaffold:** No scaffolding, hypothetical abstractions, or config for values that never change.
