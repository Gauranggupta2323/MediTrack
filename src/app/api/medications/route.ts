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
    const { name, dosage, frequency, times, startDate, endDate, notes } = body;

    if (!name || !dosage || !frequency || !times || !Array.isArray(times) || times.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Name, dosage, frequency, and times are required' },
        { status: 400 }
      );
    }

    const medication = {
      userId: user.id,
      name,
      dosage,
      frequency,
      times,
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || undefined,
      isActive: true,
      notes: notes || '',
    };

    const medicationId = await medicationService.createMedication(medication);

    return NextResponse.json({
      success: true,
      data: { id: medicationId, ...medication },
      message: 'Medication created successfully',
    });
  } catch (error) {
    console.error('Create medication API error:', error);
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
    const activeOnly = searchParams.get('active') === 'true';

    let medications;
    if (activeOnly) {
      medications = await medicationService.getActiveMedications(user.id);
    } else {
      medications = await medicationService.getUserMedications(user.id);
    }

    return NextResponse.json({
      success: true,
      data: medications,
    });
  } catch (error) {
    console.error('Get medications API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
