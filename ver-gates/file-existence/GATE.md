# Gate: File Existence

**Phase:** Phase 2 — ENGINEER (Establish Protocol)  
**Invariant:** Read first. No APIs or symbols from memory.

---

## The Rule

Before writing code or calling functions, the agent must read the files it intends to touch and verify that imports, signatures, and target files actually exist on disk.

## Falsifiable Checks

1. **Existence Verification:** All imported paths exist on disk.
2. **Signature Verification:** Function parameters, return shapes, and error conventions match current repository definitions, not memory.
3. **Local Pattern Match:** Surrounding coding patterns, test structure, and error conventions are matched.
