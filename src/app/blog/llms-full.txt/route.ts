export const dynamic = "force-static";
export const revalidate = 60 * 60; // 1 hour

import type { NextRequest } from "next/server";

/**
 * GET /blog/llms-full.txt – returns a simple message since we don't use Sanity CMS
 */
export async function GET(_req: NextRequest): Promise<Response> {
  const content = `# AxieStudio Blog

AxieStudio blog is not currently configured. Please visit our main website for customer service automation solutions.

`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
