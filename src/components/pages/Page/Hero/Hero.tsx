// Dependencies
import { type FC } from "react";

// Types
// AxieStudio placeholder types

// Components
// AxieStudio does not use PortableText
import DownloadButton from "@/components/ui/Buttons";
import Display from "@/components/ui/Display";

// Styles
import styles from "./styles.module.scss";

// Props
type Props = SectionHero;

const Hero: FC<Props> = ({ title, content, sectionId }) => {
  return (
    <section className={styles.hero} id={sectionId}>
      <div className="container">
        <div className="row">
          <div className="col d-flex flex-column align-items-center text-center">
            <Display size={700} tagName="h1">
              {title}
            </Display>
            <Display className={styles.subtitle} size={200} tagName="div">
              <p>Content not available - AxieStudio focuses on AI workflow automation.</p>
            </Display>
            {/* <DownloadButton url="/desktop-form" /> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
