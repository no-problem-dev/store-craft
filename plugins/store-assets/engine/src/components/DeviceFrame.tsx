import React from "react";
import type { DeviceSpec } from "../devices";
import type { ScreenshotTheme } from "../themes";

interface DeviceFrameProps {
  device: DeviceSpec;
  theme: ScreenshotTheme;
  children: React.ReactNode;
}

/**
 * Renders a device frame with the app content inside.
 * The frame includes Dynamic Island (if applicable), status bar area,
 * and home indicator, matching the actual device appearance.
 */
export function DeviceFrame({ device, theme, children }: DeviceFrameProps) {
  const scale = theme.device.scale;
  const scaledWidth = device.frame.width * scale;
  const scaledHeight = device.frame.height * scale;

  return (
    <div
      style={{
        width: scaledWidth,
        height: scaledHeight,
        borderRadius: device.screenRadius * scale,
        overflow: "hidden",
        boxShadow: theme.device.shadow,
        border: theme.device.border,
        position: "relative",
        flexShrink: 0,
      }}
    >
      {/* App content */}
      <div
        style={{
          width: device.frame.width,
          height: device.frame.height,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          overflow: "hidden",
          borderRadius: device.screenRadius,
        }}
      >
        {children}
      </div>

      {/* Dynamic Island overlay */}
      {device.dynamicIsland && (
        <div
          style={{
            position: "absolute",
            top: 33 * scale,
            left: "50%",
            transform: "translateX(-50%)",
            width: 372 * scale,
            height: 111 * scale,
            borderRadius: 60 * scale,
            background: "#000000",
          }}
        />
      )}
    </div>
  );
}
