"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ScreenshotLayout } from "../../components/ScreenshotLayout";
import { DEVICES, DEFAULT_DEVICE } from "../../devices";
import { THEMES, DEFAULT_THEME } from "../../themes";
import type { ScreenshotConfig, ScreenshotDef } from "../../utils/config";

/**
 * Render page for store-craft engine.
 *
 * Loads a real simulator screenshot PNG from the `screen` field in config,
 * and composites it inside a device frame with text overlay and background.
 *
 * The `screen` field must be an absolute path to a PNG file captured from
 * the iOS Simulator (via XcodeBuildMCP, xcrun simctl, or XCUITest).
 */

function RenderContent() {
  const params = useSearchParams();
  const configPath = params.get("config");
  const screenshotId = params.get("id");
  const deviceId = params.get("device") || "iphone-6.9";

  const [config, setConfig] = useState<ScreenshotConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!configPath) {
      setError("Missing config parameter");
      return;
    }
    fetch(`/api/config?path=${encodeURIComponent(configPath)}`)
      .then((r) => r.json())
      .then(setConfig)
      .catch((e) => setError(e.message));
  }, [configPath]);

  if (error) {
    return <div style={{ color: "red", padding: 40, fontSize: 24 }}>{error}</div>;
  }

  if (!config) {
    return <div style={{ padding: 40, fontSize: 24 }}>Loading config...</div>;
  }

  const screenshot = config.screenshots.find(
    (s: ScreenshotDef) => s.id === screenshotId
  );
  if (!screenshot) {
    return (
      <div style={{ color: "red", padding: 40, fontSize: 24 }}>
        Screenshot &quot;{screenshotId}&quot; not found in config
      </div>
    );
  }

  const device = DEVICES[deviceId] || DEFAULT_DEVICE;
  const themeId = screenshot.theme || config.theme || "ocean";
  const theme = THEMES[themeId] || DEFAULT_THEME;

  // Resolve the screen image path.
  // The `screen` field is a path to a real simulator screenshot PNG.
  // It can be absolute, or relative to the config file's directory.
  const screenImageUrl = `/api/image?path=${encodeURIComponent(screenshot.screen)}`;

  return (
    <ScreenshotLayout
      device={device}
      theme={theme}
      headline={screenshot.headline}
      subtext={screenshot.subtext}
      textPosition={screenshot.textPosition}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={screenImageUrl}
        alt={screenshot.id}
        style={{
          width: device.frame.width,
          height: device.frame.height,
          objectFit: "cover",
          display: "block",
        }}
      />
    </ScreenshotLayout>
  );
}

export default function RenderPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RenderContent />
    </Suspense>
  );
}
