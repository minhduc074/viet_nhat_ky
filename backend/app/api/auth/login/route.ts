import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { generateToken, formatUser, errorResponse, successResponse, getRequestBody } from '@/lib/apiUtils';

export async function POST(request: Request) {
  try {
    const body = await getRequestBody(request);
    
    if (!body || !body.email || !body.password) {
      return errorResponse('Email và password là bắt buộc');
    }
    
    const { email, password } = body;
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return errorResponse('Email hoặc password không đúng', 401);
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return errorResponse('Email hoặc password không đúng', 401);
    }
    
    // Generate token
    const token = generateToken(user.id);
    
    return successResponse({
      message: 'Đăng nhập thành công',
      data: {
        user: formatUser(user),
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse('Đã xảy ra lỗi khi đăng nhập', 500);
  }
}
