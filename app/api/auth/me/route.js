import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/middleware/auth';

export async function GET(request) {
  try {
    // Use your existing JWT verification
    const user = await verifyToken(request);
    
    return NextResponse.json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      gender: user.gender,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || 'Not authenticated' },
      { status: 401 }
    );
  }
}