# Ponytail Ladder

Seven rungs. Start at 1. Stop at the first rung that holds. Never climb a rung before checking
the one below it.

## Rungs

1. **Does this need to exist at all? (YAGNI)** — If no user or system needs it now, do not write
   it. The best code is the code never written.
2. **Is it already in the codebase?** — Search for a helper, pattern, or existing path that does
   the same job before making another.
3. **Does the standard library do it?** — `pathlib` before path surgery; `json` before a parser;
   `heapq` before a hand-rolled priority queue.
4. **Does the native platform feature do it?** — CSS before a scroll handler; a database
   constraint before app-level validation; a browser input before a custom widget.
5. **Is an already-installed dependency doing it?** — Reuse the package the project already
   trusts; do not add another just to avoid a few lines.
6. **Can it be one line?** — If one clear line holds, do not write a helper, wrapper, or loop.
7. **Minimum code that works.** — Only after all earlier rungs fail: write exactly what the
   approved Vision requires, and no more.

## Examples

| Need | First rung that holds | Choice |
|---|---|---|
| Deduplicate ordered values | Rung 3 | `list(dict.fromkeys(items))` |
| Keep a header visible while scrolling | Rung 4 | `position: sticky` |
| Format existing timestamps | Rung 5 | Use the installed date library already in the repo |
| Normalize whitespace | Rung 6 | `text = " ".join(text.split())` |
| Add a new, unserved feature | Rung 7 | Implement only the approved behavior |
| Add a configuration key for a fixed value | Rung 1 | Don't add it; hardcode until a real need appears |

## The `ponytail:` comment

For a deliberate simplification, state the ceiling and upgrade path next to the code:

```python
# ponytail: keeps up to ~100k rows in memory — use DB ordering when we exceed that
rows.sort(key=lambda row: row.created_at)
```

No comment is needed for ordinary code with no deliberate ceiling. This convention makes
simplifications explicit; it does not excuse missing requirements.

## The stacking rule

A loaded domain profile may add gates on top of the ladder. When two profiles add gates to the
same phase, the **stricter gate wins**. Rung 1 (YAGNI) never deletes a profile's gate — the gate
was requested by the loaded profile, and requested means required.

## Lazy, not negligent

The ladder is not permission to cut corners. These are **never** on the chopping block:

- Input validation at trust boundaries.
- Error handling that prevents data loss.
- Security (see `references/security-gates.md`).
- Accessibility and the five interface states (see `references/ux-checklist.md`).
- Anything explicitly requested in the approved Vision.

Use the fewest lines that satisfy the real requirement, including its safety requirements.
