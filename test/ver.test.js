'use strict';
const assert = require('node:assert');
const { test } = require('node:test');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const BIN = path.join(__dirname, '..', 'bin', 'ver.js');

function run(cwd, ...args) {
  return execFileSync(process.execPath, [BIN, ...args], { cwd, encoding: 'utf8' });
}

function runEnv(cwd, env, ...args) {
  return execFileSync(process.execPath, [BIN, ...args], { cwd, env: { ...process.env, ...env }, encoding: 'utf8' });
}

function tmp() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'ver-test-'));
}

const USER_RULE = '# My real project rules\n\n- Always run tests before commit\n- Never force push\n';

test('empty dir: all files created', () => {
  const dir = tmp();
  run(dir, '--project');
  for (const d of ['profiles', 'phases', 'refine', 'references', 'ver-gates', 'docs']) {
    assert.ok(fs.existsSync(path.join(dir, '.ver-rules', d)), `missing .ver-rules/${d}`);
  }
  assert.ok(fs.readFileSync(path.join(dir, '.ver-rules', 'AGENTS.md'), 'utf8').includes('# V.E.R.'));
  assert.ok(fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8').includes('Read .ver-rules/AGENTS.md'));
  assert.ok(fs.existsSync(path.join(dir, '.ver-rules', 'ver-manifest.json')), 'manifest missing in .ver-rules');
});

test('existing AGENTS.md: user content intact, block appended', () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, 'AGENTS.md'), USER_RULE);
  run(dir, '--project');
  const out = fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8');
  assert.ok(out.includes(USER_RULE), 'user content destroyed');
  assert.ok(out.startsWith('<!-- VER '), 'block must be at top');
  assert.ok(out.includes('Read .ver-rules/AGENTS.md'));
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
  assert.ok(out.startsWith('@.ver-rules/AGENTS.md'), 'import line missing at top');
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
  assert.strictEqual(out, '@.ver-rules/AGENTS.md\n', 'fresh file must be import line only');
});

test('--agent installs the rule set, not just the pointer', () => {
  const dir = tmp();
  run(dir, '--agent', 'claude', '--project', dir);
  assert.ok(fs.existsSync(path.join(dir, '.ver-rules', 'AGENTS.md')), '.ver-rules/AGENTS.md not created');
  assert.ok(fs.existsSync(path.join(dir, '.ver-rules', 'profiles')), '.ver-rules/profiles not created');
});

test('--agent points at .ver-rules/AGENTS.md when AGENTS.md is user-owned', () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, 'AGENTS.md'), USER_RULE);
  run(dir, '--agent', 'claude', '--project', dir);
  assert.ok(
    fs.readFileSync(path.join(dir, 'CLAUDE.md'), 'utf8').startsWith('@.ver-rules/AGENTS.md'),
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
  assert.ok(out.includes('.ver-rules/AGENTS.md'));
});

test('unknown agent: exits non-zero', () => {
  const dir = tmp();
  assert.throws(() => run(dir, '--agent', 'nope'), /Unknown agent/);
});

test('uninstall: removes rules and created AGENTS.md in clean dir', () => {
  const dir = tmp();
  run(dir, '--project');
  assert.ok(fs.existsSync(path.join(dir, 'AGENTS.md')));
  assert.ok(fs.existsSync(path.join(dir, '.ver-rules', 'profiles')));
  run(dir, '--uninstall', '--project', dir);
  assert.strictEqual(fs.existsSync(path.join(dir, 'AGENTS.md')), false, 'AGENTS.md should be removed');
  assert.strictEqual(fs.existsSync(path.join(dir, '.ver-rules')), false, '.ver-rules should be removed');
});

test('uninstall preserves pre-existing VER-path files and post-install edits', () => {
  const dir = tmp();
  fs.mkdirSync(path.join(dir, '.ver-rules'), { recursive: true });
  const ownedLookingFile = path.join(dir, '.ver-rules', 'AGENTS.md');
  fs.writeFileSync(ownedLookingFile, 'User-owned VER instructions.\n');
  run(dir, '--project');
  const editedRule = path.join(dir, '.ver-rules', 'profiles', 'programming.md');
  fs.appendFileSync(editedRule, '\nUser customization.\n');
  run(dir, '--uninstall', '--project', dir);
  assert.strictEqual(fs.readFileSync(ownedLookingFile, 'utf8'), 'User-owned VER instructions.\n');
  assert.ok(fs.readFileSync(editedRule, 'utf8').includes('User customization.'));
});

