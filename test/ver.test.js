'use strict';
const assert = require('node:assert');
const { test } = require('node:test');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const BIN = path.join(__dirname, '..', 'bin', 'ver.js');

function run(cwd, ...args) {
  return execFileSync('node', [BIN, ...args], { cwd, encoding: 'utf8' });
}

function runEnv(cwd, env, ...args) {
  return execFileSync('node', [BIN, ...args], { cwd, env: { ...process.env, ...env }, encoding: 'utf8' });
}

function tmp() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'ver-test-'));
}

const USER_RULE = '# My real project rules\n\n- Always run tests before commit\n- Never force push\n';

test('empty dir: all files created', () => {
  const dir = tmp();
  run(dir, '--project');
  for (const d of ['profiles', 'phases', 'refine', 'references', 'ver-gates']) {
    assert.ok(fs.existsSync(path.join(dir, d)), `missing ${d}`);
  }
  assert.ok(fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8').includes('# V.E.R.'));
});

test('existing AGENTS.md: user content intact, block appended', () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, 'AGENTS.md'), USER_RULE);
  run(dir, '--project');
  const out = fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8');
  assert.ok(out.includes(USER_RULE), 'user content destroyed');
  assert.ok(out.startsWith('<!-- VER '), 'block must be at top');
});

test('re-run: existing AGENTS.md block stays byte-identical', () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, 'AGENTS.md'), USER_RULE);
  run(dir, '--project');
  const once = fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8');
  run(dir, '--project');
  const twice = fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8');
  assert.strictEqual(once, twice, 're-run changed the file');
  assert.strictEqual((twice.match(/— begin -->/g) || []).length, 1, 'duplicate block');
});

test('--agent claude: existing CLAUDE.md rules survive', () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, 'CLAUDE.md'), USER_RULE);
  run(dir, '--agent', 'claude', '--project', dir);
  const out = fs.readFileSync(path.join(dir, 'CLAUDE.md'), 'utf8');
  assert.ok(out.includes(USER_RULE), 'user rules destroyed');
  assert.ok(out.startsWith('@AGENTS.md'), 'import line missing at top');
});

test('cross-version marker: v1.1.0 install + v2.0.0 = no duplicate', () => {
  const dir = tmp();
  const oldBlock = '<!-- VER v1.1.0 — begin -->\nRead AGENTS.md at the repo root.\n<!-- VER v1.1.0 — end -->\n';
  fs.writeFileSync(path.join(dir, 'AGENTS.md'), oldBlock + 'Rest of file.\n');
  run(dir, '--project');
  const out = fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8');
  assert.strictEqual((out.match(/— begin -->/g) || []).length, 1, 'marker duplicated across versions');
  assert.ok(out.includes('Rest of file.'));
});

test('no config file: created, not appended', () => {
  const dir = tmp();
  run(dir, '--agent', 'gemini', '--project', dir);
  const out = fs.readFileSync(path.join(dir, 'GEMINI.md'), 'utf8');
  assert.strictEqual(out, '@AGENTS.md\n', 'fresh file must be import line only');
});

test('--agent installs the rule set, not just the pointer', () => {
  const dir = tmp();
  run(dir, '--agent', 'claude', '--project', dir);
  assert.ok(fs.existsSync(path.join(dir, 'AGENTS.md')), 'AGENTS.md not created');
  assert.ok(fs.existsSync(path.join(dir, 'profiles')), 'profiles not created');
});

test('--agent points at ver/AGENTS.md when AGENTS.md is user-owned', () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, 'AGENTS.md'), USER_RULE);
  run(dir, '--agent', 'claude', '--project', dir);
  assert.ok(
    fs.readFileSync(path.join(dir, 'CLAUDE.md'), 'utf8').startsWith('@ver/AGENTS.md'),
    'import must point at the copy VER owns'
  );
  assert.strictEqual(fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8').includes('# V.E.R.'), false,
    'user AGENTS.md must not be replaced');
});

test('cursor: .mdc written with frontmatter', () => {
  const dir = tmp();
  run(dir, '--agent', 'cursor', '--project', dir);
  const out = fs.readFileSync(path.join(dir, '.cursor', 'rules', 'ver.mdc'), 'utf8');
  assert.ok(out.startsWith('---\n'), 'frontmatter must lead');
  assert.ok(out.includes('alwaysApply: true'));
});

