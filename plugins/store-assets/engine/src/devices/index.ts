/**
 * Device frame definitions for App Store screenshots.
 *
 * All dimensions are in pixels at the required App Store resolution.
 * The `viewport` is the inner screen area where app content is rendered.
 * The `frame` is the full image output size.
 */

export interface DeviceSpec {
  id: string;
  name: string;
  /** Full output image size (px) */
  frame: { width: number; height: number };
  /** Inner viewport for app content (px) */
  viewport: { width: number; height: number; top: number; left: number };
  /** Corner radius for the screen area */
  screenRadius: number;
  /** Whether this device has Dynamic Island */
  dynamicIsland: boolean;
  /** Status bar height (for mockup rendering) */
  statusBarHeight: number;
  /** Home indicator height */
  homeIndicatorHeight: number;
}

export const DEVICES: Record<string, DeviceSpec> = {
  "iphone-6.9": {
    id: "iphone-6.9",
    name: 'iPhone 16 Pro Max (6.9")',
    frame: { width: 1320, height: 2868 },
    viewport: { width: 1320, height: 2868, top: 0, left: 0 },
    screenRadius: 120,
    dynamicIsland: true,
    statusBarHeight: 147,
    homeIndicatorHeight: 102,
  },
  "iphone-6.7": {
    id: "iphone-6.7",
    name: 'iPhone 16 Plus (6.7")',
    frame: { width: 1290, height: 2796 },
    viewport: { width: 1290, height: 2796, top: 0, left: 0 },
    screenRadius: 118,
    dynamicIsland: true,
    statusBarHeight: 141,
    homeIndicatorHeight: 102,
  },
  "iphone-6.5": {
    id: "iphone-6.5",
    name: 'iPhone 11 Pro Max (6.5")',
    frame: { width: 1284, height: 2778 },
    viewport: { width: 1284, height: 2778, top: 0, left: 0 },
    screenRadius: 110,
    dynamicIsland: false,
    statusBarHeight: 132,
    homeIndicatorHeight: 102,
  },
  "ipad-13": {
    id: "ipad-13",
    name: 'iPad Pro 13"',
    frame: { width: 2064, height: 2752 },
    viewport: { width: 2064, height: 2752, top: 0, left: 0 },
    screenRadius: 54,
    dynamicIsland: false,
    statusBarHeight: 72,
    homeIndicatorHeight: 60,
  },
};

/** Default device for iPhone screenshots */
export const DEFAULT_DEVICE = DEVICES["iphone-6.9"];

/** Get all required App Store sizes */
export function getRequiredDevices(): DeviceSpec[] {
  return [DEVICES["iphone-6.9"]];
}
