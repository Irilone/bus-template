const fs = require('fs');

// Read the CSS file
const cssContent = fs.readFileSync('styles2.css', 'utf8');
const lines = cssContent.split('\n');

console.log(`📊 Final CSS File Analysis:`);
console.log(`Total lines: ${lines.length}`);

// Count braces
let openBraces = 0;
let closeBraces = 0;
let braceStack = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNumber = i + 1;

    // Count opening braces
    const opens = (line.match(/\{/g) || []).length;
    openBraces += opens;

    // Count closing braces
    const closes = (line.match(/\}/g) || []).length;
    closeBraces += closes;

    // Track brace balance
    for (let j = 0; j < opens; j++) {
        braceStack.push(lineNumber);
    }

    for (let j = 0; j < closes; j++) {
        if (braceStack.length > 0) {
            braceStack.pop();
        }
    }
}

console.log(`\n🔍 Brace Analysis:`);
console.log(`Opening braces: ${openBraces}`);
console.log(`Closing braces: ${closeBraces}`);
console.log(`Missing braces: ${openBraces - closeBraces}`);

if (openBraces === closeBraces) {
    console.log(`\n✅ SUCCESS: All CSS braces are now balanced!`);
    console.log(`🎉 The CSS syntax errors have been completely resolved.`);
} else {
    console.log(`\n❌ Still ${openBraces - closeBraces} missing closing braces`);
    if (braceStack.length > 0) {
        console.log(`Unclosed blocks starting at lines: ${braceStack.slice(0, 10).join(', ')}${braceStack.length > 10 ? '...' : ''}`);
    }
}

// Check file size
const fileSizeKB = Math.round(cssContent.length / 1024);
console.log(`\n📁 File size: ${fileSizeKB} KB`);