test('unknown agent: exits non-zero', () => {
  const dir = tmp();
  assert.throws(() => run(dir, '--agent', 'nope'), /Unknown agent/);
});

test('uninstall: removes rules and created AGENTS.md in clean dir', () => {
  const dir = tmp();
  run(dir, '--project');
  assert.ok(fs.existsSync(path.join(dir, 'AGENTS.md')));
  assert.ok(fs.existsSync(path.join(dir, 'profiles')));
  run(dir, '--uninstall', '--project', dir);
  assert.strictEqual(fs.existsSync(path.join(dir, 'AGENTS.md')), false, 'AGENTS.md should be removed');
  assert.strictEqual(fs.existsSync(path.join(dir, 'profiles')), false, 'profiles should be removed');
});

test('uninstall preserves pre-existing VER-path files and post-install edits', () => {
  const dir = tmp();
  fs.mkdirSync(path.join(dir, 'ver'), { recursive: true });
  const ownedLookingFile = path.join(dir, 'ver', 'AGENTS.md');
  fs.writeFileSync(ownedLookingFile, 'User-owned VER instructions.\n');
  run(dir, '--project');
  const editedRule = path.join(dir, 'profiles', 'programming.md');
  fs.appendFileSync(editedRule, '\nUser customization.\n');
  run(dir, '--uninstall', '--project', dir);
  assert.strictEqual(fs.readFileSync(ownedLookingFile, 'utf8'), 'User-owned VER instructions.\n');
  assert.ok(fs.readFileSync(editedRule, 'utf8').includes('User customization.'));
});

test('uninstall: strips marked block and preserves user AGENTS.md and ver/AGENTS.md cleaned', () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, 'AGENTS.md'), USER_RULE);
  run(dir, '--project');
  assert.ok(fs.existsSync(path.join(dir, 'ver', 'AGENTS.md')));
  run(dir, '--uninstall', '--project', dir);
  assert.strictEqual(fs.existsSync(path.join(dir, 'ver', 'AGENTS.md')), false, 'ver/AGENTS.md removed');
  const restored = fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8');
  assert.strictEqual(restored, USER_RULE, 'user AGENTS.md should be restored without VER block');
});

test('uninstall: agent imports and cursor rule removed', () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, 'CLAUDE.md'), USER_RULE);
  run(dir, '--agent', 'claude', '--project', dir);
  run(dir, '--agent', 'cursor', '--project', dir);
  assert.ok(fs.existsSync(path.join(dir, '.cursor', 'rules', 'ver.mdc')));
  assert.ok(fs.readFileSync(path.join(dir, 'CLAUDE.md'), 'utf8').startsWith('@AGENTS.md'));
  run(dir, '--uninstall', '--project', dir);
  assert.strictEqual(fs.existsSync(path.join(dir, '.cursor', 'rules', 'ver.mdc')), false);
  const claudeRestored = fs.readFileSync(path.join(dir, 'CLAUDE.md'), 'utf8');
  assert.strictEqual(claudeRestored, USER_RULE);
});

test('check: global install dir passes contracts with its own copied gates', () => {
  const fakeHome = tmp();
  const env = { HOME: fakeHome, USERPROFILE: fakeHome };
  const globalDir = path.join(fakeHome, '.claude', 'ver');
  runEnv(fakeHome, env, '--global');
  assert.ok(
    runEnv(globalDir, env, '--check', globalDir).includes('All configured static checks passed')
  );
  runEnv(fakeHome, env, '--uninstall', '--global');
});

test('global install and uninstall', () => {
  const fakeHome = tmp();
  const env = { HOME: fakeHome, USERPROFILE: fakeHome };
  runEnv(fakeHome, env, '--global');
  assert.ok(fs.existsSync(path.join(fakeHome, '.claude', 'ver', 'AGENTS.md')));
  assert.ok(fs.readFileSync(path.join(fakeHome, '.claude', 'CLAUDE.md'), 'utf8').includes('@ver/AGENTS.md'));
  for (const d of ['profiles', 'phases', 'refine', 'references', 'ver-gates']) {
    assert.ok(fs.existsSync(path.join(fakeHome, '.claude', 'ver', d)), `global ${d} missing`);
  }
  runEnv(fakeHome, env, '--uninstall', '--global');
  assert.strictEqual(fs.existsSync(path.join(fakeHome, '.claude', 'ver')), false, 'global ver dir should be removed');
  assert.strictEqual(fs.existsSync(path.join(fakeHome, '.claude', 'CLAUDE.md')), false, 'empty CLAUDE.md should be removed');
});

