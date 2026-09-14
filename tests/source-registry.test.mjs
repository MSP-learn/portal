import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import YAML from 'yaml';

test('Azure Knowledge source is cloneable in CI', () => {
  const registry = YAML.parse(fs.readFileSync('sources.yml', 'utf8'));
  const source = registry.sources.find((entry) => entry.repo === 'MSP-learn/azure-knowledge');

  assert.ok(source, 'Azure Knowledge must remain registered');
  assert.equal(source.localPath, undefined, 'Azure Knowledge must not depend on a runner sibling directory');
  assert.equal(source.defaultBranch, 'main');
});
