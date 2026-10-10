# Dependencies — Every One Is a Liability

Clause served: **Build it — the smallest thing that works, proven.**

A dependency is code you did not write, cannot fully audit, must keep patched, and that can
change or vanish without asking you. Every dependency must earn its place.

---

## The Decision Ladder

Before adding package `X`, stop at the first rung that holds:

1. **Do you need this at all?** Delete the requirement instead. The best dependency is none.
2. **Does the standard library do it?** Use the stdlib. It ships with the runtime, has no
   supply chain risk, and never breaks because someone renamed a function.
3. **Does the platform do it?** A database constraint over application validation. A CSS rule
   over a JS measurement. The platform is already installed and already tested.
4. **Does an already-installed dependency do it?** Use the one you have. Do not add a second
   package that does 80% the same thing.
5. **Can it be a few lines?** Write the few lines. A 12-line helper is cheaper over five years
   than a dependency with 40 transitive packages.
6. **Only then:** add the dependency, pinned to an exact version.

---

## The Cost Sheet

Before adding, cost it honestly:

| Cost | Question |
|---|---|
| **Size** | How many transitive packages does this drag in? |
| **Maintenance** | When was it last released? Does it have more than one maintainer? |
| **License** | Is it compatible with your licensing? |
| **Surface** | How much of its API do you actually use? If it is one function, see rung 5. |
| **Replaceability** | If it is abandoned tomorrow, how long is the rewrite? |
| **Security** | Has it had CVEs? How were they handled? |

A dependency used for one function, by a single maintainer, released two years ago, is not a
dependency. It is a liability you chose.

---

## Version Pinning

| Ecosystem | Unpinned (do not ship) | Pinned (ship this) |
|---|---|---|
| Node | `"lib": "^1.2.3"` `"lib": "*"` | `"lib": "1.2.3"` |
| Python | `lib>=1.0` `lib` | `lib==1.2.3` |
| Rust | `lib = "*"` | `lib = "=1.2.3"` |
| Go | `require lib latest` | `require lib v1.2.3` |

An unpinned version means your build is not reproducible. A build that is not reproducible
cannot be trusted, and cannot be rolled back with any confidence.

---

## Lockfiles Are Committed

The lockfile is part of the source. It is committed, reviewed, and updated deliberately — never
regenerated as a side effect of an unrelated change. A lockfile diff is a dependency change
and deserves the same scrutiny as code.

---

## Removal

Every release is a chance to delete a dependency. Ask:

- Is this package still imported anywhere? (Search, do not assume.)
- Has the platform added native support since we adopted it?
- Did we write three helpers to work around its API? Then we are using the wrong package.

Deleting a dependency is a simplification, not a risk. Fewer moving parts, fewer failure modes.

---

## Anti-patterns

| Thought | Reality |
|---|---|
| "It's only a small package." | Count the transitive tree, then say that again. |
| "Everyone uses it." | Popularity is not a security audit. |
| "I'll add it now, evaluate later." | Later is when it is load-bearing. |
| "It has a nice API." | You are buying a maintenance contract, not an API. |
| "The version range is fine." | Ranges mean today's build may not be tomorrow's. |
