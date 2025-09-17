// Dependencies
import type { Metadata } from "next";
import * as Sentry from "@sentry/nextjs";

// Components
import HeaderScripts from "@/components/scripts/Header";
import { DataAttributeTracker } from "@/components/DataAttributeTracker";

// Styles
import "@/styles/index.scss";

export const generateMetadata = (): Metadata => {
  return {
    other: {
      ...Sentry.getTraceData(),
    },
    metadataBase: new URL("https://www.axiestudio.com"),
    title: "AxieStudio | AI-Powered Customer Service Automation",
    description:
      "AxieStudio is a powerful platform for building AI-powered customer service flows. Create booking agents, email automation, and support workflows with Gmail, Calendar, and 100+ integrations.",
    icons: {
      icon: "/favicon.ico",
    },
    keywords: [
      "AxieStudio",
      "AI",
      "Customer Service",
      "Automation",
      "Booking Agent",
      "Email Automation",
      "Support Flows",
      "Gmail Integration",
      "Calendar Integration",
    ],
    authors: [{ name: "AxieStudio", url: "https://axiestudio.com" }],
    creator: "AxieStudio",
    publisher: "AxieStudio",
    openGraph: {
      title: "AxieStudio | AI-Powered Customer Service Automation",
      description:
        "AxieStudio is a powerful platform for building AI-powered customer service flows. Create booking agents, email automation, and support workflows.",
      url: "https://axiestudio.com",
      siteName: "AxieStudio",
      images: [
        {
          url: "/images/og-image.png",
          width: 1200,
          height: 630,
          alt: "AxieStudio - AI-Powered Customer Service",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "AxieStudio | AI-Powered Customer Service Automation",
      description:
        "AxieStudio is a powerful platform for building AI-powered customer service flows. Create booking agents, email automation, and support workflows.",
      images: ["/images/og-image.png"],
    },
  };
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <HeaderScripts />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link
          rel="alternate"
          type="application/rss+xml"
          href="/blog/rss.xml"
          title="AxieStudio RSS Feed"
        />
      </head>
      <body>
        <main className="layout layout-dark">{children}</main>
        <DataAttributeTracker />
      </body>
    </html>
  );
}
