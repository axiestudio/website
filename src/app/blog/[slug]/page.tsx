import { notFound } from "next/navigation";
import { NextPage } from "next";

export async function generateStaticParams() {
  // Return empty array since we don't use Sanity CMS
  return [];
}

export const generateMetadata = async ({
  params: _params,
}: {
  params: { slug: string };
}) => {
  return {
    title: "Blog Post Not Found - AxieStudio",
    description: "The requested blog post was not found.",
    openGraph: {
      title: "Blog Post Not Found - AxieStudio",
      description: "The requested blog post was not found.",
      images: ["/favicon.ico"],
    },
  };
};

const BlogPostPage: NextPage<{ params: { slug: string } }> = async ({
  params: _params,
}) => {
  // Since we don't use Sanity CMS, all blog posts should return 404
  notFound();
};

export default BlogPostPage;

export const dynamic = "force-static";
