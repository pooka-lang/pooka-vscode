# Pooka for Visual Studio Code

Give Pooka a place in Visual Studio Code. Highlight source and spec files, match brackets and use the Pooka file icon.

## Install from source

With Node.js 22+ and npm installed, run from this directory:

```sh
npm ci
npm test
npm run package
code --install-extension pooka-0.1.0.vsix
```

You can also select **Extensions: Install from VSIX** in VS Code. Building the extension does not require the Pooka compiler or Tree-sitter.

## Language server

Install a Pooka compiler build that includes `pooka lsp`. Open the folder containing `pooka.toml` in a trusted VS Code workspace, then open a Pooka file. The extension starts the server from VS Code's PATH. If needed, set `pooka.languageServer.path` in User Settings to the absolute executable path and reload the window. After trusting an already open workspace, reload the window to start the server.

Use **Go to Definition** or **Format Document** from the command palette. For formatting on save, add:

```json
{
  "[pooka]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "pooka-lang.pooka"
  }
}
```

The server checks unsaved edits and resolves dependencies offline. Run `pooka deps download` in the project if dependencies are missing, then save a Pooka file. Use **Developer: Reload Window** to restart the server and select **Pooka** in the Output panel to see its logs.

## Development

Edit `syntaxes/pooka.tmLanguage.json` and `language-configuration.json` directly. Both are owned by this package. `npm test` checks real TextMate tokenization, comment/string boundaries, newer keywords and extension metadata. `npm run package` creates the VSIX locally; it does not publish anything.

`.pooka` and `.spec.pooka` are detected automatically.

## Licence

Apache-2.0. See [LICENSE](LICENSE).
