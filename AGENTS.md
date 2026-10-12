# V.E.R. — v2.1.1

> See it. Build it. Ship it. Every release feeds the next vision.

| Clause | Phase | Promise |
|---|---|---|
| See it | Visualize | Understand before you touch |
| Build it | Engineer | Smallest thing that works |
| Ship it | Release | Do not ship a lie |
| Every release feeds the next vision | The edge | The loop compounds |

Three phases: **Visualize → Engineer → Release**. Each ends in a HARD GATE. A gate is evidence,
not narration: proceed when you can show it, never because you say you are done.

Two rule-sets are always active while working, no opt-out: the **Karpathy principles** (think first,
simplicity, surgical, goal-driven, restate before solving) and the **Ponytail ladder** (stop at the
first rung that holds). Their method loads from `references/` on engage — not from this file.

## Entry — engage VER, or answer directly

Decide the lane in order. Stop at the first match.

1. Inside an active task and this adds no new scope? → **stay in the loop.**
2. A bare approval token (`yes` `go` `approved` `ship it` `looks good`)? → **Gate 1 pass;** go to Engineer.
3. A change verb on code, design, docs, or infra — build, add, fix, refactor, migrate, delete, design, review, test, deploy? → **engage the loop.**
4. Forced? `@ver` engages; `@q` or `@nover` answers directly.
5. A social opener, a pure question, a recap, or a doc lookup? → **answer directly. Load no phase or gate file.**
6. None of the above, but it still looks like a change? → **ask once:** "This looks like a change — engage VER?" Engage only on an affirmative.

## When engaged — load on demand

Never preload everything. Read only what the current step needs.

1. Loop and gates: `phases/visualize.md`, `phases/engineer.md`, `phases/release.md`.
2. Always active while working: `references/karpathy-principles.md`, `references/ponytail-ladder.md`.
3. Refine passes on demand: `refine/` — "validate", "review the diff", "tighten it", "simplify".
4. Close each phase against its gate in `ver-gates/`. Audit any time: `ver --check [dir]` — static files and local contracts only. Session evidence (approval, executed tests) remains a manual agent check.

## Task routing (before Phase 1)

Match keywords and load the matching profile from `profiles/`, or force with `@domain`. Profiles add
gates to existing phases; they never replace the loop. State which profiles loaded — a silent profile
is a missed gate.

| Domain | Profile | Keywords |
|---|---|---|
| programming | `profiles/programming.md` | function, class, refactor, bug, API, logic, module |
| security | `profiles/security.md` | auth, secret, token, input, deletion, admin, permission, session |
| ui | `profiles/ui.md` | component, render, layout, style, button, form, modal |
| ux | `profiles/ux.md` | flow, state, empty, loading, error, copy, undo, first-use |
| data | `profiles/data.md` | query, schema, migration, pipeline, dataset, model, experiment |
| devops | `profiles/devops.md` | deploy, infra, config, terraform, container, CI, pipeline |
| testing | `profiles/testing.md` | test, spec, coverage, mock, fixture |
| docs | `profiles/docs.md` | readme, doc, comment, changelog, tutorial |

`@domain` forces one; `@domain+domain` forces several. Two profiles on one phase → the stricter gate
wins. No match → base loop. A pure question → answer directly (see Entry).

## Core rules

1. **Take the smallest thing** that moves the task forward. First rung that holds.
2. **One file** — or one module, one abstraction — **until it hurts.**
3. **Boring tools, boring code.** Proven over novel; explicit over clever.
4. **Code is a tutorial.** A reader learns the domain and intent top to bottom.
5. **Delete aggressively.** Deletion beats addition within task blast radius.
6. **Running code is the only truth.** A test you did not run is a hypothesis.
7. **One learning per release.** If nothing went in `vision-log.md`, the loop did not close.
8. **Append-only boundaries.** `vision-log.md`, `DECISIONS.md`, and config blocks are append-only.
   Never truncate or replace files outside the approved task blast radius.

## Anti-patterns

| Thought | Reality |
|---|---|
| "I already know how this works." | Read the code. You don't — not this repo, not today. |
| "It's a small change, no need to plan." | Small changes are where silent drift starts. |
| "I'll refactor while I'm here." | Surgical changes. The diff stays reviewable. |
| "The tests pass, so it works." | Did you run them, or did you assume? |
| "I'll add a layer for flexibility." | YAGNI. Delete it; add it when it hurts. |
| "The spec is clear enough — I'll fill gaps myself." | Surface assumptions in Visualize. |
| "Two failures — one more variation should do it." | Stop and report. The Vision is wrong. |
| "It's just a greeting, skip everything." | Route by verb and follow-up (Entry lanes 1–6); never assume. |

## Gate failure

One failure → fix the specific deficiency the gate named, then re-present the gate. Once. Two
failures on the same gate → **STOP.** The Vision is wrong; fix it in Phase 1. Do not try a third
variation.

## When Visualize may be skipped

Only when all four hold: the instruction fully specifies the change; under 20 lines, one known file,
no new behavior, no new dependency; reversible; and no design decision remains. Even then Gate 2
(read-first, run, show output) still applies.
