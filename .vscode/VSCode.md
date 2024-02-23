# VSCode

## Setup

---

### Must Extensions:

1. (Install "ESLint" Extension)[dbaeumer.vscode-eslint]

- Go to any typescript file, right click the error on the first line and click allow everywhere https://prnt.sc/10aaggz
- You can auto use this on the file by using the `CMD + .` shortcut
- If you don't know what linters are search `How does a linter (or typescript linters) work` on youtube

2. (Install "Mocha Test Explorer" Extension)[hbenl.vscode-mocha-test-adapter]

- After installing: https://prnt.sc/tri5i0

### Recommended Extensions:

- We have recommended extensions which will help development speed a lot. They're in `.vscode/extensions.json`.
- You can install them by https://prnt.sc/10bk1ki Looking at the recommended extensions part
- Make sure it says the comment `This extension is recommended by users of the current workspace`

---

## VSCode Tricks

---

### Important Keybinds:

1. Enable Typescript autocompile

- Press `CMD + Shift + B` to open a list of tasks in VS Code and select `tsc: watch - tsconfig.json`

### Basic Editing Keybinds:

| Command                                     | Key   | Notes                                          |
| ------------------------------------------- | ----- | ---------------------------------------------- |
| Delete Line                                 | ⇧⌘K   | I changed to ⌘Backspace                        |
| Move Line Down                              | ⌥↓    | x                                              |
| Move Line Up                                | ⌥↑    | x                                              |
| Copy Line Down                              | ⇧⌥↓   | x                                              |
| Copy Line Up                                | ⇧⌥↑   | x                                              |
| Add Selection To Next Find Match            | ⌘D    | x                                              |
| Move Last Selection To Next Find Match      | ⌘K ⌘D | x                                              |
| Undo last cursor operation                  | ⌘U    | x                                              |
| Insert cursor at end of each line selected  | ⇧⌥I   | x                                              |
| Select all occurrences of current selection | ⇧⌘L   | x                                              |
| Select current line                         | ⌘L    | x                                              |
| Insert Cursor Below                         | ⌥⌘↓   | x                                              |
| Insert Cursor Above                         | ⌥⌘↑   | x                                              |
| Jump to matching bracket                    | ⇧⌘\   | x                                              |
| Indent Line                                 | ⌘]    | x                                              |
| Outdent Line                                | ⌘[    | x                                              |
| Toggle Block Comment                        | ⇧⌥A   | I changed to ⇧⌥/                               |
| Replace                                     | ⌥⌘F   | Wanted to change this but couldn't find better |

### Rich Languages Editing Keybinds:

| Command                 | Key     | Notes |
| ----------------------- | ------- | ----- |
| Trigger Suggest         | ⌃Space  | x     |
| Trigger Parameter Hints | ⇧⌘Space | x     |
| Quick Fix               | ⌘.      | x     |
| Rename Symbol           | F2      | x     |

### Navigation Keybinds:

| Command                       | Key    | Notes           |
| ----------------------------- | ------ | --------------- |
| Show All Symbols              | ⌘T     | x               |
| Go to Line...                 | ⌃G     | I changed to ⌃L |
| Go to File..., Quick Open     | ⌘P     | x               |
| Go to Symbol...               | ⇧⌘O    | x               |
| Show Problems                 | ⇧⌘M    | x               |
| Show All Commands             | ⇧⌘P    | x               |
| Focus Breadcrumbs             | ⇧⌘.    | x               |
| Navigate Editor Group History | ⌃Tab   | x               |
| Go Back                       | ⌃-     | I changed to ⌃[ |
| Go Forward                    | ⌃⇧-    | I changed to ⌃] |
| Show Search                   | ⇧⌘F    | x               |
| Quick Open View               | ⌃Q     | x               |
| Toggle Integrated Terminal    | ⌃` | x |
| Replace in Files              | ⇧⌘H    | x               |
| Open Settings                 | ⌘,     | x               |
| Run Build Task                | ⇧⌘B    | x               |

### Custom Added Keybinds:

| Command              | Key | Notes |
| -------------------- | --- | ----- |
| Run all tests        | x   | ⌥R    |
| Repeat last test run | x   | ⌥T    |
| Cancel test runs     | x   | ⌥Y    |
| Turbo Console Log    | x   | ⌃⌥L   |
| Save + No Formatting | x   | ⇧⌘S   |
| Save + Formatting    | x   | ⌘S    |

### Keybindings.json of Goktug:

```
// Place your key bindings in this file to override the defaults
[
    {
        "key": "cmd+backspace",
        "command": "editor.action.deleteLines",
        "when": "textInputFocus && !editorReadonly"
    },
    {
        "key": "shift+cmd+k",
        "command": "-editor.action.deleteLines",
        "when": "textInputFocus && !editorReadonly"
    },
    {
        "key": "shift+alt+/",
        "command": "editor.action.blockComment",
        "when": "editorTextFocus && !editorReadonly"
    },
    {
        "key": "shift+alt+a",
        "command": "-editor.action.blockComment",
        "when": "editorTextFocus && !editorReadonly"
    },
    {
        "key": "ctrl+l",
        "command": "workbench.action.gotoLine"
    },
    {
        "key": "ctrl+g",
        "command": "-workbench.action.gotoLine"
    },
    {
        "key": "ctrl+[",
        "command": "workbench.action.navigateBack"
    },
    {
        "key": "ctrl+-",
        "command": "-workbench.action.navigateBack"
    },
    {
        "key": "ctrl+]",
        "command": "workbench.action.navigateForward"
    },
    {
        "key": "ctrl+shift+-",
        "command": "-workbench.action.navigateForward"
    },
    {
        "key": "alt+r",
        "command": "test-explorer.run-all"
    },
    {
        "key": "alt+t",
        "command": "test-explorer.rerun"
    },
    {
        "key": "alt+y",
        "command": "test-explorer.cancel"
    },
    {
        "key": "shift+cmd+s",
        "command": "workbench.action.files.save"
    },
    {
        "key": "cmd+s",
        "command": "workbench.action.files.saveWithoutFormatting"
    },
    {
        "key": "cmd+k s",
        "command": "-workbench.action.files.saveWithoutFormatting"
    },
    {
        "key": "cmd+s",
        "command": "-workbench.action.files.save"
    },
]
```

Source: https://code.visualstudio.com/docs/getstarted/keybindings
