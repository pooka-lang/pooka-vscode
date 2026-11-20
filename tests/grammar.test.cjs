// SPDX-License-Identifier: Apache-2.0
const {test, before} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const textmate = require('vscode-textmate');
const oniguruma = require('vscode-oniguruma');
const root = path.resolve(__dirname, '..');
let grammar;
before(async () => {
  const wasm = fs.readFileSync(require.resolve('vscode-oniguruma/release/onig.wasm'));
  await oniguruma.loadWASM(wasm.buffer.slice(wasm.byteOffset, wasm.byteOffset + wasm.byteLength));
  const registry = new textmate.Registry({
    onigLib: Promise.resolve({
      createOnigScanner: patterns => new oniguruma.OnigScanner(patterns),
      createOnigString: value => new oniguruma.OnigString(value),
    }),
    loadGrammar: async () => textmate.parseRawGrammar(
      fs.readFileSync(path.join(root, 'syntaxes/pooka.tmLanguage.json'), 'utf8'), 'pooka.json'),
  });
  grammar = await registry.loadGrammar('source.pooka');
});
function scope(line, word) {
  const at = line.indexOf(word);
  const token = grammar.tokenizeLine(line).tokens.find(t => t.startIndex <= at && t.endIndex > at);
  return token.scopes.join(' ');
}
test('native, actors, skipped tests and assertions are keywords', () => {
  for (const word of ['native', 'actor', 'test', 'skip', 'assert', 'with', 'match'])
    assert.match(scope(`${word} Thing`, word), /keyword/);
});
test('strings and comments keep keywords as text', () => {
  assert.match(scope('"actor native"', 'actor'), /string/);
  assert.doesNotMatch(scope('"actor native"', 'actor'), /keyword/);
  assert.match(scope('// actor native', 'native'), /comment/);
  assert.match(scope('//// A module', 'module'), /comment/);
});
test('numbers, methods and operators have useful scopes', () => {
  assert.match(scope('let x = 0x2A', '0x2A'), /numeric/);
  assert.match(scope('read(value)', 'read'), /function/);
  assert.match(scope('value |> echo', '|>'), /operator/);
});
test('every sample line can be tokenized with carried string state', () => {
  let state = textmate.INITIAL;
  for (const line of fs.readFileSync(path.join(__dirname, 'sample.spec.pooka'), 'utf8').split('\n'))
    state = grammar.tokenizeLine(line, state).ruleStack;
});
test('the package contains its declared resources and both file extensions', () => {
  const pkg = require('../package.json');
  assert.equal(pkg.license, 'Apache-2.0');
  assert.match(pkg.icon, /\.png$/);
  for (const file of [pkg.icon, pkg.contributes.grammars[0].path,
    pkg.contributes.languages[0].configuration, 'LICENSE'])
    assert.ok(fs.existsSync(path.join(root, file)), file);
  assert.deepEqual(pkg.contributes.languages[0].extensions, ['.pooka', '.spec.pooka']);
});