test('uninstall: strips marked block and preserves user AGENTS.md and .ver-rules/AGENTS.md cleaned', () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, 'AGENTS.md'), USER_RULE);
  run(dir, '--project');
  assert.ok(fs.existsSync(path.join(dir, '.ver-rules', 'AGENTS.md')));
  run(dir, '--uninstall', '--project', dir);
  assert.strictEqual(fs.existsSync(path.join(dir, '.ver-rules', 'AGENTS.md')), false, '.ver-rules/AGENTS.md removed');
  const restored = fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8');
  assert.strictEqual(restored, USER_RULE, 'user AGENTS.md should be restored without VER block');
});

test('uninstall: agent imports and cursor rule removed', () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, 'CLAUDE.md'), USER_RULE);
  run(dir, '--agent', 'claude', '--project', dir);
  run(dir, '--agent', 'cursor', '--project', dir);
  assert.ok(fs.existsSync(path.join(dir, '.cursor', 'rules', 'ver.mdc')));
  assert.ok(fs.readFileSync(path.join(dir, 'CLAUDE.md'), 'utf8').startsWith('@.ver-rules/AGENTS.md'));
  run(dir, '--uninstall', '--project', dir);
  assert.strictEqual(fs.existsSync(path.join(dir, '.cursor', 'rules', 'ver.mdc')), false);
  const claudeRestored = fs.readFileSync(path.join(dir, 'CLAUDE.md'), 'utf8');
  assert.strictEqual(claudeRestored, USER_RULE);
});

test('check: global install dir passes contracts with its own copied gates', () => {
  const fakeHome = tmp();
  const env = { HOME: fakeHome, USERPROFILE: fakeHome };
  const globalDir = path.join(fakeHome, '.ver-rules');
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
  assert.ok(fs.existsSync(path.join(fakeHome, '.ver-rules', 'AGENTS.md')));
  assert.ok(fs.readFileSync(path.join(fakeHome, '.claude', 'CLAUDE.md'), 'utf8').includes('@~/.ver-rules/AGENTS.md'));
  for (const d of ['profiles', 'phases', 'refine', 'references', 'ver-gates', 'docs']) {
    assert.ok(fs.existsSync(path.join(fakeHome, '.ver-rules', d)), `global ${d} missing`);
  }
  runEnv(fakeHome, env, '--uninstall', '--global');
  assert.strictEqual(fs.existsSync(path.join(fakeHome, '.ver-rules')), false, 'global ver dir should be removed');
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
  assert.throws(() => run(dir, '--check', dir), /recurring lesson/);
});

test('check: promotion pointer to a missing file fails', () => {
  const dir = tmp();
  projectWithLog(dir, `## 2026-02-02 — second task
- **Learning:** Two.
- **Recurs:** 2026-01-01 — first task
- **Promoted:** nowhere.md — A recurring lesson must graduate.
`);
  assert.throws(() => run(dir, '--check', dir), /target not found/);
});

test('check: promotion pointer to a file lacking the phrase fails', () => {
  const dir = tmp();
  projectWithLog(dir, `## 2026-02-02 — second task
- **Learning:** Two.
- **Recurs:** 2026-01-01 — first task
- **Promoted:** notes.md — a phrase that was never written
`);
  fs.writeFileSync(path.join(dir, 'notes.md'), 'something else entirely\n');
  assert.throws(() => run(dir, '--check', dir), /lacks/);
});

test('check: recurrence to a date with no prior entry fails', () => {
  const dir = tmp();
  projectWithLog(dir, `${PRIOR_ENTRY}## 2026-02-02 — second task
- **Learning:** Two.
- **Recurs:** 2025-12-31 — non-existent task
- **Promoted:** notes.md — A recurring lesson must graduate.
`);
  fs.writeFileSync(path.join(dir, 'notes.md'), 'A recurring lesson must graduate.\n');
  assert.throws(() => run(dir, '--check', dir), /references no prior entry/);
});

