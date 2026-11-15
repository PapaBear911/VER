# Gate: Run Before Done

**Phase:** Phase 2 — ENGINEER (Hard Gate 2)  
**Invariant:** Running code or observed execution is the only truth. A test you did not run or an observation you did not verify is a hypothesis.

---

## The Rule

An agent cannot claim a task, intervention, or feature is working without demonstrating verified execution evidence in the session under the dual execution standard. For software, run the code; for non-code interventions, inspect the authoritative, witnessed execution or rehearsal record.

## Falsifiable Checks

### For Software and Analysis Code (Mandatory)
1. **Command Execution:** Test, REPL, or script command was executed in the current session.
2. **Exit Code Zero:** Terminal process exited with code `0`.
3. **Output Produced:** Raw test runner output (e.g., test count, pass count) shown, not summarized or narrated.

### For Real-World Interventions, Procedures, and Physical Deliverables (Mandatory)
1. **Source & Input Audit:** Governing policies, datasets, or physical specifications read before action.
2. **Exact Asset / Protocol Binding:** Evidence explicitly tied to the exact asset ID, site, cohort, or procedure version.
3. **Witnessed & Dated Execution Record:** Dated record signed/certified by the designated checker or observer with explicit observed results vs criteria.
4. **Readiness vs Occurrence Distinction:** Rehearsal evidence confirms operational readiness; execution records confirm the intervention occurred. Missing, stale, or generic proxy records leave the gate open.
