import Page from "@/components/layout/page";
import Template from "@/components/pages/DesktopForm/Template";
import type { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  return {
    title: "Download AxieStudio Desktop App | AxieStudio",
    description: "Download the AxieStudio desktop application for Windows, macOS, and Linux. Get started with AI-powered customer service automation.",
    openGraph: {
      title: "Download AxieStudio Desktop App | AxieStudio",
      description: "Download the AxieStudio desktop application for Windows, macOS, and Linux. Get started with AI-powered customer service automation.",
      siteName: "AxieStudio",
      images: ["/favicon.ico"],
    },
  };
};

const DesktopForm = async () => {
  return (
    <Page className="layout" type="normal">
      <Template />
    </Page>
  );
};

export default DesktopForm;
