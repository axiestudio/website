"use server";

export type ConsultationFormState = {
  errors: string[];
  success: boolean;
  referrer: string;
};

export async function consultationSubmit(
  previousState: ConsultationFormState,
  formData: FormData
): Promise<ConsultationFormState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const company = formData.get("company") as string;
  const phone = formData.get("phone") as string;
  const usecase = formData.get("usecase") as string;
  const timeline = formData.get("timeline") as string;
  const referrer = previousState.referrer;

  // Basic validation
  if (!name || !email || !usecase) {
    return {
      errors: ["Please fill in all required fields."],
      success: false,
      referrer,
    };
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      errors: ["Please enter a valid email address."],
      success: false,
      referrer,
    };
  }

  try {
    // Send consultation request via our Resend API
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/consultation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        company,
        phone,
        usecase,
        timeline,
        referrer,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to submit consultation request');
    }

    const result = await response.json();
    console.log("Consultation Request Submitted:", result);

    return {
      errors: [],
      success: true,
      referrer,
    };
  } catch (error) {
    console.error("Error submitting consultation request:", error);
    return {
      errors: ["Failed to submit consultation request. Please try again later."],
      success: false,
      referrer,
    };
  }
}
