import { NextRequest, NextResponse } from 'next/server';
import { getAnalytics, initializeDatabase } from '@/lib/neon-database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    // Enhanced authentication check with multiple valid keys
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const validTokens = [
      process.env.ADMIN_KEY_1,
      process.env.ADMIN_KEY_2,
      process.env.ADMIN_KEY_3
    ].filter(Boolean); // Remove any undefined values

    if (!validTokens.includes(token)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Initialize database tables if they don't exist
    await initializeDatabase();

    switch (type) {
      case 'consultations':
        const { getConsultationRequests } = await import('@/lib/neon-database');
        const consultations = await getConsultationRequests();
        return NextResponse.json({
          data: consultations,
          count: consultations.length,
        });

      case 'subscribers':
        const { getNewsletterSubscribers } = await import('@/lib/neon-database');
        const subscribers = await getNewsletterSubscribers();
        return NextResponse.json({
          data: subscribers,
          count: subscribers.length,
        });

      case 'desktop-downloads':
        const { getDesktopDownloadRequests } = await import('@/lib/neon-database');
        const desktopDownloads = await getDesktopDownloadRequests();
        return NextResponse.json({
          data: desktopDownloads,
          count: desktopDownloads.length,
        });

      case 'summary':
      default:
        const analytics = await getAnalytics();
        return NextResponse.json(analytics);
    }
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Export data as CSV
export async function POST(request: NextRequest) {
  try {
    const { type } = await request.json();
    
    // Enhanced authentication check with multiple valid keys
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const validTokens = [
      process.env.ADMIN_KEY_1,
      process.env.ADMIN_KEY_2,
      process.env.ADMIN_KEY_3
    ].filter(Boolean); // Remove any undefined values

    if (!validTokens.includes(token)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let csvData = '';
    let filename = '';

    switch (type) {
      case 'consultations':
        const { getConsultationRequests } = await import('@/lib/neon-database');
        const consultations = await getConsultationRequests();
        csvData = convertConsultationsToCSV(consultations);
        filename = `consultations_${new Date().toISOString().split('T')[0]}.csv`;
        break;

      case 'subscribers':
        const { getNewsletterSubscribers } = await import('@/lib/neon-database');
        const subscribers = await getNewsletterSubscribers();
        csvData = convertSubscribersToCSV(subscribers);
        filename = `subscribers_${new Date().toISOString().split('T')[0]}.csv`;
        break;

      case 'desktop-downloads':
        const { getDesktopDownloadRequests } = await import('@/lib/neon-database');
        const desktopDownloads = await getDesktopDownloadRequests();
        csvData = convertDesktopDownloadsToCSV(desktopDownloads);
        filename = `desktop_downloads_${new Date().toISOString().split('T')[0]}.csv`;
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid export type' },
          { status: 400 }
        );
    }

    return new NextResponse(csvData, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Export API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function convertConsultationsToCSV(consultations: any[]): string {
  const headers = [
    'ID',
    'Date Submitted',
    'Client Name',
    'Email Address',
    'Company/Organization',
    'Phone Number',
    'Use Case Description',
    'Project Timeline',
    'Current Status',
    'Priority Level',
    'Follow-up Date',
    'Internal Notes',
    'Referral Source',
    'Last Updated'
  ];

  const rows = consultations.map(c => [
    c.id || '',
    new Date(c.timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    c.name || '',
    c.email || '',
    c.company || 'Not Provided',
    c.phone || 'Not Provided',
    (c.usecase || '').replace(/"/g, '""'), // Escape quotes in use case
    c.timeline || 'Not Specified',
    (c.status || 'pending').toUpperCase(),
    (c.priority || 'medium').toUpperCase(),
    c.followUpDate ? new Date(c.followUpDate).toLocaleDateString('en-US') : 'Not Set',
    (c.notes || 'No notes').replace(/"/g, '""'), // Escape quotes in notes
    c.referrer || 'Direct',
    new Date(c.updatedAt || c.timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  ]);

  // Add summary row
  const summaryRow = [
    `TOTAL: ${consultations.length} consultations`,
    `Export Date: ${new Date().toLocaleDateString('en-US')}`,
    '', '', '', '', '', '', '', '', '', '', '', ''
  ];

  return [headers, ...rows, [], summaryRow]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');
}

function convertSubscribersToCSV(subscribers: any[]): string {
  const headers = [
    'ID',
    'Email Address',
    'Subscription Date',
    'Status',
    'Referral Source',
    'Days Since Subscription',
    'Email Domain',
    'Subscription Time'
  ];

  const rows = subscribers.map(s => {
    const subscriptionDate = new Date(s.timestamp);
    const daysSince = Math.floor((Date.now() - subscriptionDate.getTime()) / (1000 * 60 * 60 * 24));
    const emailDomain = s.email ? s.email.split('@')[1] : 'Unknown';

    return [
      s.id || '',
      s.email || '',
      subscriptionDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      (s.status || 'active').toUpperCase(),
      s.referrer || 'Direct',
      `${daysSince} days`,
      emailDomain,
      subscriptionDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    ];
  });

  // Add summary row
  const summaryRow = [
    `TOTAL: ${subscribers.length} subscribers`,
    `Export Date: ${new Date().toLocaleDateString('en-US')}`,
    '', '', '', '', '', ''
  ];

  return [headers, ...rows, [], summaryRow]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');
}

function convertDesktopDownloadsToCSV(downloads: any[]): string {
  const headers = [
    'ID',
    'Download Date',
    'User Name',
    'Email Address',
    'Company/Organization',
    'Operating System',
    'Preferred Language',
    'Use Case Description',
    'Newsletter Subscription',
    'Download Status',
    'Email Domain',
    'Platform Category',
    'Days Since Download',
    'Download Time'
  ];

  const rows = downloads.map(d => {
    const downloadDate = new Date(d.timestamp);
    const daysSince = Math.floor((Date.now() - downloadDate.getTime()) / (1000 * 60 * 60 * 24));
    const emailDomain = d.email ? d.email.split('@')[1] : 'Unknown';
    const platformCategory = d.operatingSystem?.toLowerCase().includes('windows') ? 'Windows' :
                           d.operatingSystem?.toLowerCase().includes('mac') ? 'macOS' :
                           d.operatingSystem?.toLowerCase().includes('ubuntu') ? 'Linux' : 'Other';

    return [
      d.id || '',
      downloadDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      d.name || '',
      d.email || '',
      d.company || 'Not Provided',
      d.operatingSystem || 'Not Specified',
      d.language || 'English',
      (d.useCase || 'Not Specified').replace(/"/g, '""'),
      d.subscribeNewsletter ? 'YES' : 'NO',
      (d.status || 'completed').toUpperCase(),
      emailDomain,
      platformCategory,
      `${daysSince} days`,
      downloadDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    ];
  });

  // Add summary row with statistics
  const windowsCount = downloads.filter(d => d.operatingSystem?.toLowerCase().includes('windows')).length;
  const macCount = downloads.filter(d => d.operatingSystem?.toLowerCase().includes('mac')).length;
  const linuxCount = downloads.filter(d => d.operatingSystem?.toLowerCase().includes('ubuntu')).length;
  const newsletterCount = downloads.filter(d => d.subscribeNewsletter).length;

  const summaryRows = [
    [],
    [`TOTAL DOWNLOADS: ${downloads.length}`, `Export Date: ${new Date().toLocaleDateString('en-US')}`, '', '', '', '', '', '', '', '', '', '', '', ''],
    [`Windows: ${windowsCount}`, `macOS: ${macCount}`, `Linux: ${linuxCount}`, `Newsletter Subs: ${newsletterCount}`, '', '', '', '', '', '', '', '', '', '']
  ];

  return [headers, ...rows, ...summaryRows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');
}
