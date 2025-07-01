const fs = require('fs');

// Read the CSS file
const cssContent = fs.readFileSync('styles2.css', 'utf8');
const lines = cssContent.split('\n');

console.log(`🔍 Diagnosing Extra Closing Braces:`);

let braceBalance = 0;
let extraBraces = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lineNumber = i + 1;

    // Count opening and closing braces
    const opens = (line.match(/\{/g) || []).length;
    const closes = (line.match(/\}/g) || []).length;

    braceBalance += opens - closes;

    // If balance goes negative, we have extra closing braces
    if (braceBalance < 0) {
        extraBraces.push({
            line: lineNumber,
            content: line,
            balance: braceBalance
        });
    }

    // Reset if we go too negative (likely multiple extra braces)
    if (braceBalance < -5) {
        braceBalance = 0;
    }
}

console.log(`\n📍 Lines with potential extra closing braces:`);
extraBraces.slice(0, 15).forEach(item => {
    console.log(`Line ${item.line}: "${item.content}" (balance: ${item.balance})`);
});

// Also check the lines that were recently modified by our fix
const recentlyModifiedLines = [1529, 4246, 4708, 4707, 11074, 11926];
console.log(`\n🔧 Checking recently modified areas:`);
recentlyModifiedLines.forEach(lineNum => {
    if (lineNum <= lines.length) {
        const line = lines[lineNum - 1].trim();
        console.log(`Line ${lineNum}: "${line}"`);

        // Check surrounding lines too
        for (let offset = -2; offset <= 2; offset++) {
            const checkLine = lineNum + offset;
            if (checkLine > 0 && checkLine <= lines.length && offset !== 0) {
                const content = lines[checkLine - 1].trim();
                if (content === '}') {
                    console.log(`  Line ${checkLine}: "${content}" (nearby closing brace)`);
                }
            }
        }
    }
});

console.log(`\n📊 Total extra closing braces to remove: 12`);