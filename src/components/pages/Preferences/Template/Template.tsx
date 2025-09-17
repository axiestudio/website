"use client";

import { useEffect, useState } from "react";
import styles from "./styles.module.scss";

const Template = () => {
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,
    analytics: true,
    marketing: false
  });

  const handleSavePreferences = () => {
    // Save preferences to localStorage
    localStorage.setItem('axiestudio-cookie-preferences', JSON.stringify(cookiePreferences));
    // Navigate back
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  const handleAcceptAll = () => {
    const allAccepted = { essential: true, analytics: true, marketing: true };
    setCookiePreferences(allAccepted);
    localStorage.setItem('axiestudio-cookie-preferences', JSON.stringify(allAccepted));
    // Navigate back
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  useEffect(() => {
    // Load saved preferences
    const saved = localStorage.getItem('axiestudio-cookie-preferences');
    if (saved) {
      setCookiePreferences(JSON.parse(saved));
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.title}>Privacy Center</h1>
          <div className={styles.nav}>
            <span className={styles.navItem}>Welcome</span>
            <span className={styles.navItem}>Purposes</span>
          </div>
        </div>

        <section className={styles.section}>
          <h2>Your Privacy Choices</h2>
          <p>
            We use online tracking and other technologies to provide a personalized experience, improve our offerings, monitor
            and record your engagement with us, and share limited personal information with third-party advertisers. To learn
            more about our privacy practices review our <a href="/privacy-policy" className={styles.link}>Privacy Policy</a>.
          </p>
        </section>

        <section className={styles.section}>
          <h2>About Your Privacy</h2>
          <p>
            We prioritize and respect your privacy. We are committed to transparently managing your data, using it only for necessary purposes with your explicit consent.
            Rigorous security measures are in place to protect your information, and we never sell or share it for marketing without your permission. Your control over your data is
            important to us, and we continually update our practices to align with the latest standards.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Cookie Management</h2>
          <p>
            You can manage your cookie preferences below. These settings control how we collect and use data to improve your experience on our platform.
          </p>

          <div className={styles.cookieOptions}>
            <div className={styles.cookieOption}>
              <label className={styles.cookieLabel}>
                <input
                  type="checkbox"
                  checked={cookiePreferences.essential}
                  disabled
                />
                <span className={styles.checkmark}></span>
                <div className={styles.cookieInfo}>
                  <h4>Essential Cookies</h4>
                  <p>Required for basic site functionality. These cannot be disabled.</p>
                </div>
              </label>
            </div>

            <div className={styles.cookieOption}>
              <label className={styles.cookieLabel}>
                <input
                  type="checkbox"
                  checked={cookiePreferences.analytics}
                  onChange={(e) => setCookiePreferences({...cookiePreferences, analytics: e.target.checked})}
                />
                <span className={styles.checkmark}></span>
                <div className={styles.cookieInfo}>
                  <h4>Analytics Cookies</h4>
                  <p>Help us understand how visitors interact with our website.</p>
                </div>
              </label>
            </div>

            <div className={styles.cookieOption}>
              <label className={styles.cookieLabel}>
                <input
                  type="checkbox"
                  checked={cookiePreferences.marketing}
                  onChange={(e) => setCookiePreferences({...cookiePreferences, marketing: e.target.checked})}
                />
                <span className={styles.checkmark}></span>
                <div className={styles.cookieInfo}>
                  <h4>Marketing Cookies</h4>
                  <p>Used to track visitors across websites for marketing purposes.</p>
                </div>
              </label>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button className={styles.saveButton} onClick={handleSavePreferences}>
              Save Preferences
            </button>
            <button className={styles.acceptAllButton} onClick={handleAcceptAll}>
              Accept All
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Template;
