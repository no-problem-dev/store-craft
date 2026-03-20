import React from "react";
import type { ScreenshotTheme } from "../themes";

interface TextOverlayProps {
  headline: string;
  subtext?: string;
  theme: ScreenshotTheme;
  /** Position of text: "top" (above device) or "bottom" (below device) */
  position?: "top" | "bottom";
  /** Maximum width as percentage of container */
  maxWidth?: string;
}

/**
 * Text overlay for screenshot captions.
 * Renders headline + optional subtext with theme-appropriate styling.
 */
export function TextOverlay({
  headline,
  subtext,
  theme,
  position = "top",
  maxWidth = "85%",
}: TextOverlayProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        maxWidth,
        gap: 16,
        order: position === "top" ? -1 : 1,
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: 72,
          fontWeight: theme.text.headlineWeight,
          fontFamily: theme.text.fontFamily,
          color: theme.text.headlineColor,
          lineHeight: 1.25,
          letterSpacing: "-0.02em",
        }}
      >
        {headline}
      </h1>
      {subtext && (
        <p
          style={{
            margin: 0,
            fontSize: 40,
            fontWeight: 400,
            fontFamily: theme.text.fontFamily,
            color: theme.text.subtextColor,
            lineHeight: 1.5,
          }}
        >
          {subtext}
        </p>
      )}
    </div>
  );
}
