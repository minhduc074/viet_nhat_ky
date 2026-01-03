import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest, errorResponse, successResponse } from '@/lib/apiUtils';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserFromRequest(request);
    if (!userId) return errorResponse('Unauthorized', 401);
    
    const entryId = parseInt(params.id);
    
    const entry = await prisma.dailyEntry.findFirst({
      where: {
        id: entryId,
        userId
      }
    });
    
    if (!entry) {
      return errorResponse('Không tìm thấy nhật ký', 404);
    }
    
    return successResponse({ entry });
  } catch (error) {
    console.error('Get entry by ID error:', error);
    return errorResponse('Đã xảy ra lỗi', 500);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserFromRequest(request);
    if (!userId) return errorResponse('Unauthorized', 401);
    
    const entryId = parseInt(params.id);
    
    // Check if entry exists and belongs to user
    const entry = await prisma.dailyEntry.findFirst({
      where: {
        id: entryId,
        userId
      }
    });
    
    if (!entry) {
      return errorResponse('Không tìm thấy nhật ký', 404);
    }
    
    // Delete entry
    await prisma.dailyEntry.delete({
      where: { id: entryId }
    });
    
    return successResponse({ message: 'Xóa nhật ký thành công' });
  } catch (error) {
    console.error('Delete entry error:', error);
    return errorResponse('Đã xảy ra lỗi', 500);
  }
}
