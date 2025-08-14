# 🚀 KNOWCODE Local Model Setup

## 🎯 **Overview**

KNOWCODE now supports **local model execution** using Ollama and CodeGemma, giving you:
- ✅ **No API keys required**
- ✅ **Offline functionality**
- ✅ **Privacy-first approach**
- ✅ **~2GB model download**

## 🔧 **First Run Setup**

When you first install KNOWCODE, you'll see this prompt:

```
🚀 Welcome to KNOWCODE!

Do you want to run locally with no API key? (~2GB model download)

This will:
• Install Ollama silently (with your permission)
• Download CodeGemma model locally
• Enable offline code explanations

Choose your setup:
🖥️ Local Mode (Recommended)
☁️ Cloud Mode (API Key Required)
⏭️ Skip for now
```

### **🖥️ Local Mode (Recommended)**
- **What happens**: Automatically installs Ollama and downloads CodeGemma
- **Download size**: ~2GB
- **Setup time**: 5-10 minutes (depending on internet speed)
- **Result**: Fully offline code explanations

### **☁️ Cloud Mode**
- **What happens**: Prompts for API key
- **Requirements**: Valid API key for cloud models
- **Result**: Uses cloud-based AI models

### **⏭️ Skip for now**
- **What happens**: Skips setup, can configure later
- **Result**: Extension works with limited functionality

## 📦 **What Gets Installed**

### **Ollama**
- **What**: Local model server
- **Size**: ~50MB
- **Platforms**: macOS, Linux, Windows (manual)
- **Installation**: Automatic via curl script

### **CodeGemma Model**
- **What**: Code-optimized language model
- **Size**: ~2GB
- **Model**: `codellama:7b-code`
- **Download**: Automatic via Ollama

## 🎮 **Using Local Mode**

### **Automatic Setup**
1. Choose "🖥️ Local Mode (Recommended)"
2. Wait for Ollama installation
3. Wait for model download
4. Start using KNOWCODE!

### **Manual Setup (if needed)**
```bash
# Install Ollama manually
curl -fsSL https://ollama.ai/install.sh | sh

# Download CodeGemma model
ollama pull codellama:7b-code

# Start Ollama
ollama serve
```

## 🔍 **Verification Commands**

### **Test Local Model**
- **Command**: `KNOWCODE: Test Local Model`
- **What it does**: Verifies Ollama and model are working
- **Expected**: "✅ Local model is working correctly!"

### **Show Model Info**
- **Command**: `KNOWCODE: Show Model Info`
- **What it shows**: Model name, size, and status
- **Example**: "Model: codellama:7b-code, Size: 3.8GB, Status: Ready"

### **Restart Ollama**
- **Command**: `KNOWCODE: Restart Ollama`
- **When to use**: If model stops responding
- **What it does**: Restarts the Ollama service

## ⚙️ **Configuration Settings**

### **Local Model Settings**
```json
{
  "knowcode.useLocalModel": true,
  "knowcode.localModelName": "codellama:7b-code",
  "knowcode.ollamaEndpoint": "http://localhost:11434"
}
```

### **Cloud Model Settings**
```json
{
  "knowcode.useLocalModel": false,
  "knowcode.cloudApiKey": "your-api-key-here"
}
```

## 🚨 **Troubleshooting**

### **Ollama Not Found**
**Error**: "Ollama is not running"
**Solution**:
```bash
# Start Ollama
ollama serve

# Or restart it
pkill ollama && ollama serve
```

### **Model Not Downloaded**
**Error**: "Model not found"
**Solution**:
```bash
# Download the model
ollama pull codellama:7b-code

# Check available models
ollama list
```

### **Permission Issues**
**Error**: "Permission denied"
**Solution**:
```bash
# Fix permissions
sudo chmod +x /usr/local/bin/ollama

# Or reinstall
curl -fsSL https://ollama.ai/install.sh | sh
```

### **Port Already in Use**
**Error**: "Port 11434 already in use"
**Solution**:
```bash
# Kill existing process
pkill ollama

# Start fresh
ollama serve
```

## 📊 **Performance**

### **Local Model Performance**
- **First response**: 2-5 seconds (model loading)
- **Subsequent responses**: 1-3 seconds
- **Memory usage**: ~4GB RAM
- **CPU usage**: Moderate (depends on hardware)

### **System Requirements**
- **RAM**: 8GB+ recommended
- **Storage**: 5GB+ free space
- **CPU**: Modern multi-core processor
- **OS**: macOS 10.15+, Linux, Windows 10+

## 🔄 **Switching Between Modes**

### **Local → Cloud**
1. Open VS Code settings
2. Set `knowcode.useLocalModel` to `false`
3. Add your API key to `knowcode.cloudApiKey`
4. Restart VS Code

### **Cloud → Local**
1. Open VS Code settings
2. Set `knowcode.useLocalModel` to `true`
3. Ensure Ollama is running
4. Restart VS Code

## 🎯 **MVP Features with Local Model**

All MVP features work with local model:

### **1. Explain Like I'm 5**
- **Command**: `Cmd+Shift+M` → Select "Explain Like I'm 5"
- **Uses**: Local CodeGemma model
- **Output**: Simple, child-friendly explanations

### **2. Learning Mode**
- **Command**: `Cmd+Shift+L`
- **Uses**: Local CodeGemma model
- **Output**: Step-by-step learning explanations

### **3. Generate Project Ideas**
- **Command**: `KNOWCODE: Generate Project Ideas`
- **Uses**: Local CodeGemma model
- **Output**: Project suggestions based on code

### **4. Interview Mode**
- **Command**: `Cmd+Shift+M` → Select "Interview Mode"
- **Uses**: Local CodeGemma model
- **Output**: Professional interview-style explanations

### **5. MCQ Generator**
- **Command**: `KNOWCODE: Generate MCQs`
- **Uses**: Local CodeGemma model
- **Output**: Multiple choice questions about code

## 🚀 **Getting Started**

1. **Install KNOWCODE** from VS Code marketplace
2. **Choose Local Mode** when prompted
3. **Wait for setup** (5-10 minutes)
4. **Test the extension** with `Cmd+Shift+M`
5. **Enjoy offline code explanations!**

## 📞 **Support**

If you encounter issues:

1. **Check Ollama status**: `KNOWCODE: Test Local Model`
2. **View model info**: `KNOWCODE: Show Model Info`
3. **Restart service**: `KNOWCODE: Restart Ollama`
4. **Open setup**: `KNOWCODE: Open Setup`

The local model setup provides a complete offline experience for code learning and understanding! 🎉
