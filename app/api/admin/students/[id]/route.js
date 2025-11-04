import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    
    await User.findByIdAndDelete(id);
    
    return NextResponse.json({ message: 'Student deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}