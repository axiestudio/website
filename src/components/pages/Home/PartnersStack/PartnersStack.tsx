// import { LOGOS } from "./constant";
import styles from "./styles.module.scss";
import Display from "@/components/ui/Display";
import Slider from "./Slider";

// Placeholder constants since this component is not currently used
const PARTNERS_STACK_TEXT = {
  title: "Trusted by Customer Service Teams",
  description: "Join thousands of businesses automating their customer service with AxieStudio AI flows."
};

const PartnersStack = () => {
  return (
    <div className={`${styles.stack}`}>
      <div className="container-wide">
        <Display size={500} weight={400} className={styles.title}>
          {PARTNERS_STACK_TEXT.title}
        </Display>
        <p className={styles.description}>{PARTNERS_STACK_TEXT.description}</p>
      </div>
      <Slider />
    </div>
  );
};

export default PartnersStack;
