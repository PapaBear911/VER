# Install

> VER appends. It never replaces.

If any agent config file already exists in your repo — `AGENTS.md`, `CLAUDE.md`,
`.cursorrules`, `.windsurfrules`, `GEMINI.md`, `.github/copilot-instructions.md` —
**do not delete it.** VER appends a marked block, or adds a single import line. Your
existing rules stay intact. VER stacks on top.

---

## 1. The Golden Rule

**Append. Never replace.**

Every instruction in this file follows one absolute constraint: VER must be safe to install in a
repository that already has agent rules, and must never destroy them.

Three ways VER joins an existing file, in order of preference:

| Method | When | Why |
|---|---|---|
| **Native read** | The agent reads `AGENTS.md` on its own | Nothing to do. No file touched. |
| **Import line** | The agent has its own config file | One line, one source of truth, no drift. |
| **Marked block** | The agent has no import mechanism | Idempotent — repeat installs don't duplicate. |

**Never:** overwrite, truncate, reorder, or reformat existing content.

---

## 2. The Quick Install (Universal)

One clone installs the full rule set — `AGENTS.md` plus `profiles/`, `phases/`, `refine/`,
`references/`, and `ver-gates/` — with no manual copying:

```bash
git clone --depth 1 --branch v2.2.0 https://github.com/PapaBear911/VER.git ../ver-source
node ../ver-source/bin/ver.js --project .
```

Run these from your target project root. Keep the `../ver-source` checkout: every command below
reuses it. The CLI's installed bin name is `ver-rules`, which avoids the cmd.exe builtin `ver`
that shadows PATH on Windows; `node ../ver-source/bin/ver.js` is the same entry point.

Install and maintenance commands

| Path | Command | Writes to |
|---|---|---|
| **Project** | `node ../ver-source/bin/ver.js --project [dir]` | `dir/.ver-rules/` — rule dirs, docs, manifest, plus root `AGENTS.md` |
| **Update** | `node ../ver-source/bin/ver.js --update [dir]` | `dir/.ver-rules/` — migrates legacy files, updates unmodified rules |
| **Git Hook** | `node ../ver-source/bin/ver.js --hook [dir]` | `.git/hooks/pre-commit` — appends automated audit hook |
| **User-global** | `node ../ver-source/bin/ver.js --global` | `~/.ver-rules/`, plus an `@~/.ver-rules/AGENTS.md` import in `~/.claude/CLAUDE.md` |
| **Global Update** | `node ../ver-source/bin/ver.js --update --global` | `~/.ver-rules/` — updates unmodified global rules |
| **Agent config** | `node ../ver-source/bin/ver.js --agent <name>` | the one config file that agent needs (see § 3) |

- **Consolidated subfolder:** All VER supporting directories (`profiles/`, `phases/`, `refine/`,
  `references/`, `ver-gates/`, `docs/`) and `ver-manifest.json` are installed inside a single `.ver-rules/`
  subfolder (or `~/.ver-rules/` for global installs), preventing repo root clutter.
- **Legacy migration:** If an older VER installation with root folders (`profiles/`, `phases/`,
  `refine/`, `references/`, `ver-gates/`, `ver/`, `.ver/`) is present, running `--update` or `--project`
  automatically moves them into `.ver-rules/` and updates pointers. Untracked files and conflicting destinations stay in place.
  Customized legacy files are retained at their original paths as well.
- **If no `AGENTS.md` exists:** VER creates `AGENTS.md` pointing to `.ver-rules/AGENTS.md`.
- **If `AGENTS.md` already existed:** read § 4. The installer never overwrites it — your file keeps
  its content intact, VER's rule is written to `.ver-rules/AGENTS.md`, and a marked block pointer is
  prepended to your existing file.

### Curl-only (still supported)

If you want nothing but the core rule, and no profiles:

```bash
curl -fsSL https://raw.githubusercontent.com/PapaBear911/VER/main/AGENTS.md -o AGENTS.md
```

**If `AGENTS.md` already existed, stop here and read § 4 before continuing.**

For the full reference set by hand:

```bash
git clone https://github.com/PapaBear911/VER.git /tmp/ver-src
cp /tmp/ver-src/AGENTS.md .
cp -r /tmp/ver-src/profiles /tmp/ver-src/phases /tmp/ver-src/refine /tmp/ver-src/references /tmp/ver-src/ver-gates .
```

---

## 3. Per-Agent Instructions

