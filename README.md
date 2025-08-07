# KNOWCODE - Interactive Code Learning Extension

KNOWCODE transforms your VS Code editor into an interactive learning environment that makes code readable, teachable, and explorable. Instead of static comments or passive documentation, it overlays real-time, context-aware explanations and diagrams directly on your code.

## 🚀 Features

### Real-time Code Explanations
- **Smart Code Analysis**: Automatically detects functions, variables, classes, and control flow structures
- **Context-Aware Explanations**: Provides explanations based on the specific code element you're examining
- **Multi-language Support**: Works with JavaScript, TypeScript, Python, Java, C++, C#, Go, Rust, PHP, and Ruby

### Interactive Visual Overlays
- **Live Code Highlighting**: Highlights explained code with visual indicators
- **Rich Explanation Panels**: Beautiful, structured explanations with complexity indicators
- **Concept Tagging**: Identifies and explains key programming concepts used in your code

### Visual Diagrams
- **Automatic Diagram Generation**: Creates flowcharts, class diagrams, and sequence diagrams
- **Mermaid Integration**: Uses Mermaid.js for professional-quality visualizations
- **Code Structure Visualization**: Shows relationships and flow between code elements

### Adaptive Interactivity
- **Click-to-Explain**: Click on any code element to get instant explanations
- **Hover Explanations**: Enable auto-explanations on hover for quick insights
- **Overlay Mode**: Toggle overlay mode for persistent visual learning

## 🎯 Use Cases

### For Learning
- **Code Comprehension**: Understand unfamiliar codebases quickly
- **Concept Discovery**: Learn new programming patterns and concepts
- **Visual Learning**: See code structure through diagrams and flowcharts

### For Teaching
- **Code Documentation**: Create interactive documentation for your code
- **Code Reviews**: Provide visual explanations during code reviews
- **Onboarding**: Help new team members understand codebases faster

### For Development
- **Code Exploration**: Explore complex code structures visually
- **Debugging Aid**: Understand code flow and relationships
- **Architecture Understanding**: Visualize class hierarchies and function relationships

## 📋 Commands

| Command | Shortcut | Description |
|---------|----------|-------------|
| `KNOWCODE: Explain Selection` | `Ctrl+Shift+E` | Explain selected code |
| `KNOWCODE: Explain Function` | Context Menu | Explain function at cursor |
| `KNOWCODE: Explain Variable` | Context Menu | Explain variable at cursor |
| `KNOWCODE: Show Diagram` | Context Menu | Generate diagram for selected code |
| `KNOWCODE: Toggle Overlay` | `Ctrl+Shift+O` | Toggle overlay mode |

## ⚙️ Configuration

### Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `knowcode.enableOverlay` | `true` | Enable real-time overlay explanations |
| `knowcode.explanationStyle` | `concise` | Style of explanations (concise, detailed, visual) |
| `knowcode.showDiagrams` | `true` | Show visual diagrams for code structures |
| `knowcode.autoExplain` | `false` | Automatically explain code on hover |

### Example Configuration

```json
{
    "knowcode.enableOverlay": true,
    "knowcode.explanationStyle": "detailed",
    "knowcode.showDiagrams": true,
    "knowcode.autoExplain": false
}
```

## 🛠️ Installation

### From Source

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Compile the extension:
   ```bash
   npm run compile
   ```
4. Press `F5` in VS Code to launch the extension in a new Extension Development Host window

### Development

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch for changes
npm run watch

# Run tests
npm test

# Lint code
npm run lint
```

## 🎨 How It Works

### Architecture

KNOWCODE is built with a modular architecture consisting of four core services:

1. **CodeExplainer**: Analyzes code and generates intelligent explanations
2. **OverlayManager**: Manages visual overlays and UI interactions
3. **DiagramGenerator**: Creates visual diagrams using Mermaid.js
4. **ContextAnalyzer**: Analyzes code context and finds code elements

### Code Analysis Process

1. **Pattern Recognition**: Uses regex patterns to identify code structures
2. **Context Analysis**: Determines the type and scope of code elements
3. **Explanation Generation**: Creates structured explanations with complexity assessment
4. **Visual Rendering**: Generates overlays and diagrams for display

### Supported Languages

- **JavaScript/TypeScript**: Functions, classes, variables, async/await, Promises
- **Python**: Functions, classes, imports, context managers, async functions
- **Java**: Classes, methods, variables, interfaces, inheritance
- **C/C++**: Functions, classes, variables, control structures
- **C#**: Classes, methods, properties, LINQ
- **Go**: Functions, structs, interfaces, goroutines
- **Rust**: Functions, structs, traits, ownership patterns
- **PHP**: Functions, classes, variables, namespaces
- **Ruby**: Methods, classes, variables, blocks

## 🔧 Extension API

### Activation Events

The extension activates on:
- Language-specific files (JavaScript, TypeScript, Python, etc.)
- Command execution
- Editor focus

### Commands

All commands are registered in the `package.json` and implemented in `src/extension.ts`.

### Webview Panels

KNOWCODE uses VS Code's webview API to display rich explanations and diagrams with:
- Custom HTML/CSS styling
- Mermaid.js integration for diagrams
- Responsive design that adapts to VS Code themes

## 🎯 Roadmap

### Phase 1: Core Features ✅
- [x] Basic code explanation
- [x] Visual overlays
- [x] Diagram generation
- [x] Multi-language support

### Phase 2: Enhanced Intelligence
- [ ] AI-powered explanations
- [ ] Code pattern recognition
- [ ] Learning path suggestions
- [ ] Performance optimization

### Phase 3: Advanced Features
- [ ] Code refactoring suggestions
- [ ] Interactive tutorials
- [ ] Team collaboration features
- [ ] Integration with external APIs

### Phase 4: Platform Expansion
- [ ] Cursor integration
- [ ] Web-based version
- [ ] Mobile companion app
- [ ] Enterprise features

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Add JSDoc comments for public APIs
- Write unit tests for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- VS Code Extension API for the powerful extension platform
- Mermaid.js for beautiful diagram generation
- The open-source community for inspiration and tools

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-org/knowcode/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/knowcode/discussions)
- **Documentation**: [Wiki](https://github.com/your-org/knowcode/wiki)

---

**KNOWCODE** - Making code readable, teachable, and explorable. 💡 