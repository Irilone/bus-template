const fs = require('fs');

function analyzeBraces(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    let braceStack = [];
    let openBraces = 0;
    let closeBraces = 0;
    let errors = [];
    let insideMediaQuery = false;
    let mediaQueryLevel = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineNum = i + 1;

        // Count opening braces
        const openMatches = line.match(/{/g);
        if (openMatches) {
            openBraces += openMatches.length;
            for (let j = 0; j < openMatches.length; j++) {
                braceStack.push({
                    line: lineNum,
                    context: line.trim().substring(0, 50)
                });

                if (line.includes('@media')) {
                    insideMediaQuery = true;
                    mediaQueryLevel++;
                }
            }
        }

        // Count closing braces
        const closeMatches = line.match(/}/g);
        if (closeMatches) {
            closeBraces += closeMatches.length;
            for (let j = 0; j < closeMatches.length; j++) {
                if (braceStack.length === 0) {
                    errors.push(`Line ${lineNum}: Extra closing brace found`);
                } else {
                    const opened = braceStack.pop();
                    if (mediaQueryLevel > 0 && line.trim() === '}') {
                        mediaQueryLevel--;
                        if (mediaQueryLevel === 0) {
                            insideMediaQuery = false;
                        }
                    }
                }
            }
        }
    }

    console.log(`Total opening braces: ${openBraces}`);
    console.log(`Total closing braces: ${closeBraces}`);
    console.log(`Missing closing braces: ${openBraces - closeBraces}`);
    console.log(`Unclosed contexts remaining: ${braceStack.length}`);

    if (braceStack.length > 0) {
        console.log('\nUnclosed blocks:');
        braceStack.slice(-10).forEach((item, index) => {
            console.log(`${braceStack.length - 10 + index + 1}. Line ${item.line}: ${item.context}...`);
        });
    }

    if (errors.length > 0) {
        console.log('\nErrors found:');
        errors.forEach(error => console.log(error));
    }

    // Check the end of the file for structure
    console.log('\nLast 20 lines analysis:');
    const lastLines = lines.slice(-20);
    lastLines.forEach((line, index) => {
        const lineNum = lines.length - 20 + index + 1;
        if (line.includes('{') || line.includes('}')) {
            console.log(`Line ${lineNum}: ${line.trim()}`);
        }
    });
}

analyzeBraces('styles2.css');