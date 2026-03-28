import { NextRequest, NextResponse } from 'next/server';
import { posts } from '@/app/api/_data/posts';

const MOCK_DELAY_MS = 700;

export async function GET(request: NextRequest) {
  // 로딩 보여주기 위해 고정 딜레이 추가
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
  const { searchParams } = new URL(request.url);
  const pageParam = searchParams.get('page');
  const limitParam = searchParams.get('limit');
  const page = pageParam !== null ? Number(pageParam) : 1;
  const limit = limitParam !== null ? Number(limitParam) : 10;

  if (
    !Number.isInteger(page) ||
    !Number.isInteger(limit) ||
    page < 1 ||
    limit < 1
  ) {
    return NextResponse.json(
      {
        success: false,
        data: [],
        error: 'page와 limit은 1 이상의 정수여야 합니다.',
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
