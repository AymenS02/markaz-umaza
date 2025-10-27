import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/middleware/auth';
import { connectDB } from '../../../../lib/config/db';
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
    return NextResponse.json({ message: err.message }, { status: 401 });
  }
}
