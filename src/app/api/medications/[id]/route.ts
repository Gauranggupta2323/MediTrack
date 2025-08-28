import { NextRequest, NextResponse } from 'next/server';
import { MedicationService } from '@/services/medicationService';
import { AuthService } from '@/services/authService';

const medicationService = new MedicationService();
const authService = new AuthService();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authService.getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const medication = await medicationService.getMedication(params.id);
    
    if (!medication) {
      return NextResponse.json(
        { success: false, error: 'Medication not found' },
        { status: 404 }
      );
    }

    if (medication.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: medication,
    });
  } catch (error) {
    console.error('Get medication API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authService.getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const medication = await medicationService.getMedication(params.id);
    
    if (!medication) {
      return NextResponse.json(
        { success: false, error: 'Medication not found' },
        { status: 404 }
      );
    }

    if (medication.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();
    await medicationService.updateMedication(params.id, body);

    return NextResponse.json({
      success: true,
      message: 'Medication updated successfully',
    });
  } catch (error) {
    console.error('Update medication API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authService.getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const medication = await medicationService.getMedication(params.id);
    
    if (!medication) {
      return NextResponse.json(
        { success: false, error: 'Medication not found' },
        { status: 404 }
      );
    }

    if (medication.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    await medicationService.deleteMedication(params.id);

    return NextResponse.json({
      success: true,
      message: 'Medication deleted successfully',
    });
  } catch (error) {
    console.error('Delete medication API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
