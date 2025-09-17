import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ConsultationEmailTemplate } from '@/components/email/ConsultationEmailTemplate';
import { ConsultationConfirmationTemplate } from '@/components/email/ConsultationConfirmationTemplate';
import { saveConsultationRequest } from '@/lib/database';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, phone, usecase, timeline, referrer } = body;

    // Validate required fields
    if (!name || !email || !usecase) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, and usecase are required' },
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

    // Send notification email to your team using Resend
    const { data: adminData, error: adminError } = await resend.emails.send({
      from: 'AxieStudio Consultation <consultation@axiestudio.se>',
      to: [process.env.EMAIL || 'stefan@axiestudio.se'],
      subject: `🎯 New Consultation Request from ${name}`,
      react: ConsultationEmailTemplate({
        name,
        email,
        company,
        phone,
        usecase,
        timeline,
        referrer,
      }),
      replyTo: email, // Allow direct reply to the client
    });

    if (adminError) {
      console.error('Admin email error:', adminError);
      return NextResponse.json(
        { error: 'Failed to send consultation request' },
        { status: 500 }
      );
    }

    // Wait 2 seconds to avoid Resend rate limiting (max 2 requests per second)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Send confirmation email to the user
    const { data: userConfirmData, error: userConfirmError } = await resend.emails.send({
      from: 'AxieStudio Team <consultation@axiestudio.se>',
      to: [email],
      subject: `🎉 Thank You for Your Consultation Request - AxieStudio`,
      react: ConsultationConfirmationTemplate({
        name,
        usecase,
        timeline,
      }),
    });

    if (userConfirmError) {
      console.error('User confirmation email error:', userConfirmError);
      // Don't fail the request if confirmation email fails
    }

    // Save to database for tracking and analytics
    const savedRequest = await saveConsultationRequest({
      name,
      email,
      company,
      phone,
      usecase,
      timeline,
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
            type: 'consultation_request',
            data: {
              id: savedRequest.id,
              name,
              email,
              company,
              phone,
              usecase,
              timeline,
              referrer,
              timestamp: savedRequest.timestamp,
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

    console.log('Consultation Request Submitted:', {
      ...savedRequest,
      adminEmailId: adminData?.id,
      userConfirmEmailId: userConfirmData?.id,
    });

    return NextResponse.json(
      {
        message: 'Consultation request sent successfully! We will contact you within 24 hours.',
        id: savedRequest.id,
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
