import { NextResponse } from "next/server";

/**
 * Simple disable-preview API endpoint for AxieStudio
 * Returns unauthorized since we don't use Sanity CMS preview
 */
export async function GET(request: Request) {
  return new Response("Preview not available", { status: 401 });
}

export const OPTIONS = async () => {
  return NextResponse.json({});
};
