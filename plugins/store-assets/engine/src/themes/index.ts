/**
 * Screenshot theme definitions.
 *
 * Each theme defines the visual style for screenshot backgrounds,
 * text overlays, and device frame presentation.
 */

export interface ScreenshotTheme {
  id: string;
  name: string;
  /** Background style */
  background: {
    type: "gradient" | "solid" | "image";
    /** CSS gradient or color value */
    value: string;
  };
  /** Text overlay style */
  text: {
    /** Primary headline color */
    headlineColor: string;
    /** Subtext color */
    subtextColor: string;
    /** Font family */
    fontFamily: string;
    /** Font weight for headlines */
    headlineWeight: number;
  };
  /** Device frame style */
  device: {
    /** Shadow behind device */
    shadow: string;
    /** Border around device */
    border: string;
    /** Scale factor (0.5-1.0) */
    scale: number;
  };
}

export const THEMES: Record<string, ScreenshotTheme> = {
  ocean: {
    id: "ocean",
    name: "Ocean Blue",
    background: {
      type: "gradient",
      value: "linear-gradient(160deg, #0A1628 0%, #0D2847 30%, #0077BE 70%, #00A8CC 100%)",
    },
    text: {
      headlineColor: "#FFFFFF",
      subtextColor: "rgba(255,255,255,0.7)",
      fontFamily: "'Hiragino Sans', 'Noto Sans JP', sans-serif",
      headlineWeight: 700,
    },
    device: {
      shadow: "0 40px 120px rgba(0,0,0,0.5)",
      border: "none",
      scale: 0.65,
    },
  },
  midnight: {
    id: "midnight",
    name: "Midnight Dark",
    background: {
      type: "gradient",
      value: "linear-gradient(160deg, #0D0D0D 0%, #1A1A2E 40%, #16213E 100%)",
    },
    text: {
      headlineColor: "#FFFFFF",
      subtextColor: "rgba(255,255,255,0.6)",
      fontFamily: "'Hiragino Sans', 'Noto Sans JP', sans-serif",
      headlineWeight: 700,
    },
    device: {
      shadow: "0 40px 100px rgba(0,0,0,0.7)",
      border: "1px solid rgba(255,255,255,0.1)",
      scale: 0.65,
    },
  },
  sunrise: {
    id: "sunrise",
    name: "Sunrise Warm",
    background: {
      type: "gradient",
      value: "linear-gradient(160deg, #FF6B35 0%, #F7931E 30%, #FFD700 70%, #FFF8DC 100%)",
    },
    text: {
      headlineColor: "#1A0A00",
      subtextColor: "rgba(26,10,0,0.7)",
      fontFamily: "'Hiragino Sans', 'Noto Sans JP', sans-serif",
      headlineWeight: 700,
    },
    device: {
      shadow: "0 40px 100px rgba(0,0,0,0.3)",
      border: "none",
      scale: 0.65,
    },
  },
  minimal: {
    id: "minimal",
    name: "Minimal White",
    background: {
      type: "solid",
      value: "#F8F9FA",
    },
    text: {
      headlineColor: "#1A1A1A",
      subtextColor: "#666666",
      fontFamily: "'Hiragino Sans', 'Noto Sans JP', sans-serif",
      headlineWeight: 700,
    },
    device: {
      shadow: "0 20px 60px rgba(0,0,0,0.15)",
      border: "1px solid rgba(0,0,0,0.08)",
      scale: 0.65,
    },
  },
};

export const DEFAULT_THEME = THEMES.ocean;
