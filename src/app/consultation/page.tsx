//Components
import Page from "@/components/layout/page";
import Template from "@/components/pages/Consultation/Template/Template";
import type { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  return {
    title: "Free Consultation | AxieStudio",
    description:
      "Book a free consultation with our AxieStudio experts to discuss your customer service automation needs and get personalized recommendations.",
  };
};

const Consultation = async () => {
  return (
    <Page className="layout" type="normal">
      <Template />
    </Page>
  );
};

export default Consultation;
