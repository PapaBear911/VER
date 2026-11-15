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

### `ceiling:` comment convention

Mark deliberate simplifications with their ceiling and upgrade path:

```python
# ceiling: sorts up to ~100k rows in memory — use DB ORDER BY beyond that
rows.sort(key=lambda row: row.created_at)
```

Ordinary code needs no comment. A simplification with a real ceiling does.

### Execution Slices (multi-file changes >2 files or >50 lines)

Never edit multiple modules in one monolithic turn. Slice implementation into ordered checkpoints:

1. **Slice 1 — Contract & Boundary:** Write interfaces, schemas, or failing RED contract tests.
2. **Slice 2 — Core Implementation:** Implement the minimum working code (GREEN) with `ceiling:` comments.
3. **Slice 3 — Integration & Wiring:** Connect callers, CLI flags, routes, or UI components.

Prove each slice GREEN before touching files in the next slice. In multi-agent systems, slices form the verifiable handoff boundary between workers.

### Context Budget & The "Smart Zone"

Model reasoning degrades when context accumulates dozens of tool results. If an implementation approaches context limits or exceeds 15 tool executions:
- Run narrow tests and reconcile working diff.
- Suggest a context compact or session turn refresh before executing Phase 3 (Release).

## 3. Execution — running code or observed execution is the only truth

Evidence must be demonstrated in this session before claiming done:

- **For software and data scripts:** Run it in this session. Show the command and observed output.
  - A test written but not executed is a hypothesis, not a test.
  - A test that has never failed proves nothing — its assertion may be wrong.
  - If you cannot run it, say why. Reading is not running.
- **For real-world interventions, procedures, and physical deliverables:** Perform the agreed observation or inspect an authoritative, dated record of execution.
  - Evidence must tie to the exact artifact, procedure, or asset ID, the checker and date, the criteria, and the observed result.
  - **A rehearsal supports readiness.** It proves operational capacity before go-live.
  - **An execution record supports occurrence.** It proves the governed activity actually took place.
  - Missing, stale, or unverifiable proxy records keep the gate open.
- Files written via a shell (here-strings, `-Encoding utf8`, redirects) can gain a BOM or mojibake. After any shell write, verify the bytes — no U+FEFF at the start, no U+FFFD — before treating the file as evidence. Prefer an editor that writes clean UTF-8.

### TDD inner loop (software)

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
- **policy** — recorded consultations, participation gap accounting, dissent log, proposal changes, operational rehearsals under normal and short-staffed conditions.
- **research** — versioned inputs, approved environment, cohort reconciliation & exclusions, deviation logging, analysis run, sensitivity check, independent second-analyst rerun within predeclared tolerance, provenance outputs. Null results can pass.

When two profiles add gates to this phase, the stricter gate wins.

## HARD GATE 2 — Evidence shown

- [ ] Read-first complete; governing sources, code APIs, or baseline inputs inspected first.
- [ ] All seven rungs considered in order; chosen design uses the first that holds.
- [ ] Approved Vision implemented; scope neither added nor silently dropped.
- [ ] Deliberate simplifications marked with `ceiling:`.
- [ ] Multi-file tasks (>2 files) executed and verified in discrete slices.
- [ ] Profile gates for this phase completed.
- [ ] For software: tests actually executed in this session; output shown.
- [ ] For non-code: witnessed execution record or rehearsal evidence verified; dated, tied to exact asset/protocol, and checked against criteria.
- [ ] Claimed behavior observed running or certified in authoritative record, not inferred from reading code.

Two failures on Gate 2 means the Vision is wrong. Stop, report, return the fix upstream to Phase 1.
