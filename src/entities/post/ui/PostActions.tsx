'use client';

import { Heart } from 'lucide-react';

interface PostActionsProps {
  isLiked: boolean;
  likeCount: number;
  onLikeToggle?: () => void;
}

export function PostActions({
  isLiked,
  likeCount,
  onLikeToggle,
}: PostActionsProps) {
  return (
    <div className="px-4 pt-2">
      <button
        type="button"
        onClick={onLikeToggle}
        aria-label={isLiked ? '좋아요 취소' : '좋아요'}
        className="cursor-pointer"
      >
        <Heart
          className={`h-6 w-6 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700'}`}
        />
      </button>
      <p className="mt-1 text-sm font-semibold">좋아요 {likeCount.toLocaleString()}개</p>
    </div>
  );
}
