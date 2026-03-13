import { promises as fs } from "node:fs";
import process from "node:process";
import path from "node:path";
import { program } from "commander";

program
  .name("ls")
  .description("Shows files in directory")
  .option("-1", "list one file per line")
  .option(
    "-a",
    "Used to list all files, including hidden files, in the current directory"
  )
  .argument("[sample-files]", "The file path to process");

program.parse();

let pathToFile = "";

const programArgv = program.args;

(async () => {
  if (programArgv.length === 1) {
    pathToFile = programArgv[0];
    try {
      const stats = await fs.stat(pathToFile);
      if (stats.isFile()) {
        await listFiles("file");
      } else if (stats.isDirectory()) {
        listFiles("directory");
      } else {
        console.error("Not a file or directory.");
      }
    } catch (err) {
      console.error("Invalid path:", err.message);
    }
  } else if (programArgv.length === 0) {
    pathToFile = process.cwd();
    await listFiles("directory");
  } else {
    console.error(
      `Expected no more than 1 argument (sample-files) but got ${programArgv.length}.`
    );
  }
})();

const flag_1 = (files) => {
  files.forEach(function (file) {
    console.log(file);
  });
};

const flag_a = (files) => {
  files.unshift("..");
  files.unshift(".");
  return files;
};

async function listFiles(type) {
  let output = [];
  let formattedPath = "";
  if (type == "directory") {
    formattedPath = pathToFile;
  } else if (type == "file") {
    formattedPath = path.dirname(pathToFile);
  }
  const char = program.opts();
  const files = await fs.readdir(formattedPath);
  const sortedOutput = files.sort((a, b) => a.localeCompare(b));

  if (char["a"]) {
    output = flag_a(sortedOutput);
  } else {
    sortedOutput.forEach(function (file) {
      if (file[0] != ".") {
        output.push(file);
      }
    });
  }

  if (char["1"]) {
    flag_1(output);
  } else {
    console.log(output.join("   "));
  }
}
