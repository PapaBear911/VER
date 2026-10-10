# Testing Profile

Loaded when: test, spec, coverage, mock, fixture
Stacks with: programming, data, docs
Rule: When two profiles add gates to the same phase, the stricter gate wins.

## Adds to Visualize

- **Test strategy.** Which behavior is under test, at which boundary, and what failure does the
  test prevent?
- Name what is deliberately not tested and why. "Everything" is not a strategy.

## Adds to Engineer

- **Smallest failing test first.** Write it, run it RED, then implement. The RED confirms the
  test catches the missing behavior.
- Prefer real boundaries over mocks. Mock only the external effect you cannot exercise safely.

## Adds to Release

- **Coverage delta report.** State what behavior gained coverage and what remains untested.
- Run the narrowest relevant test after the final diff, not before the last cleanup.

## Anti-patterns

| Thought | Reality |
|---|---|
| "The test passes." | Did it fail before the fix? |
| "Mock everything for speed." | Then you're testing your mocks. |
| "Coverage is 90%." | Coverage measures lines, not behavior. |
| "I'll test edge cases later." | Later is never. Name the untested edge now. |
