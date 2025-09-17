import { type NextRequest, NextResponse } from "next/server";

/**
 * Simple revalidate API endpoint for AxieStudio
 * Returns unauthorized since we don't use Sanity CMS webhooks
 */
export async function POST(req: NextRequest) {
  return new Response("Revalidation not available", { status: 401 });
}

export const OPTIONS = async () => {
  return NextResponse.json({});
};
