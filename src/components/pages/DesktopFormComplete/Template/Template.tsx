'use client';

import { useEffect, useState } from 'react';
import Display from '@/components/ui/Display';
import Button from '@/components/ui/button/Button';
import { ButtonTypes } from '@/components/ui/button/types';
import styles from './styles.module.scss';

const Template = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className={styles.template}>
        <div className={styles.container}>
          <div className="text-center">
            <Display className="text-white" size={100} weight={400}>
              Loading...
            </Display>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.template}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.successIcon}>✅</div>
            <Display
              className="text-white spacer--bottom-2"
              size={400}
              weight={500}
              tagName="h1"
            >
              Download Links Sent!
            </Display>
            <Display
              className="text-white spacer--bottom-4"
              size={100}
              weight={400}
            >
              Check your email inbox for your personalized download links.
            </Display>
          </div>

          <div className={styles.steps}>
            <Display
              className="text-white spacer--bottom-3"
              size={300}
              weight={500}
              tagName="h2"
            >
              What's Next?
            </Display>

            <div className={styles.stepsList}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepContent}>
                  <Display className="text-white" size={200} weight={600} tagName="h3">
                    Check Your Email
                  </Display>
                  <Display className="text-white" size={100} weight={400}>
                    Look for an email from AxieStudio with your download links. Don't forget to check your spam folder!
                  </Display>
                </div>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepContent}>
                  <Display className="text-white" size={200} weight={600} tagName="h3">
                    Download & Install
                  </Display>
                  <Display className="text-white" size={100} weight={400}>
                    Click the download link for your operating system and follow the installation instructions.
                  </Display>
                    </div>
                  </div>
                  
              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  <Display className="text-white" size={200} weight={600} tagName="h3">
                    Get Started
                  </Display>
                  <Display className="text-white" size={100} weight={400}>
                    Launch AxieStudio and start building your AI-powered customer service workflows!
                  </Display>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.resources}>
            <Display
              className="text-white spacer--bottom-3"
              size={300}
              weight={500}
              tagName="h2"
            >
              Helpful Resources
            </Display>

            <div className={styles.resourcesList}>
              <Button
                href="https://docs.axiestudio.se"
                variant={ButtonTypes.BORDER}
                className={styles.resourceButton}
              >
                📚 Documentation
              </Button>
              <Button
                href="https://axiestudio.se/support"
                variant={ButtonTypes.BORDER}
                className={styles.resourceButton}
              >
                💬 Support Center
              </Button>
              <Button
                href="/consultation"
                variant={ButtonTypes.BORDER}
                className={styles.resourceButton}
              >
                🎯 Book a Consultation
              </Button>
            </div>
          </div>

          <div className={styles.footer}>
            <Display className="text-white" size={100} weight={400}>
              Need help? Contact us at{' '}
              <a href="mailto:support@axiestudio.se" className={styles.emailLink}>
                support@axiestudio.se
              </a>
            </Display>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Template;
