import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest, errorResponse, successResponse } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const payload = await authenticateRequest(request);
    if (!payload) {
      return errorResponse('Chưa đăng nhập', 401);
    }
    
    // Get user profile
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
    
    if (!user) {
      return errorResponse('Không tìm thấy người dùng', 404);
    }
    
    return successResponse({ user });
    
  } catch (error) {
    console.error('Get profile error:', error);
    return errorResponse('Đã xảy ra lỗi', 500);
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new Response(null, { status: 200 });
}
