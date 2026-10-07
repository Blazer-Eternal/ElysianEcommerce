// Starts the API and the web app together from the repo root.
// Prefixes each output line so the two logs stay readable side by side.
// Zero dependencies — plain node, so there is nothing extra to install.
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const NPM = process.platform === "win32" ? "npm.cmd" : "npm";
const IS_TTY = process.stdout.isTTY;
const paint = (code, text) => (IS_TTY ? `\x1b[${code}m${text}\x1b[0m` : text);

const TARGETS = [
  { name: "api", cwd: path.join(ROOT, "backend"), color: 36 },
  { name: "web", cwd: path.join(ROOT, "frontend"), color: 35 },
];

const children = [];
let shuttingDown = false;

function pipe(stream, sink, prefix) {
  let pending = "";
  stream.setEncoding("utf8");
  stream.on("data", (chunk) => {
    pending += chunk;
    const lines = pending.split(/\r?\n/);
    pending = lines.pop() ?? "";
    for (const line of lines) sink.write(prefix + line + "\n");
  });
  stream.on("end", () => {
    if (pending) sink.write(prefix + pending + "\n");
  });
}

function shutdown(code) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (child.exitCode !== null || child.signalCode) continue;
    try {
      if (process.platform === "win32") {
        spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
      } else {
        child.kill("SIGTERM");
      }
    } catch {
      // process already gone
    }
  }
  setTimeout(() => process.exit(code), 250).unref();
}

for (const target of TARGETS) {
  const child = spawn(NPM, ["run", "dev"], {
    cwd: target.cwd,
    env: process.env,
    shell: process.platform === "win32",
  });
  children.push(child);

  const prefix = paint(target.color, `[${target.name}]`) + " ";
  pipe(child.stdout, process.stdout, prefix);
  pipe(child.stderr, process.stderr, prefix);

  child.on("error", (error) => {
    process.stderr.write(`${prefix}failed to start: ${error.message}\n`);
    shutdown(1);
  });

  child.on("exit", (code, signal) => {
    if (shuttingDown) return;
    process.stdout.write(`${prefix}stopped (${signal ?? `code ${code}`})\n`);
    shutdown(code ?? 0);
  });
}

process.stdout.write(`${paint(32, "elysian")} dev — api: http://localhost:5000  web: http://localhost:5173\n`);
process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
