# KNOWCODE Extension Demo

This guide demonstrates how to use the KNOWCODE extension to understand and explore code interactively.

## 🚀 Getting Started

1. **Open the Extension**: Press `F5` in VS Code to launch the extension in a new Extension Development Host window
2. **Open Sample File**: Open `sample.js` in the new window
3. **Start Exploring**: Use the commands below to explore the code

## 📋 Available Commands

### 1. Explain Selected Code
- **Shortcut**: `Ctrl+Shift+E` (Windows/Linux) or `Cmd+Shift+E` (Mac)
- **Action**: Select any code and press the shortcut
- **Result**: A beautiful explanation panel opens with:
  - Code summary
  - Detailed line-by-line explanation
  - Key concepts used
  - Complexity assessment
  - Usage examples

**Example**: Select the `calculateSum` function and press `Ctrl+Shift+E`

### 2. Explain Function at Cursor
- **Method**: Right-click and select "KNOWCODE: Explain Function"
- **Action**: Place cursor inside any function and use context menu
- **Result**: Explains the entire function with parameters, return type, and purpose

**Example**: Place cursor inside the `fetchUserData` function and right-click

### 3. Explain Variable at Cursor
- **Method**: Right-click and select "KNOWCODE: Explain Variable"
- **Action**: Place cursor on any variable declaration
- **Result**: Explains the variable's type, value, and usage

**Example**: Place cursor on `userName` variable and right-click

### 4. Show Diagram
- **Method**: Right-click and select "KNOWCODE: Show Diagram"
- **Action**: Select code and generate visual diagram
- **Result**: Creates flowcharts, class diagrams, or sequence diagrams

**Example**: Select the `User` class and generate a class diagram

### 5. Toggle Overlay Mode
- **Shortcut**: `Ctrl+Shift+O` (Windows/Linux) or `Cmd+Shift+O` (Mac)
- **Action**: Toggle persistent overlay mode
- **Result**: Visual indicators appear on code elements

## 🎯 Demo Scenarios

### Scenario 1: Understanding a Function
1. Open `sample.js`
2. Find the `processUserData` function (lines 58-85)
3. Select the entire function
4. Press `Ctrl+Shift+E`
5. Observe the explanation panel showing:
   - Function purpose
   - Control flow analysis
   - Complexity assessment
   - Key concepts (Loops, Conditional Logic)

### Scenario 2: Exploring a Class
1. Find the `User` class (lines 30-57)
2. Right-click and select "KNOWCODE: Show Diagram"
3. View the class diagram showing:
   - Class structure
   - Methods and properties
   - Relationships

### Scenario 3: Understanding Async Code
1. Find the `fetchUserData` function (lines 18-29)
2. Select it and press `Ctrl+Shift+E`
3. Notice the explanation highlights:
   - Async/await patterns
   - Error handling
   - Promise concepts

### Scenario 4: Variable Analysis
1. Find variable declarations (lines 4-6)
2. Place cursor on `userName` and right-click
3. Select "KNOWCODE: Explain Variable"
4. See explanation of:
   - Variable type (const)
   - Value assignment
   - Usage context

## 🎨 Visual Features

### Code Highlighting
- Selected code gets highlighted with a border
- Visual indicators (💡 for explanations, 📊 for diagrams)
- Color-coded complexity badges

### Explanation Panels
- Rich HTML formatting
- Syntax highlighting
- Responsive design
- Theme-aware styling

### Diagrams
- Mermaid.js integration
- Flowcharts for control flow
- Class diagrams for OOP code
- Sequence diagrams for async operations

## ⚙️ Configuration Options

Access settings via `Ctrl+,` (Windows/Linux) or `Cmd+,` (Mac):

```json
{
    "knowcode.enableOverlay": true,
    "knowcode.explanationStyle": "detailed",
    "knowcode.showDiagrams": true,
    "knowcode.autoExplain": false
}
```

## 🔧 Troubleshooting

### Extension Not Working?
1. Check if extension is activated (status bar shows "KNOWCODE")
2. Ensure you're in a supported language file
3. Try reloading the window (`Ctrl+Shift+P` → "Developer: Reload Window")

### No Explanations Appearing?
1. Check the Output panel for errors
2. Verify the selected code is valid
3. Try different code selections

### Diagrams Not Rendering?
1. Check internet connection (Mermaid.js loads from CDN)
2. Try refreshing the diagram panel
3. Check browser console for errors

## 🎯 Next Steps

1. **Try with Your Own Code**: Open any JavaScript/TypeScript file and explore
2. **Experiment with Different Languages**: Test with Python, Java, or other supported languages
3. **Customize Settings**: Adjust explanation style and overlay preferences
4. **Provide Feedback**: Report issues or suggest improvements

## 💡 Tips

- **Start Simple**: Begin with basic functions and variables
- **Use Context Menus**: Right-click for quick access to commands
- **Combine Features**: Use explanations and diagrams together
- **Explore Patterns**: Look for recurring code patterns in explanations
- **Learn Concepts**: Pay attention to the "Key Concepts" section

---

**Happy Coding with KNOWCODE!** 💡✨ 