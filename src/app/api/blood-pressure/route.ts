import { NextRequest, NextResponse } from 'next/server';
import { BloodPressureService } from '@/services/bloodPressureService';
import { AuthService } from '@/services/authService';

const bpService = new BloodPressureService();
const authService = new AuthService();

export async function POST(request: NextRequest) {
  try {
    const user = await authService.getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { systolic, diastolic, notes } = body;

    if (!systolic || !diastolic) {
      return NextResponse.json(
        { success: false, error: 'Systolic and diastolic values are required' },
        { status: 400 }
      );
    }

    const now = new Date();
    const reading = {
      userId: user.id,
      systolic: Number(systolic),
      diastolic: Number(diastolic),
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      notes: notes || '',
    };

    const id = await bpService.createReading(reading);

    return NextResponse.json({
      success: true,
      data: { id, ...reading },
      message: 'Blood pressure reading created successfully',
    });
  } catch (error) {
    console.error('Create BP reading API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await authService.getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let readings;

    if (startDate && endDate) {
      readings = await bpService.getReadingsByDateRange(user.id, startDate, endDate);
    } else {
      readings = await bpService.getUserReadings(user.id, limit ? Number(limit) : 50);
    }

    return NextResponse.json({
      success: true,
      data: readings,
    });
  } catch (error) {
    console.error('Get BP readings API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
