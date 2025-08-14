# 🚀 VS Code Installation & Extension Setup Guide

## 🚨 **Problem**: VS Code Not Installed

You need to install Visual Studio Code to run the KNOWCODE extension.

## 📥 **Step 1: Install VS Code**

### **Option A: Download from Official Website (Recommended)**
1. **Go to**: https://code.visualstudio.com/
2. **Click**: "Download for Mac"
3. **Download**: The `.zip` file for macOS
4. **Extract**: The downloaded file
5. **Move**: `Visual Studio Code.app` to your Applications folder
6. **Open**: VS Code from Applications

### **Option B: Install via Homebrew**
```bash
# Install Homebrew first (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install VS Code
brew install --cask visual-studio-code
```

### **Option C: Install via Mac App Store**
1. **Open**: Mac App Store
2. **Search**: "Visual Studio Code"
3. **Click**: "Get" or "Install"
4. **Wait**: For installation to complete

## 🔧 **Step 2: Verify Installation**

### **Check VS Code Installation**
```bash
# After installation, try:
code --version
# Should show version like: 1.85.0 or higher
```

### **If `code` command doesn't work**
1. **Open VS Code**
2. **Press**: `Cmd+Shift+P`
3. **Type**: "Shell Command: Install 'code' command in PATH"
4. **Click**: The command
5. **Restart**: Terminal
6. **Try again**: `code --version`

## 🎯 **Step 3: Open KNOWCODE Project**

### **Method 1: From Terminal**
```bash
# Navigate to your project
cd /Users/shreeyagupta/knowcode

# Open VS Code with the project
code .
```

### **Method 2: From VS Code**
1. **Open VS Code**
2. **File → Open Folder**
3. **Navigate to**: `/Users/shreeyagupta/knowcode`
4. **Click**: "Open"

## 🚀 **Step 4: Launch Extension**

### **Compile Extension**
```bash
# In VS Code terminal or system terminal:
npm run compile
```

### **Launch Extension Development Host**
1. **In VS Code**: Press `F5`
2. **Wait**: New VS Code window opens with "Extension Development Host" in title
3. **Look for**: "KNOWCODE extension is now active! 🎉" notification

## 🎉 **Step 5: Test KNOWCODE Features**

### **Open KNOWCODE Panel**
1. **Press**: `Cmd+Shift+P`
2. **Type**: "KNOWCODE: Open Panel"
3. **Click**: The command

### **Test Explain Like I'm 5**
1. **Create a new file** (e.g., `test.js`)
2. **Add code**:
```javascript
function add(a, b) {
    return a + b;
}
```
3. **Click**: "👶 Explain like I'm 5" button
4. **Wait**: 10-30 seconds for AI response

## 🔍 **Step 6: Troubleshooting**

### **If VS Code doesn't open**
1. **Check**: Applications folder for "Visual Studio Code.app"
2. **Try**: Right-click → Open (first time)
3. **Check**: System Preferences → Security & Privacy → Allow VS Code

### **If extension doesn't activate**
1. **Check**: VS Code console for errors
2. **Try**: `Cmd+Shift+P` → "Developer: Reload Window"
3. **Check**: Output panel → KNOWCODE for messages

### **If commands don't appear**
1. **Check**: Command Palette (`Cmd+Shift+P`)
2. **Type**: "KNOWCODE" - should show all commands
3. **Try**: Reload window

## 📋 **System Requirements**

### **Minimum Requirements**
- **macOS**: 10.15 (Catalina) or later
- **RAM**: 4 GB (8 GB recommended)
- **Storage**: 1 GB free space
- **Node.js**: 16.x or later (already installed)

### **Recommended**
- **macOS**: 12.0 (Monterey) or later
- **RAM**: 8 GB or more
- **Storage**: 2 GB free space

## 🎯 **Expected Results**

After successful installation:
- ✅ **VS Code opens** and loads the KNOWCODE project
- ✅ **Extension compiles** without errors
- ✅ **F5 launches** Extension Development Host
- ✅ **"KNOWCODE extension is now active! 🎉"** message appears
- ✅ **Commands work** in Command Palette
- ✅ **KNOWCODE panel** opens with all features
- ✅ **"Explain like I'm 5"** connects to local AI model

## 🆘 **Still Having Issues?**

If you encounter problems:

1. **VS Code installation issues**: Try downloading from official website
2. **Extension not loading**: Check console for error messages
3. **Commands not working**: Reload window and try again
4. **AI not responding**: Check if Ollama is running (`ollama list`)

## 🚀 **Ready to Start!**

Once VS Code is installed:
1. **Open the KNOWCODE project**
2. **Press F5** to launch extension
3. **Test the "Explain like I'm 5" feature**
4. **Enjoy your AI-powered code explanations!** ✨

**Let me know once you have VS Code installed and I'll help you get the extension running!** 🎉
