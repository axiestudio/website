// Dependencies
import type { Metadata } from "next";

//Components
import Page from "@/components/layout/page";
import Display from "@/components/ui/Display";
import Text from "@/components/ui/text";
import { BackgroundGradient } from "@/components/BackgroundGradient";

export const generateMetadata = (): Metadata => {
  return {
    title: "Events | AxieStudio",
    description: "AxieStudio Events - Coming Soon",
  };
};

const EventsPage = async () => {
  return (
    <Page className="layout " type="normal">
      <BackgroundGradient />
      <section className="container py-4">
        <div className="row">
          <div className="col d-grid gap-4">
            <Display size={700} tagName="h1">
              Events
            </Display>
            <Text size={200} className="text-white">
              Coming soon! We'll be hosting events and webinars about customer service automation with AxieStudio.
            </Text>
          </div>
        </div>
      </section>
    </Page>
  );
};

export default EventsPage;
