import Facebook from "@/components/icons/facebook/Facebook";
import Instagram from "@/components/icons/instagram/Instagram";
import Youtube from "@/components/icons/youtube/Youtube";
import CloudPlatform from "@/components/pages/Home/Notebook/CloudPlatform";
import Langflow from "@/components/pages/Home/Notebook/Langflow";
import Signup from "@/components/pages/Home/Notebook/Signup";


import Apple from "@/components/ui/icons/Apple";
import Windows from "@/components/ui/icons/Windows";


const LIST = [
  {
    title: "Docs",
    link: "https://docs.axiestudio.se/",
    icon: "/assets/icons/docs.svg",
    comingSoon: false,
  },
  {
    title: "Newsletter",
    link: "/newsletter",
    icon: "/assets/icons/newsletter.svg",
    comingSoon: false,
  },
  {
    title: "Consultation",
    link: "/consultation",
    icon: "/assets/icons/consultation.svg",
    comingSoon: false,
  },
];

const SOCIALS = [
  {
    icon: <Facebook />,
    url: "https://www.facebook.com/p/Axie-Studio-61573009403109/",
    platform: "facebook",
  },
  {
    icon: <Instagram />,
    url: "https://www.instagram.com/axiestudi0/",
    platform: "instagram",
  },
  {
    icon: <Youtube />,
    url: "https://www.youtube.com/channel/UCD4CAPRLqS3-NjBe8s2vr_g",
    platform: "youtube",
  },
];

const QUOTES_DATA = [
  {
    quote: "Build powerful booking agents and email automation with our proven Gmail Calendar Scheduling Agent - already downloaded 397 times with 29 likes!",
    authorName: "Gmail & Calendar Integration",
    authorTitle: "CrewAI + Composio + OpenAI",
    authorImage: "/favicon_io/android-icon-192x192.png",
  },
  {
    quote: "Connect with Slack, Outlook, Google Meet, Linear, Supabase, and 100+ business tools to create comprehensive customer service workflows.",
    authorName: "Business Integrations",
    authorTitle: "15+ Communication & 20+ Data Tools",
    authorImage: "/favicon_io/android-icon-192x192.png",
  },
  {
    quote: "Create intelligent receptionist agents that handle customer inquiries, book appointments, and provide 24/7 support using our advanced AI components.",
    authorName: "AI-Powered Receptionist",
    authorTitle: "1600+ Components Available",
    authorImage: "/favicon_io/android-icon-192x192.png",
  },
];
const HERO_CONTENT = {
  title: "Automate Customer Service with AI",
  description:
    "AxieStudio is a powerful platform to build and deploy AI-powered customer service flows. Create booking agents, email automation, and support workflows with Gmail, Calendar, and 100+ integrations.",
  image: {
    src: "/images/Gradient.png",
    alt: "gradient",
    fill: true,
    priority: true,
  },
  buttons: {
    primary: {
      label: "Try AxieStudio Free",
      link: "https://flow.axiestudio.se",
    },
    secondary: {
      label: "Swedish Version",
      link: "https://se.axiestudio.se",
    },
  },
};
const NOTEBOOK = {
  title: "Enterprise",
  description:
    "Get your locally deployed AxieStudio via Docker image - dedicated enterprise solution.",
};

const CARDS = [
  {
    text: "Try AxieStudio free - English or Swedish versions available",
    Component: Signup,
    background: true,
    image: "/images/card-1.png",
  },
  {
    text: "Embed AxieStudio chat widgets on your website for instant customer service",
    Component: CloudPlatform,
    background: false,
    image: "/images/card-2.png",
  },
  {
    text: "Same AxieStudio whether you're using OSS or Cloud",
    Component: Langflow,
    background: false,
    image: "/images/card-3.png",
  },
];

const GET_STARTED = {
  title: "Build Your Customer Service Flow",
  description:
    "Join thousands of businesses automating their customer service with AI. Create your first AxieStudio customer service flow now.",
  buttons: {
    primary: {
      label: "Start Building Now",
      link: "https://flow.axiestudio.se",
    },
    secondary: {
      label: "View Documentation",
      link: "https://docs.axiestudio.se",
    },
  },
  image: {
    src: "/images/getStarted.png",
    alt: "gradiant",
    onClick: () => {
      console.log("Image clicked");
    },
  },
};

const DOWNLOAD_OPTIONS = [
  {
    icon: <Apple />,
    name: "macOS (Apple Silicon)",
    link: "https://github.com/axiestudio/axiestudio/releases/download/v1.5.1/AxieStudio_1.5.1_aarch64.dmg",
    fileName: "AxieStudio_1.5.1_aarch64.dmg",
    btnText: "Download",
    isComingSoon: false,
  },
  {
    icon: <Apple />,
    name: "macOS (Intel)",
    link: "https://github.com/axiestudio/axiestudio/releases/download/v1.5.1/AxieStudio_1.5.1_x86_64.dmg",
    fileName: "AxieStudio_1.5.1_x86_64.dmg",
    btnText: "Download",
    isComingSoon: false,
  },
  {
    icon: <Windows />,
    name: "Windows (x64)",
    link: "https://github.com/axiestudio/axiestudio/releases/download/v1.5.1/AxieStudio_1.5.1_x64_en-US.msi",
    fileName: "AxieStudio_1.5.1_x64_en-US.msi",
    btnText: "Download",
    isComingSoon: false,
  },
  {
    icon: <Windows />,
    name: "Windows (Arm)",
    link: "/",
    fileName: "",
    btnText: "",
    isComingSoon: true,
  },
  // {
  //   icon: <Globe />,
  //   name: "Web app",
  //   link: "https://flow.axiestudio.se",
  //   fileName: "",
  //   btnText: "Open",
  //   isComingSoon: false,
  // },
];

export {
  LIST,
  SOCIALS,
  QUOTES_DATA,
  HERO_CONTENT,
  NOTEBOOK,
  CARDS,

  GET_STARTED,
  DOWNLOAD_OPTIONS,
};

