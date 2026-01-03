import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getUserFromRequest, errorResponse, successResponse, getRequestBody } from '@/lib/apiUtils';

export async function PUT(request: Request) {
  try {
    const userId = await getUserFromRequest(request);
    
    if (!userId) {
      return errorResponse('Unauthorized', 401);
    }
    
    const body = await getRequestBody(request);
    
    if (!body || !body.currentPassword || !body.newPassword) {
      return errorResponse('Current password và new password là bắt buộc');
    }
    
    const { currentPassword, newPassword } = body;
    
    // Validate new password
    if (newPassword.length < 6) {
      return errorResponse('Password mới phải có ít nhất 6 ký tự');
    }
    
    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return errorResponse('User not found', 404);
    }
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    
    if (!isMatch) {
      return errorResponse('Password hiện tại không đúng', 401);
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });
    
    return successResponse({
      message: 'Đổi password thành công'
    });
  } catch (error) {
    console.error('Change password error:', error);
    return errorResponse('Đã xảy ra lỗi', 500);
  }
}
