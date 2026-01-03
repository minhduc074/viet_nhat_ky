import { NextRequest } from 'next/server';
import { verifyToken, extractToken, JwtPayload } from './auth';

// Middleware to verify authentication
export async function authenticateRequest(request: NextRequest): Promise<JwtPayload | null> {
  const authHeader = request.headers.get('authorization');
  const token = extractToken(authHeader);
  
  if (!token) {
    return null;
  }
  
  const payload = verifyToken(token);
  if (!payload) {
    return null;
  }
  
  // Verify user still exists in database
  try {
    const prisma = (await import('./prisma')).default;
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true },
    });
    
    if (!user) {
      console.warn(`User ${payload.userId} from token not found in database`);
      return null;
    }
  } catch (error) {
    console.error('Error verifying user existence:', error);
    return null;
  }
  
  return payload;
}

// Create JSON response helper
export function jsonResponse(data: unknown, status: number = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// Create error response helper
export function errorResponse(message: string, status: number = 400) {
  return jsonResponse({ success: false, error: message }, status);
}

// Create success response helper
export function successResponse(data: unknown, message?: string) {
  return jsonResponse({ success: true, data, message });
}

// Get today's date at midnight (UTC)
export function getTodayDate(): Date {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today;
}

// Get date from string (YYYY-MM-DD format)
export function parseDate(dateString: string): Date {
  const date = new Date(dateString);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

// Format date to YYYY-MM-DD
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}
