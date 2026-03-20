import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs/promises";

export async function GET(request: NextRequest) {
  const configPath = request.nextUrl.searchParams.get("path");

  if (!configPath) {
    return NextResponse.json({ error: "Missing path parameter" }, { status: 400 });
  }

  try {
    const raw = await fs.readFile(configPath, "utf-8");
    const config = JSON.parse(raw);
    return NextResponse.json(config);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Failed to load config: ${message}` }, { status: 500 });
  }
}