const PRIOR_ENTRY = '## 2026-01-01 — first task\n\n- **Learning:** One.\n\n';

function projectWithLog(dir, log) {
  run(dir, '--project');
  fs.writeFileSync(path.join(dir, 'vision-log.md'), log);
}

test('check: tagged recurrence with resolving, phrase-bearing pointer passes', () => {
  const dir = tmp();
  projectWithLog(dir, `${PRIOR_ENTRY}## 2026-02-02 — second task
- **Learning:** Two.
- **Recurs:** 2026-01-01 — first task
- **Promoted:** notes.md — A recurring lesson must graduate.
`);
  fs.writeFileSync(path.join(dir, 'notes.md'), 'A recurring lesson must graduate.\n');
  assert.ok(run(dir, '--check', dir).includes('All configured static checks passed'));

  // Backward compatible: an untagged latest entry still passes.
  fs.writeFileSync(path.join(dir, 'vision-log.md'), `${PRIOR_ENTRY}## 2026-02-03 — third task
- **Learning:** Three.
`);
  assert.ok(run(dir, '--check', dir).includes('All configured static checks passed'));
});

test('check: recurrence without promotion fails', () => {
  const dir = tmp();
  projectWithLog(dir, `${PRIOR_ENTRY}## 2026-02-02 — second task
- **Learning:** Two.
- **Recurs:** 2026-01-01 — first task
`);
  assert.throws(() => run(dir, '--check', dir), /must promote/);
});

test('check: promotion pointer to a missing file fails', () => {
  const dir = tmp();
  projectWithLog(dir, `## 2026-02-02 — second task
- **Learning:** Two.
- **Promoted:** nowhere.md — some phrase
`);
  assert.throws(() => run(dir, '--check', dir), /target not found/);
});

test('check: promotion pointer to a file lacking the phrase fails', () => {
  const dir = tmp();
  projectWithLog(dir, `## 2026-02-02 — second task
- **Learning:** Two.
- **Promoted:** notes.md — a phrase that was never written
`);
  fs.writeFileSync(path.join(dir, 'notes.md'), 'Unrelated content.\n');
  assert.throws(() => run(dir, '--check', dir), /lacks/);
});

test('check: recurrence to a date with no prior entry fails', () => {
  const dir = tmp();
  projectWithLog(dir, `${PRIOR_ENTRY}## 2026-02-02 — second task
- **Learning:** Two.
- **Recurs:** 2025-12-31 — imaginery task
- **Promoted:** notes.md — A recurring lesson must graduate.
`);
  fs.writeFileSync(path.join(dir, 'notes.md'), 'A recurring lesson must graduate.\n');
  assert.throws(() => run(dir, '--check', dir), /no prior entry/);
});

test('check: passes on valid project and fails on unbalanced markers or missing AGENTS.md', () => {
  const dir = tmp();
  // Missing AGENTS.md should fail check
  assert.throws(() => run(dir, '--check', dir), /Gate: file-existence/);

  // Install makes it valid
  run(dir, '--project');
  const res = run(dir, '--check', dir);
  assert.ok(res.includes('All configured static checks passed'));

  // Corrupt marker should fail check
  fs.appendFileSync(path.join(dir, 'AGENTS.md'), '\n<!-- VER v2.0.0 — begin -->\nBroken marker\n');
  assert.throws(() => run(dir, '--check', dir), /unbalanced VER markers/);
});

const ROOT = path.join(__dirname, '..');
const AGENTS = fs.readFileSync(path.join(ROOT, 'AGENTS.md'), 'utf8');

test('router: AGENTS.md stays a lean router, not the re-inlined monolith', () => {
  const lines = AGENTS.split('\n').length;
  assert.ok(lines < 110, `AGENTS.md is ${lines} lines — the router re-bloated; push detail back into phases/references`);
  assert.ok(AGENTS.includes('engage the loop'), 'entry engage-rule missing');
  assert.ok(AGENTS.includes('answer directly'), 'entry answer-directly-rule missing');
  assert.ok(/# V\.E\.R\./.test(AGENTS), 'identity header missing');
});

test('router: every rule path AGENTS.md points at exists on disk', () => {
  const refs = AGENTS.match(/`((?:profiles|phases|refine|references|ver-gates)\/[^`]+)`/g) || [];
  assert.ok(refs.length >= 8, `expected the router to reference the rule dirs; found ${refs.length}`);
  for (const raw of refs) {
    const rel = raw.replace(/`/g, '');
    assert.ok(fs.existsSync(path.join(ROOT, rel)), `AGENTS.md points at missing path: ${rel}`);
  }
});

