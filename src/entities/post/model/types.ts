import type { UserBase } from '@/shared/types/user';

export interface Post {
  id: string;
  author: UserBase;
  images: string[];
  content: string;
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
}
