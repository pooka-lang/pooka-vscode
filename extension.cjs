// SPDX-License-Identifier: Apache-2.0

const vscode = require('vscode');
const { LanguageClient } = require('vscode-languageclient/node');

let client;

async function activate() {
  const configuration = vscode.workspace.getConfiguration('pooka');
  if (!vscode.workspace.isTrusted || !configuration.get('languageServer.enabled')) return;

  client = new LanguageClient(
    'pooka',
    'Pooka',
    {
      command: configuration.get('languageServer.path') || 'pooka',
      // No `transport`: TransportKind.stdio would append `--stdio`, which
      // `pooka lsp` rejects. Without it the client still uses stdin/stdout.
      args: ['lsp'],
    },
    { documentSelector: [{ scheme: 'file', language: 'pooka' }] },
  );

  try {
    await client.start();
  } catch (error) {
    const failedClient = client;
    client = undefined;
    await failedClient.dispose();
    void vscode.window.showErrorMessage(
      `Pooka language server failed to start. Check pooka.languageServer.path. ${error.message}`,
    );
  }
}

async function deactivate() {
  if (client) {
    const active = client;
    client = undefined;
    await active.dispose();
  }
}

module.exports = { activate, deactivate };
