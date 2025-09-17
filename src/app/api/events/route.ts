// Dependencies
import { NextResponse } from "next/server";

/**
 * Simple events API endpoint for AxieStudio
 * Returns empty data since we don't use Sanity CMS
 *
 * @param {Request} request
 * @return {Response}
 */
export async function GET(request: Request) {
  return NextResponse.json({
    data: {
      count: 0,
      results: [],
    },
  });
}

export const OPTIONS = async () => {
  return NextResponse.json({});
};
