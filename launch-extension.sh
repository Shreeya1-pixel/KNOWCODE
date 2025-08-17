#!/bin/bash

echo "🚀 Launching KNOWCODE Extension..."

# Check if VS Code is installed
if ! command -v code &> /dev/null; then
    echo "❌ VS Code is not installed or not in PATH"
    exit 1
fi

# Check if Ollama is running
if ! curl -s http://localhost:11434/api/tags &> /dev/null; then
    echo "⚠️  Ollama is not running. Starting Ollama..."
    ollama serve &
    sleep 3
fi

# Compile the extension
echo "📦 Compiling extension..."
npm run compile

# Open VS Code with the project
echo "🔧 Opening VS Code with KNOWCODE project..."
code /Users/shreeyagupta/knowcode

echo "✅ KNOWCODE Extension is ready!"
echo ""
echo "📋 Next steps:"
echo "1. Press F5 (or Cmd+F5 on Mac) to launch the extension"
echo "2. A new VS Code window will open with KNOWCODE loaded"
echo "3. Open test-extension.js and select some code"
echo "4. Press Cmd+Shift+5 to see 'Explain Like I'm 5'"
echo "5. Or press Cmd+Shift+P and type 'KNOWCODE' for more options"
echo ""
echo "🎯 Test with this code:"
echo "function addNumbers(a, b) {"
echo "    return a + b;"
echo "}"
echo ""
echo "Select the function above and press Cmd+Shift+5!"
