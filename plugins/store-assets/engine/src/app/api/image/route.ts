import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs/promises";
import * as path from "path";

/**
 * Serves a local PNG file as an image response.
 * Used by the render page to load real simulator screenshots.
 *
 * GET /api/image?path=/absolute/path/to/screenshot.png
 */
export async function GET(request: NextRequest) {
  const imagePath = request.nextUrl.searchParams.get("path");

  if (!imagePath) {
    return NextResponse.json({ error: "Missing path parameter" }, { status: 400 });
  }

  try {
    const resolvedPath = path.resolve(imagePath);
    const data = await fs.readFile(resolvedPath);
    const ext = path.extname(resolvedPath).toLowerCase();

    const mimeTypes: Record<string, string> = {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
    };

    return new NextResponse(data, {
      headers: {
        "Content-Type": mimeTypes[ext] || "image/png",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to load image: ${message}` },
      { status: 404 }
    );
  }
}
