#!/usr/bin/env node
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const LIMIT = 200;
const rootDir = process.cwd();
const allowlistPath = path.join(rootDir, ".max-lines-allowlist");
const ignoredDirs = new Set(["node_modules", ".next", "dist", "coverage", ".turbo"]);

async function collectFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) {
      if (entry.name !== ".max-lines-allowlist") {
        continue;
      }
    }

    const absPath = path.join(dir, entry.name);
    const relPath = path.relative(rootDir, absPath);

    if (entry.isDirectory()) {
      if (ignoredDirs.has(entry.name)) {
        continue;
      }
      files.push(...(await collectFiles(absPath)));
      continue;
    }

    if (entry.isFile() && (relPath.endsWith(".ts") || relPath.endsWith(".tsx"))) {
      files.push(relPath);
    }
  }

  return files;
}

async function readAllowlist() {
  try {
    const content = await readFile(allowlistPath, "utf8");
    return new Set(
      content
        .split(/\r?\n/u)
        .map((line) => line.trim())
        .filter((line) => line.length > 0 && !line.startsWith("#"))
    );
  } catch {
    return new Set();
  }
}

async function countLines(relPath) {
  const content = await readFile(path.join(rootDir, relPath), "utf8");
  return content.split(/\r?\n/u).length;
}

const [files, allowlist] = await Promise.all([collectFiles(rootDir), readAllowlist()]);
const violations = [];

for (const file of files.sort()) {
  const lines = await countLines(file);
  if (lines > LIMIT && !allowlist.has(file)) {
    violations.push({ file, lines });
  }
}

if (violations.length > 0) {
  console.error(`Found ${violations.length} file(s) above ${LIMIT} lines not in allowlist:`);
  for (const violation of violations) {
    console.error(`- ${violation.file}: ${violation.lines}`);
  }
  process.exit(1);
}

console.log(`Line check passed for ${files.length} TS/TSX file(s). Limit: ${LIMIT}.`);
