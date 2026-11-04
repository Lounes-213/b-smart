import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const webDir = path.join(rootDir, "apps", "web");
const vercelOutput = path.join(rootDir, ".vercel", "output");

console.log("1. Building @bb/web...");
execSync("pnpm --filter @bb/web build", { cwd: rootDir, stdio: "inherit" });

console.log("2. Preparing .vercel/output...");
if (fs.existsSync(vercelOutput)) {
  fs.rmSync(vercelOutput, { recursive: true, force: true });
}
fs.mkdirSync(vercelOutput, { recursive: true });

// 1. config.json
const config = {
  version: 3,
  routes: [
    {
      src: "/bs-mobile.apk",
      status: 302,
      headers: {
        Location: "https://github.com/Lounes-213/b-smart/releases/latest/download/bs-mobile.apk",
      },
    },
    { handle: "filesystem" },
    { src: "/(.*)", dest: "/index" },
  ],
};
fs.writeFileSync(path.join(vercelOutput, "config.json"), JSON.stringify(config, null, 2));

// 2. static files
const staticDir = path.join(vercelOutput, "static");
const clientDir = path.join(webDir, "dist", "client");
fs.cpSync(clientDir, staticDir, { recursive: true });

// 3. functions/index.func
const funcDir = path.join(vercelOutput, "functions", "index.func");
fs.mkdirSync(funcDir, { recursive: true });

const serverDir = path.join(webDir, "dist", "server");
fs.cpSync(serverDir, funcDir, { recursive: true });

fs.writeFileSync(path.join(funcDir, "package.json"), JSON.stringify({ type: "module" }, null, 2));

const vcConfig = {
  runtime: "nodejs22.x",
  handler: "entry.js",
  launcherType: "Nodejs",
};
fs.writeFileSync(path.join(funcDir, ".vc-config.json"), JSON.stringify(vcConfig, null, 2));

const entryCode = `import app from "./index.js";
import { Readable } from "node:stream";

export default async function handler(req, res) {
  try {
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    const url = new URL(req.url, \`\${protocol}://\${host}\`);

    if (url.pathname === "/bs-mobile.apk") {
      res.writeHead(302, {
        Location: "https://github.com/Lounes-213/b-smart/releases/latest/download/bs-mobile.apk",
      });
      res.end();
      return;
    }

    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (Array.isArray(value)) {
        for (const v of value) headers.append(key, v);
      } else if (value !== undefined) {
        headers.set(key, value);
      }
    }

    const request = new Request(url, {
      method: req.method,
      headers,
      body: ["GET", "HEAD"].includes(req.method) ? undefined : req,
      duplex: "half",
    });

    const response = await app.fetch(request, process.env, {});

    res.statusCode = response.status;
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    if (response.body) {
      Readable.fromWeb(response.body).pipe(res);
    } else {
      res.end();
    }
  } catch (err) {
    console.error("Vercel function error:", err);
    res.statusCode = 500;
    res.end("Internal Server Error: " + err.message);
  }
}
`;
fs.writeFileSync(path.join(funcDir, "entry.js"), entryCode);

console.log("Vercel build output prepared successfully in .vercel/output!");