### Claude Code

Claude Code added native `AGENTS.md` support in v2.1.277. If no `CLAUDE.md` exists in the
project directory or any parent directory, Claude Code checks for and uses `AGENTS.md`
automatically.

- **If no `CLAUDE.md` exists:** nothing to do. Claude Code reads `AGENTS.md` automatically.
- **If `CLAUDE.md` exists with content:** do not overwrite it. Add `@AGENTS.md` as the first
  line and leave the rest intact:

  ```markdown
  @AGENTS.md

  <!-- your existing content below, untouched -->
  ```

- **If you want both loaded:** keep `CLAUDE.md` as-is and add the `@AGENTS.md` import line.
  Claude Code will load both.
- **On Windows:** use the `@AGENTS.md` import, not a symlink. Symlinks need Administrator or
  Developer Mode.
- **Never delete `CLAUDE.md`. Never overwrite it.**

`@AGENTS.md` is an import, not a copy — the two files cannot drift.

### Cursor

Cursor reads `AGENTS.md` natively at the project root.

- **Nothing else to do** if you use the native rule.
- To add an explicit Cursor rule, run `node ../ver-source/bin/ver.js --agent cursor`. It writes
  `.cursor/rules/ver.mdc` with required YAML frontmatter. Existing `.mdc` content is preserved.
- **If `.cursorrules` exists (legacy):** leave it. Cursor reads both. This file still works but
  is deprecated.
- **If you want VER as a Cursor rule instead:** create `.cursor/rules/ver.mdc` with
  `alwaysApply: true` and a pointer to `AGENTS.md`. Do not delete existing rules.

### Codex CLI

Codex CLI reads `AGENTS.md` natively at the repository root.

- **Nothing else to do.** It is auto-detected.

### Windsurf

Windsurf recognizes `AGENTS.md` automatically at the root and feeds it into the same rules
engine that powers `.windsurf/rules/`.

- **Nothing else to do.** At the root it behaves like `always_on`; in a subdirectory it applies
  only to that directory.
- **If `.windsurfrules` exists:** leave it. Windsurf indexes all rule sources.

### Gemini CLI

Gemini CLI reads `AGENTS.md` when configured.

- Create or update `.gemini/settings.json` in the repository root to include `AGENTS.md` as a
  context file.
- **If `GEMINI.md` already exists with content:** do not overwrite it. Add `@AGENTS.md` as the
  first line.

### GitHub Copilot

GitHub Copilot reads `AGENTS.md` natively.

- **Nothing else to do.**
- **If `.github/copilot-instructions.md` exists:** leave it. Copilot reads both.

### Aider, OpenCode, RooCode, and others

These support `AGENTS.md` through their own configuration. If your tool does not read it
natively, use the marked block in § 4 — it is the universal fallback.

---

## 4. Append Protocol (for existing config files)

When your agent has its own config file and no import mechanism, the installer appends a marked
block at the **top** of the existing file, above your existing content:

```markdown
<!-- VER v2.2.0 — begin -->
Read AGENTS.md at the repo root. Apply the VER loop to every task.
<!-- VER v2.2.0 — end -->
```

The marker makes repeat installs idempotent — running the installer again does not duplicate the
block. Detection matches the full versioned marker (`<!-- VER v<semver> — begin/end -->`), not the
`<!-- VER` prefix alone, so a user comment that merely begins like a marker does not abort a
repeat install, while upgrading from an older VER still finds the old block and leaves it alone
rather than stacking a second one. This is the established pattern: **add, don't replace.**

To update the version later, replace only the text between the markers. Everything outside them
is not yours to touch.

**If you already have an `AGENTS.md`**, the installer leaves it exactly as it is and writes VER's
rule to `.ver-rules/AGENTS.md` instead, prepending a marked block pointer to the top of yours:

```markdown
<!-- VER v2.2.0 — begin -->
Read .ver-rules/AGENTS.md. Apply the VER loop to every task.
<!-- VER v2.2.0 — end -->
```

Your file keeps its content verbatim; the rule is cleanly referenced without collision.

---

## 5. Symlink Strategy (optional)

If you want `CLAUDE.md` to always mirror `AGENTS.md`:

```bash
# macOS / Linux
ln -s AGENTS.md CLAUDE.md

# Windows (PowerShell, admin or Developer Mode)
New-Item -ItemType SymbolicLink -Path CLAUDE.md -Target AGENTS.md
```

