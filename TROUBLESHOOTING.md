# KNOWCODE Extension Troubleshooting Guide

## 🚨 F5 Not Working - Extension Won't Launch

### Step 1: Check Extension Development Host
1. **Press F5** in VS Code
2. **Wait for new window** - A new VS Code window should open with "Extension Development Host" in the title
3. **Check the title bar** - It should say "Extension Development Host" not just "Visual Studio Code"

### Step 2: Check Console for Errors
1. In the **Extension Development Host** window, go to **View → Output**
2. Select **"KNOWCODE"** from the dropdown
3. Look for any error messages or the activation message: "KNOWCODE extension is now active! 🎉"

### Step 3: Verify Extension is Active
1. In the **Extension Development Host** window, press **Ctrl+Shift+P** (or Cmd+Shift+P on Mac)
2. Type "KNOWCODE" - you should see all the KNOWCODE commands
3. If you don't see them, the extension isn't active

### Step 4: Check Status Bar
1. Look at the **bottom status bar** in the Extension Development Host window
2. You should see "KNOWCODE" on the right side
3. Click it to toggle overlay mode

## 🔧 Common Issues & Solutions

### Issue 1: "No Extension Development Host Window Opens"
**Solution:**
1. Make sure you're in the correct VS Code window (the one with the KNOWCODE project)
2. Check that `.vscode/launch.json` exists and is properly configured
3. Try **Ctrl+Shift+P → "Developer: Reload Window"**

### Issue 2: "Extension Not Found" Error
**Solution:**
1. Run `npm run compile` to ensure the extension is built
2. Check that `out/extension.js` exists
3. Verify `package.json` has correct `main` field: `"./out/extension.js"`

### Issue 3: "Commands Not Available"
**Solution:**
1. Make sure you're in the **Extension Development Host** window
2. Check that the extension activated (look for the activation message)
3. Try **Ctrl+Shift+P → "Developer: Reload Window"**

### Issue 4: "TypeScript Compilation Errors"
**Solution:**
1. Run `npm run compile` to see specific errors
2. Fix any TypeScript errors in the source files
3. Make sure all dependencies are installed: `npm install`

## 🎯 Testing the Extension

### Quick Test Steps:
1. **Open Extension Development Host** (press F5)
2. **Open sample.js** in the new window
3. **Select some code** (e.g., the `calculateSum` function)
4. **Press Ctrl+Shift+E** to explain the selection
5. **You should see** a beautiful explanation panel open

### Test All Features:
1. **Basic Explanation**: `Ctrl+Shift+E` on selected code
2. **Enhanced Explanation**: `Ctrl+Shift+M` for multiple modes
3. **Learning Mode**: `Ctrl+Shift+L` to toggle
4. **Generate MCQs**: Command palette → "KNOWCODE: Generate MCQs"
5. **Generate Project Ideas**: Command palette → "KNOWCODE: Generate Project Ideas"

## 🛠️ Manual Debugging

### Check Extension Status:
1. **Ctrl+Shift+P → "Developer: Show Running Extensions"**
2. Look for "knowcode" in the list
3. Check if it shows as "activated"

### Check Console Logs:
1. **View → Output**
2. Select "KNOWCODE" from dropdown
3. Look for activation messages and errors

### Check Extension Manifest:
1. Open `package.json`
2. Verify `activationEvents` includes `"*"`
3. Verify `main` points to `"./out/extension.js"`

## 🚀 Alternative Launch Methods

### Method 1: Command Palette
1. **Ctrl+Shift+P → "Developer: Reload Window"**
2. This reloads the extension without opening a new window

### Method 2: Terminal
1. Open terminal in VS Code
2. Run: `code --extensionDevelopmentPath=/path/to/knowcode`
3. This opens a new window with the extension

### Method 3: Package Extension
1. Install vsce: `npm install -g vsce`
2. Package extension: `vsce package`
3. Install the .vsix file in VS Code

## 📞 Still Having Issues?

### Check These Files:
- ✅ `package.json` - Extension manifest
- ✅ `out/extension.js` - Compiled extension
- ✅ `.vscode/launch.json` - Debug configuration
- ✅ `tsconfig.json` - TypeScript configuration

### Common Solutions:
1. **Restart VS Code** completely
2. **Delete node_modules** and run `npm install` again
3. **Clear VS Code cache**: Delete `.vscode-test` folder
4. **Check VS Code version**: Make sure it's compatible (^1.85.0)

### Get Help:
1. Check the **Output panel** for specific error messages
2. Look at the **Developer Tools** (Help → Toggle Developer Tools)
3. Check the **Extension Development Host** console for errors

---

**If you're still having issues, the extension should show a notification "KNOWCODE extension is now active! 🎉" when it successfully loads. If you don't see this, there's likely a compilation or configuration issue.** 