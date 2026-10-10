# V.E.R.

**v1.1.0** — Router release

> See it. Build it. Ship it. Every release feeds the next vision.

---

## The Tagline Architecture

The tagline is not a slogan. It is the repository's constitution: the test that every rule,
profile, and gate must pass. Four clauses. Three phases plus a feedback edge.

| Clause | Phase | What it promises | What v1.1.0 adds |
|---|---|---|---|
| **See it** | Visualize | Understand before you touch | Router · Five-State Check · Threat Model |
| **Build it** | Engineer | The smallest thing that works | Domain-aware ladder · Human-Path Test |
| **Ship it** | Release | Do not ship a lie | Layered Security · Rollback Line · Copy Audit |
| **Every release feeds the next vision** | The edge | The loop compounds | vision-log · a growing profile library |

Four clauses. Three phases plus a feedback edge. **Every rule in `AGENTS.md` serves one of
them. A rule that cannot be traced to a clause is not VER.**

**The tagline did not change in v1.1.0, because it did not need to.** Every addition in this
release maps onto a clause that already existed. Router and UX gates serve *See it*. The
domain-aware ladder serves *Build it*. Security gates, rollback lines, and copy audits serve
*Ship it*. The profile library serves the compounding edge. Nothing was added, because nothing
was missing — v1.0.0 simply had not yet built out what its own constitution already required.

---

## What it is

V.E.R. — **V**isualize → **E**ngineer → **R**elease — is a universal, always-on agent rule
delivered as a single file, `AGENTS.md`, at the root of a repository. A 15-line router reads the
task, matches keywords, and loads only the domain profiles that apply — so a security task gets
security gates and a docs task does not. Each phase ends in a hard gate: nothing is built until
the vision is approved, nothing is claimed until the code has run, nothing ships without a
rollback line and one written learning.

It is not a framework. Not a CLI. Not a runtime.

---

## Why

Vibe-coded software fails the same way every time. The agent invents an API that does not exist,
misstates a parameter, reaches for a library nobody installed, reports a test run it never
performed, and logs work that never happened. Nothing in a normal session ever asks the model to
*prove* anything — it asks the model to *sound* finished.

V.E.R. closes that gap with the cheapest instrument available: a gate you can talk your way up
to, but not through.

| Hallucination | Where VER catches it |
|---|---|
| Fabricated APIs | **Engineer: Establish** forces reading codebase before writing code. |
| Inaccurate parameters | **Engineer: Execution** demands running code. Running code is the only truth. |
| Non-existent libraries | **Visualize: Validate** forces surfacing existing dependencies before choosing. |
| False test results | **Engineer: Execution** — the agent must actually run the code, not claim it ran. |
| Invented work | **Gate-Failure Protocol** — two failed gates triggers a stop, not more looping. |

---

## Five chefs, one dish. Four cook. One tastes.

- **GSD** fires up twenty burners and builds a state machine for the tomatoes. Exquisite dish, 45 minutes, destroyed kitchen.
- **Superpowers** follows the recipe perfectly, then freezes when the pantry doesn't match. It waits for oak-smoked paprika that doesn't exist.
- **Ponytail** serves one perfect tomato. Right when less is more. Wrong when the customer wanted a soufflé.
- **Karpathy** reasons its way to the perfect dish from first principles. Never tastes it. Half the time the salt is off.
- **V.E.R.** asks what "done" looks like, routes the dish to the right station, cooks the smallest version, tastes after each step, serves it, and writes one line in the kitchen log.

Every other chef's check is a proxy — a recipe, a plan, a principle, a benchmark. **V.E.R. is
the only chef whose verdict comes from the food. The spoon is the only judge.**

---

## The loop

```
V ──▶ E ──▶ R ──▶ V
```

- **V** — Visualize: state what done looks like.
- **E** — Engineer: build it, run it, prove it.
- **R** — Release: ship it, learn, log one line.
- The trailing **V** is the point: the release writes `vision-log.md`, which seeds the next Visualize.

---

## What's new in v1.1.0

v1.0.0 was a web/backend loop wearing a universal badge. v1.1.0 makes the universality real —
through six additions, without bloating the core:

1. **Task Router** — 15 lines in `AGENTS.md` read the task, match keywords, load domain profiles on demand.
2. **8 Domain Profiles** — `programming`, `security`, `ui`, `ux`, `data`, `devops`, `testing`, `docs`. Each adds gates to existing phases. None rewrites the loop.
3. **Layered Security Model** — automated gate → security guard → human-in-the-loop.
4. **UX as a First-Class Concern** — Five-State Check, Human-Path Test, Copy Audit.
5. **Rollback Line** — every release note ends *"To undo: [command or process]."*
6. **`INSTALL.md`** — cross-agent installation, with a strict **append, never replace** rule.

---

## Task Routing

The router runs before Phase 1. It is 15 lines and it is the whole of v1.1.0's universality.

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

**Override:** `@domain` forces a profile; `@domain+domain` forces several.

```text
@security add a password reset flow
@security+ux add a password reset flow
```

