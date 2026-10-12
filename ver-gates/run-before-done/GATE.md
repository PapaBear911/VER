# Gate: Run Before Done

**Phase:** Phase 2 — ENGINEER (Hard Gate 2)  
**Invariant:** Running code is the only truth. A test you did not run is a hypothesis.

---

## The Rule

An agent cannot claim a task or feature is working without executing the verification command and observing the output in the session.

## Falsifiable Checks

1. **Command Execution:** Test, REPL, or script command was executed in the current session.
2. **Exit Code Zero:** Terminal process exited with code `0`.
3. **Output Produced:** Raw test runner output (e.g., test count, pass count) shown, not summarized or narrated.
