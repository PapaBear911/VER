# V.E.R. Core — The Universal Loop Reference

The operational constitution for autonomous and assisted AI engineering across Visualize, Engineer, and Release.

Clause served: **See it. Build it. Ship it. Every release feeds the next vision.** — The entire compounding loop.

---

## Rules

1. Route the task before touching files.
   Match domain keywords against `profiles/` or honor `@domain` overrides; profiles only add gates and never replace the base loop.

2. Restate the task as an observable outcome before proposing code.
   A deadline or task name is not an outcome; define exactly what a person or test command can observe.

3. Halt at Hard Gate 1 until an explicit approval token is received.
   Only `yes`, `go`, `approved`, `ship it`, or `looks good` constitutes approval; silence or ambiguity requires waiting.

4. Read the codebase first; never invent APIs, types, or signatures from memory.
   Open every target file, inspect existing imports, and locate real function signatures before typing changes.

5. Climb the Ponytail ladder from rung 1 upward and stop at the first rung that holds.
   YAGNI first, followed by existing codebase patterns, standard library, platform features, and installed dependencies before adding code.

6. Running code or observed execution is the only truth.
   Code requires executed command output in this session; non-code deliverables require authoritative, dated execution records; unverified claims remain hypotheses.

7. Stop after two consecutive failures on the same gate.
   Do not iterate a third attempt; two failures mean the upstream Vision is flawed and must be re-scoped in Phase 1.

8. Append and import; never overwrite or truncate existing agent configurations.
   Prepend idempotent versioned comment blocks or use import syntax to preserve existing user rules and files.

9. Every release note must end with a mandatory rollback line.
   Document the exact revert command (`To undo: [command]`) or the Three-Part Bounded Undo (responsible authority, mitigation steps, residual effects) when complete reversal is unavailable.

10. Record one concrete learning per release to close the loop.
    Log exactly one learning in `vision-log.md`; recurring lessons must graduate to enforceable rules in `INVARIANTS.md` or `ver-gates/`.

---

## Examples

| Situation | Without this reference | With this reference |
|---|---|---|
| User requests a feature change | Agent starts writing speculative abstractions immediately | Agent routes domain profiles, restates observable outcome, and waits for Gate 1 approval |
| Test fails during implementation | Agent changes multiple things randomly or fabricates results | Agent tests RED first, makes surgical edit, runs real command, and stops after 2 failures |
| Installing rules in existing repo | Tool replaces user's `AGENTS.md` or wipes configuration | Tool prepends marked idempotent block or writes `ver/AGENTS.md` pointer |
| Wrapping up a release | Agent says "done" with no way to revert or learn | Agent runs verification, documents rollback command, and logs a learning |

---

## Anti-patterns

| Thought | Reality |
|---|---|
| "I already know how this repo works." | Read the code. You don't — not this repo, not today. |
| "It's a small change, no need to plan." | Small changes without observable outcomes are where silent drift begins. |
| "The tests pass, so it's working." | If you didn't execute the test and show the output in this session, you assumed. |
| "I'll add a helper layer for future flexibility." | YAGNI. Stop at the lowest Ponytail rung that holds; delete uncalled code. |
| "Two failures — one more tweak will fix it." | Two failed gates mean the Vision itself is wrong. Stop, report, and re-vision. |
| "It's just a greeting or question, run the loop." | Pure questions, recaps, and doc lookups bypass the loop and answer directly. |
