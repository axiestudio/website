'use client';

import React, { useState } from 'react';
import Display from '@/components/ui/Display';
import Button from '@/components/ui/button/Button';
import { ButtonTypes } from '@/components/ui/button/types';
import styles from './styles.module.scss';

const Template = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    operatingSystem: '',
    language: 'english',
    useCase: '',
    subscribeNewsletter: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.operatingSystem) {
      errors.operatingSystem = 'Please select your operating system';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setError('Please fix the errors below and try again.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/desktop-download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        // Redirect to success page after 2 seconds
        setTimeout(() => {
          window.location.href = '/desktop-form-complete';
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className={styles.template}>
        <div className={styles.container}>
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <div className={styles.successMessage}>
                <div className={styles.successIcon}>✅</div>
                <Display size={400} tagName="h1" className="text-white spacer--bottom-2">
                  Request Submitted Successfully!
                </Display>
                <Display size={100} className="text-white spacer--bottom-4">
                  We're processing your download request. You'll receive an email with download links shortly.
                </Display>
                <div className={styles.redirectMessage}>
                  Redirecting you to the download page...
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.template}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.leftColumn}>
            <Display
              className={`${styles.heading} text-white`}
              size={400}
              weight={500}
              tagName="h1"
            >
              Download AxieStudio Desktop App
            </Display>
            <Display
              className="text-white spacer--bottom-4"
              size={100}
              weight={400}
            >
              Get instant access to our powerful AI-driven customer service automation platform.
              Available for Windows, macOS, and Linux.
            </Display>

            <div className={styles.features}>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>🚀</div>
                <div>
                  <h3>Lightning Fast</h3>
                  <p>Native desktop performance with instant response times</p>
                </div>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>🔒</div>
                <div>
                  <h3>Secure & Private</h3>
                  <p>Your data stays on your machine with enterprise-grade security</p>
                </div>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>⚡</div>
                <div>
                  <h3>Offline Capable</h3>
                  <p>Work without internet connection when needed</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.formCard}>
              <Display
                className={`${styles.formTitle} spacer--bottom-3`}
                size={300}
                weight={600}
                tagName="h2"
              >
                Get Your Desktop App
              </Display>

              {error && (
                <div className={styles.errorMessage}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`${styles.input} ${validationErrors.name ? styles.inputError : ''}`}
                      placeholder="Enter your full name"
                      required
                    />
                    {validationErrors.name && (
                      <div className={styles.fieldError}>{validationErrors.name}</div>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`${styles.input} ${validationErrors.email ? styles.inputError : ''}`}
                      placeholder="your.email@company.com"
                      required
                    />
                    {validationErrors.email && (
                      <div className={styles.fieldError}>{validationErrors.email}</div>
                    )}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="company" className={styles.label}>
                    Company/Organization
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Your company name (optional)"
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="operatingSystem" className={styles.label}>
                      Operating System *
                    </label>
                    <select
                      id="operatingSystem"
                      name="operatingSystem"
                      value={formData.operatingSystem}
                      onChange={handleInputChange}
                      className={`${styles.select} ${validationErrors.operatingSystem ? styles.inputError : ''}`}
                      required
                    >
                      <option value="">Select your OS</option>
                      <option value="windows">🪟 Windows</option>
                      <option value="macos">🍎 macOS</option>
                      <option value="ubuntu">🐧 Ubuntu/Linux</option>
                    </select>
                    {validationErrors.operatingSystem && (
                      <div className={styles.fieldError}>{validationErrors.operatingSystem}</div>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="language" className={styles.label}>
                      Preferred Language
                    </label>
                    <select
                      id="language"
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      className={styles.select}
                    >
                      <option value="english">🇺🇸 English</option>
                      <option value="swedish">🇸🇪 Swedish</option>
                    </select>
                  </div>
                </div>



                <div className={styles.formGroup}>
                  <label htmlFor="useCase" className={styles.label}>
                    Primary Use Case
                  </label>
                  <textarea
                    id="useCase"
                    name="useCase"
                    value={formData.useCase}
                    onChange={handleInputChange}
                    className={styles.textarea}
                    rows={3}
                    placeholder="Tell us how you plan to use AxieStudio..."
                  />
                </div>

                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="subscribeNewsletter"
                      checked={formData.subscribeNewsletter}
                      onChange={handleInputChange}
                      className={styles.checkbox}
                    />
                    <span className={styles.checkboxText}>
                      Subscribe to our newsletter for updates and tips
                    </span>
                  </label>
                </div>

                <Button
                  type="submit"
                  variant={ButtonTypes.FILLED}
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending Request...' : 'Request Download Links'}
                </Button>
              </form>

              <div className={styles.formFooter}>
                <p>
                  By submitting this form, you agree to receive download links via email.
                  We respect your privacy and won't spam you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Template;
