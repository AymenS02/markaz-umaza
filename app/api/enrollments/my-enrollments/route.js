// app/api/enrollments/my-enrollments/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/config/db';
import Enrollment from '@/lib/models/enrollmentSchema';
import User from '@/lib/models/userSchema';
import jwt from 'jsonwebtoken';

async function verifyAuth(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    await dbConnect();
    const user = await User.findById(decoded.userId);
    
    return user;
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}

export async function GET(request) {
  try {
    await dbConnect();
    
    const user = await verifyAuth(request);
    
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const enrollments = await Enrollment.find({ user: user._id })
      .populate('course', 'title instructor price difficultyLevel')
      .sort({ enrolledAt: -1 });

    return NextResponse.json(enrollments, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json(
      { message: 'Failed to fetch enrollments', error: error.message },
      { status: 500 }
    );
  }
}