#!/usr/bin/env node
import { spawnSync } from 'child_process';

const commitMsg = process.argv[2] || 'update';

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { stdio: 'inherit', ...options });
  if (result.error) {
    console.error(`[git-push] Failed to run ${command} ${args.join(' ')}`);
    process.exit(1);
  }
  if (result.status !== 0) {
    process.exit(result.status);
  }
  return result;
}

function runQuiet(command, args) {
  return spawnSync(command, args, { stdio: 'ignore' });
}

const branchResult = spawnSync('git', ['symbolic-ref', '--short', 'HEAD'], { encoding: 'utf8' });
if (branchResult.status !== 0) {
  console.error('[git-push] Unable to determine current branch.');
  process.exit(1);
}

const branch = branchResult.stdout.trim();
console.log(`[git-push] Current branch: ${branch}`);

console.log('[git-push] Staging all changes...');
run('git', ['add', '.']);

const diffResult = runQuiet('git', ['diff', '--cached', '--quiet']);
if (diffResult.status === 0) {
  console.log('[git-push] No changes to commit.');
} else {
  console.log(`[git-push] Committing with message: "${commitMsg}"`);
  run('git', ['commit', '-m', commitMsg]);
}

console.log(`[git-push] Pushing branch '${branch}'...`);
run('git', ['push']);
console.log('[git-push] Done.');
