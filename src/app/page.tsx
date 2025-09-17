import Page from "@/components/layout/page";
import Template from "@/components/pages/Home/Template";
import type { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  return {
    title: "Home | AxieStudio",
    description: "Welcome to AxieStudio - Automate Customer Service with AI Flows",
  };
};

export default function Home() {
  return (
    <Page className="layout "  type="home">
      <Template />
    </Page>
  );
}
