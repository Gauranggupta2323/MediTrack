import { NextRequest, NextResponse } from 'next/server';
import { BloodPressureService } from '@/services/bloodPressureService';
import { AuthService } from '@/services/authService';

const bpService = new BloodPressureService();
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

    const reading = await bpService.getReading(params.id);
    
    if (!reading) {
      return NextResponse.json(
        { success: false, error: 'Reading not found' },
        { status: 404 }
      );
    }

    if (reading.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: reading,
    });
  } catch (error) {
    console.error('Get BP reading API error:', error);
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

    const reading = await bpService.getReading(params.id);
    
    if (!reading) {
      return NextResponse.json(
        { success: false, error: 'Reading not found' },
        { status: 404 }
      );
    }

    if (reading.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { systolic, diastolic, notes } = body;

    const updates: any = {};
    if (systolic !== undefined) updates.systolic = Number(systolic);
    if (diastolic !== undefined) updates.diastolic = Number(diastolic);
    if (notes !== undefined) updates.notes = notes;

    await bpService.updateReading(params.id, updates);

    return NextResponse.json({
      success: true,
      message: 'Reading updated successfully',
    });
  } catch (error) {
    console.error('Update BP reading API error:', error);
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

    const reading = await bpService.getReading(params.id);
    
    if (!reading) {
      return NextResponse.json(
        { success: false, error: 'Reading not found' },
        { status: 404 }
      );
    }

    if (reading.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    await bpService.deleteReading(params.id);

    return NextResponse.json({
      success: true,
      message: 'Reading deleted successfully',
    });
  } catch (error) {
    console.error('Delete BP reading API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
