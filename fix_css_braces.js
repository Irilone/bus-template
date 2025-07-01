const fs = require('fs');

// Read the CSS file
const cssContent = fs.readFileSync('styles2.css', 'utf8');
const lines = cssContent.split('\n');

console.log(`Original file has ${lines.length} lines`);

// Based on the previous analysis, these are the lines that need closing braces:
const unclosedBlocks = [
    { line: 11079, description: "Mobile nav toggle block" },
    { line: 11115, description: "Navigation item block" },
    { line: 11119, description: "CSS rules block" },
    { line: 11142, description: "Price heading block" },
    { line: 11311, description: "Container section" },
    { line: 11312, description: "Section rules" },
    { line: 11434, description: "Price table rules" },
    { line: 11488, description: "Vaccine content block" },
    { line: 11548, description: "Vaccine summary rules" },
    { line: 12019, description: "Final lightbox block" }
];

// Create a copy of lines for modification
let fixedLines = [...lines];
let addedBraces = 0;

// Work backwards through the unclosed blocks to maintain line numbers
for (let i = unclosedBlocks.length - 1; i >= 0; i--) {
    const block = unclosedBlocks[i];
    const lineIndex = block.line - 1; // Convert to 0-based index

    console.log(`Fixing ${block.description} at line ${block.line}`);

    // Find the appropriate indentation level for the closing brace
    let indentLevel = '';
    if (lineIndex < fixedLines.length) {
        const currentLine = fixedLines[lineIndex];
        const match = currentLine.match(/^(\s*)/);
        if (match && match[1].length > 4) {
            // Reduce indentation for closing brace
            indentLevel = match[1].substring(0, match[1].length - 4);
        }
    }

    // Insert closing brace after the current line
    fixedLines.splice(lineIndex + 1, 0, `${indentLevel}}`);
    addedBraces++;
}

console.log(`Added ${addedBraces} closing braces`);

// Write the fixed content back to the file
const fixedContent = fixedLines.join('\n');
fs.writeFileSync('styles2.css', fixedContent);

console.log(`Fixed file now has ${fixedLines.length} lines`);
console.log('CSS file has been repaired with missing closing braces');

// Verify the fix by counting braces
const openBraces = (fixedContent.match(/\{/g) || []).length;
const closeBraces = (fixedContent.match(/\}/g) || []).length;

console.log(`\nBrace count after fix:`);
console.log(`Opening braces: ${openBraces}`);
console.log(`Closing braces: ${closeBraces}`);
console.log(`Difference: ${openBraces - closeBraces}`);