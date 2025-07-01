const fs = require('fs');

// Read the CSS file
const cssContent = fs.readFileSync('styles2.css', 'utf8');
const lines = cssContent.split('\n');

// Define the fixes needed based on the analysis
const fixes = [
    {
        line: 893,
        description: '[data-theme="dark"] {',
        // Find end of this block - look for next top-level rule or end of file
        insertAfter: 1528 // Just before .faq-item summary
    },
    {
        line: 1529,
        description: '.faq-item summary {',
        // Find end of this block
        insertAfter: 4245 // Just before .gap-md
    },
    {
        line: 4246,
        description: '.gap-md {',
        // Find end of this block
        insertAfter: 4706 // Just before the orphaned brace
    },
    {
        line: 4707,
        description: '{ (orphaned opening brace)',
        // This is an orphaned brace, should be closed immediately
        insertAfter: 4707 // Right after the orphaned brace
    },
    {
        line: 11026,
        description: '@media (max-width: 767.98px) {',
        // Find end of this media query
        insertAfter: 11073 // Just before body>.container-fluid
    },
    {
        line: 11074,
        description: 'body>.container-fluid {',
        // This should close at the end of the file or before next major block
        insertAfter: lines.length - 1 // At the very end
    }
];

// Apply fixes from bottom to top to maintain line numbers
for (let i = fixes.length - 1; i >= 0; i--) {
    const fix = fixes[i];
    const insertPosition = fix.insertAfter;

    console.log(`Adding closing brace for ${fix.description} after line ${insertPosition}`);

    // Insert closing brace with appropriate indentation
    lines.splice(insertPosition, 0, '}');
}

// Write the fixed content back to the file
const fixedContent = lines.join('\n');
fs.writeFileSync('styles2.css', fixedContent);

console.log('✅ Added 6 closing braces to fix remaining CSS syntax errors');
console.log('File updated successfully!');