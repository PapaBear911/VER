# Gate: Deploy Aware & Append-Only

**Phase:** Phase 3 — RELEASE (Rollout Protocol)  
**Invariant:** Installation appends; it never replaces existing agent config or user content. Every release note includes a rollback line.

---

## The Rule

1. **Rollback Mandatory:** Every release note must end with an explicit, runnable rollback command:
   `To undo: [command or process]`
2. **Append-Never-Replace:** Config markers (`<!-- VER ... -->`) and import lines must never destroy or replace user rules or existing code.
3. **Blast Radius Confined:** No file outside the approved task scope may be deleted, truncated, or modified.
4. **Diff Reconciliation:** Before this gate closes, reconcile the entire working tree (`git status`, `git diff`). A changed file you did not author or cannot attribute is an escalation to Layer 3 (human) — never a silent pass. Concurrent edits and generated noise are the common cause; "the tests pass" does not account for a foreign diff.
