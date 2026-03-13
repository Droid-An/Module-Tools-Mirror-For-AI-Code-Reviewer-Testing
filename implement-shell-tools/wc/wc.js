import { program } from "commander";
import { promises as fs } from "node:fs";

program
  .name("count-containing-words")
  .description("Counts words in a file that contain a particular character")
  .option(
    "-l",
    "The number of lines in each input file is written to the standard output."
  )
  .option(
    "-w",
    "The number of words in each input file is written to the standard output."
  )
  .option(
    "-c",
    "The number of bytes in each input file is written to the standard output."
  )
  .argument("<path...>", "The file path to process")
  .parse();

const argv = program.args;

const opts = program.opts();

const total = [];
const output = [];
const countsPerFile = [];
let columnWidth = 0;

const flag_c = (content) => {
  return Buffer.byteLength(content, "utf8");
};

const flag_w = (content) => {
  return content.match(/\b[\w']+\b/g).length;
};

const flag_l = (content) => {
  return content.split("\n").length - 1;
};

const countAndDisplay = async (path) => {
  const outputPerFile = [];
  const content = await fs.readFile(path, "utf-8");
  if (opts["l"]) {
    outputPerFile.push(flag_l(content));
  }
  if (opts["w"]) {
    outputPerFile.push(flag_w(content));
  }
  if (opts["c"]) {
    outputPerFile.push(flag_c(content));
  }
  if (argv.length > 1) {
    if (total.length == 0) {
      total.push(...outputPerFile);
    } else {
      for (let index = 0; index < outputPerFile.length; index++) {
        total[index] += outputPerFile[index];
      }
    }
    countsPerFile.push(...outputPerFile);
  }
  outputPerFile.push(path);
  output.push([...outputPerFile]);
};

const handleInput = async () => {
  if (Object.keys(opts).length == 0) {
    ["l", "w", "c"].forEach((key) => (opts[key] = true));
  }
  for (const path of argv) {
    await countAndDisplay(path);
  }
  const numOfColumns = Object.keys(opts).length;
  if (argv.length > 1) {
    total.push("total");
    output.push(total);
  }
  for (const row of output) {
    for (let i = 0; i < numOfColumns; i++) {
      columnWidth = Math.max(columnWidth, String(row[i]).length);
    }
  }

  for (let row of output) {
    const line_parts = [];
    for (let i = 0; i < numOfColumns; i++) {
      line_parts.push(String(row[i]).padStart(columnWidth + 4));
    }
    console.log(line_parts.join(" "), row.at(-1));
  }
};
handleInput();
