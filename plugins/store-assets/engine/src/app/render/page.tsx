"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ScreenshotLayout } from "../../components/ScreenshotLayout";
import { DEVICES, DEFAULT_DEVICE } from "../../devices";
import { THEMES, DEFAULT_THEME } from "../../themes";
import type { ScreenshotConfig, ScreenshotDef } from "../../utils/config";

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

  return (
    <ScreenshotLayout
      device={device}
      theme={theme}
      headline={screenshot.headline}
      subtext={screenshot.subtext}
      textPosition={screenshot.textPosition}
    >
      {/* App screen placeholder — the screenshot-designer agent generates
          actual screen components per app. For now, render a styled placeholder. */}
      <AppScreenPlaceholder
        screenId={screenshot.screen}
        device={device}
        appName={config.app.name}
      />
    </ScreenshotLayout>
  );
}

function AppScreenPlaceholder({
  screenId,
  device,
  appName,
}: {
  screenId: string;
  device: typeof DEFAULT_DEVICE;
  appName: string;
}) {
  return (
    <div
      style={{
        width: device.frame.width,
        height: device.frame.height,
        background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Hiragino Sans', sans-serif",
        color: "#fff",
        gap: 20,
      }}
    >
      <div style={{ fontSize: 48, fontWeight: 700 }}>{appName}</div>
      <div style={{ fontSize: 32, opacity: 0.5 }}>Screen: {screenId}</div>
      <div style={{ fontSize: 24, opacity: 0.3 }}>
        Replace with actual app screen component
      </div>
    </div>
  );
}

export default function RenderPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RenderContent />
    </Suspense>
  );
}
