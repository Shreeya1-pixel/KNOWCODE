#!/bin/bash

echo "🔧 Fixing VS Code Debug Configuration..."

# Compile the extension
echo "📦 Compiling extension..."
npm run compile

# Check if .vscode directory exists
if [ ! -d ".vscode" ]; then
    echo "📁 Creating .vscode directory..."
    mkdir -p .vscode
fi

# Verify launch.json exists
if [ -f ".vscode/launch.json" ]; then
    echo "✅ launch.json exists"
else
    echo "❌ launch.json missing"
fi

# Verify tasks.json exists
if [ -f ".vscode/tasks.json" ]; then
    echo "✅ tasks.json exists"
else
    echo "❌ tasks.json missing"
fi

# Open VS Code with the project
echo "🔧 Opening VS Code..."
code .

echo ""
echo "🎯 Now try these steps:"
echo "1. Press Cmd+Shift+P to open Command Palette"
echo "2. Type: 'Developer: Reload Window'"
echo "3. Press Enter"
echo "4. Wait for VS Code to reload"
echo "5. Press F5 - you should now see 'Run Extension' option"
echo ""
echo "If that doesn't work, try:"
echo "1. Cmd+Shift+P → 'Developer: Start Debugging'"
echo "2. Or Cmd+Shift+P → 'KNOWCODE: Open Tutorial'"
