# Gate: Receipt Log

**Phase:** Phase 3 — RELEASE (Hard Gate 3)  
**Invariant:** Every release feeds the next vision. One learning per release.

---

## The Rule

Every release must write an append-only entry to `vision-log.md` before the release gate closes. If nothing went in `vision-log.md`, the loop did not close.

## Falsifiable Checks

1. **Append-Only:** Prior entries in `vision-log.md` are byte-identical; never rewritten.
2. **Format Adherence:**

   ```markdown
   ## YYYY-MM-DD — [task name]
   - **Learning:** (one sentence)
   - **Recurs:** YYYY-MM-DD — [prior task name] (optional; requires `Promoted:`)
   - **Promoted:** [path] — [exact phrase added to the target] (optional)
   - **Next V seed:** (one sentence, optional)
   ```

3. **Diff Evidence:** `git diff vision-log.md` shows newly added lines at the end of the file.
4. **Recurrence Graduation:** A `Recurs:` date matches an earlier entry, and the same latest entry contains `Promoted:`. A recurrence without promotion fails Gate 3.
5. **Promotion Integrity:** The latest entry's `Promoted:` path resolves from the project root or VER source root, and the target contains the stated phrase. Only the latest entry is checked so later edits do not invalidate history.
