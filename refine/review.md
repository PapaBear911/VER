# Refine Pass — Review

Deep dive. `AGENTS.md` stays authoritative; this file adds method.

Run when: "review the diff", "read it end to end", "ready to ship?"

## Purpose

Read the finished diff as a whole, the way a maintainer will read it six months from now, and
return a single verdict.

## Steps

1. **Read top to bottom** — every changed file, in full, in reading order. Not a summary, not a
   hunk-by-hunk skim.
2. **Check drift** — does the code still do what the tests claim and what the Vision approved?
   Is any plan left behind in the code?
3. **Check naming** — every name describes what the thing is now, not what it was when written.
4. **Check comments** — comments explain *why*, not *what*. Delete the ones that narrate the line
   below them.
5. **Check tests** — each new behavior has a test that fails without it; each test was actually
   run in this session.
6. **Run the narrowest verification once more** — after all other checks, because reading can
   change nothing but reading is not running. Show the output.
7. **Check profile gates (v1.1.0)** — list the domains the router loaded and confirm each
   profile's Release gates passed. A profile whose gate was never run is an open loop.
8. **Check the rollback line** — the release note carries an `## undo` line. If absent, Loop.
9. **Verdict** — Ship or Loop.

## Output

```markdown
## Review verdict

Verdict: **Ship** | **Loop**

- Drift:   [none, or file + what drifted]
- Naming:  [none, or file + what confused]
- Comments:[none, or file + what narrates]
- Tests:   [coverage + last observed run output]
- Risk:    [the one thing most likely to be wrong in production]

If Loop:
- [specific deficiency]
- [the phase that owns the fix: Visualize / Engineer / Release]
```

## HARD GATE — verdict must be Ship before Release

A Loop verdict blocks Release. Route the deficiency to the phase that owns it: an unclear
outcome goes to Visualize, an unproven behavior goes to Engineering, an unbuilt observation goes
to Rollout. Never answer a Loop verdict with a third attempt at the same gate — two failures
means the Vision is wrong.
