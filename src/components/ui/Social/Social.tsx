"use client";

// Dependencies

// Components
import Link from "@/components/ui/Link";
import Display from "@/components/ui/Display";

// Styles
import styles from "./styles.module.scss";
import { SOCIALS } from "@/utils/constants";

const Social = () => {
  // Using static counts for AxieStudio social media

  return (
    <div className={styles.container}>
      {SOCIALS.map((s, index) => (
        <div key={index}>
          <Link
            href={s.url}
            target="_blank"
            data-event="AxieStudio.se - Social Clicked"
            data-platform={s.platform}
          >
            <div className={styles.social}>
              {s.icon}
              <Display size={100} weight={400}>
                {s.count}
              </Display>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Social;
