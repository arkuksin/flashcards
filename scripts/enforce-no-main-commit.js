#!/usr/bin/env node
"use strict";

const { execSync, spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function run(cmd, opts = {}) {
  try {
    const res = execSync(cmd, { stdio: ["ignore", "pipe", "pipe"], encoding: "utf8", ...opts });
    return res.trim();
  } catch (e) {
    const msg = e?.stderr?.toString?.() || e?.message || String(e);
    throw new Error(`Command failed: ${cmd}\n${msg}`);
  }
}

function branchExists(name) {
  try {
    run(`git rev-parse --verify --quiet ${name}`);
    return true;
  } catch {
    return false;
  }
}

function slugify(input) {
  const s = (input || "")
    .toLowerCase()
    .replace(/^(feat|fix|chore|docs|refactor|style|test|perf|build|ci|revert)(\(.+?\))?:\s*/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
  if (!s) {
    const ts = new Date()
      .toISOString()
      .replace(/[:T.Z]/g, "-")
      .replace(/-+/g, "-")
      .toLowerCase();
    return `update-${ts}`.slice(0, 60);
  }
  return s.slice(0, 60);
}

function detectType(firstLine) {
  const s = (firstLine || "").trim();
  if (/^(fix|bugfix|hotfix|bug)(\b|:)/i.test(s)) return "bugfix";
  return "feature";
}

function getCurrentBranch() {
  return run("git rev-parse --abbrev-ref HEAD");
}

function switchToNewBranch(name) {
  // Prefer git switch if available, fallback to checkout
  try {
    run(`git switch -c ${name}`);
  } catch {
    run(`git checkout -b ${name}`);
  }
}

(function main() {
  // Guard to avoid recursion if any nested commit triggers this script
  if (process.env.JUNIE_REDIRECTED_COMMIT === "1") {
    process.exit(0);
  }

  const msgPath = process.argv[2];
  if (!msgPath) {
    // Nothing to do if we cannot read the commit message
    process.exit(0);
  }

  let branch;
  try {
    branch = getCurrentBranch();
  } catch (e) {
    // Not a git repo or some error; do not block
    process.exit(0);
  }

  if (branch !== "main") {
    // Allowed, proceed normally
    process.exit(0);
  }

  let message = "";
  try {
    message = fs.readFileSync(msgPath, "utf8");
  } catch (e) {
    // If cannot read message, still block and create a generic branch
    message = "";
  }

  const firstLine = (message.split(/\r?\n/)[0] || "").trim();
  const type = detectType(firstLine);
  const slug = slugify(firstLine);
  let newBranch = `${type}/${slug}`;

  // Ensure uniqueness
  if (branchExists(newBranch)) {
    let i = 2;
    while (branchExists(`${newBranch}-${i}`)) i++;
    newBranch = `${newBranch}-${i}`;
  }

  try {
    switchToNewBranch(newBranch);
  } catch (e) {
    console.error("[Junie] Failed to create/switch to the new branch:");
    console.error(e.message || String(e));
    console.error("Aborting commit on main.");
    process.exit(1);
  }

  console.log(`Direct commits to main are not allowed. A new branch ${newBranch} has been created for you. Please commit there.`);

  // Re-run the commit automatically on the new branch using the same message file
  try {
    const env = { ...process.env, JUNIE_REDIRECTED_COMMIT: "1" };
    const result = spawnSync("git", ["commit", "-F", msgPath], { stdio: "inherit", env });
    if (result.status !== 0) {
      console.error("Automatic commit on the new branch failed. Please run git commit again.");
      process.exit(1);
    }
    console.log(`Commit has been created on ${newBranch}.`);
  } catch (e) {
    console.error("Automatic commit on the new branch failed:");
    console.error(e.message || String(e));
    process.exit(1);
  }

  // Abort the original commit on main (this hook invocation)
  process.exit(1);
})();
