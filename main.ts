// The Houseplant Out-of-Office — v2 entry program.
//
// The entry is assembled from its four clauses, in order, so the joke's
// rhythm (announcement -> grievance -> correction -> threat) is visible
// in the source instead of hidden inside one long string literal.
const fs = require("node:fs");
const path = require("node:path");

const CLAUSES = [
  "Out of office: ",
  "the snake plant is on strike. ",
  "Low-maintenance, not no-maintenance. ",
  "Water me, or the fern gets it.",
];

const GATE = Object.freeze({ minChars: 1, maxChars: 120, maxLines: 1 });

class Entry {
  constructor(clauses) {
    this.text = clauses.join("");
  }

  check() {
    const problems = [];
    if (this.text.length < GATE.minChars || this.text.length > GATE.maxChars) {
      problems.push(`length ${this.text.length} outside ${GATE.minChars}-${GATE.maxChars}`);
    }
    if (this.text.trim() === "") problems.push("entry is blank");
    if (this.text.split("\n").length > GATE.maxLines) problems.push("entry must be a single line");
    if (this.text.includes("\r")) problems.push("entry contains a carriage return");
    if (this.text.includes("  ")) problems.push("entry contains a double space");
    if (/\s$/.test(this.text)) problems.push("entry ends in whitespace");
    if (problems.length > 0) throw new Error(`invalid entry: ${problems.join("; ")}`);
    return this.text;
  }
}

class EntryWriter {
  constructor(dir) {
    this.dir = dir;
  }

  static fromEnv() {
    const dir = process.env.MAKEFUN_OUTPUT_DIR;
    if (!dir) throw new Error("MAKEFUN_OUTPUT_DIR is not set");
    return new EntryWriter(dir);
  }

  save(text) {
    fs.mkdirSync(this.dir, { recursive: true });
    // No trailing newline: write the entry bytes and nothing else.
    fs.writeFileSync(path.join(this.dir, "entry.txt"), text, { encoding: "utf8", flag: "w" });
  }
}

function run() {
  const entry = new Entry(CLAUSES);
  const checked = entry.check();
  // Byte count must equal char count here (plain ASCII entry); if a
  // non-ASCII character ever crept in, the gate is on characters, but
  // the file size check below would catch a surprise.
  if (Buffer.byteLength(checked, "utf8") !== checked.length) {
    throw new Error("entry must be plain ASCII");
  }
  EntryWriter.fromEnv().save(checked);
  process.stdout.write(`${checked}\n`);
}

run();
