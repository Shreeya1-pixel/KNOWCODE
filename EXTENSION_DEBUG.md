# 🔧 Extension Not Opening - Debug Guide

## 🚨 **Problem**: Extension Development Host Not Opening

### **Step 1: Check VS Code Setup**

#### **1.1 Verify VS Code Installation**
```bash
# Check if VS Code is installed
code --version
# Should show version like: 1.85.0 or higher
```

#### **1.2 Check Extension Development Tools**
1. **Open VS Code**
2. **Go to Extensions** (`Cmd+Shift+X`)
3. **Search for**: "Extension Development Host"
4. **Make sure it's installed** (should be built-in)

### **Step 2: Check Project Structure**

#### **2.1 Verify Required Files**
```bash
# Check if these files exist:
ls -la package.json
ls -la .vscode/launch.json
ls -la out/extension.js
```

#### **2.2 Expected Structure**
```
knowcode/
├── package.json          ✅ Required
├── .vscode/
│   └── launch.json       ✅ Required
├── out/
│   └── extension.js      ✅ Required (compiled)
└── src/
    └── extension.ts      ✅ Source file
```

### **Step 3: Compilation Check**

#### **3.1 Recompile Extension**
```bash
# Clean and recompile
rm -rf out/
npm run compile
```

#### **3.2 Check for Compilation Errors**
```bash
# Look for any TypeScript errors
npx tsc --noEmit
```

### **Step 4: Launch Extension**

#### **4.1 Method 1: F5 Key**
1. **Open VS Code** in the knowcode folder
2. **Press F5** (should open Extension Development Host)
3. **Look for**: New VS Code window with "Extension Development Host" in title

#### **4.2 Method 2: Command Palette**
1. **Press `Cmd+Shift+P`**
2. **Type**: "Developer: Reload Window"
3. **Press F5** again

#### **4.3 Method 3: Manual Launch**
1. **Press `Cmd+Shift+P`**
2. **Type**: "Developer: Open Extension Development Host"
3. **Select the command**

### **Step 5: Check Activation**

#### **5.1 Look for Activation Message**
When extension loads, you should see:
- **Notification**: "KNOWCODE extension is now active! 🎉"
- **Console message**: "KNOWCODE extension is now active!"

#### **5.2 Check Output Panel**
1. **View → Output**
2. **Select "KNOWCODE"** from dropdown
3. **Look for activation messages**

### **Step 6: Test Commands**

#### **6.1 Check Command Palette**
1. **Press `Cmd+Shift+P`**
2. **Type**: "KNOWCODE"
3. **Should see all KNOWCODE commands**

#### **6.2 Test Basic Command**
1. **Create a new file** (e.g., `test.js`)
2. **Add some code**:
```javascript
function test() {
    return "hello";
}
```
3. **Press `Cmd+Shift+P`**
4. **Type**: "KNOWCODE: Explain Selection"
5. **Select some code and run command**

### **Step 7: Common Issues & Fixes**

#### **Issue 1: "Extension Development Host" not opening**
**Fix**:
```bash
# Close VS Code completely
# Reopen VS Code in the knowcode folder
# Press F5
```

#### **Issue 2: No activation message**
**Fix**:
1. **Check package.json activationEvents**
2. **Make sure you have a supported file open** (JS, TS, Python, etc.)
3. **Try opening a JavaScript file**

#### **Issue 3: Commands not appearing**
**Fix**:
1. **Check package.json commands section**
2. **Reload window**: `Cmd+Shift+P` → "Developer: Reload Window"
3. **Restart VS Code**

#### **Issue 4: TypeScript compilation errors**
**Fix**:
```bash
# Check for errors
npm run compile

# If errors exist, fix them first
# Then recompile
```

### **Step 8: Advanced Debugging**

#### **8.1 Check Extension Host Logs**
1. **Help → Toggle Developer Tools**
2. **Go to Console tab**
3. **Look for errors**

#### **8.2 Check Extension Output**
1. **View → Output**
2. **Select "Extension Host"**
3. **Look for KNOWCODE-related messages**

#### **8.3 Manual Extension Loading**
```bash
# Check if extension.js is valid
node -c out/extension.js
# Should not show any errors
```

### **Step 9: Reset Everything**

#### **9.1 Complete Reset**
```bash
# Clean everything
rm -rf out/
rm -rf node_modules/
npm install
npm run compile
```

#### **9.2 Restart VS Code**
1. **Close VS Code completely**
2. **Reopen in knowcode folder**
3. **Press F5**

### **Step 10: Verify Success**

#### **10.1 Success Indicators**
- ✅ **Extension Development Host opens**
- ✅ **"KNOWCODE extension is now active! 🎉" message**
- ✅ **Commands appear in Command Palette**
- ✅ **No errors in Console**

#### **10.2 Test KNOWCODE Panel**
1. **Press `Cmd+Shift+P`**
2. **Type**: "KNOWCODE: Open Panel"
3. **Panel should open with buttons**

## 🆘 **Still Not Working?**

If the extension still won't open, please provide:

1. **VS Code version**: `code --version`
2. **Error messages** from Console
3. **What happens when you press F5**
4. **Screenshot** of any error dialogs

## 🎯 **Expected Behavior**

When working correctly:
1. **Press F5** → New VS Code window opens
2. **Window title** shows "Extension Development Host"
3. **Notification** appears: "KNOWCODE extension is now active! 🎉"
4. **Commands** work in Command Palette
5. **KNOWCODE panel** opens with all features

**Try these steps and let me know what happens!** 🚀
