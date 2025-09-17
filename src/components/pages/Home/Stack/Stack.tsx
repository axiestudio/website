"use client";

import React from "react";

import styles from "./styles.module.scss";
import LogosSlider from "@/components/ui/LogosSlider";
import OpenAI from "@/components/ui/icons/OpenAI";
import Slack from "@/components/ui/icons/Slack";
import Gmail from "@/components/ui/icons/Gmail";
import Composio from "@/components/ui/icons/Composio";
import Groq from "@/components/ui/icons/Groq";
import Anthropic from "@/components/ui/icons/Anthropic";

// Placeholder constants since this component is not currently used
const STACK_TEXT = {
  heading: "Trusted by Customer Service Teams Worldwide"
};

const STACK_LOGOS = [
  OpenAI,
  Slack,
  Gmail,
  Composio,
  Groq,
  Anthropic,
];

const Stack = () => {
  return (
    <div className={styles.stackContainer}>
      <div className={`${styles.stack} container-wide`}>
        <h5 className={styles.stack_heading}>{STACK_TEXT.heading}</h5>
      </div>
      <LogosSlider className={styles.slider} logos={STACK_LOGOS} />
    </div>
  );
};

export default Stack;
