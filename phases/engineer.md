# Phase 2 — ENGINEER

Deep dive. `AGENTS.md` stays authoritative; this file adds method.

Sub-steps: **Establish**, **Engineering**, **Execution**. Ends in one hard gate.
Clause served: **Build it.**

Loaded profiles may add gates here. Complete them before Gate 2.

## 1. Establish — read-first protocol

1. Open every file the Vision names. Read the relevant sections plus enough surrounding code to
   see the local pattern.
2. Locate every symbol you intend to call. Confirm exact signature, parameter names/order,
   return shape, and error behavior by reading its definition.
3. Confirm imports resolve. A package on your mental list is not a package installed here.
4. Note conventions: file naming, test location, error style, comment density. Match them.
5. If a symbol the Vision depends on does not exist, return to Visualize. Do not invent an API.

## 2. Engineering — the seven-rung Ponytail ladder

Start at rung 1. Stop at the first rung that holds. Never skip a rung.

### Rung 1 — Does this need to exist? (YAGNI)

If nobody needs it now, don't write it. A config value that never changes is a constant, not a
setting.

```python
# Before: config system for a retry count that's always 3
RETRY_LIMIT = 3
```

### Rung 2 — Is it already in the codebase?

Search before writing. The helper may already exist and be tested.

```python
# Before: write format_user(u) yourself
# After:  from .people import full_name  # existing, used in 4 files
```

### Rung 3 — Does the standard library do it?

```python
# pathlib before path string surgery
from pathlib import Path
```

### Rung 4 — Does the native platform feature do it?

CSS before JS. Database constraint before app-level validation. Browser input before custom
widget.

```css
.sticky { position: sticky; top: 0; }
```

### Rung 5 — Is an already-installed dependency doing it?

Reuse what the project trusts. Never add a package when a few lines or an installed dependency
works.

### Rung 6 — Can it be one line?

If one clear line holds, don't write a helper. Clarity beats line-count tricks.

```python
seen = list(dict.fromkeys(items))  # ordered dedupe
```

### Rung 7 — Minimum code that works

After every earlier rung fails: implement exactly the approved Vision, no more.

## Rules of writing

- No unrequested abstractions. No interface with one implementation, no factory for one product.
- No scaffolding for later. No config for a value that never changes.
- Delete before adding. One file until it hurts. Split on evidence, not anticipation.
- Boring over clever. Match the codebase before introducing a pattern.
- Never simplify away trust-boundary validation, data-loss handling, security, accessibility, or
  anything the approved Vision explicitly requires.

### `ponytail:` comment convention

Mark deliberate simplifications with their ceiling and upgrade path:

```python
# ponytail: sorts up to ~100k rows in memory — use DB ORDER BY beyond that
rows.sort(key=lambda row: row.created_at)
```

Ordinary code needs no comment. A simplification with a real ceiling does.

## 3. Execution — running code is the only truth

Run it in this session. Show the command and observed output.

- A test written but not executed is a hypothesis, not a test.
- A test that has never failed proves nothing — its assertion may be wrong.
- If you cannot run it, say why. Reading is not running.
- Files written via a shell (here-strings, `-Encoding utf8`, redirects) can gain a BOM or mojibake. After any shell write, verify the bytes — no U+FEFF at the start, no U+FFFD — before treating the file as evidence. Prefer an editor that writes clean UTF-8.

### TDD inner loop

```text
1. Write the smallest test that fails for the right reason.
2. Run it.                 → RED. If it passes, fix the test.
3. Write minimum code.     → GREEN.
4. Refactor with ladder.   → GREEN again.
5. Repeat for next behavior.
```

### One-hypothesis debugging

1. State one hypothesis: *"The cache key ignores locale."*
2. Name the observation that would falsify it.
3. Run exactly that check.
4. Update: confirmed → act; refuted → discard and state the next one.

Never change two things at once to see what happens.

## Profile gates

Profiles commonly add here:

- **security** — validation test, parameterized queries, no secrets in code or logs.
- **ux** — Human-Path Test: walk the flow as a person, not as a test suite.
- **ui** — run the page, not only the test; inspect rendered behavior.
- **data** — reproducible run, pinned inputs and seeds.
- **devops** — plan → apply → verify replaces "run the code."
- **testing** — smallest failing test before implementation.
- **docs** — prose teaches from the code; no stale claims.

When two profiles add gates to this phase, the stricter gate wins.

## HARD GATE 2 — Evidence shown

- [ ] Read-first complete; no API/signature/import asserted from memory.
- [ ] All seven rungs considered in order; chosen design uses the first that holds.
- [ ] Approved Vision implemented; scope neither added nor silently dropped.
- [ ] Deliberate simplifications marked with `ponytail:`.
- [ ] Profile gates for this phase completed.
- [ ] Tests actually executed in this session; output shown.
- [ ] Claimed behavior observed running, not inferred from reading code.

Two failures on Gate 2 means the Vision is wrong. Stop, report, return the fix upstream to Phase 1.
