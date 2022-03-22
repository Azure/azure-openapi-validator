import { spawn, spawnSync } from "child_process";
import { readFileSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";

function read(filename) {
  const txt = readFileSync(filename, "utf8")
    .replace(/\r/gm, "")
    .replace(/\n/gm, "«")
    .replace(/\/\*.*?\*\//gm, "")
    .replace(/«/gm, "\n")
    .replace(/\s+\/\/.*/g, "");
  return JSON.parse(txt);
}

export const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
export const autorest = resolve(repoRoot, "eng/scripts/node_modules/.bin/autorest");

const rush = read(`${repoRoot}/rush.json`);

export function forEachProject(onEach) {
  // load all the projects
  for (const each of rush.projects) {
    const packageName = each.packageName;
    const projectFolder = resolve(`${repoRoot}/${each.projectFolder}`);
    const project = JSON.parse(readFileSync(`${projectFolder}/package.json`));
    onEach(packageName, projectFolder, project, each);
  }
}

export function npmForEach(cmd, options) {
  forEachProject((name, location, project) => {
    if (project.scripts[cmd] || cmd === "pack") {
      const args = cmd === "pack" ? [cmd] : ["run", cmd];
      run("npm", args, { cwd: location, ...options });
    }
  });
}

// We could use { shell: true } to let Windows find .cmd, but that causes other issues.
// It breaks ENOENT checking for command-not-found and also handles command/args with spaces
// poorly.
const isCmdOnWindows = ["rush", "npm", "code"];

export class CommandFailedError extends Error {
  constructor(msg, proc) {
    super(msg);
    this.proc = proc;
  }
}

export function run(command, args, options) {
  if (!options?.silent) {
    console.log();
    console.log(`> ${command} ${args.join(" ")}`);
  }

  options = {
    stdio: "inherit",
    sync: true,
    throwOnNonZeroExit: true,
    ...options,
  };

  if (process.platform === "win32" && isCmdOnWindows.includes(command)) {
    command += ".cmd";
  }

  const proc = (options.sync ? spawnSync : spawn)(command, args, options);
  if (proc.error) {
    if (options.ignoreCommandNotFound && proc.error.code === "ENOENT") {
      console.log(`Skipped: Command \`${command}\` not found.`);
    } else {
      throw proc.error;
    }
  } else if (options.throwOnNonZeroExit && proc.status !== undefined && proc.status !== 0) {
    throw new CommandFailedError(
      `Command \`${command} ${args.join(" ")}\` failed with exit code ${proc.status}`,
      proc
    );
  }

  return proc;
}

export function clearScreen() {
  process.stdout.write("\x1bc");
}


export function logWithTime(msg) {
  const time = new Date().toLocaleTimeString();
  console.log(`[${time}] ${msg}`);
}

export function checkForChangedFiles(cwd, comment = undefined, options = {}) {
  if (comment && !options.silent) {
    console.log();
    console.log(comment);
  }

  const proc = run("git", ["status", "--porcelain"], {
    encoding: "utf-8",
    stdio: [null, "pipe", "pipe"],
    cwd,
    ...options,
  });

  if (proc.stdout && !options.silent) {
    console.log(proc.stdout);
  }

  if (proc.stderr && !options.silent) {
    console.error(proc.stderr);
  }

  return proc.stdout || proc.stderr;
}