test('check: passes on valid project and fails on unbalanced markers or missing AGENTS.md', () => {
  const dir = tmp();
  // Missing AGENTS.md should fail check
  assert.throws(() => run(dir, '--check', dir), /no AGENTS\.md found/);

  // Fresh install passes
  run(dir, '--project');
  assert.ok(run(dir, '--check', dir).includes('All configured static checks passed'));

  // Corrupt markers fail deploy-aware gate
  fs.appendFileSync(path.join(dir, 'AGENTS.md'), '<!-- VER v2.1.2 — begin -->\n');
  assert.throws(() => run(dir, '--check', dir), /unbalanced VER markers/);
});

const ROOT = path.join(__dirname, '..');
const AGENTS = fs.readFileSync(path.join(ROOT, 'AGENTS.md'), 'utf8');

test('router: AGENTS.md stays a lean router, not the re-inlined monolith', () => {
  const lines = AGENTS.split('\n').length;
  assert.ok(lines < 110, `AGENTS.md is ${lines} lines — the router re-bloated; push detail back into phases/references`);
  assert.ok(lines >= 40, `AGENTS.md is ${lines} lines — suspiciously short; did router content get deleted?`);
  assert.ok(/# V\.E\.R\./.test(AGENTS), 'identity header missing');
});

test('router: every rule path AGENTS.md points at exists on disk', () => {
  const refs = AGENTS.match(/`((?:profiles|phases|refine|references|ver-gates)\/[^`]+)`/g) || [];
  assert.ok(refs.length >= 8, `expected the router to reference the rule dirs; found ${refs.length}`);
  for (const ref of refs) {
    const file = ref.replace(/`/g, '');
    assert.ok(fs.existsSync(path.join(ROOT, file)), `pointed path missing: ${file}`);
  }
});

test('uninstall: a pre-existing empty file is restored empty, not deleted', () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, 'AGENTS.md'), '');
  run(dir, '--project');
  run(dir, '--uninstall', '--project', dir);
  assert.ok(fs.existsSync(path.join(dir, 'AGENTS.md')), 'empty AGENTS.md was removed instead of restored');
  assert.strictEqual(fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8'), '');
});

test('check: fails contracts when the project ships no ver-gates of its own', () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, 'AGENTS.md'), USER_RULE);
  assert.throws(() => run(dir, '--check', dir), /missing GATE\.md/);
});

test('uninstall: manifest paths outside the project are never pruned', () => {
  const parent = tmp();
  const dir = path.join(parent, 'project');
  fs.mkdirSync(dir);
  run(dir, '--project');

  const outside = path.join(parent, 'victim.txt');
  fs.writeFileSync(outside, 'precious\n');

  // Forge a malicious manifest entry that points outside the project root
  const mfPath = path.join(dir, '.ver-rules', 'ver-manifest.json');
  const mf = JSON.parse(fs.readFileSync(mfPath, 'utf8'));
  const crypto = require('crypto');
  const h = crypto.createHash('sha256').update(fs.readFileSync(outside)).digest('hex');
  mf.files['../victim.txt'] = { orig: null, hash: h };
  fs.writeFileSync(mfPath, JSON.stringify(mf));

  run(dir, '--uninstall', '--project', dir);
  assert.ok(fs.existsSync(outside), 'traversal prune deleted a file outside the project root');
  assert.strictEqual(fs.readFileSync(outside, 'utf8'), 'precious\n');
});

test('install: a user comment that merely starts like a marker does not suppress install', () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, 'AGENTS.md'), `<!-- VER note to self -->\n${USER_RULE}`);
  run(dir, '--project');
  const out = fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8');
  assert.ok(out.includes('<!-- VER note to self -->'), 'user comment destroyed');
  assert.ok(out.startsWith('<!-- VER v'), 'block should be prepended despite prefix comment');
});

test('package: bin name avoids collisions with shell builtins', () => {
  const bin = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).bin;
  const names = Object.keys(bin);
  assert.strictEqual(names.includes('ver'), false, 'package publishes "ver" bin which collides with cmd.exe builtin');
  assert.ok(names.includes('ver-rules'), 'package must publish "ver-rules" bin');
});

