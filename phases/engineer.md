# Phase 2 — ENGINEER

Deep dive. `AGENTS.md` stays authoritative; this file adds method.

Three sub-steps — **Establish**, **Engineering**, **Execution** — ending in one hard gate.
The Karpathy principles and the 7-rung Ponytail ladder are active throughout.

## 1. Establish — read-first protocol

Read before you write. The order matters:

1. Open every file the Vision names. Read the sections you will modify, plus enough around them
   to see the local pattern.
2. Locate every symbol you intend to call. Confirm the exact signature — parameter names and
   order, return shape, error behavior — by reading its definition, not recalling it.
3. Confirm imports resolve. A package that exists on your mental list is not a package that is
   installed here.
4. Note the surrounding conventions: file naming, test location, error style, comment density.
   Match them. This is not a style preference — it is what makes the diff reviewable.

If a symbol the Vision depends on does not exist, that is a Phase 1 problem. Go back, do not
invent the API in place.

## 2. Engineering — the Ponytail ladder, all seven rungs

Stop at the first rung that holds. Never climb a rung without checking the one below it.

### Rung 1 — Does this need to exist at all? (YAGNI)

The best code is the code never written. Before anything: is this task real, or did it appear
because the last sentence implied it?

```python
# A config option for a value that has never changed and nobody has asked to change.
# ponytail: hardcode it; add a setting when someone actually asks twice.
RETRY_LIMIT = 3
```

### Rung 2 — Is it already in the codebase?

Search first. The repo almost certainly has a helper for the thing you are about to write.

```python
# Before: def format_user(u): return f"{u.first} {u.last}"
# After:  from .people import full_name   # exists, tested, already used in 4 files
```

### Rung 3 — Does the standard library do it?

The stdlib is already installed, already audited, already documented.

```python
# Before: hand-rolled topological sort
# After:  import heapq          # or collections.deque, itertools, pathlib, dataclasses
```

### Rung 4 — Does the native platform feature do it?

CSS before JS. `TEXT` column with a `CHECK` before app-level validation. OS-level file locking
before a custom one. A DB constraint before an app code path that reports the same error.

```css
/* Before: JS scroll listener toggling a class */
.sticky { position: sticky; top: 0; }   /* after: zero JavaScript */
```

### Rung 5 — Is an already-installed dependency doing it?

Rung 4's cousin: don't add a new dependency when a loaded one covers it. Rung 5's wall is
adding a package for what a few lines can do — because a new dependency is a new supply chain,
a new upgrade cadence, and a new thing to explain in review.

```python
# Before: pip install humanize      # new dependency for one function
# After:  f"{seconds}s"             # 4 characters, no supply chain
```

### Rung 6 — Can it be one line?

One line, when one line holds. Not one line at the cost of clarity — one line because the
shortest correct expression is already the readable one.

```python
# Before: five lines of manual dedupe
# After:  seen = list(dict.fromkeys(items))   # order-preserving, O(n)
```

### Rung 7 — Minimum code that works

The floor. After every rung above has failed to remove the need: write the smallest amount of
code that satisfies the approved Vision — no more.

## Rules for writing code

- **No unrequested abstractions.** No interface with one implementation, no factory for one
  product, no config for a value that never changes.
- **No scaffolding for later.** No boilerplate, no empty directories, no `utils/` reserved for
  files nobody has needed yet.
- **Deletion over addition.** Prefer removing a line to adding one; prefer removing a feature to
  defending it.
- **Boring over clever.** Clever code is a tax paid by the next reader, every time.
- **One file until it hurts.** Split on evidence, not anticipation.
- **Never simplify away:** validation at trust boundaries, error handling that prevents data
  loss, security, accessibility, or anything the Vision explicitly asked for.

### The `ponytail:` comment convention

Mark every deliberate simplification — the ceiling you accepted and the upgrade path when it
stops holding. Format: `ponytail: <ceiling> — <upgrade path>`.

```python
# ponytail: sorts in memory for up to ~100k rows — switch to a DB ORDER BY when we exceed that
rows.sort(key=lambda r: r.created_at)

# ponytail: treats any 4xx from /login as bad credentials — split 429 out when rate limits land
except requests.HTTPError as exc:
    raise BadCredentials from exc
```

No `ponytail:` comment means the simplification was not a decision — it was an accident waiting
to be discovered in production. Auditing these is part of `refine/enhance.md`.

## 3. Execution — running code is the only truth

Run it. Not "the tests should pass." Run them, in this session, and show the output.

- Claiming a run that did not happen is a hallucination and a gate failure.
- A test written but never executed is a hypothesis, not a test.
- A test that passes without ever having failed proves nothing — it asserts nothing.
- If you cannot run it, say why plainly and let the user decide. Do not substitute a reading
  for a run.

### TDD inner loop

Per unit of behavior, repeat:

```
1. Write the smallest test that fails for the right reason.
2. Run it.          → RED.      (If it passes, the test is wrong — fix the test.)
3. Write the minimum code to pass it.
4. Run it.          → GREEN.
5. Refactor with the ladder active. Run again.  → GREEN.
6. Next unit.
```

The RED step is the whole point: a test that never fails has never checked anything.

### One-hypothesis debugging

1. State **one** hypothesis: *"The cache key ignores the `locale` parameter."*
2. State the observation that would falsify it: *"Print the key for two locales; if identical,
   the hypothesis holds."*
3. Run exactly that check.
4. Update: confirmed → act on it. Refuted → discard it and state the next one.

Never change two things to see what happens. You learn nothing, and you cannot undo either one.

## HARD GATE 2 — Evidence shown

- [ ] Read-first completed; no API, signature, or import asserted from memory.
- [ ] Every rung of the ladder was considered in order; the chosen design starts at the lowest rung that holds.
- [ ] Vision implemented as approved — no scope added, none silently dropped.
- [ ] Ladder decisions that were deliberate carry a `ponytail:` comment.
- [ ] Tests actually executed in this session; output shown, not summarized.
- [ ] The claimed behavior was observed running, not inferred from reading the code.

## When this gate fails twice

Two failures on Gate 2 means the Vision is wrong, not the Engineer weak. Stop, report what the
gate required and what evidence was missing, and send the fix upstream to Phase 1.
