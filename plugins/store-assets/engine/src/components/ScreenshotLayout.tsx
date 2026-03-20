import React from "react";
import type { DeviceSpec } from "../devices";
import type { ScreenshotTheme } from "../themes";
import { DeviceFrame } from "./DeviceFrame";
import { TextOverlay } from "./TextOverlay";

interface ScreenshotLayoutProps {
  /** Full output size (App Store required dimensions) */
  device: DeviceSpec;
  theme: ScreenshotTheme;
  /** Headline text */
  headline: string;
  /** Optional subtext */
  subtext?: string;
  /** Text position */
  textPosition?: "top" | "bottom";
  /** App screen content (rendered inside device frame) */
  children: React.ReactNode;
}

/**
 * Complete screenshot layout combining background, text overlay, and device frame.
 * This is the primary composition component for generating store screenshots.
 *
 * Layout structure:
 * - Full-size background (gradient/solid/image)
 * - Text overlay (headline + subtext)
 * - Device frame with app content
 */
export function ScreenshotLayout({
  device,
  theme,
  headline,
  subtext,
  textPosition = "top",
  children,
}: ScreenshotLayoutProps) {
  return (
    <div
      id="screenshot-root"
      style={{
        width: device.frame.width,
        height: device.frame.height,
        background: theme.background.value,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 60,
        padding: "80px 60px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <TextOverlay
        headline={headline}
        subtext={subtext}
        theme={theme}
        position={textPosition}
      />
      <DeviceFrame device={device} theme={theme}>
        {children}
      </DeviceFrame>
    </div>
  );
}
