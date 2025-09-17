"use server";

export type KitFormState = {
  errors: string[];
  success: boolean;
  referrer: string;
};

export async function kitSubscribe(
  previousState: KitFormState,
  formData: FormData
): Promise<KitFormState> {
  const email = formData.get("email") as string;
  const referrer = previousState.referrer;

  try {
    // Send newsletter subscription via our Resend API
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/newsletter`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        referrer,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Newsletter Subscription:", result);

      return {
        errors: [],
        success: true,
        referrer,
      };
    } else {
      const errorData = await response.json();
      return {
        errors: [errorData.error || 'Failed to subscribe to newsletter'],
        success: false,
        referrer,
      };
    }
  } catch (error) {
    console.error("Error subscribing to Kit:", error);
    return {
      errors: ["Failed to subscribe. Please try again later."],
      success: false,
      referrer,
    };
  }
}
