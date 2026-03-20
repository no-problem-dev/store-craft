/**
 * Screenshot rendering script.
 *
 * Usage:
 *   tsx src/render.ts --config <path-to-config.json>
 *   tsx src/render.ts --all        # render all screenshots
 *   tsx src/render.ts --id <id>    # render specific screenshot
 *
 * This script:
 * 1. Starts the Next.js dev server
 * 2. Uses Playwright to navigate to each screenshot page
 * 3. Captures the page at the exact App Store resolution
 * 4. Saves PNG files to the configured output directory
 */

import { chromium } from "playwright";
import { spawn, type ChildProcess } from "child_process";
import * as path from "path";
import * as fs from "fs/promises";

const ENGINE_PORT = 3847;
const ENGINE_URL = `http://localhost:${ENGINE_PORT}`;

async function waitForServer(url: string, timeoutMs = 30000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // Server not ready yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server at ${url} did not start within ${timeoutMs}ms`);
}

function startDevServer(cwd: string): ChildProcess {
  const child = spawn("npx", ["next", "dev", "-p", String(ENGINE_PORT)], {
    cwd,
    stdio: "pipe",
    env: { ...process.env, NODE_ENV: "development" },
  });
  child.stderr?.on("data", (d) => {
    const msg = d.toString();
    if (!msg.includes("warn")) process.stderr.write(msg);
  });
  return child;
}

interface RenderOptions {
  configPath?: string;
  screenshotId?: string;
  all?: boolean;
}

function parseArgs(): RenderOptions {
  const args = process.argv.slice(2);
  const opts: RenderOptions = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--config" && args[i + 1]) opts.configPath = args[++i];
    if (args[i] === "--id" && args[i + 1]) opts.screenshotId = args[++i];
    if (args[i] === "--all") opts.all = true;
  }
  return opts;
}

async function main() {
  const opts = parseArgs();
  const engineDir = path.resolve(__dirname, "..");
  const configPath = opts.configPath || path.resolve(process.cwd(), "store-craft.config.json");

  // Load config
  let config;
  try {
    const raw = await fs.readFile(configPath, "utf-8");
    config = JSON.parse(raw);
  } catch {
    console.error(`Config not found: ${configPath}`);
    console.error('Run "store-screenshot" skill to generate a config.');
    process.exit(1);
  }

  const outputDir = path.resolve(path.dirname(configPath), config.outputDir || "./store-assets/screenshots");
  await fs.mkdir(outputDir, { recursive: true });

  // Filter screenshots
  const screenshots = opts.screenshotId
    ? config.screenshots.filter((s: { id: string }) => s.id === opts.screenshotId)
    : config.screenshots;

  if (screenshots.length === 0) {
    console.error("No screenshots to render.");
    process.exit(1);
  }

  console.log(`Rendering ${screenshots.length} screenshot(s)...`);

  // Start dev server
  console.log("Starting render engine...");
  const server = startDevServer(engineDir);

  try {
    await waitForServer(ENGINE_URL);
    console.log("Engine ready.");

    // Launch browser
    const browser = await chromium.launch();

    for (const ss of screenshots) {
      const device = config.devices?.[0] || "iphone-6.9";
      const pageUrl = `${ENGINE_URL}/render?` + new URLSearchParams({
        config: configPath,
        id: ss.id,
        device,
      }).toString();

      const page = await browser.newPage();

      // Set viewport to exact App Store dimensions
      const { DEVICES } = await import("./devices/index.js");
      const deviceSpec = DEVICES[device] || DEVICES["iphone-6.9"];
      await page.setViewportSize({
        width: deviceSpec.frame.width,
        height: deviceSpec.frame.height,
      });

      await page.goto(pageUrl, { waitUntil: "networkidle" });

      // Wait for content to render
      await page.waitForTimeout(1000);

      const filename = `${String(ss.order).padStart(2, "0")}_${ss.id}.png`;
      const outputPath = path.join(outputDir, filename);

      await page.screenshot({
        path: outputPath,
        type: "png",
        clip: {
          x: 0,
          y: 0,
          width: deviceSpec.frame.width,
          height: deviceSpec.frame.height,
        },
      });

      console.log(`  ✓ ${filename} (${deviceSpec.frame.width}×${deviceSpec.frame.height})`);
      await page.close();
    }

    await browser.close();
    console.log(`\nDone! ${screenshots.length} screenshots saved to ${outputDir}`);
  } finally {
    server.kill();
  }
}

main().catch((err) => {
  console.error("Render failed:", err);
  process.exit(1);
});
