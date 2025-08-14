# 🔧 Custom API Setup Guide

## 🎯 **How to Add Your Own API to KNOWCODE**

### **Method 1: Using API Key Manager (Easiest)**
1. **Press `Cmd+Shift+P`** → "KNOWCODE: Manage API Keys"
2. **Enter your custom API key** in the "Custom API Key" field
3. **Configure your endpoint** in VS Code settings (see Method 2)

### **Method 2: Using VS Code Settings (Recommended)**
1. **Press `Cmd+,`** (Open Settings)
2. **Search for "knowcode"**
3. **Configure these settings**:

```json
{
  "knowcode.customAPIEndpoint": "https://your-api.com/v1/chat",
  "knowcode.customAPIHeaders": "{\"X-API-Key\": \"your-api-key\", \"Content-Type\": \"application/json\"}"
}
```

## 🔗 **Custom API Requirements**

### **Expected Request Format**
Your API should accept POST requests with this JSON body:

```json
{
  "prompt": "Explain this code to me as if I'm a 5-year-old...",
  "code": "function add(a, b) { return a + b; }",
  "context": "JavaScript function in main.js",
  "mode": "explain5"
}
```

### **Expected Response Format**
Your API should return JSON with one of these formats:

**Option 1:**
```json
{
  "content": "This code is like a magic calculator..."
}
```

**Option 2:**
```json
{
  "text": "This code is like a magic calculator..."
}
```

**Option 3:**
```json
{
  "response": "This code is like a magic calculator..."
}
```

**Option 4:**
```json
{
  "message": "This code is like a magic calculator..."
}
```

**Option 5:**
```json
"This code is like a magic calculator..."
```

## 🚀 **Example Custom API Implementations**

### **Example 1: Simple Flask API**
```python
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/v1/chat', methods=['POST'])
def chat():
    data = request.json
    prompt = data.get('prompt', '')
    code = data.get('code', '')
    mode = data.get('mode', 'default')
    
    # Your AI logic here
    response = your_ai_function(prompt, code, mode)
    
    return jsonify({
        "content": response
    })

if __name__ == '__main__':
    app.run(debug=True)
```

### **Example 2: Node.js Express API**
```javascript
const express = require('express');
const app = express();

app.use(express.json());

app.post('/v1/chat', async (req, res) => {
    const { prompt, code, context, mode } = req.body;
    
    // Your AI logic here
    const response = await yourAIFunction(prompt, code, mode);
    
    res.json({
        content: response
    });
});

app.listen(3000, () => {
    console.log('Custom API running on port 3000');
});
```

### **Example 3: Using Hugging Face Inference API**
```python
import requests
import json

def huggingface_api(prompt, code, mode):
    API_URL = "https://api-inference.huggingface.co/models/your-model"
    headers = {"Authorization": "Bearer your-huggingface-token"}
    
    payload = {
        "inputs": f"{prompt}\n\nCode:\n{code}",
        "parameters": {
            "max_length": 500,
            "temperature": 0.7
        }
    }
    
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()[0]["generated_text"]

# Use this in your Flask/Express API
```

## ⚙️ **Configuration Examples**

### **For Hugging Face API**
```json
{
  "knowcode.customAPIEndpoint": "https://api-inference.huggingface.co/models/your-model",
  "knowcode.customAPIHeaders": "{\"Authorization\": \"Bearer your-token\"}"
}
```

### **For Local API**
```json
{
  "knowcode.customAPIEndpoint": "http://localhost:3000/v1/chat",
  "knowcode.customAPIHeaders": "{\"X-API-Key\": \"your-local-key\"}"
}
```

### **For Cloud API with Custom Headers**
```json
{
  "knowcode.customAPIEndpoint": "https://your-api.com/v1/chat",
  "knowcode.customAPIHeaders": "{\"X-API-Key\": \"your-key\", \"X-User-ID\": \"123\", \"Content-Type\": \"application/json\"}"
}
```

## 🔍 **Testing Your Custom API**

### **Step 1: Test API Directly**
```bash
curl -X POST https://your-api.com/v1/chat \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-key" \
  -d '{
    "prompt": "Explain this code to me as if I am a 5-year-old",
    "code": "function add(a, b) { return a + b; }",
    "context": "JavaScript function",
    "mode": "explain5"
  }'
```

### **Step 2: Test in KNOWCODE**
1. **Configure your API** in VS Code settings
2. **Add your API key** via "KNOWCODE: Manage API Keys"
3. **Set AI preference** to "Cloud API" via "KNOWCODE: Set AI Preference"
4. **Test "Explain like I'm 5"** with any code

## 🎯 **Troubleshooting**

### **Common Issues**

**Issue**: "Custom API endpoint not configured"
**Solution**: Set `knowcode.customAPIEndpoint` in VS Code settings

**Issue**: "Custom API error: 401 Unauthorized"
**Solution**: Check your API key and headers configuration

**Issue**: "Custom API error: 404 Not Found"
**Solution**: Verify your endpoint URL is correct

**Issue**: "Invalid response format"
**Solution**: Ensure your API returns JSON with `content`, `text`, `response`, or `message` field

### **Debug Steps**
1. **Test API directly** with curl/Postman
2. **Check VS Code settings** for correct configuration
3. **Use "KNOWCODE: Test AI Connections"** to verify setup
4. **Check browser console** for detailed error messages

## 🎉 **Ready to Use!**

Once configured, your custom API will be automatically used when:
- **API keys are configured** and AI preference is set to "Cloud API"
- **Local Ollama is not available** and custom API is configured
- **You explicitly choose** cloud API as your preference

**Your custom API will work seamlessly with all KNOWCODE features, including "Explain like I'm 5"!** 🚀✨
