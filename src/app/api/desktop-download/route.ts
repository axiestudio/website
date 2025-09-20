import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { addDesktopDownloadRequest, initializeDatabase } from '@/lib/neon-database';

const resend = new Resend(process.env.RESEND_API_KEY);

// Download links for different platforms and languages - configurable via environment variables
const DOWNLOAD_LINKS = {
  swedish: {
    windows: process.env.SWEDISH_WINDOWS || 'https://github.com/axiestudio/axiestudio/actions/runs/17840237030/artifacts/4049845314',
    macos: process.env.SWEDISH_MACOS || 'https://github.com/axiestudio/axiestudio/actions/runs/17840237030/artifacts/4049869109',
    ubuntu: process.env.SWEDISH_UBUNTU || 'https://github.com/axiestudio/axiestudio/actions/runs/17840237030/artifacts/4049862869'
  },
  english: {
    windows: process.env.ENGLISH_WINDOWS || 'https://github.com/axiestudio/axiestudio/actions/runs/17840231117/artifacts/4049849448',
    macos: process.env.ENGLISH_MACOS || 'https://github.com/axiestudio/axiestudio/actions/runs/17840231117/artifacts/4049873702',
    ubuntu: process.env.ENGLISH_UBUNTU || 'https://github.com/axiestudio/axiestudio/actions/runs/17840231117/artifacts/4049866197'
  }
};

