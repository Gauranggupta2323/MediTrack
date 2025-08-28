import { NextRequest, NextResponse } from 'next/server';
import { MedicationService } from '@/services/medicationService';
import { AuthService } from '@/services/authService';

const medicationService = new MedicationService();
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
    const { medicationId, medicationName, scheduledTime, actualTime, status, notes } = body;

    if (!medicationId || !medicationName || !scheduledTime || !status) {
      return NextResponse.json(
        { success: false, error: 'MedicationId, medicationName, scheduledTime, and status are required' },
        { status: 400 }
      );
    }

    const log = {
      userId: user.id,
      medicationId,
      medicationName,
      scheduledTime,
      actualTime: actualTime || new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      status,
      date: new Date().toISOString().split('T')[0],
      notes: notes || '',
    };

    const logId = await medicationService.createMedicationLog(log);

    return NextResponse.json({
      success: true,
      data: { id: logId, ...log },
      message: 'Medication log created successfully',
    });
  } catch (error) {
    console.error('Create medication log API error:', error);
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
    const date = searchParams.get('date');

    let logs;
    if (date) {
      logs = await medicationService.getMedicationLogsByDate(user.id, date);
    } else {
      logs = await medicationService.getUserMedicationLogs(user.id);
    }

    return NextResponse.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    console.error('Get medication logs API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
