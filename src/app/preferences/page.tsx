//Components
import Page from "@/components/layout/page";
import Template from "@/components/pages/Preferences/Template";
import type { Metadata } from "next";
import { Suspense } from "react";

export const generateMetadata = (): Metadata => {
  return {
    title: "Privacy Preferences | AxieStudio",
    description: "AxieStudio Privacy Preferences and Cookie Management",
  };
};

const Preferences = async () => {
  return (
    <Page className="layout " type="normal">
      <Suspense fallback={<div>Loading...</div>}>
        <Template />
      </Suspense>
    </Page>
  );
};

export default Preferences;
