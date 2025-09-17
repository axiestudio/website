"use client";

import { useFormState, useFormStatus } from "react-dom";

import btnStyles from "../../../ui/button/styles.module.scss";
import styles from "./styles.module.scss";
import { consultationSubmit } from "../../../../app/actions/consultationSubmit";
import { useEffect } from "react";
import { trackEvent } from "@/lib/utils/tracking";
import Display from "@/components/ui/Display";

export function ConsultationForm() {
  let referrer = "";
  useEffect(() => {
    if (window && window.location) {
      referrer = window.location.href;
      if (!referrer.includes("utm_source")) {
        const url = new URL(referrer);
        url.searchParams.set("utm_source", "axiestudio.se");
        url.searchParams.set("utm_medium", "website");
        url.searchParams.set("utm_campaign", "consultation");
        referrer = url.toString();
      }
    }
  });

  const initialState = {
    success: false,
    errors: [],
    referrer: referrer,
  };

  const [state, formAction] = useFormState(consultationSubmit, initialState);

  if (state.success) {
    trackEvent("AxieStudio.se - Consultation Request Submitted", {
      text: "Book Consultation",
    });
  }

  return (
    <div className={styles.formContainer}>
      {!state.success ? (
        <form action={formAction} data-bs-theme="dark" className={styles.form}>
          <Display className="text-white" size={400} weight={500}>
            Book Your Free Consultation
          </Display>

          <Display size={100} weight={400}>
            Tell us about your customer service automation needs
          </Display>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Full Name: *
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email Address: *
            </label>
            <input
              type="email"
              className={
                state.errors.length > 0
                  ? "form-control is-invalid"
                  : "form-control"
              }
              id="email"
              name="email"
              placeholder="john@company.com"
              required
            />
            {state.errors.length > 0 && (
              <div className="invalid-feedback">
                {state.errors.map((error: string) => (
                  <p key={error}>{error}</p>
                ))}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="company" className="form-label">
              Company Name:
            </label>
            <input
              type="text"
              className="form-control"
              id="company"
              name="company"
              placeholder="Your Company"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="phone" className="form-label">
              Phone Number:
            </label>
            <input
              type="tel"
              className="form-control"
              id="phone"
              name="phone"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="usecase" className="form-label">
              Describe your customer service automation needs: *
            </label>
            <textarea
              className="form-control"
              id="usecase"
              name="usecase"
              rows={4}
              placeholder="Tell us about your current customer service challenges and how you'd like to automate them..."
              required
            />
          </div>

          <div className="mb-5">
            <label htmlFor="timeline" className="form-label">
              When would you like to implement this solution?
            </label>
            <select className="form-control" id="timeline" name="timeline">
              <option value="">Select timeline</option>
              <option value="immediately">Immediately</option>
              <option value="1-3months">1-3 months</option>
              <option value="3-6months">3-6 months</option>
              <option value="6+months">6+ months</option>
              <option value="exploring">Just exploring</option>
            </select>
          </div>

          <div className="d-grid">
            <SubmitButton></SubmitButton>
          </div>
        </form>
      ) : (
        <div
          className="alert alert-success container"
          role="alert"
          data-bs-theme="dark"
        >
          <p>
            <strong>Thank you!</strong> Your consultation request has been submitted.
            Our team will contact you within 24 hours to schedule your free consultation.
          </p>
        </div>
      )}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className={`${btnStyles.button} ${btnStyles["filled-button"]}`}
      type="submit"
      disabled={pending}
    >
      {pending ? "Submitting..." : "Book Free Consultation"}
    </button>
  );
}
