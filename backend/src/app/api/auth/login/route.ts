import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { comparePassword, generateToken } from '@/lib/auth';
import { errorResponse, successResponse } from '@/lib/utils';
import { z } from 'zod';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return errorResponse(validation.error.errors[0].message, 400);
    }
    
    const { email, password } = validation.data;
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      return errorResponse('Email hoặc mật khẩu không đúng', 401);
    }
    
    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return errorResponse('Email hoặc mật khẩu không đúng', 401);
    }
    
    // Check if user is active
    if (!user.isActive) {
      return errorResponse('Tài khoản đã bị vô hiệu hóa', 403);
    }
    
    // Generate token with role
    const token = generateToken({ 
      userId: user.id, 
      email: user.email,
      role: user.role || 'user'
    });
    
    return successResponse({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    }, 'Đăng nhập thành công');
    
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse('Đã xảy ra lỗi khi đăng nhập', 500);
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new Response(null, { status: 200 });
}
