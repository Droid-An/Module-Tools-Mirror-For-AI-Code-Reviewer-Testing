import { promises as fs } from "node:fs";
import { program } from "commander";

program
  .name("cat")
  .description("Concatenate and print files")
  .option("-n", "Number the output lines, starting at 1")
  .option("-b", "Number the non-blank output lines, starting at 1")
  .argument("<sample-files...>", "The file path to process")
  .parse();

const argv = program.args;

const opts = program.opts();

const countLines = (data) => {
  const lines = data.split("\n");
  if (lines[lines.length - 1] === "") {
    lines.pop();
  }

  let lineNum = 1;

  for (const line of lines) {
    if (opts.b) {
      if (line.trim() === "") {
        console.log();
      } else {
        console.log(`${lineNum} ${line}`);
        lineNum++;
      }
    } else if (opts.n) {
      console.log(`${lineNum} ${line}`);
      lineNum++;
    }
  }
};

async function example(path) {
  try {
    const data = await fs.readFile(path, { encoding: "utf8" });
    if (opts["b"]) {
      countLines(data);
    } else if (opts["n"]) {
      countLines(data);
    } else {
      console.log(data.trimEnd());
    }
  } catch (err) {
    console.error(err);
  }
}

const handleInput = async () => {
  for (const path of argv) {
    await example(path);
  }
};

handleInput();
