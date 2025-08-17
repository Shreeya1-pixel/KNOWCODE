# KNOWCODE - Interactive Code Learning Assistant

**"AI writes code, but who explains it?"** - KNOWCODE bridges the gap between AI-generated code and human understanding.

## Features

### 🎯 Core Features
- **Explain Like I'm 5** - Simple, analogy-based explanations with visual diagrams
- **Learning Mode** - Step-by-step progressive learning with flowcharts
- **Interview Mode** - Technical analysis with complexity assessment and algorithm diagrams
- **MCQ Generator** - Create multiple-choice questions
- **Project Generator** - Turn code into learning projects

### 🚀 Quick Start
1. **Install KNOWCODE Extension**:
   - Download the `.vsix` file
   - In VS Code: `Ctrl+Shift+P` → "Extensions: Install from VSIX"
   - Select the downloaded file

2. **Automatic Setup**:
   - KNOWCODE will automatically detect if Ollama is needed
   - Click "Install Ollama" when prompted for one-click installation
   - The AI model will be downloaded automatically (~4GB)

3. **Start Learning**:
   - Open any code file
   - **Select 5-20 lines of code** (this is important for best results!)
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
- **Structured** - JSON-formatted explanations with Mermaid diagrams
- **Automatic Setup** - One-click Ollama installation and model download

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
  ],
  "mermaidDiagram": "flowchart TD\n    A[Start with data] --> B[Filter active items]\n    B --> C[Add processed sticker]\n    C --> D[Merge into one list]\n    D --> E[Return result]"
}
```

## Setup Options

### 🎯 **Automatic Setup (Recommended)**
- **One-click installation** - KNOWCODE handles everything
- **Cross-platform** - Works on Windows, macOS, and Linux
- **Smart detection** - Automatically detects if Ollama is needed
- **Model download** - Downloads the AI model automatically

### 🔧 **Manual Setup (Alternative)**
If you prefer manual installation:

1. **Install Ollama**:
   ```bash
   # macOS/Linux
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # Windows
   # Download from https://ollama.ai/download
   ```

2. **Download Model**:
   ```bash
   ollama pull llama2:7b-chat
   ```

3. **Start Ollama**:
   ```bash
   ollama serve
   ```

### ☁️ **Cloud AI (Optional)**
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
- 4GB RAM (for local AI models)
- Internet connection (for initial setup only)

## Installation

1. Download the `.vsix` file
2. Open VS Code
3. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
4. Type "Extensions: Install from VSIX"
5. Select the downloaded file
6. Restart VS Code
7. **KNOWCODE will automatically guide you through setup!**

## Commands

| Command | Description |
|---------|-------------|
| `KNOWCODE: Explain Like I'm 5` | Simple explanations with analogies |
| `KNOWCODE: Learning Mode` | Step-by-step learning |
| `KNOWCODE: Interview Mode` | Technical analysis |
| `KNOWCODE: Generate MCQs` | Create quiz questions |
| `KNOWCODE: Generate Project` | Turn code into projects |
| `KNOWCODE: Setup Ollama` | Manual Ollama installation |
| `KNOWCODE: Open Tutorial` | Built-in usage guide |
| `KNOWCODE: Open Panel` | Quick access panel |

## Support

- **Documentation**: See the Tutorial panel in the extension
- **Issues**: Report bugs through VS Code's extension feedback
- **Features**: Request new features through the same channel

---

**KNOWCODE** - Making code understandable for everyone 
