import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/config/db';
import User from '@/lib/models/userSchema';
import Enrollment from '@/lib/models/enrollmentSchema';

export async function DELETE(request, { params }) {
  try {

    await connectDB();
    const { id } = await params;

    // ✅ Check if student exists
    const student = await User.findById(id);
    if (!student) {
      return NextResponse.json(
        { message: 'Student not found' },
        { status: 404 }
      );
    }

    // ✅ Delete all enrollments associated with this student
    await Enrollment.deleteMany({ user: id });

    // ✅ Delete the student
    await User.findByIdAndDelete(id);

    return NextResponse.json({
      message: 'Student and related enrollments deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json(
      { message: 'Error deleting student', error: error.message },
      { status: 500 }
    );
  }
}
