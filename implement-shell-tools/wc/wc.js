#!/usr/bin/env node
const fs = require('node:fs');
// Function to count lines, words, and bytes in a file
function countFileContent(content) {
    const lines = content.split('\n').length; // Count lines by splitting on newline characters
    const words = content.trim().split(/\s+/).filter(Boolean).length; // Split by whitespace and filter out empty strings
    const bytes = Buffer.byteLength(content, 'utf8');
    return { lines, words, bytes };
}

//print counts in the format of wc according to options
function printCounts(filePath, counts, options) {
    const parts = [];
    if(options.line) parts.push(counts.lines);
    if(options.word) parts.push(counts.words);
    if(options.byte) parts.push(counts.bytes);
//if no specific count options are provided, print all counts
    if(!options.line && !options.word && !options.byte) {
    //default is to print all counts
        parts.push(counts.lines, counts.words, counts.bytes);
    }
    console.log(parts.join('\t'),filePath);
}

function main() {
    const args = process.argv.slice(2);
    const options = {
        line: false,
        word: false,
        byte: false,
    };

    //Separate options from file paths
    const files = [];
    args.forEach((arg) => {
        if(arg === '-l') options.line = true;
        else if(arg === '-w') options.word = true;
        else if(arg === '-c') options.byte = true;
        else files.push(arg);
    });

    if(files.length === 0) {
        console.error('No files specified');
        process.exit(1);
    }

    let totalCounts = { lines: 0, words: 0, bytes: 0 };
    const multipleFiles = files.length > 1;
    
    files.forEach(file => {
        try {
            const content = fs.readFileSync(file, 'utf-8');
            const counts = countFileContent(content);

            // Sum counts for total if multiple files
            totalCounts.lines += counts.lines;
            totalCounts.words += counts.words;
            totalCounts.bytes += counts.bytes;

            printCounts(file, counts, options);
        } catch (error) {
            console.error(`Error reading file ${file}: ${error.message}`);
        }
    });
    
    // If multiple files, print total counts
    if(multipleFiles) {
        printCounts('total', totalCounts, options);
    }
}
main();