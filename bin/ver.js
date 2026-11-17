#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const pkg = require('../package.json');
const SRC = path.join(__dirname, '..');
const VER_SUBDIR = '.ver-rules';
const RULE_DIRS = ['profiles', 'phases', 'refine', 'references', 'ver-gates'];
const DOCS = ['BOOTSTRAP.md', 'CHANGELOG.md', 'CONTEXT.md', 'DECISIONS.md', 'INSTALL.md', 'INVARIANTS.md', 'README.md'];
const BUNDLE = [
  ...[...RULE_DIRS, 'AGENTS.md', 'examples'].map((name) => [name, name]),
  ...DOCS.map((name) => [name, path.join('docs', name)]),
];
const LEGACY_RULE_DIRS = ['profiles', 'phases', 'refine', 'references', 'ver-gates'];
const MARK_RE = /<!-- VER v\d+\.\d+\.\d+ — (?:begin|end) -->/;
const MANIFEST_REL = path.join(VER_SUBDIR, 'ver-manifest.json');
const LEGACY_MANIFEST_REL = path.join('.ver', 'ver-manifest.json');
const BLOCK = (body) =>
  `<!-- VER v${pkg.version} — begin -->\n${body}\n<!-- VER v${pkg.version} — end -->`;

const log = (file, action) => console.log(`${action.padEnd(8)} ${file}`);
const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
const safeChild = (dir, rel) => {
  if (path.isAbsolute(rel)) return null;
  const root = path.resolve(dir);
  const file = path.resolve(root, rel);
  const fromRoot = path.relative(root, file);
  const contained = fromRoot && fromRoot !== '..' && !fromRoot.startsWith(`..${path.sep}`) && !path.isAbsolute(fromRoot);
  if (!contained) return null;
  let current = file;
  while (current !== root) {
    if (fs.lstatSync(current, { throwIfNoEntry: false })?.isSymbolicLink()) return null;
    current = path.dirname(current);
  }
  return file;
};

function requirePlainPath(dir, file) {
  if (!safeChild(dir, path.relative(dir, file))) {
    throw new Error('Refusing to write through a redirected or invalid VER path: ' + file);
  }
}

// Ownership tracker for a single install run. Uninstall deletes or restores a file
// only if (a) this run created/modified it and (b) its bytes are still the recorded ones.
let tracking = null;
function beginTrack(dir) {
  tracking = { dir, files: {} };
  return dir;
}
function relOf(file) {
  if (!tracking) return null;
  const rel = path.relative(tracking.dir, file);
  return rel && !rel.startsWith('..') && !path.isAbsolute(rel) ? rel.replace(/\\/g, '/') : null;
}
function trackBefore(file) {
  if (!tracking) return;
  const rel = relOf(file);
  if (!rel) return;
  if (!tracking.files[rel]) tracking.files[rel] = { orig: fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null, hash: null };
}
function trackAfter(file) {
  if (!tracking) return;
  const rel = relOf(file);
  if (!rel) return;
  if (!tracking.files[rel]) tracking.files[rel] = { orig: fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null, hash: null };
  tracking.files[rel].hash = sha(fs.readFileSync(file));
}

// Copy only absent paths; existing rules and user edits are never replaced.
function copyMissing(source, dest) {
  requirePlainPath(tracking.dir, dest);
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
  trackBefore(dest);
  fs.copyFileSync(source, dest);
  trackAfter(dest);
  log(dest, 'created');
}

