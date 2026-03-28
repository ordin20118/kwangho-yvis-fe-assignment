import { NextRequest, NextResponse } from 'next/server';
import { posts } from '@/app/api/_data/posts';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;

  if (page < 1 || limit < 1) {
    return NextResponse.json(
      {
        success: false,
        data: [],
        error: 'page와 limit은 1 이상이어야 합니다.',
      },
      { status: 400 },
    );
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const slicedPosts = posts.slice(startIndex, endIndex);
  const totalCount = posts.length;
  const totalPages = Math.ceil(totalCount / limit);

  return NextResponse.json({
    success: true,
    data: slicedPosts,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages,
    },
  });
}
