// Components
import PageLayout from "@/components/layout/page";
import Display from "@/components/ui/Display";
import { BackgroundGradient } from "@/components/BackgroundGradient";
import { Metadata, NextPage } from "next";
import Text from "@/components/ui/text";

export const dynamic = "force-static";

const BlogIndex: NextPage = async () => {
  return (
    <PageLayout className="layout" type="normal">
      <BackgroundGradient />
      <section className="container py-4">
        <div className="row">
          <div className="col d-grid gap-4">
            <Display size={700} tagName="h1">
              Blog
            </Display>
            <Text size={200} className="text-white">
              Coming soon! Our blog will feature the latest updates, tutorials, and insights about AxieStudio.
            </Text>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="row">
          <div className="col">
            <div className="d-grid gap-4 position-relative" id="blog-section">
              <Display
                size={400}
                style={{ paddingLeft: 11, paddingTop: "1rem" }}
              >
                No Posts Yet
              </Display>
              <Text size={200} className="text-white" style={{ paddingLeft: 11 }}>
                We're working on creating valuable content for you. Check back soon!
              </Text>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export const metadata: Metadata = {
  title: "Blog | AxieStudio - Customer Service Automation",
  openGraph: {
    url: "https://axiestudio.se/blog",
    siteName: "AxieStudio",
    images: [
      {
        url: "/favicon.ico",
        width: 1200,
        height: 630,
        alt: "AxieStudio - Customer Service Automation",
      },
    ],
  },
  description:
    "Coming soon! Our blog will feature the latest updates, tutorials, and insights about AxieStudio customer service automation.",
};

export default BlogIndex;
