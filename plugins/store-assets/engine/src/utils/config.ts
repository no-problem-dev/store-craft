/**
 * Screenshot project configuration schema.
 *
 * Each app creates a `store-craft.config.json` in its project root.
 * The engine reads this config to determine what to render.
 */

export interface ScreenshotConfig {
  /** App metadata */
  app: {
    name: string;
    tagline: string;
    bundleId?: string;
  };
  /** Target devices */
  devices: string[];
  /** Theme ID or custom theme */
  theme: string;
  /** Locale for text */
  locale: string;
  /** Screenshot definitions */
  screenshots: ScreenshotDef[];
  /** Output directory (relative to project root) */
  outputDir: string;
}

export interface ScreenshotDef {
  /** Unique screenshot ID (used for filename) */
  id: string;
  /** Sort order (1-10) */
  order: number;
  /** Headline text */
  headline: string;
  /** Optional subtext */
  subtext?: string;
  /** Text position */
  textPosition?: "top" | "bottom";
  /** Absolute path to a real simulator screenshot PNG */
  screen: string;
  /** Optional per-screenshot theme override */
  theme?: string;
}

/** Default config template */
export const DEFAULT_CONFIG: ScreenshotConfig = {
  app: {
    name: "My App",
    tagline: "Your amazing app",
  },
  devices: ["iphone-6.9"],
  theme: "ocean",
  locale: "ja",
  screenshots: [],
  outputDir: "./store-assets/screenshots",
};

/**
 * Load config from a JSON file path.
 */
export async function loadConfig(path: string): Promise<ScreenshotConfig> {
  const fs = await import("fs/promises");
  const raw = await fs.readFile(path, "utf-8");
  const parsed = JSON.parse(raw) as Partial<ScreenshotConfig>;
  return { ...DEFAULT_CONFIG, ...parsed };
}
