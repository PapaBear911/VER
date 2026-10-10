# UX Profile

Loaded when: flow, state, empty, loading, error, copy, undo, first-use
Stacks with: ui, security, docs
Rule: When two profiles add gates to the same phase, the stricter gate wins.

## Adds to Visualize

- **Five-State Check.** Every interface has five states. Name how each behaves:
  1. **First use** — nothing exists yet. What does the user see?
  2. **Success** — the happy path completed.
  3. **Failure** — something went wrong. What now?
  4. **Waiting** — the system is thinking. Is there feedback?
  5. **Undo** — the user wants it back. Can they?
  Most bugs live in states 1, 4, and 5, because nobody designs them.
- Name the primary human path, step by step, in the user's words.

## Adds to Engineer

- **Human-Path Test.** Walk the flow as a person would, not as the test suite does. Tap through
  it yourself, including the states above.
- A spinner that never resolves is a failure state, not a waiting state.

## Adds to Release

- **Copy Audit.** Every message tells the user what happened and what to do next.
  - Error: what failed, and the next action — not "Something went wrong."
  - Button: the outcome ("Save changes"), not the mechanism ("Submit query").
  - Empty state: what belongs here and how to add it.

## Anti-patterns

| Thought | Reality |
|---|---|
| "The happy path works." | The happy path is the one state users rarely need help with. |
| "Loading is obvious." | Without feedback, users click again and duplicate the action. |
| "Undo is a nice-to-have." | For destructive actions, undo is the safety net. |
| "The error is in the logs." | Users don't read logs. |
