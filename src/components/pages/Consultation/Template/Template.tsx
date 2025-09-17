// Components
import { ConsultationForm } from "../ConsultationForm/ConsultationForm";
import Display from "@/components/ui/Display";
import Button from "@/components/ui/button/Button";
import { ButtonTypes } from "@/components/ui/button/types";

// Styles
import styles from "./styles.module.scss";

const Template = () => {
  return (
    <section className={styles.template}>
      <div
        className={`${styles.content} ${styles.container} container container-wide h-100`}
      >
        <div className="col">
          <Display
            className={`spacer--bottom-4 text-white  ${styles.heading}`}
            size={200}
            weight={400}
            tagName="h1"
          >
            {"Free AxieStudio Consultation"}
          </Display>
          <Display
            className="spacer--bottom-4 text-white pt-5"
            size={200}
            weight={400}
          >
            {
              "Book a free 30-minute consultation with our AxieStudio experts. We'll help you design the perfect customer service automation solution for your business needs."
            }
          </Display>

          <Button
            href="https://flow.axiestudio.se"
            variant={ButtonTypes.BORDER}
            className={styles.button}
          >
            Try AxieStudio Free
          </Button>
        </div>
        <div className="col">
          <ConsultationForm />
        </div>
      </div>
    </section>
  );
};

export default Template;
