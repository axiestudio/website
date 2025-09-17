import { NextRequest, NextResponse } from 'next/server';
import { getAnalytics, getConsultationRequests, getNewsletterSubscribers } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    // Basic authentication check (you should implement proper auth)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || authHeader !== `Bearer ${process.env.ANALYTICS_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    switch (type) {
      case 'consultations':
        const consultations = await getConsultationRequests();
        return NextResponse.json({
          data: consultations,
          count: consultations.length,
        });

      case 'subscribers':
        const subscribers = await getNewsletterSubscribers();
        return NextResponse.json({
          data: subscribers,
          count: subscribers.length,
        });

      case 'summary':
      default:
        const analytics = await getAnalytics();
        const consultationsList = await getConsultationRequests();
        const subscribersList = await getNewsletterSubscribers();

        return NextResponse.json({
          ...analytics,
          consultationsList: consultationsList,
          subscribersList: subscribersList
        });
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
    
    // Basic authentication check
    const authHeader = request.headers.get('authorization');
    if (!authHeader || authHeader !== `Bearer ${process.env.ANALYTICS_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let csvData = '';
    let filename = '';

    switch (type) {
      case 'consultations':
        const consultations = await getConsultationRequests();
        csvData = convertConsultationsToCSV(consultations);
        filename = `consultations_${new Date().toISOString().split('T')[0]}.csv`;
        break;

      case 'subscribers':
        const subscribers = await getNewsletterSubscribers();
        csvData = convertSubscribersToCSV(subscribers);
        filename = `subscribers_${new Date().toISOString().split('T')[0]}.csv`;
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
  const headers = ['ID', 'Name', 'Email', 'Company', 'Phone', 'Use Case', 'Timeline', 'Status', 'Referrer', 'Timestamp'];
  const rows = consultations.map(c => [
    c.id,
    c.name,
    c.email,
    c.company || '',
    c.phone || '',
    c.usecase,
    c.timeline || '',
    c.status,
    c.referrer || '',
    c.timestamp,
  ]);

  return [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');
}

function convertSubscribersToCSV(subscribers: any[]): string {
  const headers = ['ID', 'Email', 'Status', 'Referrer', 'Timestamp'];
  const rows = subscribers.map(s => [
    s.id,
    s.email,
    s.status,
    s.referrer || '',
    s.timestamp,
  ]);

  return [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');
}
