# Testing Strategies — What to Test and What to Skip

Clause served: **Build it — the smallest thing that works, proven.**

Tests are not a coverage number. They are a claim that specific behavior cannot silently break.

---

## The Selection Order

When deciding what to test, work down this list and stop at the first rung that holds:

1. **Is there a boundary crossing?** (network, filesystem, user input, external API)
   → Test it. Boundaries are where data changes shape.
2. **Is there a branch with real consequences?** (money, permissions, deletion, auth)
   → Test it at both branches.
3. **Is there a bug being fixed?** → Test the exact failure first. Red before green.
4. **Is it a pure function with a non-obvious edge?** → Test the edge, not the middle.
5. **Is it a thin pass-through?** → Skip. If it breaks, the caller's test catches it.

---

## The Test Pyramid, Applied Honestly

```text
        ┌─────────────┐
        │     E2E     │   few — one per critical user path, not per feature
        ├─────────────┤
        │ Integration │   some — at every real boundary (DB, HTTP, queue)
        ├─────────────┤
        │    Unit     │   many — pure logic, edge cases, branch coverage
        └─────────────┘
```

The pyramid is a budget, not a quota. The number that matters is: *which behaviors are
unproven if this suite passes?*

---

## Red → Green → Refactor

The inner loop, in order:

1. **RED** — Write the smallest test that fails for the right reason. Run it. *Watch it fail.*
   A test that never failed proves nothing.
2. **GREEN** — Write the minimum code to pass. Not the elegant version. The minimum.
3. **REFACTOR** — Remove duplication, rename, extract — with the test still green.

Skipping RED is the most common shortcut and the most expensive. It produces tests that
pass whether or not the code is correct.

---

## Mocks: Use Sparingly

Mock the **external effect** you cannot exercise safely (a payment charge, an email send).
Never mock the thing under test.

| Bad mock | Why | Better |
|---|---|---|
| Mocking your own repository layer | You test the mock, not the query | Use a real test DB, or an in-memory equivalent |
| Mocking the function you're testing | Tautology | Test the real function |
| Mocking the clock everywhere | Hides timezone and boundary bugs | Inject a fixed clock, let real logic run |
| Mocking 6 collaborators in one test | Test is now a spec of the mocks | Split the test; test one thing |

---

## Naming

A test name states **behavior**, not **method**.

| Bad | Good |
|---|---|
| `testResetPassword()` | `reset link expires after 30 minutes` |
| `testLoginFail()` | `login rejects a wrong password without revealing which field was wrong` |
| `testEmptyInput()` | `search returns empty list when the query has only whitespace` |

If the name needs the word "and", it is two tests.

---

## Anti-patterns

| Thought | Reality |
|---|---|
| "Coverage is 90%." | Coverage measures lines executed, not behavior verified. |
| "The test passed on the first run." | Then it was never red. Did you watch it fail? |
| "I'll add tests after." | After is when you no longer remember what you meant. |
| "It's too hard to test." | That is the design telling you something. |
| "Flaky tests are normal." | Flaky tests are broken tests that occasionally lie. |
