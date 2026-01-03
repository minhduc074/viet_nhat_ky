import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { generateToken, formatUser, errorResponse, successResponse, getRequestBody } from '@/lib/apiUtils';

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 */
export async function POST(request: Request) {
  try {
    const body = await getRequestBody(request);
    
    if (!body || !body.email || !body.password) {
      return errorResponse('Email và password là bắt buộc');
    }
    
    const { email, password, name } = body;
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return errorResponse('Email đã được sử dụng');
    }
    
    // Validate password length
    if (password.length < 6) {
      return errorResponse('Password phải có ít nhất 6 ký tự');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split('@')[0]
      }
    });
    
    // Generate token
    const token = generateToken(user.id);
    
    return successResponse(
      {
        message: 'Đăng ký thành công',
        data: {
          user: formatUser(user),
          token
        }
      },
      201
    );
  } catch (error) {
    console.error('Register error:', error);
    return errorResponse('Đã xảy ra lỗi khi đăng ký', 500);
  }
}