test('hook: installs and appends pre-commit hook safely', () => {
  const dir = tmp();
  // Failure if no .git
  assert.throws(() => run(dir, '--hook', dir), /Not a git repository/);

  // Initialize mock .git directory
  fs.mkdirSync(path.join(dir, '.git'));
  const out = run(dir, '--hook', dir);
  assert.ok(out.includes('Created .git/hooks/pre-commit with V.E.R. audit.'));

  const hookPath = path.join(dir, '.git', 'hooks', 'pre-commit');
  assert.ok(fs.existsSync(hookPath));
  assert.ok(fs.readFileSync(hookPath, 'utf8').includes('ver-rules --check'));

  // Re-run is idempotent
  const repeatOut = run(dir, '--hook', dir);
  assert.ok(repeatOut.includes('pre-commit hook already includes V.E.R. audit (skipped)'));

  // Appends cleanly to non-VER existing hook
  const otherDir = tmp();
  fs.mkdirSync(path.join(otherDir, '.git', 'hooks'), { recursive: true });
  const otherHook = path.join(otherDir, '.git', 'hooks', 'pre-commit');
  fs.writeFileSync(otherHook, '#!/bin/sh\necho "running linter"\n');
  run(otherDir, '--hook', otherDir);
  const appended = fs.readFileSync(otherHook, 'utf8');
  assert.ok(appended.includes('echo "running linter"'));
  assert.ok(appended.includes('ver-rules --check'));
});

test('cross-domain profiles: policy and research exist and follow profile contract', () => {
  for (const name of ['policy', 'research']) {
    const file = path.join(ROOT, 'profiles', `${name}.md`);
    assert.ok(fs.existsSync(file), `missing ${name} profile`);
    const content = fs.readFileSync(file, 'utf8');
    assert.ok(content.includes('Profile'), `${name} missing domain header`);
    assert.ok(content.includes('## Adds to Visualize'), `${name} missing visualize additions`);
    assert.ok(content.includes('## Adds to Engineer'), `${name} missing engineer additions`);
    assert.ok(content.includes('## Adds to Release'), `${name} missing release additions`);
    assert.ok(content.includes('## Anti-patterns'), `${name} missing anti-patterns`);
  }
});

test('cross-domain routing: AGENTS.md routes policy and research and maintains size contract', () => {
  const lines = AGENTS.split('\n').length;
  assert.ok(lines < 110, `AGENTS.md is ${lines} lines (ceiling is 110)`);
  assert.ok(AGENTS.includes('| policy | `profiles/policy.md` |'), 'policy route missing');
  assert.ok(AGENTS.includes('| research | `profiles/research.md` |'), 'research route missing');
});

test('cross-domain install: project install creates policy and research profiles', () => {
  const dir = tmp();
  run(dir, '--project');
  assert.ok(fs.existsSync(path.join(dir, '.ver-rules', 'profiles', 'policy.md')), 'profiles/policy.md not installed');
  assert.ok(fs.existsSync(path.join(dir, '.ver-rules', 'profiles', 'research.md')), 'profiles/research.md not installed');
});

test('invariants and gates: dual truth standard and Three-Part Bounded Undo contracts hold', () => {
  const invariants = fs.readFileSync(path.join(ROOT, 'INVARIANTS.md'), 'utf8');
  assert.ok(invariants.includes('Running code or observed execution is the only truth'), 'Invariant 6 not updated');
  assert.ok(invariants.includes('Three-Part Bounded Undo'), 'Invariant 13 not updated');

  const engineerGate = fs.readFileSync(path.join(ROOT, 'ver-gates', 'run-before-done', 'GATE.md'), 'utf8');
  assert.ok(engineerGate.includes('dual execution standard'), 'run-before-done missing dual execution standard');

  const releaseGate = fs.readFileSync(path.join(ROOT, 'ver-gates', 'deploy-aware', 'GATE.md'), 'utf8');
  assert.ok(releaseGate.includes('Three-Part Bounded Undo'), 'deploy-aware missing Three-Part Bounded Undo');
});

