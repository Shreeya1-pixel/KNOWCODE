# 🔍 Debugging KNOWCODE Extension - F5 Not Working

## 🚨 **Immediate Steps to Debug**

### **Step 1: Check if Extension Compiles**
```bash
# In terminal, run:
npm run compile
```
**Expected**: Should complete without errors
**If errors**: Fix compilation issues first

### **Step 2: Check VS Code Output**
1. Open VS Code with KNOWCODE project
2. Go to **View → Output** (or `Cmd+Shift+U`)
3. Select **"Extension Development Host"** from dropdown
4. Look for any error messages

### **Step 3: Check Debug Console**
1. Press `F5` in VS Code
2. Look at the **Debug Console** (bottom panel)
3. Check for any error messages or warnings

### **Step 4: Check Extension Host**
1. Press `Cmd+Shift+P` to open Command Palette
2. Type "Developer: Show Running Extensions"
3. Look for "knowcode" in the list
4. Check if it shows as "Activated" or has errors

### **Step 5: Check Extension Host Logs**
1. Press `Cmd+Shift+P`
2. Type "Developer: Open Process Explorer"
3. Look for Extension Host process
4. Check for any error messages

## 🔧 **Common Issues & Solutions**

### **Issue 1: Extension Not Activating**
**Symptoms**: No "KNOWCODE extension is now active!" message
**Solutions**:
1. Check `package.json` activation events
2. Verify `main` field points to correct file
3. Check for compilation errors

### **Issue 2: Extension Development Host Not Opening**
**Symptoms**: Pressing F5 does nothing
**Solutions**:
1. Check launch.json configuration
2. Verify workspace folder is open
3. Try restarting VS Code

### **Issue 3: Extension Host Crashes**
**Symptoms**: Extension Host process crashes
**Solutions**:
1. Check for syntax errors in TypeScript
2. Verify all imports are correct
3. Check for missing dependencies

### **Issue 4: Commands Not Registered**
**Symptoms**: Extension activates but commands don't work
**Solutions**:
1. Check command registration in extension.ts
2. Verify command IDs match package.json
3. Check for runtime errors

## 🎯 **Quick Diagnostic Commands**

```bash
# Check if files are compiled
ls -la out/
ls -la out/services/

# Check if main extension file exists
cat out/extension.js | head -20

# Check for TypeScript errors
npx tsc --noEmit

# Check if extension can be loaded
node -e "console.log(Object.keys(require('./out/extension.js')))"
```

## 📋 **What to Report**

If the extension still doesn't work, please report:

1. **What happens when you press F5?**
   - Does a new window open?
   - Do you see any error messages?

2. **What appears in the Debug Console?**
   - Any error messages?
   - Any warning messages?

3. **What appears in the Output panel?**
   - Extension Development Host messages
   - Any error logs?

4. **What appears in Process Explorer?**
   - Extension Host status
   - Any crash messages?

5. **What appears in Running Extensions?**
   - Is knowcode listed?
   - What's the status?

## 🚀 **Expected Behavior**

When you press F5:
1. ✅ A new VS Code window opens (Extension Development Host)
2. ✅ You see "KNOWCODE extension is now active! 🎉" message
3. ✅ Commands appear in Command Palette
4. ✅ Keybindings work
5. ✅ No errors in Debug Console

## 🆘 **If Still Not Working**

1. **Restart VS Code completely**
2. **Delete and recreate the project**
3. **Check VS Code version** (needs 1.85.0+)
4. **Check Node.js version** (needs 18+)
5. **Try a minimal test extension**

## 📞 **Getting Help**

Provide this information:
- VS Code version
- Node.js version
- Error messages from Debug Console
- Error messages from Output panel
- Screenshots of any error dialogs
