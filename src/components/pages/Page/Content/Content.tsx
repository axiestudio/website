// Dependencies
import { FC } from "react";

// AxieStudio doesn't use Sanity - placeholder type
type SectionContent = any;

// Components
import Display from "@/components/ui/Display";

// Styles
import styles from "./styles.module.scss";
import Text from "@/components/ui/text";
// AxieStudio doesn't use PortableText - removed

// Props types
type Props = SectionContent & {
  center?: boolean;
};

const Content: FC<Props> = ({ content, title, sectionId, center = true }) => {
  return (
    <section className={styles.content} id={sectionId}>
      <div className="container">
        <div className={`row ${center ? "justify-content-center" : ""}`}>
          <div className="col-lg-9">
            {title && (
              <div className={styles.heading}>
                <Display size={400} tagName="h2">
                  {title}
                </Display>

                <hr />
              </div>
            )}

            <Text className={styles.article} size={300} tagName="article">
              {/* AxieStudio doesn't use PortableText - placeholder content */}
              <p>Content not available - AxieStudio focuses on AI workflow automation.</p>
            </Text>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Content;
