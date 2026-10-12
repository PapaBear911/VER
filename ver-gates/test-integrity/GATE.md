# Gate: Test Integrity

**Phase:** Phase 2 / Phase 3 — ENGINEER & RELEASE  
**Invariant:** Do not ship a lie. Tests prove claims; they do not bend to code.

---

## The Rule

An agent must never weaken, delete, or comment out existing test assertions to make a test suite pass.

## Falsifiable Checks

1. **No Assertion Removal:** `git diff` on test files does not delete assertions or tests unless the contract change was explicitly approved in Visualize.
2. **Strict Equality:** Assertions remain exact (no changing strict checks to loose checks or no-ops).
3. **No Skipped Tests:** No tests changed from active to `test.skip` or `xit` without explicit instruction.
