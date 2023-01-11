# sops-encrypt README

Easily encrypt your workspace files with sops using just a right click!

## Features

![alt text](https://github.com/npapapietro/sops-encrypt-vscode/blob/main/Style.gif)

- Configure a single public key
- Let the extension present multiple keys for you to choose from.

## Requirements

- Mozilla [sops](https://github.com/mozilla/sops) installed

## Extension Settings

- `sops-encrypt.binaryLocation`: (Default: `sops`) Name of sops binary.
- `sops-encrypt.pubKeyLocation`: (Optional, Default: `null`) Location of public key. If unset, vscode will present a dropdown selection.
- `sops-encrypt.pubKeyGlob`: (Optional, Default: `**/*.pub.asc`) If `sops-encrypt.pubKeyLocation` is unset, extenstion will glob the workspace for keys with this format.
- `sops-encrypt.errorLevel`: (Optional, Default: `error`) Error level. Accepts `error` or `warning`.

## Release Notes

Users appreciate release notes as you update your extension.

### 0.1.0

Initial release
