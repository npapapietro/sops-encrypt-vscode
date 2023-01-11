// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as glob from "glob";
import * as cp from "child_process";
import * as path from "path";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "sops-encrypt" is now active!');

  vscode.commands.registerCommand("sops-encrypt.encrypt", sopsEncrypt);
}

function sopsEncrypt() {
  const { activeTextEditor } = vscode.window;
  const config = getConfig();

  if (activeTextEditor && activeTextEditor.document.languageId === "yaml") {
    const {
      document: { uri, fileName },
    } = activeTextEditor;

    if (config.keyLocation) {
      runEncrypt(config, uri.fsPath);
    } else {
      const opts = getPublicKeyList(config);
      if (opts.length > 0) {
        vscode.window
          .showQuickPick(getPublicKeyList(config), {
            canPickMany: false,
          })
          .then((result) => runEncrypt(config, uri.fsPath, result));
      } else {
        vscode.window.showErrorMessage(
          `Sops error: No public keys with glob "${config.globPattern}" found in workspace.`
        );
      }
    }
  }
}

function runEncrypt(config: Config, filename: string, directory?: string) {
  const runFrom = directory ?? config.keyLocation;
  if (runFrom) {
    const cmd = `${config.binary} --encrypt --in-place ${filename}`;
    cp.exec(cmd, { cwd: path.dirname(runFrom) }, (err, stdout, stderr) => {
      handleResultMessage(err?.message ?? null);
      handleResultMessage(stderr);
    });
  } else {
    handleResultMessage("Sops error: Public key location not specified");
  }
}

function handleResultMessage(message: string | null) {
  if (message && message.trim() !== "") {
    if (message.toLowerCase().includes("warning")) {
      vscode.window.showWarningMessage(`Sops warning: "${message}".`);
    } else {
      vscode.window.showErrorMessage(`Sops error: "${message}".`);
    }
  }
}

type Config = {
  binary: string;
  keyLocation: string | null;
  globPattern: string;
};

function getConfig(): Config {
  const config = vscode.workspace.getConfiguration("sops-encrypt");
  return {
    binary: config.get("binaryLocation") ?? "sops",
    keyLocation: config.get("pubKeyLocation") ?? null,
    globPattern: config.get("pubKeyGlob") ?? "**/*.pub.asc",
  };
}

function getPublicKeyList(config: Config) {
  return (vscode.workspace.workspaceFolders ?? []).reduce((list, ws) => {
    return [
      ...list,
      ...glob.sync(config.globPattern, {
        cwd: ws.uri.fsPath,
        dot: true,
        absolute: true,
      }),
    ];
  }, [] as string[]);
}
