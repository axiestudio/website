export const dynamic = "force-static";
export const revalidate = 60 * 60; // 1 hour

import type { NextRequest } from "next/server";

/**
 * GET /blog/[slug]/llms.txt – returns a simple message since we don't use Sanity CMS
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
): Promise<Response> {
  const content = `Post not available - AxieStudio blog is not configured`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
