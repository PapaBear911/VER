# Docs Profile

Loaded when: readme, doc, comment, changelog, tutorial
Stacks with: ux, testing
Rule: When two profiles add gates to the same phase, the stricter gate wins.

## Adds to Visualize

- **Audience and purpose.** Who is this for, and what should they be able to do after reading?
- Name the one action the doc must enable. Everything else is optional.

## Adds to Engineer

- **Code-as-tutorial check.** A reader should understand intent from the doc alone, without
  opening the source.
- Match the doc to the current code, not to last release's code.

## Adds to Release

- **Link check.** Every referenced path, anchor, and command must resolve.
- **Freshness check.** Does the doc describe what ships today? If the code changed, so must
  the doc — in the same change, not later.

## Anti-patterns

| Thought | Reality |
|---|---|
| "I'll update the docs after the release." | Later is when the doc stops being true. |
| "The doc explains the architecture." | The doc explains how to use it, not how it's built. |
| "A dead link is a minor issue." | A dead link is where the reader stops trusting the whole doc. |
| "The comment restates the line." | Explain the why, not the what. |
