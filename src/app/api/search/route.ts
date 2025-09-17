import { NextResponse } from "next/server";

/**
 * Simple search API endpoint for AxieStudio
 * Returns empty data since we don't use Sanity CMS
 */
export async function GET(request: Request) {
  return NextResponse.json({ posts: [] });
}
