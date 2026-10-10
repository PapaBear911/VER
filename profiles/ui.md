# UI Profile

Loaded when: component, render, layout, style, button, form, modal
Stacks with: ux, programming
Rule: When two profiles add gates to the same phase, the stricter gate wins.

## Adds to Visualize

- **Layout contract.** Describe the structure before styling it: what is fixed, what flexes, and
  what happens at 375px wide.
- Name the states this component must render. A component with one state is half-built.

## Adds to Engineer

- **Run the page, not just the test.** A passing DOM assertion is not a rendered layout. Open it.
- Check keyboard navigation and visible focus rings on every interactive element.
- Contrast must pass in both light and dark.

## Adds to Release

- **Visual sanity pass.** Render and inspect: spacing, alignment, overflow, and text wrapping at
  narrow widths.
- Confirm no horizontal scroll at 375px.

## Anti-patterns

| Thought | Reality |
|---|---|
| "The test asserts the element exists." | Existing is not visible, aligned, or usable. |
| "It looks fine on my screen." | Test the narrow one. |
| "Accessibility is a later pass." | Retrofitting focus order costs more than building it. |
| "I'll add three sizes for flexibility." | Add the size used today. |
