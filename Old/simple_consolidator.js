const fs = require('fs');

// Read the CSS file
const cssContent = fs.readFileSync('styles2.css', 'utf8');

// Simple but effective CSS parser using regex
function parseCSS(content) {
    const selectors = new Map();

    // Remove comments
    const cleanContent = content.replace(/\/\*[\s\S]*?\*\//g, '');

    // Match CSS rules with regex
    const rulePattern = /([^{}]+)\s*\{([^{}]*)\}/g;
    let match;

    while ((match = rulePattern.exec(cleanContent)) !== null) {
        const selectorPart = match[1].trim();
        const rulesPart = match[2].trim();

        if (!selectorPart || !rulesPart) continue;

        // Handle multiple selectors separated by commas
        const selectorList = selectorPart.split(',').map(s => s.trim()).filter(s => s);

        // Parse individual rules
        const rules = rulesPart.split(';')
            .map(rule => rule.trim())
            .filter(rule => rule && rule.includes(':'));

        // Store each selector
        for (const selector of selectorList) {
            if (!selectors.has(selector)) {
                selectors.set(selector, []);
            }
            selectors.get(selector).push(rules);
        }
    }

    return selectors;
}

console.log('Parsing CSS...');
const allSelectors = parseCSS(cssContent);
console.log(`Found ${allSelectors.size} unique selectors`);

// Find duplicates
const duplicates = new Map();
const uniqueSelectors = new Map();

for (const [selector, rulesList] of allSelectors.entries()) {
    if (rulesList.length > 1) {
        duplicates.set(selector, rulesList);
    } else {
        uniqueSelectors.set(selector, rulesList[0]);
    }
}

console.log(`Found ${duplicates.size} selectors with duplicates`);

// Target patterns for consolidation
const targetPatterns = {
    footer: [
        'footer.footer',
        'footer.footer h4',
        'footer.footer h5',
        'nav.footer__link-nav',
        'nav.footer__link-nav ul#footer__links',
        '.footer__link'
    ],
    utilities: [
        '.p-xs', '.p-sm', '.p-md', '.p-lg', '.p-xl',
        '.px-xs', '.px-sm', '.px-md', '.px-lg', '.px-xl',
        '.py-xs', '.py-sm', '.py-md', '.py-lg', '.py-xl',
        '.m-xs', '.m-sm', '.m-md', '.m-lg', '.m-xl',
        '.my-xs', '.my-sm', '.my-md', '.my-lg', '.my-xl',
        '.text-xs', '.text-sm', '.text-md', '.text-lg', '.text-xl',
        '.gap-xs', '.gap-sm', '.gap-md', '.gap-lg', '.gap-xl',
        '.rounded-sm', '.rounded-md', '.rounded-lg', '.rounded-full'
    ],
    priceTable: [
        '.price-table',
        '.price-table th',
        '.price-table td',
        '.price-table th:first-child',
        '.price-table td:first-child'
    ],
    vaccine: [
        '.vaccine-category',
        '.vaccine-summary',
        '.vaccine-content',
        '.vaccine-item'
    ],
    navigation: [
        '.container',
        '.header',
        '.hamburger-menu',
        '.offside-navbar',
        '.navigation'
    ]
};

// Merge rules function
function mergeRules(rulesList) {
    const merged = new Map();

    for (const rules of rulesList) {
        for (const rule of rules) {
            const colonIndex = rule.indexOf(':');
            if (colonIndex > 0) {
                const property = rule.substring(0, colonIndex).trim();
                const value = rule.substring(colonIndex + 1).trim();
                merged.set(property, value);
            }
        }
    }

    return Array.from(merged.entries()).map(([prop, val]) => `${prop}: ${val}`);
}

// Generate consolidated CSS
let consolidatedCSS = `/*
=================================================================
CONSOLIDATED CSS - Duplicates Removed
Generated: ${new Date().toISOString()}
File size reduction and performance optimization
=================================================================
*/

`;

// Start with :root variables
if (duplicates.has(':root')) {
    const rootRules = mergeRules(duplicates.get(':root'));
    consolidatedCSS += ':root {\n';
    for (const rule of rootRules.sort()) {
        consolidatedCSS += `    ${rule};\n`;
    }
    consolidatedCSS += '}\n\n';
}

// Process each category
for (const [categoryName, patterns] of Object.entries(targetPatterns)) {
    const categoryDuplicates = [];

    for (const pattern of patterns) {
        if (duplicates.has(pattern)) {
            categoryDuplicates.push([pattern, duplicates.get(pattern)]);
        }
    }

    if (categoryDuplicates.length > 0) {
        consolidatedCSS += `/* ===== ${categoryName.toUpperCase()} STYLES ===== */\n`;

        for (const [selector, rulesList] of categoryDuplicates) {
            const mergedRules = mergeRules(rulesList);

            consolidatedCSS += `${selector} {\n`;
            for (const rule of mergedRules.sort()) {
                consolidatedCSS += `    ${rule};\n`;
            }
            consolidatedCSS += '}\n\n';
        }

        consolidatedCSS += '\n';
    }
}

// Add other duplicates
const processedSelectors = new Set([':root']);
for (const patterns of Object.values(targetPatterns)) {
    for (const pattern of patterns) {
        processedSelectors.add(pattern);
    }
}

const otherDuplicates = [];
for (const [selector, rulesList] of duplicates.entries()) {
    if (!processedSelectors.has(selector)) {
        otherDuplicates.push([selector, rulesList]);
    }
}

if (otherDuplicates.length > 0) {
    consolidatedCSS += '/* ===== OTHER CONSOLIDATED STYLES ===== */\n';

    for (const [selector, rulesList] of otherDuplicates) {
        const mergedRules = mergeRules(rulesList);

        consolidatedCSS += `${selector} {\n`;
        for (const rule of mergedRules.sort()) {
            consolidatedCSS += `    ${rule};\n`;
        }
        consolidatedCSS += '}\n\n';
    }

    consolidatedCSS += '\n';
}

// Add unique selectors
consolidatedCSS += '/* ===== UNIQUE STYLES ===== */\n';

for (const [selector, rules] of uniqueSelectors.entries()) {
    if (!processedSelectors.has(selector)) {
        consolidatedCSS += `${selector} {\n`;
        for (const rule of rules) {
            consolidatedCSS += `    ${rule};\n`;
        }
        consolidatedCSS += '}\n\n';
    }
}

// Write consolidated CSS
fs.writeFileSync('styles2_consolidated.css', consolidatedCSS);

// Calculate statistics
const originalSize = fs.statSync('styles2.css').size;
const consolidatedSize = fs.statSync('styles2_consolidated.css').size;
const totalDuplicatesRemoved = Array.from(duplicates.values()).reduce((sum, rulesList) => sum + rulesList.length - 1, 0);

// Generate report
console.log('\n' + '='.repeat(60));
console.log('CSS CONSOLIDATION COMPLETE');
console.log('='.repeat(60));
console.log(`Original file size: ${(originalSize / 1024).toFixed(1)} KB`);
console.log(`Consolidated file size: ${(consolidatedSize / 1024).toFixed(1)} KB`);
console.log(`Size reduction: ${(((originalSize - consolidatedSize) / originalSize) * 100).toFixed(1)}%`);
console.log(`\nTotal selectors: ${allSelectors.size}`);
console.log(`Duplicated selectors: ${duplicates.size}`);
console.log(`Duplicate rules removed: ${totalDuplicatesRemoved}`);

console.log('\nCategory breakdown:');
for (const [categoryName, patterns] of Object.entries(targetPatterns)) {
    const categoryCount = patterns.filter(p => duplicates.has(p)).length;
    const categoryRemovals = patterns.reduce((sum, p) => {
        return sum + (duplicates.has(p) ? duplicates.get(p).length - 1 : 0);
    }, 0);

    if (categoryCount > 0) {
        console.log(`  ${categoryName}: ${categoryCount} selectors, ${categoryRemovals} duplicates removed`);
    }
}

console.log(`\nConsolidated CSS saved as: styles2_consolidated.css`);
console.log('Review the file and replace styles2.css when ready.');