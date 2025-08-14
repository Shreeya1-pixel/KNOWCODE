# 🐛 KNOWCODE Extension Debugging Guide

## Current Issues Identified

### 1. **TypeScript Version Compatibility**
- **Issue**: Using TypeScript 5.9.2, but ESLint supports up to 5.4.0
- **Impact**: May cause compilation issues
- **Solution**: Downgrade TypeScript or update ESLint

### 2. **ESLint Warnings (48 warnings)**
- **Issue**: Missing curly braces in if statements
- **Impact**: Code style issues, but shouldn't prevent functionality
- **Solution**: Fix linting issues

### 3. **Extension Activation Issues**
- **Issue**: Extension may not be activating properly
- **Impact**: Commands won't work
- **Solution**: Check activation events and debug logs

## 🔧 Step-by-Step Debugging

### Step 1: Check Extension Activation
1. Open VS Code
2. Open the Command Palette (`Cmd+Shift+P`)
3. Type "Developer: Show Running Extensions"
4. Look for "knowcode" in the list
5. Check if it shows as "Activated"

### Step 2: Check Extension Host Logs
1. Open Command Palette (`Cmd+Shift+P`)
2. Type "Developer: Open Process Explorer"
3. Look for any errors in the Extension Host

### Step 3: Test Basic Commands
1. Open `sample.js` file
2. Select some code
3. Try these commands:
   - `Cmd+Shift+P` → "KNOWCODE: Explain Selection"
   - `Cmd+Shift+M` → Should trigger explain with mode
   - `Cmd+Shift+L` → Should toggle learning mode

### Step 4: Check Console Output
1. Open Developer Tools (`Cmd+Option+I`)
2. Go to Console tab
3. Look for KNOWCODE-related messages
4. Check for any error messages

### Step 5: Verify File Structure
```bash
# Check if all files are compiled
ls -la out/
ls -la out/services/

# Check if main extension file exists
cat out/extension.js | head -20
```

### Step 6: Test Extension in Extension Development Host
1. Press `F5` in VS Code
2. This opens a new VS Code window with your extension
3. You should see: "KNOWCODE extension is now active! 🎉"
4. If not, check the Debug Console for errors

## 🚨 Common Issues & Solutions

### Issue 1: Extension Not Activating
**Symptoms**: No "KNOWCODE extension is now active!" message
**Solutions**:
- Check `package.json` activation events
- Verify `main` field points to correct file
- Check for compilation errors

### Issue 2: Commands Not Working
**Symptoms**: Commands don't appear or don't execute
**Solutions**:
- Verify command registration in `extension.ts`
- Check command IDs match `package.json`
- Test in Extension Development Host

### Issue 3: Keybindings Not Working
**Symptoms**: `Cmd+Shift+M` and `Cmd+Shift+L` don't work
**Solutions**:
- Check for keybinding conflicts
- Verify keybinding definitions in `package.json`
- Test commands via Command Palette first

### Issue 4: Services Not Loading
**Symptoms**: Extension activates but features don't work
**Solutions**:
- Check service imports
- Verify service files are compiled
- Check for runtime errors

## 🔍 Debugging Commands

```bash
# Recompile the extension
npm run compile

# Check for TypeScript errors
npx tsc --noEmit

# Run linting with fixes
npm run lint -- --fix

# Check extension structure
find out/ -name "*.js" | head -10

# Test extension loading
node -e "console.log(require('./out/extension.js'))"
```

## 📋 Testing Checklist

- [ ] Extension activates (shows welcome message)
- [ ] Commands appear in Command Palette
- [ ] Keybindings work (`Cmd+Shift+M`, `Cmd+Shift+L`)
- [ ] Right-click context menu shows KNOWCODE options
- [ ] Code selection triggers explanations
- [ ] No errors in Developer Console
- [ ] All services load without errors

## 🆘 If Still Not Working

1. **Check VS Code Version**: Ensure you're using VS Code 1.85.0+
2. **Clear Extension Cache**: Delete `~/.vscode/extensions` and reinstall
3. **Check Node.js Version**: Ensure you're using Node.js 18+
4. **Reinstall Dependencies**: `rm -rf node_modules && npm install`
5. **Create Minimal Test**: Create a simple test extension to verify setup

## 📞 Getting Help

If the extension still doesn't work:
1. Check the Debug Console for specific error messages
2. Look at the Extension Host logs
3. Test with a minimal code sample
4. Verify all dependencies are installed correctly
