import { MetadataRoute } from "next";

const CHANGE_FREQUENCIES = {
  ALWAYS: "always",
  HOURLY: "hourly",
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  YEARLY: "yearly",
  NEVER: "never",
} as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://axiestudio.se";

  // Current date for lastModified
  const date = new Date();

  const staticPages = [
    {
      url: baseUrl,
      lastModified: date,
      changeFrequency: CHANGE_FREQUENCIES.MONTHLY,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/newsletter`,
      lastModified: date,
      changeFrequency: CHANGE_FREQUENCIES.MONTHLY,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/consultation`,
      lastModified: date,
      changeFrequency: CHANGE_FREQUENCIES.MONTHLY,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: date,
      changeFrequency: CHANGE_FREQUENCIES.YEARLY,
      priority: 0.3,
    },
  ];

  // Return only static pages since we don't use Sanity CMS
  return staticPages;
}
