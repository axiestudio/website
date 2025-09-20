import { NextRequest, NextResponse } from 'next/server';
import { updateConsultationStatus } from '@/lib/neon-database';

// Trinity Security System - 3 valid admin keys
const getValidTokens = () => [
  process.env.ADMIN_KEY_1,
  process.env.ADMIN_KEY_2,
  process.env.ADMIN_KEY_3
].filter(Boolean);

export async function POST(request: NextRequest) {
  try {
    // Check authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const validTokens = getValidTokens();

    if (!validTokens.includes(token)) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, notes, followUpDate, priority } = body;

    if (!id) {
      return NextResponse.json({ error: 'Consultation ID is required' }, { status: 400 });
    }

    // Update the consultation in Neon database
    const updatedConsultation = await updateConsultationStatus(parseInt(id), {
      status,
      priority,
      notes,
      followUpDate
    });

    if (!updatedConsultation) {
      return NextResponse.json({ error: 'Consultation not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Consultation updated successfully',
      consultation: updatedConsultation
    });

  } catch (error) {
    console.error('Error updating consultation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
