# V.E.R.

**v1.0.0** — first stable release

> **See it. Build it. Ship it. Every release feeds the next vision.**

| | |
|---|---|
| **Version** | v1.0.0 — first stable release |
| **License** | MIT |
| **Delivery** | single file: `AGENTS.md` at repo root |
| **Loop** | Visualize → Engineer → Release → Visualize |
| **Author** | Ver Sangil |

---

## Contents

- [What it is](#what-it-is)
- [Why](#why)
- [Where hallucinations die](#where-hallucinations-die)
- [The loop](#the-loop)
- [The three phases](#the-three-phases)
- [Install](#install)
- [Five chefs, one dish](#five-chefs-one-dish-four-cook-one-tastes)
- [How V.E.R. differs](#how-ver-differs)
- [The VER Refine Pass](#the-ver-refine-pass)
- [Repository map](#repository-map)
- [Reading order](#reading-order)
- [Stability](#stability-v100)
- [Contributing](#contributing)
- [License](#license)

---

## What it is

V.E.R. — **V**isualize → **E**ngineer → **R**elease — is a universal, always-on agent rule delivered as a single file, [`AGENTS.md`](AGENTS.md), at the root of a repository.

It wraps any AI coding agent in a three-phase loop with **hard gates**:

| Gate | Blocks until |
|---|---|
| **Gate 1** — after Visualize | the outcome is stated and a human approves it |
| **Gate 2** — after Engineer | the code has actually been *run*, with output shown |
| **Gate 3** — after Release | one learning is written to `vision-log.md` |

**It is not a framework. Not a CLI. Not a runtime.** It is a rule file and the discipline around it.

```text
        one file              3 hard gates           one loop
      AGENTS.md at root  →  evidence, not claims  →  release feeds vision
```

---

## Why

Vibe-coded software fails the same way every time.

The agent invents an API that does not exist. It misstates a parameter. It reaches for a library nobody installed. It reports a test run it never performed. It logs work that never happened.

**The model is not the problem. The workflow is.** Nothing in a normal session ever asks the model to *prove* anything — it asks the model to *sound* finished.

V.E.R. closes that gap with the cheapest instrument available: **a gate you can talk your way up to, but not through.** You pass with evidence, or you don't pass.

```text
   Typical agent session                      V.E.R. session
   ─────────────────────                      ──────────────
   prompt ─────────────────► claim            prompt ─► V ─► gate ─► E ─► gate ─► R ─► gate
                                     no gate ever         ▲             ▲              ▲
                                                         │             │              │
                                                      approved       ran it       logged it
```

---

## Where hallucinations die

Five failure modes, and the exact gate that catches each one:

| # | Hallucination | Where V.E.R. catches it |
|---|---|---|
| 1 | **Fabricated APIs** | **Engineer → Establish** forces reading the codebase before writing code. |
| 2 | **Inaccurate parameters** | **Engineer → Execution** demands running the code. Running code is the only truth. |
| 3 | **Non-existent libraries** | **Visualize → Validate** forces surfacing existing dependencies before choosing. |
| 4 | **False test results** | **Engineer → Execution** — the agent must actually run the code, not claim it ran. |
| 5 | **Invented work** | **Gate-Failure Protocol** — two failed gates triggers a stop, not more looping. |

Every one of these is a *claim without evidence*. Every gate in V.E.R. is a demand for evidence.

---

## The loop

```text
      ┌─────────────────────────────────────────────────────┐
      │                                                     │
      ▼                                                     │
 ┌───────────┐      ┌───────────┐      ┌───────────┐        │
 │    V      │─────▶│    E      │─────▶│    R      │────────┘
 │ VISUALIZE │      │ ENGINEER  │      │  RELEASE  │
 └───────────┘      └───────────┘      └───────────┘
      │                  │                  │
      ▼                  ▼                  ▼
  GATE 1             GATE 2             GATE 3
  Vision approved    Evidence shown     Shipped + logged
```

| Phase | Question it answers | Ends with |
|---|---|---|
| **V** — Visualize | What does *done* look like? | Approved vision |
| **E** — Engineer | Does it actually work? | Running code, output shown |
| **R** — Release | What did we learn? | One line in `vision-log.md` |

**The trailing V is the point.** Release writes `vision-log.md`, and that log seeds the next Visualize. The loop closes — or it isn't a loop.

---

## The three phases

Each phase has three sub-steps and one hard gate.

**V — VISUALIZE**

| Sub-step | Action |
|---|---|
| **Visualize** | Restate the task as an observable outcome. Name what you don't know. |
| **Validate** | Read the codebase. Inventory existing dependencies and helpers. Surface every assumption as a falsifiable sentence. |
| **Vision** | Present the smallest plan, at least two options with costs. Ask clarifying questions once. Then stop and wait. |

> **Gate 1** — Approval token: `yes` · `go` · `approved` · `ship it` · `looks good`. **Silence is not approval.**

**E — ENGINEER**

| Sub-step | Action |
|---|---|
| **Establish** | Re-read the files you'll touch. Confirm signatures and imports by reading them. |
| **Engineering** | Build the smallest thing that works. Climb the Ponytail ladder. Mark deliberate simplifications with `ponytail:`. |
| **Execution** | Run it. TDD inner loop: RED → GREEN → refactor. |

> **Gate 2** — Read-first complete · ladder climbed in order · tests executed this session · output shown, not summarized.

**R — RELEASE**

| Sub-step | Action |
|---|---|
| **Refinement** | Read the diff top to bottom. Delete what isn't needed. Re-climb the ladder. |
| **Rollout** | Three sanity checks: re-run the narrowest verification, inspect the public surface, check for drift. |
| **Release** | State what shipped, what was skipped, what to watch. Write `vision-log.md`. |

> **Gate 3** — Verification re-run green · public surface inspected · `vision-log.md` updated.

Two rule-sets are **always active** — every phase, every turn, no opt-out:

| Rule-set | Reference | What it does |
|---|---|---|
| **Karpathy principles** | [`references/karpathy-principles.md`](references/karpathy-principles.md) | Think before coding · simplicity first · surgical changes · goal-driven execution |
| **Ponytail ladder** | [`references/ponytail-ladder.md`](references/ponytail-ladder.md) | 7 rungs · stop at the first that holds |

---

## Install

**One file. Drop it at your repo root.**

```bash
curl -O https://raw.githubusercontent.com/<your-username>/VER/main/AGENTS.md
```

That's the whole install. No hooks, no CLI, no runtime, no config.

<details>
<summary><b>Want the reference files too? (optional)</b></summary>

`AGENTS.md` is self-contained — the loop works with that file alone. The `phases/`, `refine/`, and `references/` trees are *progressive disclosure*: deeper method, loaded only when needed.

```bash
git clone https://github.com/<your-username>/VER.git /tmp/ver-src
cp /tmp/ver-src/AGENTS.md .
```

</details>

<details>
<summary><b>Using it with a system prompt or session hook (optional)</b></summary>

See [`BOOTSTRAP.md`](BOOTSTRAP.md) for a 5-line preamble that ensures your agent reads `AGENTS.md` before responding and logs a learning at session end.

</details>

---

## Five chefs, one dish. Four cook. One tastes.

```text
   GSD         20 burners, state-machine tomatoes, destroyed kitchen
   Superpowers recipe followed perfectly... pantry mismatch... freeze
   Ponytail    one perfect tomato. wrong order.
   Karpathy    perfect dish, reasoned from first principles. never tasted it.
   V.E.R.      cooks the smallest dish. tastes after each step. serves it.
```

| Chef | Strength | Failure |
|---|---|---|
| **GSD** | Fires up twenty burners and builds a state machine for the tomatoes. | Exquisite dish, 45 minutes, destroyed kitchen. |
| **Superpowers** | Follows the recipe perfectly. | Freezes when the pantry doesn't match. Waits for oak-smoked paprika that doesn't exist. |
| **Ponytail** | Serves one perfect tomato. | Right when less is more. Wrong when the customer wanted a soufflé. |
| **Karpathy** | Reasons its way to the perfect dish from first principles. | Never tastes it. Half the time the salt is off. |
| **V.E.R.** | Asks what "done" looks like, cooks the smallest dish, tastes after each step, serves it, writes one line in the kitchen log. | — |

**The only chef that closes the loop.**

Every other chef's check is a *proxy* — a recipe, a plan, a principle, a benchmark. V.E.R. is the only one whose verdict comes from the food.

> **The spoon is the only judge.**

---

## How V.E.R. differs

| | GSD | Superpowers | Ponytail | Karpathy | **V.E.R.** |
|---|---|---|---|---|---|
| **Tells you what to build** | Via plans | Via skills | Only what to cut | Only how to think | **Via Vision** |
| **Proves it ran** | No | No | No | No | **Yes — hard gate** |
| **Catches hallucination** | Indirect | Indirect | No | No | **Direct** |
| **Ends with a learning** | Via reports | No | No | No | **Yes — `vision-log.md`** |
| **Ships when done** | State machine decides | Pantry decides | Scope decides | Never quite done | **Gated** |
| **Install cost** | Framework | Skill library | Rule-set | Principle | **One file** |

**V.E.R. does not replace them.** It is the closing step they all omit: *taste the food.*

---

## The VER Refine Pass

Optional. Run any pass on demand, or before Gate 3 when the work feels loose.

| Pass | File | Trigger phrases | Hard gate |
|---|---|---|---|
| **Validate** | [`refine/validate.md`](refine/validate.md) | "validate" · "does this match the vision?" · "on target?" | No silent acceptance of gap or drift. |
| **Enhance** | [`refine/enhance.md`](refine/enhance.md) | "tighten it" · "simplify" · "delete what's unneeded" | Diff is the smallest coherent change. |
| **Review** | [`refine/review.md`](refine/review.md) | "review the diff" · "read it end to end" · "ready to ship?" | Verdict must be **Ship** before Release. |

Refine passes are never mandatory. A simple change should not pay for a second workflow.

---

## Repository map

```text
VER/
├── AGENTS.md                        THE MAIN FILE — always-on rule, drop at your repo root
├── BOOTSTRAP.md                     optional 5-line session preamble
├── VERSION                          1.0.0
├── LICENSE                          MIT © Ver Sangil
├── README.md                        you are here
├── CONTEXT.md                       seed doc — read this to understand the project
├── INVARIANTS.md                    10 rules that never change
├── DECISIONS.md                     append-only ADR log — why each choice was made
├── OPEN-THREADS.md                  live TODO
├── TRIGGERS.md                      phrase → file routing table
├── vision-log.md                    the release output; seeds the next Vision
│
├── phases/                          deep dives on each phase
│   ├── visualize.md                   Phase 1 method: assumptions, tradeoffs, spec template
│   ├── engineer.md                    Phase 2 method: 7-rung ladder, TDD loop, debugging
│   └── release.md                     Phase 3 method: deletion, sanity checks, release notes
│
├── refine/                          optional passes
│   ├── validate.md                    built work vs. approved Vision
│   ├── enhance.md                     re-climb the ladder on finished work
│   └── review.md                      read the diff end to end → Ship or Loop
│
├── references/                      always-active rule-sets
│   ├── karpathy-principles.md         5 principles
│   └── ponytail-ladder.md             7 rungs + "lazy, not negligent"
│
└── examples/
    └── walkthrough.md                 one real task, all three phases, gates evidenced
```

**20 files.** `AGENTS.md` is the only one required for the loop to run. Everything else is depth, loaded on demand — progressive disclosure, not a curriculum.

---

## Reading order

```text
   5 min    README.md              what V.E.R. is, why it exists
      │
      ▼
   5 min    AGENTS.md              the actual rule (the file you install)
      │
      ▼
  10 min    examples/walkthrough.md  watch a real task pass all three gates
      │
      ▼
  10 min    CONTEXT.md + INVARIANTS.md  what's frozen, what a task is
      │
      ▼
  as needed phases/ · refine/ · references/ · DECISIONS.md
```

---

## Stability (v1.0.0)

**V.E.R. 1.0.0 is the first stable release, and the floor for all of 1.x.**

| Frozen | Meaning |
|---|---|
| **Phase names** | Visualize · Engineer · Release — and their sub-step names |
| **Gate structure** | 3 gates, in order, with the same pass conditions |
| **Delivery mechanism** | `AGENTS.md`. No hooks, no CLI, no runtime in 1.x. |
| **Acronym** | V.E.R. = Visualize → Engineer → Release |

**Additions in 1.x may only be** new reference files, new examples, or clarifications — **never** new phases, new gates, or new mechanisms.

> A trust layer that shifts under its users stops being a trust layer.

This commitment is stated in [`README.md`](README.md), [`CONTEXT.md`](CONTEXT.md), [`INVARIANTS.md`](INVARIANTS.md), and [`DECISIONS.md`](DECISIONS.md).

---

## Publish to GitHub

First upload, from scratch:

```bash
git init
git add .
git commit -m "VER v1.0.0 — first stable release by Ver Sangil"
git branch -M main
git remote add origin git@github.com:<your-username>/VER.git
git push -u origin main
git tag -a v1.0.0 -m "First stable release — Ver Sangil"
git push origin v1.0.0
```

Then set the repo description and topics on GitHub:

```text
Description:  Visualize → Engineer → Release. A three-phase agent loop with hard gates.
              One file. See it. Build it. Ship it.
Topics:       ai-agents, agents-md, claude-code, codex, cursor, prompt-engineering,
              agentic-workflow, llm, developer-tools, yagni
```

**Verify the upload worked:** open a fresh agent session in any tool, in a repo containing `AGENTS.md`, and ask *"What is the VER loop?"* If it answers **Visualize → Engineer → Release** with hard gates, the file is being read.

---

## Contributing

The rules that keep this repo coherent:

1. **One loop, no new mechanisms.** A contribution may add a reference file, an example, or a clarification. It may not add a phase, a gate, or a runtime.
2. **Deletion over addition.** A PR that removes 50 lines and loses nothing is worth more than one that adds 50.
3. **Every PR states its learning.** Fill in the `vision-log.md` entry the change produces.
4. **No new dependency** where the stdlib or the platform already does it.
5. **Prose obeys the ladder.** Every sentence earns its place, or it goes.

See [`OPEN-THREADS.md`](OPEN-THREADS.md) for what's currently open, and [`DECISIONS.md`](DECISIONS.md) before proposing a structural change — the alternatives were likely already considered and rejected.

---

## License

**MIT** — see [`LICENSE`](LICENSE).

---

<div align="center">

**VER v1.0.0** — by **Ver Sangil**

*See it. Build it. Ship it. Every release feeds the next vision.*

*Ver* and *V.E.R.* share a root — the byline is the loop.

</div>
