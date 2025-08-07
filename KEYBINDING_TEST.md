# KNOWCODE Keybinding Test Guide

## 🚨 Testing Keybindings

### Step 1: Verify Extension is Active
1. **Press F5** to open Extension Development Host
2. **Look for notification**: "KNOWCODE extension is now active! 🎉"
3. **Check status bar**: Should see "KNOWCODE" on the right

### Step 2: Test Commands via Command Palette
1. **Press Ctrl+Shift+P** (or Cmd+Shift+P on Mac)
2. **Type "KNOWCODE"** - you should see all commands:
   - KNOWCODE: Explain Selection
   - KNOWCODE: Explain with Mode
   - KNOWCODE: Toggle Learning Mode
   - KNOWCODE: Generate MCQs
   - etc.

### Step 3: Test Keybindings
1. **Open sample.js** in the Extension Development Host window
2. **Select some code** (e.g., the `calculateSum` function)
3. **Test each keybinding**:

#### Test 1: Ctrl+Shift+E (Basic Explanation)
- **Should show**: "KNOWCODE: explainSelection command triggered"
- **Result**: Explanation panel opens

#### Test 2: Ctrl+Shift+M (Multiple Modes)
- **Should show**: "KNOWCODE: explainWithMode command triggered"
- **Result**: Mode selection menu appears

#### Test 3: Ctrl+Shift+L (Learning Mode)
- **Should show**: "KNOWCODE: toggleLearningMode command triggered"
- **Result**: Learning mode toggles on/off

#### Test 4: Ctrl+Shift+O (Overlay Mode)
- **Should show**: Overlay mode toggles

### Step 4: Check for Conflicts
1. **Ctrl+Shift+P → "Preferences: Open Keyboard Shortcuts"**
2. **Search for "ctrl+shift+m"** - check for conflicts
3. **Search for "ctrl+shift+l"** - check for conflicts

## 🔧 Troubleshooting

### Issue 1: "Command not found"
**Solution:**
1. Make sure you're in the **Extension Development Host** window
2. Check that the extension activated (look for the notification)
3. Try **Ctrl+Shift+P → "Developer: Reload Window"**

### Issue 2: "Keybinding not working"
**Solution:**
1. **Check for conflicts** in Keyboard Shortcuts
2. **Try the command palette** instead of keybinding
3. **Check the Output panel** for errors

### Issue 3: "No notification appears"
**Solution:**
1. The extension might not be active
2. Check the **Output panel** (View → Output → KNOWCODE)
3. Look for activation messages or errors

## 🎯 Alternative Testing Methods

### Method 1: Command Palette Only
1. **Ctrl+Shift+P → "KNOWCODE: Explain with Mode"**
2. **Ctrl+Shift+P → "KNOWCODE: Toggle Learning Mode"**
3. This bypasses keybinding issues

### Method 2: Context Menu
1. **Right-click** on selected code
2. **Look for "KNOWCODE"** section
3. **Click commands** directly

### Method 3: Status Bar
1. **Click "KNOWCODE"** in the status bar
2. **This should toggle** overlay mode

## 📊 Expected Behavior

### When Keybindings Work:
- **Ctrl+Shift+E**: Shows explanation panel
- **Ctrl+Shift+M**: Shows mode selection menu
- **Ctrl+Shift+L**: Toggles learning mode with notification
- **Ctrl+Shift+O**: Toggles overlay mode

### Debug Messages:
- You should see notifications when commands are triggered
- Check the **Output panel** for console logs
- Look for any error messages

## 🚀 Quick Fix

If keybindings still don't work:

1. **Use Command Palette**: Ctrl+Shift+P → "KNOWCODE: [command]"
2. **Check Output Panel**: View → Output → KNOWCODE
3. **Reload Extension**: Ctrl+Shift+P → "Developer: Reload Window"
4. **Restart VS Code**: Close and reopen completely

---

**The keybindings should work once the extension is properly loaded. If they don't, use the command palette as a workaround.** 