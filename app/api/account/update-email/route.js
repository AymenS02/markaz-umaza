import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/middleware/auth';
import connectDB from '../../../../lib/config/db';
import User from '../../../../lib/models/userSchema';

export async function PUT(req) {
  try {
    await connectDB();

    // Verify JWT and get current user
    const user = await verifyToken(req);

    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
    }

    // Check if email is already taken by another user
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      return NextResponse.json({ message: 'Email is already taken' }, { status: 400 });
    }

    // Update email
    user.email = email;
    await user.save();

    return NextResponse.json({ message: 'Email updated successfully', email }, { status: 200 });
  } catch (err) {
    if (err.message === 'Invalid or expired token' || err.message === 'No token provided') {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Error updating email' }, { status: 500 });
  }
}
