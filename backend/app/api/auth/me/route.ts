import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest, errorResponse, successResponse, formatUser } from '@/lib/apiUtils';

export async function GET(request: Request) {
  try {
    const userId = await getUserFromRequest(request);
    
    if (!userId) {
      return errorResponse('Unauthorized', 401);
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return errorResponse('User not found', 404);
    }
    
    return successResponse({
      user: formatUser(user)
    });
  } catch (error) {
    console.error('Get me error:', error);
    return errorResponse('Đã xảy ra lỗi', 500);
  }
}

export async function PUT(request: Request) {
  try {
    const userId = await getUserFromRequest(request);
    
    if (!userId) {
      return errorResponse('Unauthorized', 401);
    }
    
    const body = await request.json();
    const { name, email } = body;
    
    // Check if email is already taken
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          NOT: { id: userId }
        }
      });
      
      if (existingUser) {
        return errorResponse('Email đã được sử dụng');
      }
    }
    
    // Update user
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email })
      }
    });
    
    return successResponse({
      message: 'Cập nhật thông tin thành công',
      user: formatUser(user)
    });
  } catch (error) {
    console.error('Update me error:', error);
    return errorResponse('Đã xảy ra lỗi', 500);
  }
}
