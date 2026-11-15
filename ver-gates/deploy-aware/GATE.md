# Gate: Deploy Aware & Append-Only

**Phase:** Phase 3 — RELEASE (Rollout Protocol)  
**Invariant:** Installation appends; it never replaces existing agent config or user content. Every release note includes a rollback line.

---

## The Rule

1. **Rollback Mandatory:** Every release note must end with an explicit rollback command or process:
   `To undo: [command or process]`.
   When complete physical or institutional reversal is unavailable, `To undo:` requires the **Three-Part Bounded Undo**:
   - **Responsible Authority:** designated role authorized to trigger suspension or rollback.
   - **Active Mitigation / Suspension Steps:** immediate concrete steps to halt or contain the release.
   - **Disclosed Irreversible Residuals:** explicit disclosure of residual effects that cannot be undone.
2. **Authorized Activation & Handoff:** For non-code releases, verify the authorized handoff, activation, publication, or signed acceptance promised in the Vision. A submission receipt or draft is not proof of activation.
3. **Restricted Evidence Hygiene:** Restricted data (PII, raw participant records) must remain in approved secure stores; use inspectable hashes or references, never raw secrets or PII in public logs.
4. **Append-Never-Replace:** Config markers (`<!-- VER ... -->`) and import lines must never destroy or replace user rules or existing code.
5. **Blast Radius Confined:** No file or operational asset outside the approved task scope may be deleted, truncated, or modified.
6. **Diff Reconciliation:** Before this gate closes, reconcile the entire working tree (`git status`, `git diff`). A changed file you did not author or cannot attribute is an escalation to Layer 3 (human) — never a silent pass. Concurrent edits and generated noise are the common cause; "the tests pass" does not account for a foreign diff.
