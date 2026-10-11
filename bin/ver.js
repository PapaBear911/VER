#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');

const pkg = require('../package.json');
const SRC = path.join(__dirname, '..');
const RULE_DIRS = ['profiles', 'phases', 'refine', 'references', 'ver-gates'];
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

function removeMatching(source, target) {
  if (!fs.existsSync(target)) return;
  const stat = fs.statSync(target);
  if (stat.isDirectory()) {
    if (!fs.existsSync(source) || !fs.statSync(source).isDirectory()) return;
    for (const entry of fs.readdirSync(target)) {
      removeMatching(path.join(source, entry), path.join(target, entry));
    }
    try { fs.rmdirSync(target); log(target, 'removed'); } catch {}
    return;
  }
  if (!fs.existsSync(source)) return;
  if (fs.readFileSync(source).equals(fs.readFileSync(target))) {
    fs.unlinkSync(target);
    log(target, 'removed');
  }
}

function removeRules(dest) {
  for (const dir of RULE_DIRS) removeMatching(path.join(SRC, dir), path.join(dest, dir));
}

function stripBlock(file) {
  if (!fs.existsSync(file)) return;
  const prev = fs.readFileSync(file, 'utf8');
  if (!prev.includes(MARK)) return;
  const next = prev.replace(new RegExp(`\\n*${MARK}[\\s\\S]*?${MARK}[^\\n]*— end -->\\n*`, 'g'), '').trim();
  if (!next) {
    fs.unlinkSync(file);
    return log(file, 'removed');
  }
  write(file, next + '\n', 'stripped');
}

function stripImport(file, importLines) {
  if (!fs.existsSync(file)) return;
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const filtered = lines.filter((l) => !importLines.includes(l.trim()));
  const next = filtered.join('\n').trim();
  if (!next) {
    fs.unlinkSync(file);
    return log(file, 'removed');
  }
  write(file, next + '\n', 'stripped');
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

function uninstallProject(dir) {
  const source = path.join(SRC, 'AGENTS.md');
  const root = path.join(dir, 'AGENTS.md');
  if (fs.existsSync(root)) {
    if (fs.readFileSync(root).equals(fs.readFileSync(source))) {
      fs.unlinkSync(root);
      log(root, 'removed');
    } else {
      stripBlock(root);
    }
  }

  const verAgent = path.join(dir, 'ver', 'AGENTS.md');
  if (fs.existsSync(verAgent)) {
    fs.unlinkSync(verAgent);
    log(verAgent, 'removed');
    try { fs.rmdirSync(path.join(dir, 'ver')); } catch {}
  }

  const cursorFile = path.join(dir, '.cursor', 'rules', 'ver.mdc');
  if (fs.existsSync(cursorFile)) {
    fs.unlinkSync(cursorFile);
    log(cursorFile, 'removed');
    try { fs.rmdirSync(path.join(dir, '.cursor', 'rules')); } catch {}
    try { fs.rmdirSync(path.join(dir, '.cursor')); } catch {}
  }

  stripImport(path.join(dir, 'CLAUDE.md'), ['@AGENTS.md', '@ver/AGENTS.md']);
  stripImport(path.join(dir, 'GEMINI.md'), ['@AGENTS.md', '@ver/AGENTS.md']);
  removeRules(dir);
}

function uninstallGlobal() {
  const claude = path.join(os.homedir(), '.claude');
  const dest = path.join(claude, 'ver');
  if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
    log(dest, 'removed');
  }
  stripImport(path.join(claude, 'CLAUDE.md'), ['@ver/AGENTS.md']);
}

const GATES = [
  'spec-before-edit',
  'file-existence',
  'run-before-done',
  'test-integrity',
  'receipt-log',
  'deploy-aware',
];

