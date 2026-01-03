// Utility functions for API routes
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Generate JWT token
export function generateToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verify JWT token
export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Get user from Authorization header
export async function getUserFromRequest(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  const decoded = verifyToken(token) as { userId: number } | null;
  
  return decoded ? decoded.userId : null;
}

// Error response helper
export function errorResponse(message: string, status = 400) {
  return NextResponse.json(
    { success: false, message },
    { status }
  );
}

// Success response helper
export function successResponse(data: any, status = 200) {
  return NextResponse.json(
    { success: true, ...data },
    { status }
  );
}

// Format user (remove password)
export function formatUser(user: any) {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// Validate request body
export async function getRequestBody(request: Request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
