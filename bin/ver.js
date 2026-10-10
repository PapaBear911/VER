#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');

const pkg = require('../package.json');
const SRC = path.join(__dirname, '..');
const RULE_DIRS = ['profiles', 'phases', 'refine', 'references'];
const MARK = '<!-- VER ';
const BLOCK = (body) =>
  `${MARK}v${pkg.version} — begin -->\n${body}\n${MARK}v${pkg.version} — end -->`;

const log = (file, action) => console.log(`${action.padEnd(8)} ${file}`);

// Copy only absent paths; existing rules and user edits are never replaced.
function copyMissing(source, dest) {
  const stat = fs.statSync(source);
  if (stat.isDirectory()) {
    if (fs.existsSync(dest) && !fs.statSync(dest).isDirectory()) return log(dest, 'skipped');
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(source)) {
      copyMissing(path.join(source, entry), path.join(dest, entry));
    }
    return;
  }
  if (fs.existsSync(dest)) return log(dest, 'skipped');
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(source, dest);
  log(dest, 'created');
}

function copyRules(dest) {
  for (const dir of RULE_DIRS) copyMissing(path.join(SRC, dir), path.join(dest, dir));
}

// ponytail: sync read-modify-write, single process — add locking only if concurrent installs appear
function write(file, next, action) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, next);
  log(file, action);
}

/** Prepend `body` above existing content at the top of `file`. INSTALL.md §4. */
function prependBlock(file, body) {
  const prev = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  if (prev.includes(MARK)) return log(file, 'skipped');
  write(file, prev ? `${BLOCK(body)}\n\n${prev}` : `${BLOCK(body)}\n`, prev ? 'appended' : 'created');
}

/** Prepend a bare import line, e.g. `@AGENTS.md`. */
function prependImport(file, line) {
  const prev = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  if (prev.includes(line)) return log(file, 'skipped');
  write(file, prev ? `${line}\n\n${prev}` : `${line}\n`, prev ? 'appended' : 'created');
}

/** Cursor reads `.mdc` only when YAML frontmatter is present. */
function cursorRule(file, rulePath) {
  const prev = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  if (prev.includes('alwaysApply: true')) return log(file, 'skipped');
  const front = [
    '---',
    'description: V.E.R. Loop — Visualize, Engineer, Release',
    'alwaysApply: true',
    '---',
    '',
    `Read ${rulePath} at the repo root. Apply the VER loop to every task.`,
    '',
  ].join('\n');
  write(file, prev ? `${front}\n${prev}` : front, prev ? 'appended' : 'created');
}

function installProject(dir) {
  fs.mkdirSync(dir, { recursive: true });
  copyRules(dir);

  const source = path.join(SRC, 'AGENTS.md');
  const root = path.join(dir, 'AGENTS.md');
  if (!fs.existsSync(root)) {
    copyMissing(source, root);
    return 'AGENTS.md';
  }
  const existing = fs.readFileSync(root);
  if (existing.equals(fs.readFileSync(source)) || existing.toString('utf8').includes(MARK)) {
    log(root, 'skipped');
    return 'AGENTS.md';
  }

  // Keep VER's full rule separately; point to it without replacing the user's file.
  const rule = path.join(dir, 'ver', 'AGENTS.md');
  copyMissing(source, rule);
  prependBlock(root, 'Read ver/AGENTS.md. Apply the VER loop to every task.');
  return 'ver/AGENTS.md';
}

function installGlobal() {
  const claude = path.join(os.homedir(), '.claude');
  const dest = path.join(claude, 'ver');
  fs.mkdirSync(dest, { recursive: true });
  copyMissing(path.join(SRC, 'AGENTS.md'), path.join(dest, 'AGENTS.md'));
  copyRules(dest);
  prependImport(path.join(claude, 'CLAUDE.md'), '@ver/AGENTS.md');
}

function installAgent(name, dir) {
  const rulePath = installProject(dir);
  const importPath = `@${rulePath}`;
  if (name === 'claude') return prependImport(path.join(dir, 'CLAUDE.md'), importPath);
  if (name === 'gemini') return prependImport(path.join(dir, 'GEMINI.md'), importPath);
  return cursorRule(path.join(dir, '.cursor', 'rules', 'ver.mdc'), rulePath);
}

const HELP = `ver ${pkg.version} — V.E.R. installer. Appends. Never replaces.

  ver --project [dir]     Install into a repo (default: .)
  ver --global            Install into ~/.claude/ver/ + import from ~/.claude/CLAUDE.md
  ver --agent <name>      Install rules + config touch: claude, cursor, gemini

Native readers (Windsurf, Copilot, Codex, Aider, OpenCode, Amp, RooCode,
Devin, Zed) need no flag — they read AGENTS.md at the repo root already.
`;

function main(argv) {
  const a = argv.slice(2);

  if (a.includes('--version') || a.includes('-v')) return console.log(pkg.version);
  if (a.includes('--help') || a.includes('-h') || a.length === 0) return console.log(HELP);

  const agentAt = a.indexOf('--agent');
  if (agentAt !== -1) {
    const name = a[agentAt + 1];
    if (!['claude', 'cursor', 'gemini'].includes(name)) {
      console.error(`Unknown agent: ${name || '(none)'}. Known: claude, cursor, gemini`);
      process.exitCode = 1;
      return;
    }
    const projAt = a.indexOf('--project');
    const dir =
      projAt !== -1 && a[projAt + 1] && !a[projAt + 1].startsWith('-')
        ? a[projAt + 1]
        : process.cwd();
    return installAgent(name, path.resolve(dir));
  }

  if (a.includes('--global') || a.includes('-g')) return installGlobal();

  const projAt = a.indexOf('--project');
  const dir = projAt !== -1 && a[projAt + 1] && !a[projAt + 1].startsWith('-') ? a[projAt + 1] : '.';
  return installProject(path.resolve(dir));
}

main(process.argv);
