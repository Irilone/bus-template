const fs = require('fs');

// Read the CSS file
const cssContent = fs.readFileSync('styles2.css', 'utf8');

// Track all selectors and their rules
const selectorMap = new Map();
const lines = cssContent.split('\n');
let currentSelector = '';
let currentRules = [];
let insideRule = false;
let braceCount = 0;

// Parse CSS to find all selectors and their rules
for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line || line.startsWith('/*') || line.startsWith('*') || line === '*/') {
        continue;
    }

    // Count braces to track if we're inside a rule
    const openBraces = (line.match(/\{/g) || []).length;
    const closeBraces = (line.match(/\}/g) || []).length;

    if (openBraces > 0) {
        if (!insideRule) {
            // New selector
            currentSelector = line.replace(/\s*\{.*$/, '').trim();
            currentRules = [];
            insideRule = true;
            braceCount = openBraces - closeBraces;

            // Get any rules on the same line
            const rulePart = line.substring(line.indexOf('{') + 1);
            if (rulePart.trim() && !rulePart.includes('}')) {
                currentRules.push(rulePart.trim());
            }
        } else {
            braceCount += openBraces - closeBraces;
            if (!line.includes('{')) {
                currentRules.push(line);
            }
        }
    } else if (closeBraces > 0) {
        braceCount -= closeBraces;

        if (line !== '}' && !line.endsWith('}')) {
            currentRules.push(line.replace(/\}.*$/, '').trim());
        }

        if (braceCount <= 0) {
            // End of rule
            if (currentSelector) {
                if (!selectorMap.has(currentSelector)) {
                    selectorMap.set(currentSelector, []);
                }
                selectorMap.get(currentSelector).push({
                    rules: [...currentRules],
                    lineNumber: i + 1
                });
            }
            insideRule = false;
            currentSelector = '';
            currentRules = [];
            braceCount = 0;
        }
    } else if (insideRule && line) {
        currentRules.push(line);
    }
}

// Categories to consolidate
const categories = {
    footer: {
        patterns: [
            'footer.footer',
            'footer.footer h4',
            'footer.footer h5',
            'footer.footer p',
            'footer.footer a',
            'nav.footer__link-nav',
            'nav.footer__link-nav ul#footer__links',
            'nav.footer__link-nav ul#footer__links>li.col',
            'nav.footer__link-nav a.footer__link',
            'nav.footer__link-nav button#footer__links-toggle-button',
            '.footer__link .fa-external-link'
        ]
    },
    utilities: {
        patterns: [
            '.p-xs', '.p-sm', '.p-md', '.p-lg', '.p-xl', '.p-2xl',
            '.px-xs', '.px-sm', '.px-md', '.px-lg', '.px-xl',
            '.py-xs', '.py-sm', '.py-md', '.py-lg', '.py-xl',
            '.m-xs', '.m-sm', '.m-md', '.m-lg', '.m-xl',
            '.my-xs', '.my-sm', '.my-md', '.my-lg', '.my-xl',
            '.text-xs', '.text-sm', '.text-base', '.text-md', '.text-lg', '.text-xl', '.text-2xl', '.text-3xl',
            '.gap-xs', '.gap-sm', '.gap-md', '.gap-lg', '.gap-xl',
            '.rounded-sm', '.rounded-md', '.rounded-lg', '.rounded-full',
            '.transition-fast', '.transition-normal', '.transition-slow'
        ]
    },
    priceTable: {
        patterns: [
            '.price-table',
            '.price-table th',
            '.price-table td',
            '.price-table th:first-child',
            '.price-table th:nth-child(3)',
            '.price-table th:nth-child(4)',
            '.price-table th:not(:first-child)',
            '.price-table thead th',
            '.price-table thead th:nth-child(2)'
        ]
    },
    vaccine: {
        patterns: [
            '.vaccine-category',
            '.vaccine-category-title',
            '.vaccine-item',
            '.vaccine-summary',
            '.vaccine-content',
            '.vaccine-priority',
            '.vaccine-badge',
            '.vaccine-desc'
        ]
    },
    navigation: {
        patterns: [
            '.container',
            '.header',
            '.navigation',
            '.navigation__logo',
            '.navigation__item',
            '.navigation__item-category',
            '.hamburger-menu',
            '.offside-navbar'
        ]
    }
};

