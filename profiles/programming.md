# Programming Profile

Loaded when: function, class, refactor, bug, API, logic, module
Stacks with: all profiles (this is the base discipline)
Rule: When two profiles add gates to the same phase, the stricter gate wins.

## Adds to Visualize

- **Contract check.** State what the function promises its callers: inputs, outputs, error
  behavior, side effects. A signature without a contract is a guess.
- Name the caller. If nothing calls it yet, that is a Visualize question, not an Engineer one.

## Adds to Engineer

- **TDD inner loop confirmed.** The smallest failing test exists and was run RED before
  implementation. Not "tests will be added later."
- Match the surrounding code's structure before introducing a new pattern.

## Adds to Release

- **Abstraction gate.** Did this change create a new abstraction? If so, name the second call
  site. One implementation is not a pattern.
- Confirm no public signature changed silently. A changed default argument is a breaking change.

## Anti-patterns

| Thought | Reality |
|---|---|
| "I'll extract a helper for reuse." | Name the second caller, or inline it. |
| "The interface makes it testable." | One implementation needs no interface. |
| "I'll fix the nearby bug too." | Surgical changes. Note it; don't do it unasked. |
| "Types will catch it at compile time." | Only if the types are right. Check the boundary. |
