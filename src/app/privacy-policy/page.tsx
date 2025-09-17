import Page from "@/components/layout/page";
import type { Metadata } from "next";
import styles from "./styles.module.scss";

export const generateMetadata = (): Metadata => {
  return {
    title: "Privacy Policy | AxieStudio",
    description: "AxieStudio Privacy Policy - Learn how we protect your data and privacy",
  };
};

export default function PrivacyPolicy() {
  return (
    <Page className="layout" type="normal">
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString()}</p>
          
          <section className={styles.section}>
            <h2>Introduction</h2>
            <p>
              AxieStudio ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you use our 
              AI-powered customer service automation platform.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Information We Collect</h2>
            <h3>Personal Information</h3>
            <p>We may collect personal information that you provide directly to us, including:</p>
            <ul>
              <li>Name and contact information</li>
              <li>Account credentials</li>
              <li>Payment information</li>
              <li>Communication preferences</li>
            </ul>

            <h3>Usage Information</h3>
            <p>We automatically collect certain information about your use of our services:</p>
            <ul>
              <li>Log data and analytics</li>
              <li>Device and browser information</li>
              <li>IP address and location data</li>
              <li>Cookies and similar technologies</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide and maintain our services</li>
              <li>Process transactions and send notifications</li>
              <li>Improve our platform and develop new features</li>
              <li>Provide customer support</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Information Sharing</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              without your consent, except as described in this policy or as required by law.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Your Rights</h2>
            <p>Depending on your location, you may have certain rights regarding your personal information:</p>
            <ul>
              <li>Access to your personal information</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion of your information</li>
              <li>Data portability</li>
              <li>Opt-out of certain processing</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience on our platform. 
              You can manage your cookie preferences through your browser settings.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p>
              Email: privacy@axiestudio.se<br />
              Website: <a href="https://axiestudio.se">https://axiestudio.se</a>
            </p>
          </section>
        </div>
      </div>
    </Page>
  );
}
