import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/authService';

const authService = new AuthService();

export async function POST(request: NextRequest) {
  try {
    await authService.logout();
    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout API error:', error);
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    );
  }
}
