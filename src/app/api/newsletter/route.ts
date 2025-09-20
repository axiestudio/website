import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { NewsletterEmailTemplate } from '@/components/email/NewsletterEmailTemplate';
import { NewsletterConfirmationTemplate } from '@/components/email/NewsletterConfirmationTemplate';
import { saveNewsletterSubscriber, initializeDatabase } from '@/lib/neon-database';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, referrer } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Send notification email to your team about new subscriber
    const { data: adminData, error: adminError } = await resend.emails.send({
      from: 'AxieStudio Newsletter <newsletter@axiestudio.se>',
      to: [process.env.EMAIL || 'stefan@axiestudio.se'],
      subject: `📧 New AI++ Newsletter Subscription: ${email}`,
      react: NewsletterEmailTemplate({
        email,
        referrer,
      }),
    });

    if (adminError) {
      console.error('Admin email error:', adminError);
      return NextResponse.json(
        { error: 'Failed to process newsletter subscription' },
        { status: 500 }
      );
    }

    // Wait 2 seconds to avoid Resend rate limiting (max 2 requests per second)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Send confirmation email to the subscriber
    const { data: userConfirmData, error: userConfirmError } = await resend.emails.send({
      from: 'AxieStudio Team <newsletter@axiestudio.se>',
      to: [email],
      subject: `🎉 Welcome to AI++ Newsletter - AxieStudio`,
      react: NewsletterConfirmationTemplate({
        email,
      }),
    });

    if (userConfirmError) {
      console.error('User confirmation email error:', userConfirmError);
      // Don't fail the request if confirmation email fails
    }

    // Initialize database tables if they don't exist
    await initializeDatabase();

    // Save to database for tracking and future newsletters
    const savedSubscriber = await saveNewsletterSubscriber({
      email,
      referrer,
    });

    // Send webhook notification (backup storage method) - with timeout protection
    try {
      const webhookUrl = process.env.WEBHOOK_URL;
      if (webhookUrl) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout

        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'newsletter_subscription',
            data: {
              id: savedSubscriber.id,
              email,
              referrer,
              timestamp: savedSubscriber.timestamp,
            },
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);
      }
    } catch (webhookError) {
      console.error('Webhook error (non-critical):', webhookError);
      // Don't fail the request if webhook fails
    }

    console.log('Newsletter Subscription:', {
      ...savedSubscriber,
      adminEmailId: adminData?.id,
      userConfirmEmailId: userConfirmData?.id,
    });

    return NextResponse.json(
      {
        message: 'Successfully subscribed to AI++ Newsletter! Welcome aboard! 🚀',
        id: savedSubscriber.id,
        adminEmailId: adminData?.id,
        userConfirmEmailId: userConfirmData?.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to retrieve subscription stats
export async function GET() {
  try {
    // You could return subscription statistics here
    // For now, just return a simple status
    return NextResponse.json(
      { 
        message: 'AI++ Newsletter API is active',
        status: 'operational',
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
