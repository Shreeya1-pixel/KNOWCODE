#!/usr/bin/env node

console.log('🔍 KNOWCODE Extension Test\n');

// Check if we're in the right directory
const fs = require('fs');
const path = require('path');

console.log('📁 Current directory:', process.cwd());
console.log('📁 Expected directory:', '/Users/shreeyagupta/knowcode');

if (process.cwd() !== '/Users/shreeyagupta/knowcode') {
    console.log('❌ You are not in the correct directory!');
    console.log('💡 Run: cd /Users/shreeyagupta/knowcode');
    process.exit(1);
}

console.log('✅ Correct directory\n');

// Check essential files
const essentialFiles = [
    'package.json',
    'src/extension.ts',
    'out/extension.js',
    'out/services/EnhancedExplainer.js'
];

console.log('📦 Checking essential files:');
let allFilesExist = true;
essentialFiles.forEach(file => {
    const exists = fs.existsSync(file);
    console.log(`  ${exists ? '✅' : '❌'} ${file}`);
    if (!exists) allFilesExist = false;
});

if (!allFilesExist) {
    console.log('\n❌ Some essential files are missing!');
    console.log('💡 Run: npm run compile');
    process.exit(1);
}

console.log('\n✅ All essential files exist\n');

// Check package.json
console.log('📋 Checking package.json:');
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    console.log(`  ✅ name: ${packageJson.name}`);
    console.log(`  ✅ main: ${packageJson.main}`);
    console.log(`  ✅ activationEvents: ${packageJson.activationEvents.length} events`);
    console.log(`  ✅ commands: ${packageJson.contributes.commands.length} commands`);
} catch (error) {
    console.log(`  ❌ Error reading package.json: ${error.message}`);
    process.exit(1);
}

console.log('\n✅ Package.json is valid\n');

// Check extension.js
console.log('🔧 Checking extension.js:');
try {
    const extensionContent = fs.readFileSync('out/extension.js', 'utf8');
    const hasActivate = extensionContent.includes('activate');
    const hasDeactivate = extensionContent.includes('deactivate');
    const hasVscodeImport = extensionContent.includes('vscode');
    
    console.log(`  ${hasActivate ? '✅' : '❌'} activate function`);
    console.log(`  ${hasDeactivate ? '✅' : '❌'} deactivate function`);
    console.log(`  ${hasVscodeImport ? '✅' : '❌'} vscode import`);
    
    if (!hasActivate || !hasDeactivate || !hasVscodeImport) {
        console.log('\n❌ Extension.js is missing required functions!');
        process.exit(1);
    }
} catch (error) {
    console.log(`  ❌ Error reading extension.js: ${error.message}`);
    process.exit(1);
}

console.log('\n✅ Extension.js is valid\n');

// Summary
console.log('📊 SUMMARY:');
console.log('  ✅ Directory is correct');
console.log('  ✅ All files exist');
console.log('  ✅ Package.json is valid');
console.log('  ✅ Extension.js is valid');
console.log('\n🚀 Extension structure is ready!');

console.log('\n🎯 NEXT STEPS:');
console.log('1. Open VS Code with the ENTIRE project folder:');
console.log('   open -a "Visual Studio Code" .');
console.log('2. Press F5 to launch Extension Development Host');
console.log('3. Look for "KNOWCODE extension is now active! 🎉"');

console.log('\n🚨 If F5 still doesn\'t work:');
console.log('- Make sure you opened the FOLDER, not individual files');
console.log('- Check the Debug Console for error messages');
console.log('- Try restarting VS Code completely');
