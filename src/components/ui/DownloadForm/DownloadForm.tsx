"use client";

// Dependencies
import { useState } from "react";

// Components
import Display from "@/components/ui/Display";
import MarketoForm from "@/components/ui/form";

// Utils
import { DOWNLOAD_OPTIONS } from "@/utils/constants";
import { trackEvent } from '@/lib/utils/tracking';

// Styles
import styles from "./styles.module.scss";

const DownloadForm = () => {
  const handleGetDownload = (url: string) => {
    window.location.href = url;
  };

  return (
    <>
      <Display className="text-white" size={100} weight={400}>
        Get started with AxieStudio desktop app for your operating system.
      </Display>
      <div className={styles.list}>
        {DOWNLOAD_OPTIONS.map((option, index) => (
          <div key={index} className={styles.listItem}>
            <div
              className={`${styles.detailsItem} ${option.isComingSoon ? styles.opacity : ""}`}
            >
              {option.icon}
              <Display size={100} weight={600} className={styles.itemName}>
                {option.name}
              </Display>
            </div>

            {option.isComingSoon ? (
              <Display size={100} weight={400} className={styles.comingSoon}>
                Coming Soon
              </Display>
            ) : (
              <a
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleGetDownload(option.link);
                }}
                className={styles.downloadButton}
              >
                <Display
                  size={100}
                  weight={600}
                  className={"text-center text-black"}
                >
                  {option.btnText}
                </Display>
              </a>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default DownloadForm;
