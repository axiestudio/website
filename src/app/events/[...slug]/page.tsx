// Dependencies
import { FC } from "react";
import { notFound } from "next/navigation";

// Props types
type Props = {
  params: {
    slug: string[];
  };
};

/**
 * Define the dynamic paths
 */
export const dynamic = "force-static";
export const dynamicParams = true;

export async function generateStaticParams() {
  // Return empty array since we don't use Sanity CMS
  return [];
}

/**
 * Generate the Metadata settings for this pages
 */
export const generateMetadata = async ({ params: { slug } }: Props) => {
  return {
    title: "Event Not Found - AxieStudio",
    description: "The requested event was not found.",
    openGraph: {
      url: `https://axiestudio.se/events/${slug.join("/")}`,
      title: "Event Not Found - AxieStudio",
      description: "The requested event was not found.",
      siteName: "AxieStudio",
      images: ["/favicon.ico"],
    },
  };
};

const DynamicPage: FC<Props> = async ({ params: _params }: Props) => {
  // Since we don't use Sanity CMS, all events should return 404
  notFound();
};

export default DynamicPage;