const getEmailTemplate = (name: string, operatingSystem: string, language: string, downloadLink: string) => {
  const isSwedish = language === 'swedish';
  const osDisplayName = operatingSystem.charAt(0).toUpperCase() + operatingSystem.slice(1);

  return {
    subject: isSwedish ? 'Din AxieStudio Desktop App är redo!' : 'Your AxieStudio Desktop App is Ready!',
    html: `
      <!DOCTYPE html>
      <html lang="${isSwedish ? 'sv' : 'en'}">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <title>${isSwedish ? 'AxieStudio Nedladdning' : 'AxieStudio Download'}</title>
          <!--[if mso]>
          <noscript>
            <xml>
              <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
            </xml>
          </noscript>
          <![endif]-->
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; line-height: 1.6;">
          <!-- Email Container -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc;">
            <tr>
              <td align="center" style="padding: 20px 0;">
                <!-- Main Content Table -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); overflow: hidden;">

                  <!-- Header with Logo -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 48px 40px; text-align: center;">
                      <!-- Logo -->
                      <img src="https://axiestudio.se/images/axiestudio-logo-192.png"
                           alt="AxieStudio Logo"
                           width="64"
                           height="64"
                           style="display: block; margin: 0 auto 24px auto; border-radius: 12px;">

                      <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; text-align: center;">
                        ${isSwedish ? 'Tack för att du valde AxieStudio!' : 'Thank you for choosing AxieStudio!'}
                      </h1>
                      <p style="color: rgba(255, 255, 255, 0.9); margin: 16px 0 0 0; font-size: 18px; text-align: center;">
                        ${isSwedish ? 'Din desktop-app är redo att laddas ner' : 'Your desktop app is ready to download'}
                      </p>
                    </td>
                  </tr>

                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 48px 40px;">
                      <!-- Greeting -->
                      <p style="font-size: 18px; color: #1f2937; margin: 0 0 24px 0; font-weight: 500;">
                        ${isSwedish ? `Hej ${name},` : `Hi ${name},`}
                      </p>

                      <!-- Main Message -->
                      <p style="font-size: 16px; color: #374151; line-height: 1.7; margin: 0 0 32px 0;">
                        ${isSwedish
                          ? 'Tack för ditt intresse för AxieStudio! Din nedladdningslänk för desktop-appen är nu redo. Klicka på knappen nedan för att ladda ner och komma igång med automatisering.'
                          : 'Thank you for your interest in AxieStudio! Your desktop app download link is now ready. Click the button below to download and start automating.'
                        }
                      </p>

                      <!-- Download Button -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td align="center" style="padding: 16px 0 32px 0;">
                            <a href="${downloadLink}"
                               style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 18px 36px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3); transition: all 0.3s ease;">
                              📥 ${isSwedish ? `Ladda ner för ${osDisplayName}` : `Download for ${osDisplayName}`}
                            </a>
                          </td>
                        </tr>
                      </table>

                      <!-- Installation Steps -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #f8fafc; border-radius: 16px; margin: 16px 0 32px 0;">
                        <tr>
                          <td style="padding: 32px;">
                            <h3 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">
                              ${isSwedish ? '🚀 Installationssteg:' : '🚀 Installation Steps:'}
                            </h3>

                            <!-- Step 1 -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 16px;">
                              <tr>
                                <td width="32" style="vertical-align: top; padding-right: 12px;">
                                  <div style="width: 24px; height: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; color: white; text-align: center; line-height: 24px; font-size: 12px; font-weight: 600;">1</div>
                                </td>
                                <td style="color: #374151; font-size: 15px; line-height: 1.6;">
                                  ${isSwedish
                                    ? 'Klicka på nedladdningslänken ovan'
                                    : 'Click the download link above'
                                  }
                                </td>
                              </tr>
                            </table>

                            <!-- Step 2 -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 16px;">
                              <tr>
                                <td width="32" style="vertical-align: top; padding-right: 12px;">
                                  <div style="width: 24px; height: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; color: white; text-align: center; line-height: 24px; font-size: 12px; font-weight: 600;">2</div>
                                </td>
                                <td style="color: #374151; font-size: 15px; line-height: 1.6;">
                                  ${isSwedish
                                    ? 'Kör installationsfilen när nedladdningen är klar'
                                    : 'Run the installer file once the download completes'
                                  }
                                </td>
                              </tr>
                            </table>

                            <!-- Step 3 -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 16px;">
                              <tr>
                                <td width="32" style="vertical-align: top; padding-right: 12px;">
                                  <div style="width: 24px; height: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; color: white; text-align: center; line-height: 24px; font-size: 12px; font-weight: 600;">3</div>
                                </td>
                                <td style="color: #374151; font-size: 15px; line-height: 1.6;">
                                  ${isSwedish
                                    ? 'Följ installationsguiden'
                                    : 'Follow the installation wizard'
                                  }
                                </td>
                              </tr>
                            </table>

                            <!-- Step 4 -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                              <tr>
                                <td width="32" style="vertical-align: top; padding-right: 12px;">
                                  <div style="width: 24px; height: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; color: white; text-align: center; line-height: 24px; font-size: 12px; font-weight: 600;">4</div>
                                </td>
                                <td style="color: #374151; font-size: 15px; line-height: 1.6;">
                                  ${isSwedish
                                    ? 'Starta AxieStudio och börja automatisera! 🎉'
                                    : 'Launch AxieStudio and start automating! 🎉'
                                  }
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      <!-- Support Section -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-top: 1px solid #e5e7eb; margin-top: 16px;">
                        <tr>
                          <td style="padding: 32px 0 0 0;">
                            <h3 style="color: #1f2937; font-size: 18px; margin: 0 0 16px 0; font-weight: 600;">
                              ${isSwedish ? '💬 Behöver du hjälp?' : '💬 Need Help?'}
                            </h3>
                            <p style="color: #6b7280; margin: 0 0 24px 0; font-size: 15px; line-height: 1.6;">
                              ${isSwedish
                                ? 'Om du har några frågor eller behöver hjälp med installationen:'
                                : 'If you have any questions or need help with installation:'
                              }
                            </p>

                            <!-- Support Links -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                              <tr>
                                <td style="padding-bottom: 12px;">
                                  <a href="https://docs.axiestudio.se"
                                     style="color: #3b82f6; text-decoration: none; font-weight: 500; font-size: 15px; display: inline-block;">
                                    📚 ${isSwedish ? 'Dokumentation' : 'Documentation'}
                                  </a>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding-bottom: 12px;">
                                  <a href="https://axiestudio.se/support"
                                     style="color: #3b82f6; text-decoration: none; font-weight: 500; font-size: 15px; display: inline-block;">
                                    💬 ${isSwedish ? 'Support Center' : 'Support Center'}
                                  </a>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <a href="https://axiestudio.se/consultation"
                                     style="color: #3b82f6; text-decoration: none; font-weight: 500; font-size: 15px; display: inline-block;">
                                    📞 ${isSwedish ? 'Boka konsultation' : 'Book Consultation'}
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background: #f8fafc; padding: 32px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <!-- Footer Logo -->
                      <img src="https://axiestudio.se/images/axiestudio-logo-192.png"
                           alt="AxieStudio"
                           width="32"
                           height="32"
                           style="display: block; margin: 0 auto 16px auto; border-radius: 6px; opacity: 0.7;">

                      <p style="color: #6b7280; margin: 0 0 8px 0; font-size: 14px;">
                        ${isSwedish
                          ? 'Detta e-postmeddelande skickades från AxieStudio'
                          : 'This email was sent from AxieStudio'
                        }
                      </p>
                      <p style="color: #6b7280; margin: 0; font-size: 14px;">
                        <a href="https://axiestudio.se" style="color: #3b82f6; text-decoration: none; font-weight: 500;">
                          axiestudio.se
                        </a>
                      </p>

                      <!-- Unsubscribe -->
                      <p style="color: #9ca3af; margin: 16px 0 0 0; font-size: 12px;">
                        ${isSwedish
                          ? 'Du får detta e-postmeddelande eftersom du begärde en nedladdning från AxieStudio.'
                          : 'You received this email because you requested a download from AxieStudio.'
                        }
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `
  };
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, operatingSystem, language, useCase, subscribeNewsletter } = body;

    // Validate required fields
    if (!name || !email || !operatingSystem || !language) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the appropriate download link
    const downloadLink = DOWNLOAD_LINKS[language as keyof typeof DOWNLOAD_LINKS]?.[operatingSystem as keyof typeof DOWNLOAD_LINKS.english];

    if (!downloadLink) {
      return NextResponse.json(
        { message: 'Invalid operating system or language selection' },
        { status: 400 }
      );
    }

    // Initialize database tables if they don't exist
    await initializeDatabase();

    // Store the download request in the database
    await addDesktopDownloadRequest({
      name,
      email,
      company: company || null,
      operatingSystem,
      language,
      useCase: useCase || null,
      subscribeNewsletter: subscribeNewsletter || false,
      downloadLink,
      status: 'sent'
    });

    // Send email with download link
    const emailTemplate = getEmailTemplate(name, operatingSystem, language, downloadLink);
    
    await resend.emails.send({
      from: 'AxieStudio <noreply@axiestudio.se>',
      to: [email],
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    return NextResponse.json(
      { message: 'Download request processed successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Desktop download API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