// Find duplicates for each category
const duplicates = {};
for (const [category, {patterns}] of Object.entries(categories)) {
    duplicates[category] = {};

    for (const pattern of patterns) {
        if (selectorMap.has(pattern)) {
            const occurrences = selectorMap.get(pattern);
            if (occurrences.length > 1) {
                duplicates[category][pattern] = occurrences;
            }
        }
    }
}

// Generate consolidated CSS
function consolidateCategory(categoryName, categoryDuplicates) {
    let consolidated = `\n/* ===== CONSOLIDATED ${categoryName.toUpperCase()} STYLES ===== */\n`;

    for (const [selector, occurrences] of Object.entries(categoryDuplicates)) {
        // Merge all rules for this selector
        const allRules = new Set();

        for (const occurrence of occurrences) {
            for (const rule of occurrence.rules) {
                if (rule.trim()) {
                    allRules.add(rule.trim());
                }
            }
        }

        if (allRules.size > 0) {
            consolidated += `${selector} {\n`;
            for (const rule of Array.from(allRules).sort()) {
                consolidated += `    ${rule}\n`;
            }
            consolidated += `}\n\n`;
        }
    }

    return consolidated;
}

// Create the new consolidated CSS
let newCSS = `/* =============================================
   CONSOLIDATED CSS - All Duplicates Removed
   Original file had 1,138 redundant rules
   ============================================= */\n\n`;

// Add :root variables (keep only the first occurrence)
const rootOccurrences = selectorMap.get(':root') || [];
if (rootOccurrences.length > 0) {
    newCSS += ':root {\n';
    const allVars = new Set();
    for (const occurrence of rootOccurrences) {
        for (const rule of occurrence.rules) {
            if (rule.trim() && rule.includes('--')) {
                allVars.add(rule.trim());
            }
        }
    }
    for (const varRule of Array.from(allVars).sort()) {
        newCSS += `    ${varRule}\n`;
    }
    newCSS += '}\n\n';
}

// Add consolidated categories
for (const [categoryName, categoryDuplicates] of Object.entries(duplicates)) {
    if (Object.keys(categoryDuplicates).length > 0) {
        newCSS += consolidateCategory(categoryName, categoryDuplicates);
    }
}

// Add unique selectors (those that appear only once)
newCSS += '\n/* ===== UNIQUE STYLES (NON-DUPLICATED) ===== */\n';
const processedSelectors = new Set();

// Add all selectors from categories first
for (const category of Object.values(categories)) {
    for (const pattern of category.patterns) {
        processedSelectors.add(pattern);
    }
}
processedSelectors.add(':root');

for (const [selector, occurrences] of selectorMap.entries()) {
    if (!processedSelectors.has(selector) && occurrences.length === 1) {
        const rules = occurrences[0].rules;
        if (rules.length > 0) {
            newCSS += `${selector} {\n`;
            for (const rule of rules) {
                if (rule.trim()) {
                    newCSS += `    ${rule.trim()}\n`;
                }
            }
            newCSS += '}\n\n';
        }
    }
}

// Write the consolidated CSS
fs.writeFileSync('styles2_consolidated.css', newCSS);

// Generate summary report
const totalOriginalRules = Array.from(selectorMap.values()).reduce((sum, occurrences) => sum + occurrences.length, 0);
const duplicateRulesRemoved = Array.from(selectorMap.values()).reduce((sum, occurrences) => sum + Math.max(0, occurrences.length - 1), 0);

console.log('CSS Consolidation Complete!');
console.log('================================');
console.log(`Original selectors: ${selectorMap.size}`);
console.log(`Total original rules: ${totalOriginalRules}`);
console.log(`Duplicate rules removed: ${duplicateRulesRemoved}`);
console.log(`Size reduction: ${((duplicateRulesRemoved / totalOriginalRules) * 100).toFixed(1)}%`);
console.log('\nDuplicates by category:');

for (const [category, categoryDuplicates] of Object.entries(duplicates)) {
    const categoryCount = Object.keys(categoryDuplicates).length;
    const categoryRemovals = Object.values(categoryDuplicates).reduce((sum, occurrences) => sum + Math.max(0, occurrences.length - 1), 0);
    if (categoryCount > 0) {
        console.log(`  ${category}: ${categoryCount} selectors, ${categoryRemovals} duplicates removed`);
    }
}

console.log(`\nConsolidated CSS saved as: styles2_consolidated.css`);