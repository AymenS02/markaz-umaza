import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/middleware/auth';

export async function GET(request) {
  try {
    // Use your existing JWT verification
    const user = await verifyToken(request);
    
    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      status: user.status
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || 'Not authenticated' },
      { status: 401 }
    );
  }
}