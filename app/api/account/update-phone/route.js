import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/middleware/auth';
import connectDB from '../../../../lib/config/db';
import User from '../../../../lib/models/userSchema';

export async function PUT(req) {
  try {
    await connectDB();

    // Verify JWT and get current user
    const user = await verifyToken(req);

    const { phone } = await req.json();
    if (!phone) {
      return NextResponse.json({ message: 'phone is required' }, { status: 400 });
    }

    // Check if phone is already taken by another user
    const existingUser = await User.findOne({ phone });
    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      return NextResponse.json({ message: 'phone is already taken' }, { status: 400 });
    }

    // Update phone
    user.phone = phone;
    await user.save();

    return NextResponse.json({ message: 'phone updated successfully', phone }, { status: 200 });
  } catch (err) {
    if (err.message === 'Invalid or expired token' || err.message === 'No token provided') {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Error updating phone' }, { status: 500 });
  }
}
