//Components
import Page from "@/components/layout/page";
import Template from "@/components/pages/Newsletter/Template/Template";
import type { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  return {
    title: "AI++ Newsletter | AxieStudio",
    description:
      "Sign up for the AI++ Newsletter to stay updated with the latest in AI, Customer Service Automation, and AxieStudio features.",
  };
};

const Newsletter = async () => {
  return (
    <Page className="layout" type="normal">
      <Template />
    </Page>
  );
};

export default Newsletter;
