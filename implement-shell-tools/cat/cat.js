#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

//shared line counter across all files(matches cat -n)
let globalLineCounter = 1;

function printFile(filePath, options) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');

        lines.forEach((line) => {
            if(options.numberNonEmpty) {
                //-b option: number non-empty lines
                if(line.trim()) {
                    process.stdout.write(
                        `${String(globalLineCounter).padStart(6)}\t${line}\n`
                    );
                    globalLineCounter++;
                } else {
                    process.stdout.write('\n');
                }
            } else if(options.numberAll) {
                //-n option: number all lines
                process.stdout.write(
                    `${String(globalLineCounter).padStart(6)}\t${line}\n`
                );
                globalLineCounter++;
            } else {
                //default: just print the line
                process.stdout.write(line + '\n');
            }
    });

    } catch (error) {
        console.error(`Error reading file ${filePath}: ${error.message}`);
    }
}

function main() {
    const args = process.argv.slice(2);
    const options = {
        numberNonEmpty: false,
        numberAll: false,
    };
    const filePatterns = [];

    args.forEach((arg) => {
        if(arg === '-n') {
            options.numberAll = true;
        } else if(arg === '-b') {
            options.numberNonEmpty = true;
        } else {
            filePatterns.push(arg);
        }
    });
    // -b takes precedence over -n
    if(options.numberNonEmpty) {
        options.numberAll = false;
    }

    if(filePatterns.length === 0) {
        console.log("cat: missing file operand");
        process.exit(1);
    }

    const files = filePatterns;

    files.forEach((file) => {
        const resolvedPath = path.resolve(process.cwd(), file);
        printFile(resolvedPath, options);
    });
    }

main();
