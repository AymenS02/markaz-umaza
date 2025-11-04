import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const { status } = await request.json();
    const { id } = params;
    
    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}