**But only if `CLAUDE.md` does not already exist.** If it does, use `@AGENTS.md` instead.

A symlink **replaces**; an import **stacks**. On Windows, symlinks require Administrator or
Developer Mode — which is why the import is the default recommendation everywhere.

---

## 6. Verify

### CLI Audit

Run the built-in checker to verify all 6 gates, contracts, manifest files, and marker integrity:

```bash
node ../ver-source/bin/ver.js --check        # Audit current project directory
node ../ver-source/bin/ver.js --check [dir]  # Audit target directory
```

### Conversational Verification

Open a new agent session in any tool, in a repository containing `AGENTS.md`. Ask:

```text
What is the VER loop?
```

If the agent answers **Visualize → Engineer → Release** with hard gates, the rule is live.

Two more checks:

```text
What does VER do with @security?
```
> Loads `profiles/security.md` and stacks it on the base loop.

```text
I already have an AGENTS.md. What does VER do?
```
> Appends the marked block. Never replaces.

---

## 7. Update / Upgrade

Because the installer adheres to **Append. Never replace**, existing files and user modifications
are skipped (`skipped`). Running `ver-rules --project` over an existing install will not overwrite rules.

### Upgrading the CLI

Point the checkout at the newer tag, then rerun the installer:

```bash
git -C ../ver-source fetch --depth 1 origin tag v2.2.0
git -C ../ver-source checkout v2.2.0
```

### Refreshing Rules & Coordinated Updates

Run `node ../ver-source/bin/ver.js --update` to add new rules and refresh rules whose hashes still match the recorded install. Use `node ../ver-source/bin/ver.js --update --global` for a global installation.

For older installations where rule files are already present, updating shared base rules (`phases/`, `ver-gates/`, `references/`) requires a coordinated update path:

1. **Automatic Refresh (Recommended):**
   If you have not hand-modified the generated rule files, uninstall and re-install:
   ```bash
   node ../ver-source/bin/ver.js --uninstall
   node ../ver-source/bin/ver.js --project
   ```
   This uninstalls the tracked files whose hashes match the manifest, then places the latest release files. User-owned content in `AGENTS.md` and custom files remain completely untouched.

2. **Selective / Custom Update:**
   If you have added custom project rules inside `phases/` or `profiles/`:
   - Run `node ../ver-source/bin/ver.js --project` to copy newly added profile files automatically.
   - Inspect upstream changes to shared guides (`phases/`, `ver-gates/`, `INVARIANTS.md`) using git diff:
     ```bash
     git diff origin/main -- phases/ ver-gates/ INVARIANTS.md
     ```
   - Port the dual truth standard (Invariant 6) and Three-Part Bounded Undo (Invariant 13) into your preserved rule copies without clobbering your local project conventions.

---

## 8. Uninstall

**Removing the CLI** (it wrote nothing — it only placed files): delete the `../ver-source`
checkout. Nothing was installed into a package manager.

**Removing the rules automatically:**

```bash
node ../ver-source/bin/ver.js --uninstall                   # remove from current project (.ver-rules)
node ../ver-source/bin/ver.js --uninstall --project [dir]   # remove from target project (.ver-rules)
node ../ver-source/bin/ver.js --uninstall --global          # remove global install (~/.ver-rules)
```

Or manually, in the reverse order they were installed:

1. Remove the marked VER block from any config file (§ 4).
2. Remove the `@.ver-rules/AGENTS.md` (or `@~/.ver-rules/AGENTS.md`) import line from `CLAUDE.md` or `GEMINI.md`.
3. Remove `.ver-rules/` and its manifest.
4. Remove the root `AGENTS.md` **only if the installer created it** — if you wrote it yourself,
   keep it.

**Do not delete any file content that existed before VER was installed.** Uninstall removes VER
and nothing else — if you cannot tell which lines were yours, you installed it wrong.

---

## 9. What VER never does

- Never deletes an existing agent config file.
- Never overwrites existing content in one.
- Never reorders or reformats your rules.
- Never overwrites a file it did not create — an existing `AGENTS.md`, `CLAUDE.md`, or
  `GEMINI.md` keeps its content, and VER's rule goes to `.ver-rules/AGENTS.md` with a one-line pointer.
- Never installs a hook or a daemon.
- Never requires a build step, a daemon, or a network call at inference time.
- The `ver-rules` CLI runs once, when you invoke it. It is a file placer, not a runtime.
