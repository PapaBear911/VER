# Gate: Deploy Aware & Append-Only

**Phase:** Phase 3 — RELEASE (Rollout Protocol)  
**Invariant:** Installation appends; it never replaces existing agent config or user content. Every release note includes a rollback line.

---

## The Rule

1. **Rollback Mandatory:** Every release note must end with an explicit, runnable rollback command:
   `To undo: [command or process]`
2. **Append-Never-Replace:** Config markers (`<!-- VER ... -->`) and import lines must never destroy or replace user rules or existing code.
3. **Blast Radius Confined:** No file outside the approved task scope may be deleted, truncated, or modified.
