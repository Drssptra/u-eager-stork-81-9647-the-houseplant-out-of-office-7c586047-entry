const { mkdirSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");

// The entry: one out-of-office auto-reply, written as if by the fern on the
// windowsill that nobody has watered since March.
function entryText() {
  return "Out of office: ignored since March, alive purely out of spite. Water me or don’t — I’m a fern, not your inbox.";
}

function outputDir() {
  return process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
}

function outputPath() {
  const dir = outputDir();
  mkdirSync(dir, { recursive: true });
  return join(dir, "entry.txt");
}

function writeEntryFile(text) {
  writeFileSync(outputPath(), text + "\n", "utf8");
}

function main() {
  const text = entryText();
  writeEntryFile(text);
  process.stdout.write(text + "\n");
}

main();
