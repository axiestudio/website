import { NextResponse } from "next/server";

export async function GET() {
  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AxieStudio Blog</title>
    <description>AxieStudio customer service automation solutions and insights.</description>
    <link>https://axiestudio.se/blog</link>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://axiestudio.se/blog/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>https://axiestudio.se/favicon.ico</url>
      <title>AxieStudio Blog</title>
      <link>https://axiestudio.se/blog</link>
    </image>
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
