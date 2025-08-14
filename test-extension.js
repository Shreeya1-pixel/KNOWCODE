#!/usr/bin/env node

// Simple test to verify KNOWCODE extension structure
console.log('🔍 Testing KNOWCODE Extension Structure...\n');

const fs = require('fs');
const path = require('path');

// Check if compiled files exist
const requiredFiles = [
    'out/extension.js',
    'out/services/CodeExplainer.js',
    'out/services/OverlayManager.js',
    'out/services/DiagramGenerator.js',
    'out/services/ContextAnalyzer.js',
    'out/services/EnhancedExplainer.js',
    'out/services/LearningMode.js'
];

console.log('📁 Checking compiled files:');
let allFilesExist = true;
requiredFiles.forEach(file => {
    const exists = fs.existsSync(file);
    console.log(`  ${exists ? '✅' : '❌'} ${file}`);
    if (!exists) allFilesExist = false;
});

// Check package.json
console.log('\n📦 Checking package.json:');
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    console.log(`  ✅ name: ${packageJson.name}`);
    console.log(`  ✅ main: ${packageJson.main}`);
    console.log(`  ✅ activationEvents: ${packageJson.activationEvents.length} events`);
    console.log(`  ✅ commands: ${packageJson.contributes.commands.length} commands`);
    console.log(`  ✅ keybindings: ${packageJson.contributes.keybindings.length} keybindings`);
} catch (error) {
    console.log(`  ❌ Error reading package.json: ${error.message}`);
    allFilesExist = false;
}

// Check extension.js structure
console.log('\n🔧 Checking extension.js structure:');
try {
    const extensionContent = fs.readFileSync('out/extension.js', 'utf8');
    const hasActivate = extensionContent.includes('activate');
    const hasDeactivate = extensionContent.includes('deactivate');
    const hasVscodeImport = extensionContent.includes('vscode');
    
    console.log(`  ${hasActivate ? '✅' : '❌'} activate function`);
    console.log(`  ${hasDeactivate ? '✅' : '❌'} deactivate function`);
    console.log(`  ${hasVscodeImport ? '✅' : '❌'} vscode import`);
    
    if (!hasActivate || !hasDeactivate || !hasVscodeImport) {
        allFilesExist = false;
    }
} catch (error) {
    console.log(`  ❌ Error reading extension.js: ${error.message}`);
    allFilesExist = false;
}

// Summary
console.log('\n📊 Summary:');
if (allFilesExist) {
    console.log('  ✅ Extension structure looks good!');
    console.log('  🚀 Ready to test in VS Code Extension Development Host');
    console.log('  💡 Press F5 in VS Code to test the extension');
} else {
    console.log('  ❌ Some issues found with extension structure');
    console.log('  🔧 Run "npm run compile" to rebuild the extension');
}

console.log('\n🎯 Next Steps:');
console.log('  1. Open VS Code with this project');
console.log('  2. Press F5 to launch Extension Development Host');
console.log('  3. Look for "KNOWCODE extension is now active! 🎉" message');
console.log('  4. Test commands in the new window');
