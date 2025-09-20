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
    title: "Page Not Found - AxieStudio",
    description: "The requested page was not found.",
    openGraph: {
      // Let Vercel handle URL automatically
      title: "Page Not Found - AxieStudio",
      description: "The requested page was not found.",
      siteName: "AxieStudio",
      images: ["/favicon.ico"],
    },
  };
};

const DynamicPage: FC<Props> = async ({ params: { slug } }) => {
  // Since we don't use Sanity CMS, all dynamic pages should return 404
  notFound();
};

export default DynamicPage;
