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

## Development

Edit `syntaxes/pooka.tmLanguage.json` and `language-configuration.json` directly. Both are owned by this package. `npm test` checks real TextMate tokenization, comment/string boundaries, newer keywords and extension metadata. `npm run package` creates the VSIX locally; it does not publish anything.

`.pooka` and `.spec.pooka` are detected automatically. Highlighting only: no language server is started. The repository metadata reserves the proposed `pooka-lang/pooka-vscode` name for review.

## Licence

Apache-2.0. See [LICENSE](LICENSE).
