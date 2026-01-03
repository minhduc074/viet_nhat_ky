import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';
import { jsonResponse, errorResponse, successResponse } from '@/lib/utils';
import { z } from 'zod';

// Validation schema
const registerSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  name: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return errorResponse(validation.error.errors[0].message, 400);
    }
    
    const { email, password, name } = validation.data;
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return errorResponse('Email đã được sử dụng', 409);
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    
    // Generate token
    const token = generateToken({ userId: user.id, email: user.email });
    
    return successResponse({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    }, 'Đăng ký thành công');
    
  } catch (error) {
    console.error('Register error:', error);
    return errorResponse('Đã xảy ra lỗi khi đăng ký', 500);
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new Response(null, { status: 200 });
}