test('uninstall: a pre-existing empty file is restored empty, not deleted', () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, 'AGENTS.md'), '');
  run(dir, '--project');
  run(dir, '--uninstall', '--project', dir);
  assert.ok(fs.existsSync(path.join(dir, 'AGENTS.md')), 'pre-existing empty AGENTS.md was deleted');
  assert.strictEqual(fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8'), '');
});

test('check: fails contracts when the project ships no ver-gates of its own', () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, 'AGENTS.md'), USER_RULE);
  assert.throws(() => run(dir, '--check', dir), /Gate: contracts/, 'audited the package bundle, not the project');
});

test('uninstall: manifest paths outside the project are never pruned', () => {
  const parent = tmp();
  const dir = path.join(parent, 'project');
  fs.mkdirSync(path.join(dir, '.ver'), { recursive: true });
  const victim = path.join(parent, 'victim');
  fs.mkdirSync(victim);
  fs.writeFileSync(
    path.join(dir, '.ver', 'ver-manifest.json'),
    JSON.stringify({
      version: 1,
      files: {
        'ghost.txt': { orig: null, hash: null },
        'nested/../../victim/ghost.txt': { orig: null, hash: null },
      },
    })
  );
  run(dir, '--uninstall', '--project', dir);
  assert.ok(fs.existsSync(victim), 'a directory outside the project was pruned');
});

test('install: a user comment that merely starts like a marker does not suppress install', () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, 'AGENTS.md'), `<!-- VER note to self -->\n${USER_RULE}`);
  run(dir, '--project');
  const out = fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8');
  assert.ok(out.startsWith('<!-- VER v'), 'block not prepended');
  assert.ok(out.includes('note to self'), 'user content destroyed');
});

test('package: bin name avoids collisions with shell builtins', () => {
  const bin = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).bin;
  const names = Object.keys(bin);
  assert.ok(!names.includes('ver'), '"ver" is shadowed by the cmd.exe builtin on Windows');
  for (const name of names) {
    assert.ok(fs.existsSync(path.join(ROOT, bin[name])), `missing bin target for ${name}: ${bin[name]}`);
  }
});

test('hook: installs and appends pre-commit hook safely', () => {
  const dir = tmp();
  // Failure if no .git
  assert.throws(() => run(dir, '--hook', dir), /Not a git repository/);

  // Success on git repo
  const gitDir = path.join(dir, '.git');
  fs.mkdirSync(gitDir, { recursive: true });
  const out1 = run(dir, '--hook', dir);
  assert.ok(out1.includes('Created .git/hooks/pre-commit'), 'did not create hook');
  const hookPath = path.join(gitDir, 'hooks', 'pre-commit');
  assert.ok(fs.existsSync(hookPath), 'hook file does not exist');
  const content1 = fs.readFileSync(hookPath, 'utf8');
  assert.ok(content1.includes('ver-rules --check'), 'hook missing audit command');

  // Repeat call is idempotent / skips
  const out2 = run(dir, '--hook', dir);
  assert.ok(out2.includes('already includes'), 'repeat hook call did not skip');

  // Appends to existing non-VER hook without overwriting user script
  const dir2 = tmp();
  const gitDir2 = path.join(dir2, '.git', 'hooks');
  fs.mkdirSync(gitDir2, { recursive: true });
  fs.writeFileSync(path.join(gitDir2, 'pre-commit'), '#!/bin/sh\necho "existing user hook"\n');
  const out3 = run(dir2, '--hook', dir2);
  assert.ok(out3.includes('Appended V.E.R. audit'), 'did not append to existing hook');
  const content3 = fs.readFileSync(path.join(gitDir2, 'pre-commit'), 'utf8');
  assert.ok(content3.includes('existing user hook'), 'overwrote existing user hook');
  assert.ok(content3.includes('ver-rules --check'), 'did not append audit check');
});