test('update: updates unmodified files, creates new profiles, and preserves user modifications', () => {
  const dir = tmp();
  run(dir, '--project');

  // 1. User modification is preserved:
  const customizedFile = path.join(dir, '.ver-rules', 'profiles', 'programming.md');
  fs.appendFileSync(customizedFile, '\n# My Custom Rule\n');

  // 2. Unmodified file from older version is updated:
  const oldPhaseFile = path.join(dir, '.ver-rules', 'phases', 'visualize.md');
  const oldPhaseContent = fs.readFileSync(oldPhaseFile, 'utf8');
  const mockOldContent = oldPhaseContent.replace('Institutional authorization identified', 'Old text from v1');
  fs.writeFileSync(oldPhaseFile, mockOldContent);
  const mfPath = path.join(dir, '.ver-rules', 'ver-manifest.json');
  const mf = JSON.parse(fs.readFileSync(mfPath, 'utf8'));
  const crypto = require('crypto');
  const oldHash = crypto.createHash('sha256').update(fs.readFileSync(oldPhaseFile)).digest('hex');
  mf.files[path.join('.ver-rules', 'phases', 'visualize.md').replace(/\\/g, '/')] = { orig: null, hash: oldHash };
  
  // 3. New missing file is created:
  const policyFile = path.join(dir, '.ver-rules', 'profiles', 'policy.md');
  fs.unlinkSync(policyFile);
  delete mf.files[path.join('.ver-rules', 'profiles', 'policy.md').replace(/\\/g, '/')];
  fs.writeFileSync(mfPath, JSON.stringify(mf, null, 2) + '\n');

  // Run update:
  const out = run(dir, '--update', dir);
  assert.ok(out.includes('updated'), 'did not update unmodified rule');
  assert.ok(out.includes('kept (modified)'), 'did not keep user modification');
  assert.ok(out.includes('created'), 'did not create missing profile');

  // Verify:
  assert.ok(fs.readFileSync(customizedFile, 'utf8').includes('My Custom Rule'), 'user edit was overwritten');
  assert.ok(fs.readFileSync(oldPhaseFile, 'utf8').includes('Institutional authorization identified'), 'unmodified rule was not updated to package version');
  assert.ok(fs.existsSync(policyFile), 'missing profile was not created');

  // 4. Global update works
  const fakeHome = tmp();
  const env = { HOME: fakeHome, USERPROFILE: fakeHome };
  runEnv(fakeHome, env, '--global');
  const globalOut = runEnv(fakeHome, env, '--update', '--global');
  assert.ok(globalOut.includes('skipped') || globalOut.includes('updated'));
  runEnv(fakeHome, env, '--uninstall', '--global');
});

test('migration: legacy root files and ver/AGENTS.md migrated into .ver-rules', () => {
  const dir = tmp();
  // Set up legacy layout:
  // Root rule dirs
  fs.mkdirSync(path.join(dir, 'profiles'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'profiles', 'custom.md'), '# Legacy Profile\n');
  fs.mkdirSync(path.join(dir, 'ver-gates', 'spec-before-edit'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'ver-gates', 'spec-before-edit', 'GATE.md'), '# Spec Gate\n');
  fs.mkdirSync(path.join(dir, 'ver'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'ver', 'AGENTS.md'), '# Legacy VER Agent Rule\n');
  fs.mkdirSync(path.join(dir, '.ver'), { recursive: true });
  fs.writeFileSync(path.join(dir, '.ver', 'ver-manifest.json'), JSON.stringify({
    version: 1,
    files: {
      'profiles/custom.md': { orig: null, hash: 'abc' },
      'ver/AGENTS.md': { orig: null, hash: 'def' },
      'ver-gates/spec-before-edit/GATE.md': { orig: null, hash: 'ghi' }
    }
  }, null, 2) + '\n');

  fs.writeFileSync(path.join(dir, 'AGENTS.md'), '<!-- VER v2.1.2 — begin -->\nRead ver/AGENTS.md. Apply the VER loop to every task.\n<!-- VER v2.1.2 — end -->\n\n# User Rules\n');
  
  // Set up a user project docs directory that should NEVER be moved
  fs.mkdirSync(path.join(dir, 'docs'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'docs', 'my-project-doc.md'), '# Project Documentation\n');

  // Run update to trigger migration
  run(dir, '--update', dir);

  // Check that legacy root directories were moved
  assert.strictEqual(fs.existsSync(path.join(dir, 'ver')), false, 'legacy ver/ directory not removed');
  assert.strictEqual(fs.existsSync(path.join(dir, '.ver')), false, 'legacy .ver/ directory not removed');
  assert.strictEqual(fs.existsSync(path.join(dir, 'ver-gates')), false, 'legacy ver-gates/ directory not removed');

  // Check that .ver-rules received the files
  assert.ok(fs.existsSync(path.join(dir, '.ver-rules', 'profiles', 'custom.md')), 'profiles/custom.md not in .ver-rules');
  assert.ok(fs.existsSync(path.join(dir, '.ver-rules', 'ver-gates', 'spec-before-edit', 'GATE.md')), 'GATE.md not in .ver-rules');
  assert.ok(fs.existsSync(path.join(dir, '.ver-rules', 'AGENTS.md')), 'AGENTS.md not in .ver-rules');
  assert.ok(fs.existsSync(path.join(dir, '.ver-rules', 'ver-manifest.json')), 'ver-manifest.json not in .ver-rules');

  // Check that root AGENTS.md was updated
  const agentsMd = fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8');
  assert.ok(agentsMd.includes('Read .ver-rules/AGENTS.md'), 'root AGENTS.md not updated to .ver-rules');
  assert.ok(agentsMd.includes('# User Rules'), 'user content in root AGENTS.md destroyed');

  // Check that user project docs directory was NEVER touched or moved
  assert.ok(fs.existsSync(path.join(dir, 'docs', 'my-project-doc.md')), 'user docs directory was moved or destroyed');
  assert.strictEqual(fs.readFileSync(path.join(dir, 'docs', 'my-project-doc.md'), 'utf8'), '# Project Documentation\n');
});

