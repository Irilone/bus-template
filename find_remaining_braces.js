const fs = require('fs');

// Read the CSS file
const cssContent = fs.readFileSync('styles2.css', 'utf8');
const lines = cssContent.split('\n');

console.log(`Analyzing file with ${lines.length} lines`);

let braceStack = [];
let openBraces = 0;
let closeBraces = 0;
let unclosedBlocks = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Count opening braces
    const opensInLine = (line.match(/\{/g) || []).length;
    const closesInLine = (line.match(/\}/g) || []).length;

    openBraces += opensInLine;
    closeBraces += closesInLine;

    // Track each opening brace with its context
    for (let j = 0; j < opensInLine; j++) {
        // Get the CSS selector/rule for this opening brace
        let context = line.trim();
        if (!context && i > 0) {
            // If line is just braces, use previous line for context
            context = lines[i - 1].trim();
        }
        braceStack.push({
            line: lineNum,
            context: context,
            expectedIndent: line.match(/^(\s*)/)[1]
        });
    }

    // Remove corresponding opening braces for each closing brace
    for (let j = 0; j < closesInLine; j++) {
        if (braceStack.length > 0) {
            braceStack.pop();
        }
    }
}

console.log(`\nBrace analysis:`);
console.log(`Total opening braces: ${openBraces}`);
console.log(`Total closing braces: ${closeBraces}`);
console.log(`Missing closing braces: ${openBraces - closeBraces}`);
console.log(`Unclosed blocks: ${braceStack.length}`);

console.log(`\nRemaining unclosed blocks:`);
braceStack.forEach((block, index) => {
    console.log(`${index + 1}. Line ${block.line}: ${block.context.substring(0, 80)}${block.context.length > 80 ? '...' : ''}`);
});

// Try to determine where to place the missing closing braces
console.log(`\nAnalyzing structure to determine placement...`);

if (braceStack.length > 0) {
    // Find good locations to place closing braces by looking at indentation patterns
    const potentialClosingLocations = [];

    for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i];
        const lineNum = i + 1;

        // Look for lines that could be good places to close blocks
        if (line.trim() === '' ||
            line.match(/^\s*$/) ||
            line.match(/^\s*\/\*/) ||
            line.match(/^\s*\}/) ||
            line.match(/^\s*@media/) ||
            line.match(/^\s*:root/)) {

            const indent = line.match(/^(\s*)/)[1];
            potentialClosingLocations.push({
                line: lineNum,
                indent: indent.length,
                content: line.trim()
            });
        }
    }

    console.log(`\nPotential closing locations (last 10):`);
    potentialClosingLocations.slice(-10).forEach(loc => {
        console.log(`Line ${loc.line} (indent: ${loc.indent}): ${loc.content.substring(0, 50)}`);
    });
}

// Save detailed analysis to a file
const analysis = {
    totalLines: lines.length,
    openBraces: openBraces,
    closeBraces: closeBraces,
    missing: openBraces - closeBraces,
    unclosedBlocks: braceStack
};

fs.writeFileSync('brace_analysis.json', JSON.stringify(analysis, null, 2));
console.log(`\nDetailed analysis saved to brace_analysis.json`);