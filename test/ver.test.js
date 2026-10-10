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

function tmp() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'ver-test-'));
}

const USER_RULE = '# My real project rules\n\n- Always run tests before commit\n- Never force push\n';

test('empty dir: all files created', () => {
  const dir = tmp();
  run(dir, '--project');
  for (const d of ['profiles', 'phases', 'refine', 'references']) {
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