test('migration: a normal install leaves unrelated directories intact', () => {
  const dir = tmp();
  const userFile = path.join(dir, 'profiles', 'customers.json');
  fs.mkdirSync(path.dirname(userFile));
  fs.writeFileSync(userFile, '{}');
  run(dir, '--project');
  run(dir, '--uninstall');
  assert.strictEqual(fs.readFileSync(userFile, 'utf8'), '{}');
});

test('migration: upgrades tracked legacy rules and keeps uninstall provenance', () => {
  const dir = tmp();
  const legacy = path.join(dir, 'profiles', 'programming.md');
  const previous = Buffer.from('Old VER rule');
  const hash = require('node:crypto').createHash('sha256').update(previous).digest('hex');
  fs.mkdirSync(path.dirname(legacy));
  fs.writeFileSync(legacy, previous);
  fs.mkdirSync(path.join(dir, '.ver'));
  fs.writeFileSync(path.join(dir, '.ver', 'ver-manifest.json'), JSON.stringify({
    version: 1, files: { 'profiles/programming.md': { orig: null, hash } }
  }));
  run(dir, '--update');
  const updated = path.join(dir, '.ver-rules', 'profiles', 'programming.md');
  assert.match(fs.readFileSync(updated, 'utf8'), /Programming Profile/);
  run(dir, '--uninstall');
  assert.ok(!fs.existsSync(updated), 'uninstall resurrected the older package rule');
});

test('migration: keeps conflicting target and legacy bytes', () => {
  const dir = tmp();
  const legacy = path.join(dir, 'profiles', 'programming.md');
  const target = path.join(dir, '.ver-rules', 'profiles', 'programming.md');
  fs.mkdirSync(path.dirname(legacy), { recursive: true });
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.mkdirSync(path.join(dir, '.ver'));
  fs.writeFileSync(legacy, 'Legacy');
  fs.writeFileSync(target, 'Custom destination');
  fs.writeFileSync(path.join(dir, '.ver', 'ver-manifest.json'), JSON.stringify({
    version: 1, files: { 'profiles/programming.md': { orig: null, hash: 'previous' } }
  }));
  run(dir, '--update');
  assert.strictEqual(fs.readFileSync(legacy, 'utf8'), 'Legacy');
  assert.strictEqual(fs.readFileSync(target, 'utf8'), 'Custom destination');
});

test('global update on a fresh home installs rules at the documented location', () => {
  const dir = tmp();
  const env = { HOME: dir, USERPROFILE: dir };
  runEnv(dir, env, '--update', '--global');
  assert.ok(fs.existsSync(path.join(dir, '.ver-rules', 'profiles', 'programming.md')));
  assert.match(fs.readFileSync(path.join(dir, '.claude', 'CLAUDE.md'), 'utf8'), /@~\/\.ver-rules\/AGENTS\.md/);
});
