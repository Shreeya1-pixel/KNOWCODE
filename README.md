# KNOWCODE - Interactive Code Learning Assistant

**"AI writes code, but who explains it?"** - KNOWCODE bridges the gap between AI-generated code and human understanding.

## Features

### 🎯 Core Features
- **Explain Like I'm 5** - Simple, analogy-based explanations
- **Learning Mode** - Step-by-step progressive learning
- **Interview Mode** - Technical analysis with complexity assessment
- **MCQ Generator** - Create multiple-choice questions
- **Project Generator** - Turn code into learning projects

### 🚀 Quick Start
1. **Install Ollama** (for local AI):
   ```bash
   curl -fsSL https://ollama.ai/install.sh | sh
   ollama pull llama3.1:8b-instruct
   ollama serve
   ```

2. **Install KNOWCODE Extension**:
   - Download the `.vsix` file
   - In VS Code: `Ctrl+Shift+P` → "Extensions: Install from VSIX"
   - Select the downloaded file

3. **Start Learning**:
   - Open any code file
   - Select some code
   - Press `Ctrl+Shift+5` for "Explain Like I'm 5"
   - Or use `Ctrl+Shift+P` and type "KNOWCODE"

## Keybindings

| Feature | Windows/Linux | Mac |
|---------|---------------|-----|
| Explain Like I'm 5 | `Ctrl+Shift+5` | `Cmd+Shift+5` |
| Learning Mode | `Ctrl+Shift+L` | `Cmd+Shift+L` |
| Interview Mode | `Ctrl+Shift+I` | `Cmd+Shift+I` |
| Open Panel | `Ctrl+Shift+P` | `Cmd+Shift+P` |

## How It Works

KNOWCODE uses local AI (Ollama) to provide:
- **Privacy** - Your code never leaves your machine
- **Speed** - No API calls, instant responses
- **Offline** - Works without internet
- **Structured** - JSON-formatted explanations

## Example Output

**Input Code:**
```javascript
const result = data.reduce((acc, curr) => 
  acc.concat(curr.filter(x => x.status === 'active')
    .map(x => ({ ...x, processed: true }))), []);
```

**Explain Like I'm 5 Output:**
```json
{
  "analogy": "It's like sorting toys, keeping the ones that work, and putting a sticker on them before placing them in one box.",
  "bullets": [
    "Looks through each group of items one by one.",
    "Keeps only items marked as active.",
    "Adds a 'processed: true' sticker to each kept item.",
    "Merges all kept items into a single list."
  ],
  "glossary": [
    {"term": "reduce", "meaning": "A way to go through a list and build one final result."},
    {"term": "filter", "meaning": "Keeps only items that meet a condition."},
    {"term": "map", "meaning": "Transforms each item into a new form."}
  ]
}
```

## Setup Options

### Local AI (Recommended)
- **Privacy-focused** - No data sent to external servers
- **Free** - No API costs
- **Fast** - Runs on your machine
- **Offline** - Works without internet

### Cloud AI (Optional)
- Get OpenAI API key
- Open VS Code Settings
- Search for "KNOWCODE"
- Enter your API key

## Use Cases

- **Code Reviews** - Understand complex code quickly
- **Learning** - Step-by-step explanations for beginners
- **Interviews** - Prepare for technical questions
- **Documentation** - Generate explanations for your code
- **Teaching** - Create educational content

## Requirements

- VS Code 1.85.0 or higher
- Node.js (for local AI)
- 4GB RAM (for local AI models)

## Installation

1. Download the `.vsix` file
2. Open VS Code
3. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
4. Type "Extensions: Install from VSIX"
5. Select the downloaded file
6. Restart VS Code

## Support

- **Documentation**: See the Tutorial panel in the extension
- **Issues**: Report bugs through VS Code's extension feedback
- **Features**: Request new features through the same channel

---

**KNOWCODE** - Making code understandable for everyone 
