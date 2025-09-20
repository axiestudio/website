import Page from "@/components/layout/page";
import Template from "@/components/pages/DesktopFormComplete/Template";
import type { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  return {
    title: "Download Complete - AxieStudio Desktop App | AxieStudio",
    description: "Your AxieStudio desktop app download is ready. Check your email for download links and installation instructions.",
    openGraph: {
      title: "Download Complete - AxieStudio Desktop App | AxieStudio", 
      description: "Your AxieStudio desktop app download is ready. Check your email for download links and installation instructions.",
      siteName: "AxieStudio",
      images: ["/favicon.ico"],
    },
  };
};

const DesktopFormComplete = async () => {
  return (
    <Page className="layout" type="normal">
      <Template />
    </Page>
  );
};

export default DesktopFormComplete;
