# 🔧 Ollama Installation Troubleshooting

## 🚨 **Common Installation Issues**

### **Issue 1: "Command failed: curl -fsSL https://ollama.ai/install.sh | sh"**

This error usually occurs due to:
- Network connectivity issues
- Firewall blocking the download
- Permission problems
- DNS resolution issues

#### **Quick Fixes:**

**1. Check Network Connection**
```bash
# Test if you can reach ollama.ai
curl -I https://ollama.ai

# Test DNS resolution
nslookup ollama.ai
```

**2. Try Alternative Installation Methods**

**For macOS:**
```bash
# Method 1: Homebrew (if you have it)
brew install ollama

# Method 2: Manual download
curl -fsSL https://ollama.ai/install.sh -o install.sh
chmod +x install.sh
./install.sh
rm install.sh

# Method 3: Direct download
curl -L https://ollama.ai/download/ollama-darwin-amd64 -o ollama
chmod +x ollama
sudo mv ollama /usr/local/bin/
```

**For Linux:**
```bash
# Method 1: Using wget
wget -qO- https://ollama.ai/install.sh | sh

# Method 2: Manual download
curl -fsSL https://ollama.ai/install.sh -o install.sh
chmod +x install.sh
./install.sh
rm install.sh
```

**3. Check Permissions**
```bash
# Make sure you have write permissions
ls -la /usr/local/bin/

# If needed, fix permissions
sudo chown $(whoami) /usr/local/bin/
```

**4. Bypass Firewall/Proxy**
```bash
# If behind corporate firewall, try:
curl --proxy your-proxy:port -fsSL https://ollama.ai/install.sh | sh
```

### **Issue 2: "Permission denied"**

**Solution:**
```bash
# Fix permissions
sudo chmod +x /usr/local/bin/ollama

# Or reinstall with proper permissions
sudo rm /usr/local/bin/ollama
curl -fsSL https://ollama.ai/install.sh | sh
```

### **Issue 3: "Port 11434 already in use"**

**Solution:**
```bash
# Find what's using the port
lsof -i :11434

# Kill the process
sudo pkill ollama

# Or kill by PID
sudo kill -9 <PID>
```

### **Issue 4: "Model not found"**

**Solution:**
```bash
# Check if Ollama is running
ollama list

# If not running, start it
ollama serve

# Download the model
ollama pull codellama:7b-code

# Test the model
ollama run codellama:7b-code "Hello"
```

## 🛠️ **Manual Installation Steps**

### **macOS Manual Installation**

**Step 1: Download Ollama**
```bash
# Create a temporary directory
mkdir ~/ollama-install
cd ~/ollama-install

# Download the binary
curl -L https://ollama.ai/download/ollama-darwin-amd64 -o ollama

# Make it executable
chmod +x ollama

# Move to system path
sudo mv ollama /usr/local/bin/

# Clean up
cd ~
rm -rf ~/ollama-install
```

**Step 2: Start Ollama**
```bash
# Start the service
ollama serve
```

**Step 3: Download Model**
```bash
# In a new terminal
ollama pull codellama:7b-code
```

### **Linux Manual Installation**

**Step 1: Download Ollama**
```bash
# Create a temporary directory
mkdir ~/ollama-install
cd ~/ollama-install

# Download the binary
curl -L https://ollama.ai/download/ollama-linux-amd64 -o ollama

# Make it executable
chmod +x ollama

# Move to system path
sudo mv ollama /usr/local/bin/

# Clean up
cd ~
rm -rf ~/ollama-install
```

**Step 2: Start Ollama**
```bash
# Start the service
ollama serve
```

**Step 3: Download Model**
```bash
# In a new terminal
ollama pull codellama:7b-code
```

## 🔍 **Verification Steps**

After installation, verify everything works:

```bash
# 1. Check Ollama version
ollama --version

# 2. Check if service is running
ollama list

# 3. Test with a simple prompt
ollama run codellama:7b-code "Hello, world!"

# 4. Check model info
ollama show codellama:7b-code
```

## 🚨 **If Nothing Works**

### **Alternative: Use Cloud Mode**

If local installation continues to fail, you can:

1. **Skip local setup** and use cloud mode
2. **Get an API key** from a cloud provider
3. **Configure KNOWCODE** to use cloud models

### **Alternative: Use Different Model**

If CodeGemma fails, try a smaller model:

```bash
# Try a smaller model
ollama pull llama2:7b

# Or use a different code model
ollama pull codellama:7b-instruct
```

## 📞 **Getting Help**

If you're still having issues:

1. **Check Ollama logs**:
   ```bash
   ollama serve --verbose
   ```

2. **Check system resources**:
   ```bash
   # Check available disk space
   df -h
   
   # Check available memory
   free -h
   ```

3. **Check network connectivity**:
   ```bash
   # Test internet connection
   ping 8.8.8.8
   
   # Test DNS
   nslookup ollama.ai
   ```

4. **Check system requirements**:
   - **RAM**: 8GB+ recommended
   - **Storage**: 5GB+ free space
   - **OS**: macOS 10.15+, Linux, Windows 10+

## 🎯 **Quick Test Commands**

Run these to test your installation:

```bash
# Test 1: Basic functionality
ollama --version

# Test 2: Service status
ollama list

# Test 3: Model download
ollama pull codellama:7b-code

# Test 4: Model response
ollama run codellama:7b-code "Explain this code: function hello() { return 'world'; }"
```

If all tests pass, KNOWCODE should work perfectly with your local model! 🎉