function updateFileOrKeep(source, dest, manifest) {
  requirePlainPath(tracking.dir, dest);
  const stat = fs.statSync(source);
  if (stat.isDirectory()) {
    if (fs.existsSync(dest) && !fs.statSync(dest).isDirectory()) return log(dest, 'skipped');
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(source)) {
      updateFileOrKeep(path.join(source, entry), path.join(dest, entry), manifest);
    }
    return;
  }
  const rel = relOf(dest);
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    trackBefore(dest);
    fs.copyFileSync(source, dest);
    trackAfter(dest);
    return log(dest, 'created');
  }
  const rec = manifest?.files?.[rel] || manifest?.files?.[rel?.replace(/\//g, '\\')];
  if (rec && rec.hash) {
    const currentHash = sha(fs.readFileSync(dest));
    if (currentHash === rec.hash) {
      if (sha(fs.readFileSync(source)) === currentHash) {
        return log(dest, 'skipped');
      }
      trackBefore(dest);
      fs.copyFileSync(source, dest);
      trackAfter(dest);
      return log(dest, 'updated');
    } else {
      return log(dest, 'kept (modified)');
    }
  }
  log(dest, 'skipped');
}

function migrateLegacyVerFiles(dir) {
  const legacyPath = safeChild(dir, LEGACY_MANIFEST_REL);
  const manifestPath = path.join(dir, MANIFEST_REL);
  requirePlainPath(dir, manifestPath);
  if (!legacyPath || !fs.existsSync(legacyPath) || fs.existsSync(manifestPath)) return;
  const manifest = loadManifest(dir);
  if (!manifest) return;

  const agents = ['CLAUDE.md', 'GEMINI.md', '.cursor/rules/ver.mdc'];
  const keepLegacyLayout = agents.some((rel) => {
    const file = safeChild(dir, rel);
    if (!file || !fs.existsSync(file)) return false;
    const text = fs.readFileSync(file, 'utf8');
    const record = manifest.files[rel] || manifest.files[rel.replace(/\//g, '\\')];
    return /^(Read |@)ver\/AGENTS\.md(?=\s|$)/m.test(text) && sha(Buffer.from(text)) !== record?.hash;
  });

  // Copy first so an interrupted migration leaves the legacy files intact.
  const moved = [];
  for (const [rel, record] of Object.entries(manifest.files)) {
    const normalized = rel.replace(/\\/g, '/');
    const folder = normalized.split('/')[0];
    const rule = normalized === 'ver/AGENTS.md' ? 'AGENTS.md' : normalized;
    if (normalized !== 'ver/AGENTS.md' && !LEGACY_RULE_DIRS.includes(folder)) continue;
    const nextRel = VER_SUBDIR + '/' + rule;
    const source = safeChild(dir, normalized);
    const dest = safeChild(dir, nextRel);
    if (!source || !dest || !fs.statSync(source, { throwIfNoEntry: false })?.isFile()) continue;
    if (fs.existsSync(dest)) {
      log(source, 'kept (destination exists)');
      continue;
    }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(source, dest, fs.constants.COPYFILE_EXCL);
    manifest.files[nextRel] = { ...record, orig: null };
    if (!keepLegacyLayout && record.orig === null && sha(fs.readFileSync(source)) === record.hash) {
      delete manifest.files[rel];
      moved.push(source);
    }
    log(dest, 'migrated');
  }

  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' });
  for (const source of moved) {
    fs.unlinkSync(source);
    let parent = path.dirname(source);
    while (parent !== dir) {
      try { fs.rmdirSync(parent); } catch { break; }
      parent = path.dirname(parent);
    }
  }
  fs.unlinkSync(legacyPath);
  try { fs.rmdirSync(path.dirname(legacyPath)); } catch {}

  if (!fs.existsSync(path.join(dir, VER_SUBDIR, 'AGENTS.md'))) return;
  for (const rel of agents) {
    const file = safeChild(dir, rel);
    const record = manifest.files[rel] || manifest.files[rel.replace(/\//g, '\\')];
    if (!file || !record || !fs.existsSync(file)) continue;
    const previous = fs.readFileSync(file, 'utf8');
    if (sha(Buffer.from(previous)) !== record.hash) continue;
    const next = previous.replace(/^(Read |@)ver\/AGENTS\.md(?=\s|$)/m, '$1' + VER_SUBDIR + '/AGENTS.md');
    if (next !== previous) write(file, next, 'updated');
  }
}

function updateProject(dir) {
  if (!loadManifest(dir)) return installProject(dir);
  beginTrack(dir);
  migrateLegacyVerFiles(dir);
  const manifest = loadManifest(dir);
  for (const [source, dest] of BUNDLE) {
    updateFileOrKeep(path.join(SRC, source), path.join(dir, VER_SUBDIR, dest), manifest);
  }
  updateProjectPointer(dir, manifest);
  endTrack(dir);
}

function updateProjectPointer(dir, manifest) {
  const root = path.join(dir, 'AGENTS.md');
  const body = 'Read ' + VER_SUBDIR + '/AGENTS.md. Apply the VER loop to every task.';
  if (!fs.existsSync(root)) return prependBlock(root, body);
  const previous = fs.readFileSync(root, 'utf8');
  const record = manifest?.files['AGENTS.md'];
  const oldBlock = /<!-- VER v\d+\.\d+\.\d+ — begin -->\r?\nRead (?:ver|\.ver-rules)\/AGENTS\.md\. Apply the VER loop to every task\.\r?\n<!-- VER v\d+\.\d+\.\d+ — end -->/;
  const next = record?.orig === null && sha(Buffer.from(previous)) === record.hash
    ? BLOCK(body) + '\n'
    : previous.replace(oldBlock, BLOCK(body));
  if (next !== previous) return write(root, next, 'updated');
  if (!MARK_RE.test(previous)) prependBlock(root, body);
}

function loadManifest(dir) {
  const mf = safeChild(dir, MANIFEST_REL);
  const legacyMf = safeChild(dir, LEGACY_MANIFEST_REL);
  const target = mf && fs.existsSync(mf) ? mf : legacyMf;
  if (!target) return null;
  try {
    const m = JSON.parse(fs.readFileSync(target, 'utf8'));
    if (m && m.version === 1 && m.files && typeof m.files === 'object' && !Array.isArray(m.files)) return m;
  } catch {}
  return null;
}

function endTrack(dir) {
  const mf = path.join(dir, MANIFEST_REL);
  requirePlainPath(dir, mf);
  // A manifest that exists but does not parse is a user file — never clobber it.
  if (fs.existsSync(mf) && !loadManifest(dir)) {
    tracking = null;
    return log(mf, 'skipped');
  }
  const prev = loadManifest(dir) || { version: 1, files: {} };
  for (const [rel, rec] of Object.entries(tracking.files)) {
    if (!rec.hash) continue;
    const legacyKey = rel.replace(/\//g, '\\');
    const prior = prev.files[rel] || prev.files[legacyKey];
    if (prior && (rec.orig === null || sha(Buffer.from(rec.orig)) === prior.hash)) rec.orig = prior.orig;
    if (legacyKey !== rel) delete prev.files[legacyKey];
    prev.files[rel] = rec;
  }
  fs.mkdirSync(path.dirname(mf), { recursive: true });
  fs.writeFileSync(mf, JSON.stringify(prev, null, 2) + '\n');
  log(mf, 'updated');
  tracking = null;
}

function uninstallRecorded(dir) {
  const manifest = loadManifest(dir);
  if (!manifest) {
    console.log('No VER install manifest found; nothing removed. See INSTALL.md §7 for manual cleanup.');
    return;
  }
  const root = path.resolve(dir);
  const prunable = [];
  for (const [rel, rec] of Object.entries(manifest.files)) {
    const file = safeChild(root, rel);
    if (!file) continue;
    prunable.push(file);
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) continue;
    if (rec.hash !== sha(fs.readFileSync(file))) {
      log(file, 'kept (modified)');
      continue;
    }
    if (rec.orig !== null) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, rec.orig);
      log(file, 'restored');
    } else {
      fs.unlinkSync(file);
      log(file, 'removed');
    }
  }
  const current = safeChild(root, MANIFEST_REL);
  const consumed = current && fs.existsSync(current) ? current : safeChild(root, LEGACY_MANIFEST_REL);
  fs.unlinkSync(consumed);

  // Prune empty dirs the manifest created or held, deepest first.
  const dirs = new Set();
  for (const file of prunable) {
    let d = path.dirname(file);
    while (d !== root && d !== path.dirname(d) && d.startsWith(root)) { dirs.add(d); d = path.dirname(d); }
  }
  dirs.add(path.dirname(consumed));
  for (const d of [...dirs].sort((a, b) => b.length - a.length)) {
    try { fs.rmdirSync(d); } catch {}
  }
}

// ceiling: sync read-modify-write, single process — add locking only if concurrent installs appear
function write(file, next, action) {
  requirePlainPath(tracking.dir, file);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  trackBefore(file);
  fs.writeFileSync(file, next);
  trackAfter(file);
  log(file, action);
}

/** Prepend `body` above existing content at the top of `file`. INSTALL.md §4. */
function prependBlock(file, body) {
  const prev = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  if (MARK_RE.test(prev)) return log(file, 'skipped');
  write(file, prev ? `${BLOCK(body)}\n\n${prev}` : `${BLOCK(body)}\n`, prev ? 'appended' : 'created');
}

/** Prepend a bare import line, e.g. `@AGENTS.md`. */
function prependImport(file, line) {
  const prev = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  if (prev.includes(line)) return log(file, 'skipped');
  write(file, prev ? `${line}\n\n${prev}` : `${line}\n`, prev ? 'appended' : 'created');
}

/** Cursor reads `.mdc` only when YAML frontmatter is present. */
const cursorFront = (rulePath) =>
  ['---', 'description: V.E.R. Loop — Visualize, Engineer, Release', 'alwaysApply: true', '---', '',
    `Read ${rulePath} at the repo root. Apply the VER loop to every task.`, ''].join('\n');

function cursorRule(file, rulePath) {
  const prev = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  if (prev.includes('alwaysApply: true')) return log(file, 'skipped');
  const front = cursorFront(rulePath);
  write(file, prev ? `${front}\n${prev}` : front, prev ? 'appended' : 'created');
}

function installProject(dir) {
  beginTrack(dir);
  fs.mkdirSync(dir, { recursive: true });
  migrateLegacyVerFiles(dir);

  for (const [source, dest] of BUNDLE) {
    copyMissing(path.join(SRC, source), path.join(dir, VER_SUBDIR, dest));
  }
  updateProjectPointer(dir, loadManifest(dir));
  endTrack(dir);
  return VER_SUBDIR + '/AGENTS.md';
}

function installGlobal(update = false) {
  const home = os.homedir();
  const target = path.join(home, VER_SUBDIR);
  const claude = path.join(home, '.claude');
  const legacyTarget = path.join(claude, 'ver');
  const legacy = safeChild(home, '.claude/ver') && loadManifest(legacyTarget);
  const manifest = loadManifest(home);
  beginTrack(home);
  for (const [rel, record] of Object.entries(legacy?.files || {})) {
    const source = safeChild(legacyTarget, rel);
    const dest = safeChild(home, VER_SUBDIR + '/' + rel.replace(/\\/g, '/'));
    if (!source || !dest || !fs.statSync(source, { throwIfNoEntry: false })?.isFile() || fs.existsSync(dest)) continue;
    copyMissing(source, dest);
    if (tracking.files[relOf(dest)].hash !== record.hash) delete tracking.files[relOf(dest)];
  }
  for (const [from, to] of BUNDLE) {
    const source = path.join(SRC, from);
    const dest = path.join(target, to);
    if (update) updateFileOrKeep(source, dest, manifest || tracking);
    else copyMissing(source, dest);
  }

  const claudeMd = path.join(claude, 'CLAUDE.md');
  const importLine = '@~/' + VER_SUBDIR + '/AGENTS.md';
  requirePlainPath(home, claudeMd);
  const oldConfig = loadManifest(claude)?.files?.['CLAUDE.md'];
  const previous = fs.existsSync(claudeMd) ? fs.readFileSync(claudeMd, 'utf8') : '';
  if (oldConfig && previous.startsWith('@ver/AGENTS.md\n') && sha(Buffer.from(previous)) === oldConfig.hash) {
    write(claudeMd, importLine + previous.slice('@ver/AGENTS.md'.length), 'updated');
    tracking.files['.claude/CLAUDE.md'].orig = oldConfig.orig;
  } else {
    prependImport(claudeMd, importLine);
  }
  endTrack(home);
}

function installAgent(name, dir) {
  const rulePath = installProject(dir);
  const importPath = `@${rulePath}`;
  beginTrack(dir);
  let result;
  if (name === 'claude') result = prependImport(path.join(dir, 'CLAUDE.md'), importPath);
  else if (name === 'gemini') result = prependImport(path.join(dir, 'GEMINI.md'), importPath);
  else result = cursorRule(path.join(dir, '.cursor', 'rules', 'ver.mdc'), rulePath);
  endTrack(dir);
  return result;
}

function uninstallProject(dir) {
  uninstallRecorded(dir);
}

function uninstallGlobal() {
  const home = os.homedir();
  const claude = path.join(home, '.claude');
  if (fs.existsSync(path.join(home, MANIFEST_REL))) uninstallRecorded(home);
  for (const dir of [path.join(home, VER_SUBDIR), claude, path.join(claude, 'ver')]) {
    if (safeChild(home, path.relative(home, dir)) && loadManifest(dir)) uninstallRecorded(dir);
  }
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

  const gatesDir = [
    path.join(dir, VER_SUBDIR, 'ver-gates'),
    path.join(dir, 'ver-gates')
  ].find((d) => fs.existsSync(d)) || path.join(dir, VER_SUBDIR, 'ver-gates');

  const missing = GATES.filter((g) => !fs.existsSync(path.join(gatesDir, g, 'GATE.md')));
  if (missing.length) fail('contracts', `missing GATE.md in ${gatesDir}: ${missing.join(', ')}`);
  else ok('contracts', 'all 6 gate definitions present');

  const agentsMd = path.join(dir, 'AGENTS.md');
  const verRulesAgentsMd = path.join(dir, VER_SUBDIR, 'AGENTS.md');
  const verAgentsMd = path.join(dir, 'ver', 'AGENTS.md');
  if (fs.existsSync(agentsMd) || fs.existsSync(verRulesAgentsMd) || fs.existsSync(verAgentsMd)) {
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
        // ceiling: dir-then-SRC lookup, no dedup — tighten if two roots ever ship the same filename
        const target = [
          path.join(dir, promoted[1]),
          path.join(dir, VER_SUBDIR, promoted[1]),
          path.join(SRC, promoted[1])
        ].find((f) => fs.existsSync(f));
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
  console.log('All configured static checks passed.');
  console.log('Session evidence (approvals, executed tests) is verified by the agent, not this audit.');
  return true;
}

function installHook(dir) {
  const gitDir = path.join(dir, '.git');
  if (!fs.existsSync(gitDir)) {
    console.error(`Error: Not a git repository (no .git directory found in ${dir}).`);
    process.exitCode = 1;
    return false;
  }
  const hooksDir = path.join(gitDir, 'hooks');
  if (!fs.existsSync(hooksDir)) fs.mkdirSync(hooksDir, { recursive: true });
  const hookFile = path.join(hooksDir, 'pre-commit');

  const hookCheck = 'if command -v ver-rules >/dev/null 2>&1; then\n  ver-rules --check .\nelif [ -f "bin/ver.js" ]; then\n  node bin/ver.js --check .\nelse\n  echo "V.E.R. audit skipped: no ver-rules CLI on PATH" >&2\nfi';

  if (fs.existsSync(hookFile)) {
    const existing = fs.readFileSync(hookFile, 'utf8');
    if (existing.includes('ver-rules --check') || existing.includes('V.E.R. audit hook')) {
      console.log('pre-commit hook already includes V.E.R. audit (skipped).');
      return true;
    }
    fs.appendFileSync(hookFile, `\n\n# --- V.E.R. audit hook ---\n${hookCheck}\n`);
    try { fs.chmodSync(hookFile, 0o755); } catch {}
    console.log('Appended V.E.R. audit to existing .git/hooks/pre-commit');
    return true;
  }

  const script = `#!/bin/sh\n# --- V.E.R. audit hook ---\n${hookCheck}\n`;
  fs.writeFileSync(hookFile, script, { mode: 0o755 });
  try { fs.chmodSync(hookFile, 0o755); } catch {}
  console.log('Created .git/hooks/pre-commit with V.E.R. audit.');
  return true;
}

const HELP = `${pkg.name} ${pkg.version} — V.E.R. installer. Appends. Never replaces.

  ver-rules --project [dir]     Install into a repo in .ver-rules/ (default: .)
  ver-rules --update [dir]      Update unmodified rules to this CLI version (--global supported)
  ver-rules --global            Install into ~/.ver-rules/ + import from ~/.claude/CLAUDE.md
  ver-rules --agent <name>      Install rules + config touch: claude, cursor, gemini
  ver-rules --hook [dir]        Install pre-commit hook running audit before commits
  ver-rules --uninstall         Remove installed rules and imports (--project [dir] or --global)
  ver-rules --check [dir]       Audit V.E.R. gates, contracts, and invariants (default: .)

The CLI is named ver-rules, not ver: cmd.exe has a built-in "ver" that shadows
any PATH entry, so a binary named "ver" silently does nothing on Windows.

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

  if (a.includes('--hook')) {
    const hookAt = a.indexOf('--hook');
    const dir =
      hookAt !== -1 && a[hookAt + 1] && !a[hookAt + 1].startsWith('-') ? a[hookAt + 1] : '.';
    return installHook(path.resolve(dir));
  }

  if (a.includes('--update')) {
    if (a.includes('--global') || a.includes('-g')) {
      return installGlobal(true);
    }
    const updateAt = a.indexOf('--update');
    const dir =
      updateAt !== -1 && a[updateAt + 1] && !a[updateAt + 1].startsWith('-') ? a[updateAt + 1] : '.';
    return updateProject(path.resolve(dir));
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
