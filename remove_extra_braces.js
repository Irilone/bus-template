const fs = require('fs');

// Read the CSS file
const cssContent = fs.readFileSync('styles2.css', 'utf8');
const lines = cssContent.split('\n');

console.log(`🔧 Removing Extra Closing Braces...`);

// Based on the diagnosis, these are the lines with extra closing braces to remove
// We need to be very careful to only remove the ones we incorrectly added
const linesToRemove = [
    1529, // This was added but there was already a closing brace
    4246, // This line is empty now but caused a duplicate
    4708, // Area around the orphaned brace got messed up
    11926 // Extra brace added at the end
];

// Let's also scan for standalone '}' lines that are clearly extra
const extraBraceLines = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lineNumber = i + 1;

    // Look for standalone closing braces that might be duplicates
    if (line === '}') {
        // Check if this line was recently added by our script
        // Look at surrounding context to see if it's a duplicate
        const prevLine = i > 0 ? lines[i - 1].trim() : '';
        const nextLine = i < lines.length - 1 ? lines[i + 1].trim() : '';

        // If previous line is also a closing brace, this might be a duplicate
        if (prevLine === '}' || nextLine === '}') {
            extraBraceLines.push(lineNumber);
        }
    }
}

console.log(`Found potential extra braces at lines: ${extraBraceLines.join(', ')}`);

// Create a set of line numbers to remove (convert to 0-based indexing)
const removeLines = new Set();

// Remove obvious duplicates (pairs of closing braces)
// Be conservative - only remove every other one when we see consecutive closing braces
let consecutiveClosingBraces = [];
for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '}') {
        consecutiveClosingBraces.push(i);
    } else {
        // Process any accumulated consecutive closing braces
        if (consecutiveClosingBraces.length > 1) {
            // Remove every other one (keep the first, remove the second, etc.)
            for (let j = 1; j < consecutiveClosingBraces.length; j += 2) {
                removeLines.add(consecutiveClosingBraces[j]);
                console.log(`Marking line ${consecutiveClosingBraces[j] + 1} for removal (duplicate closing brace)`);
            }
        }
        consecutiveClosingBraces = [];
    }
}

// Handle any remaining consecutive braces at the end
if (consecutiveClosingBraces.length > 1) {
    for (let j = 1; j < consecutiveClosingBraces.length; j += 2) {
        removeLines.add(consecutiveClosingBraces[j]);
        console.log(`Marking line ${consecutiveClosingBraces[j] + 1} for removal (duplicate closing brace)`);
    }
}

// Filter out the lines to remove
const cleanedLines = lines.filter((line, index) => !removeLines.has(index));

console.log(`Removed ${removeLines.size} duplicate closing braces`);

// Write the cleaned content back
const cleanedContent = cleanedLines.join('\n');
fs.writeFileSync('styles2.css', cleanedContent);

console.log(`✅ File cleaned! New line count: ${cleanedLines.length}`);