function checkGates(dir) {
  let passed = true;
  const fail = (gate, msg) => {
    passed = false;
    console.error(`✖ Gate: ${gate} — ${msg}`);
  };
  const ok = (gate, msg) => {
    console.log(`✔ Gate: ${gate} — ${msg}`);
  };

  const gatesDir = fs.existsSync(path.join(dir, 'ver-gates'))
    ? path.join(dir, 'ver-gates')
    : path.join(SRC, 'ver-gates');
  let contractsOk = true;
  for (const g of GATES) {
    if (!fs.existsSync(path.join(gatesDir, g, 'GATE.md'))) {
      fail(g, `missing GATE.md in ${g}`);
      contractsOk = false;
    }
  }
  if (contractsOk) ok('contracts', 'all 6 gate definitions present');

  const agentsMd = path.join(dir, 'AGENTS.md');
  const verAgentsMd = path.join(dir, 'ver', 'AGENTS.md');
  if (fs.existsSync(agentsMd) || fs.existsSync(verAgentsMd)) {
    ok('file-existence', 'AGENTS.md present and readable');
  } else {
    fail('file-existence', 'no AGENTS.md found');
  }

  const logFile = path.join(dir, 'vision-log.md');
  if (fs.existsSync(logFile)) {
    const content = fs.readFileSync(logFile, 'utf8').trim();
    if (/## \d{4}-\d{2}-\d{2}[^\r\n]+[\r\n]+- \*\*Learning:\*\*/.test(content)) {
      let receiptOk = true;
      const bad = (msg) => {
        receiptOk = false;
        fail('receipt-log', msg);
      };
      // Only the latest entry is checked: an edit to a promoted rule must not break older pointers.
      const entries = content.split(/^## (?=\d{4}-\d{2}-\d{2})/m).filter((e) => e.trim());
      const latest = entries[entries.length - 1];
      const recurs = latest.match(/- \*\*Recurs:\*\* (\d{4}-\d{2}-\d{2})/);
      const promoted = latest.match(/- \*\*Promoted:\*\* (.+?) — (.+)/);

      if (recurs) {
        if (!entries.slice(0, -1).some((e) => e.startsWith(`${recurs[1]} —`))) {
          bad(`Recurs: references no prior entry dated ${recurs[1]}`);
        } else if (!promoted) {
          bad('recurring lesson (Recurs:) must promote (Promoted:)');
        }
      }
      if (promoted) {
        // ponytail: dir-then-SRC lookup, no dedup — tighten if two roots ever ship the same filename
        const target = [path.join(dir, promoted[1]), path.join(SRC, promoted[1])].find((f) => fs.existsSync(f));
        if (!target) bad(`Promoted: target not found: ${promoted[1]}`);
        else if (!fs.readFileSync(target, 'utf8').includes(promoted[2])) {
          bad(`Promoted: ${promoted[1]} lacks "${promoted[2]}"`);
        }
      }
      if (receiptOk) ok('receipt-log', 'vision-log.md contains valid learning entry');
    } else {
      fail('receipt-log', 'vision-log.md missing required entry format');
    }
  } else {
    ok('receipt-log', 'no vision-log.md (skipped)');
  }

  let markersBalanced = true;
  for (const f of ['AGENTS.md', 'CLAUDE.md', 'GEMINI.md']) {
    const fp = path.join(dir, f);
    if (fs.existsSync(fp)) {
      const txt = fs.readFileSync(fp, 'utf8');
      const begins = (txt.match(/— begin -->/g) || []).length;
      const ends = (txt.match(/— end -->/g) || []).length;
      if (begins !== ends) {
        fail('deploy-aware', `unbalanced VER markers in ${f} (${begins} begin, ${ends} end)`);
        markersBalanced = false;
      }
    }
  }
  if (markersBalanced) ok('deploy-aware', 'markers balanced and intact');

  if (!passed) {
    process.exitCode = 1;
    return false;
  }
  console.log('All gates verified.');
  return true;
}

const HELP = `ver ${pkg.version} — V.E.R. installer. Appends. Never replaces.

  ver --project [dir]     Install into a repo (default: .)
  ver --global            Install into ~/.claude/ver/ + import from ~/.claude/CLAUDE.md
  ver --agent <name>      Install rules + config touch: claude, cursor, gemini
  ver --uninstall         Remove installed rules and imports (--project [dir] or --global)
  ver --check [dir]       Audit V.E.R. gates, contracts, and invariants (default: .)

Native readers (Windsurf, Copilot, Codex, Aider, OpenCode, Amp, RooCode,
Devin, Zed) need no flag — they read AGENTS.md at the repo root already.
`;

function main(argv) {
  const a = argv.slice(2);

  if (a.includes('--version') || a.includes('-v')) return console.log(pkg.version);
  if (a.includes('--help') || a.includes('-h') || a.length === 0) return console.log(HELP);

  if (a.includes('--check')) {
    const checkAt = a.indexOf('--check');
    const dir =
      checkAt !== -1 && a[checkAt + 1] && !a[checkAt + 1].startsWith('-') ? a[checkAt + 1] : '.';
    return checkGates(path.resolve(dir));
  }

  if (a.includes('--uninstall')) {
    if (a.includes('--global') || a.includes('-g')) return uninstallGlobal();
    const projAt = a.indexOf('--project');
    const dir =
      projAt !== -1 && a[projAt + 1] && !a[projAt + 1].startsWith('-') ? a[projAt + 1] : '.';
    return uninstallProject(path.resolve(dir));
  }

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