**Stacking rule:** profiles stack. When two profiles add gates to the same phase, **the stricter
gate wins.** A task that is both security and UX gets the security gate for authentication
logic and the UX gate for the copy — and where they overlap, the stricter one governs.

No keyword match → run the base loop. A pure question → answer directly, load nothing.

---

## Layered Security

Security is not one gate. It is three, applied in order, each escalating to the next only when
it must. **Automated** runs on every release — a scan of the diff for OWASP-class patterns,
hardcoded secrets, and injection. **Guard** fires only when the diff touches a sensitive surface
(auth, secrets, user input, data deletion, admin or permission changes, session handling) and
checks logic, data flow, and privilege escalation. **Human-in-the-loop** fires only when the
guard lacks confidence, the change is irreversible, or the problem is genuinely novel — because
overusing the human causes reviewer fatigue, which is its own security failure.

See `references/security-gates.md`.

---

## UX Gates

Three gates that make the invisible visible:

- **Five-State Check** — every interface has five states: first use, success, failure, waiting, undo. Most bugs live in the three nobody designs.
- **Human-Path Test** — walk the flow as a person would, not as the test suite does. A green test suite says nothing about the path a human takes.
- **Copy Audit** — every error message says what happened and what to do. Every button label names the outcome, not the mechanism. "Something went wrong" is a lie of omission.

See `references/ux-checklist.md` and `references/copy-guide.md`.

---

## How install

**Full cross-agent instructions: [`INSTALL.md`](INSTALL.md).**

The one-line version — drop `AGENTS.md` at your repo root:

```bash
curl -fsSL https://raw.githubusercontent.com/PapaBear911/VER/main/AGENTS.md -o AGENTS.md
```

Most agents read it natively and need nothing further. A few need one import line in their own
config file.

> **If you already have an `AGENTS.md`, `CLAUDE.md`, or any other agent config file, VER
> appends — it never replaces.** `INSTALL.md` tells you exactly what gets added and where. Your
> existing rules stay intact; VER stacks on top.

---

## How it works

- **Visualize** — route the task, surface assumptions, complete any profile gates, get an approved vision.
- **Engineer** — read before you write, build the smallest thing that works, run it until it's true.
- **Release** — delete what isn't needed, run the security gate, audit the copy, ship, and write one line to `vision-log.md`.

Each phase ends in a HARD GATE. Silence is not approval. A claim without evidence is a failure.

---

## The Refine Pass

Optional, three passes, each one file:

| Pass | File | Trigger phrases | Hard gate |
|---|---|---|---|
| **Validate** | `refine/validate.md` | "validate" · "does this match the vision?" · "on target?" | No silent acceptance of gap or drift. |
| **Enhance** | `refine/enhance.md` | "tighten it" · "simplify" · "delete what's unneeded" | Diff is the smallest coherent change. |
| **Review** | `refine/review.md` | "review the diff" · "read it end to end" · "ready to ship?" | Verdict must be **Ship** before Release. |

---

## Why not GSD / Superpowers / Ponytail / Karpathy alone

| | GSD | Superpowers | Ponytail | Karpathy | **V.E.R.** |
|---|---|---|---|---|---|
| Tells you what to build | Via plans | Via skills | Only what to cut | Only how to think | **Via Vision** |
| Adapts to the domain | Per-phase agents | Per-skill | No | No | **Via router + 8 profiles** |
| Proves it ran | Indirect | Indirect | No | No | **Yes — hard gate** |
| Security gate | No | No | No | No | **3 layers, every release** |
| UX gates | No | No | No | No | **Five-State · Human-Path · Copy** |
| Ends with a learning | Via reports | No | No | No | **Yes — `vision-log.md`** |
| Install cost | Framework | Skill library | Rule-set | Principle | **One file** |

V.E.R. does not replace them. It is the closing step they all omit: taste the food.

---

## Stability (v1.1.0)

**v1.1.0 is the Router release. It remains inside the 1.x stability promise.**

| Frozen | Meaning |
|---|---|
| **Phase names** | Visualize · Engineer · Release |
| **Sub-step names** | Visualize/Validate/Vision · Establish/Engineering/Execution · Refinement/Rollout/Release |
| **Refine pass names** | Validate · Enhance · Review |
| **Router shape** | The domain table and the `@domain` / `@domain+domain` syntax |
| **Tagline** | *See it. Build it. Ship it. Every release feeds the next vision.* |
| **Acronym** | V.E.R. = Visualize → Engineer → Release |
| **Delivery mechanism** | `AGENTS.md`. No hooks, no CLI, no runtime in 1.x. |
| **Author** | Ver Sangil |

**Router and Profiles are the only structural addition permitted in 1.x.** Profiles may be
added; the router syntax may not change. Additions beyond that may only be new reference files,
new examples, or clarifications — never new phases, new gates, or new mechanisms.

---

## License

MIT. See [`LICENSE`](LICENSE).

---

**Author:** Ver Sangil. *Ver* and *VER* share a root — the byline is the loop.
