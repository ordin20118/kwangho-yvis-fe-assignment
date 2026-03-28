import { NextResponse } from 'next/server';
import { posts } from '@/app/api/_data/posts';

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return NextResponse.json(
      { success: false, data: null, error: '게시물을 찾을 수 없습니다.' },
      { status: 404 },
    );
  }

  post.isLiked = !post.isLiked;
  post.likeCount += post.isLiked ? 1 : -1;

  return NextResponse.json({
    success: true,
    data: post,
  });
}
