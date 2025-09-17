import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ContactEmailTemplate } from '@/components/email/ContactEmailTemplate';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, company, message, type = 'contact' } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    let subject = '';
    let toEmail = '';

    switch (type) {
      case 'contact':
        subject = `New Contact Form Submission from ${firstName} ${lastName}`;
        toEmail = 'contact@axiestudio.se';
        break;
      case 'newsletter':
        subject = `Newsletter Subscription from ${firstName} ${lastName}`;
        toEmail = 'newsletter@axiestudio.se';
        break;
      case 'consultation':
        subject = `Consultation Request from ${firstName} ${lastName}`;
        toEmail = 'consultation@axiestudio.se';
        break;
      default:
        subject = `Website Form Submission from ${firstName} ${lastName}`;
        toEmail = 'info@axiestudio.se';
    }

    const { data, error } = await resend.emails.send({
      from: 'AxieStudio Website <noreply@axiestudio.se>',
      to: [toEmail],
      subject: subject,
      react: ContactEmailTemplate({
        firstName,
        lastName,
        email,
        company,
        message,
      }),
      // Also send a plain text version
      text: `
New ${type} form submission:

Name: ${firstName} ${lastName}
Email: ${email}
${company ? `Company: ${company}` : ''}

Message:
${message}

---
This email was sent from the AxieStudio website.
      `.trim(),
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Email sent successfully',
        id: data?.id 
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
