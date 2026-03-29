import type { Post } from '../model/types';
import { PostHeader } from './PostHeader';
import { PostImage } from './PostImage';
import { PostActions } from './PostActions';

interface PostCardProps {
  post: Post;
  onLikeToggle?: () => void;
}

export function PostCard({ post, onLikeToggle }: PostCardProps) {
  return (
    <article className="border-b border-gray-200 bg-white">
      <PostHeader
        profileImage={post.author.profileImage}
        username={post.author.username}
      />
      <PostImage
        src={post.images[0]}
        alt={`${post.author.username}의 포스트`}
      />
      <PostActions isLiked={post.isLiked} likeCount={post.likeCount} onLikeToggle={onLikeToggle} />
      <div className="px-4 pb-4 pt-2">
        <p className="text-sm">
          <span className="font-semibold">{post.author.username}</span>{' '}
          {post.content}
        </p>
        <p className="mt-1 text-xs text-gray-400">
          {new Date(post.createdAt).toLocaleDateString('ko-KR')}
        </p>
      </div>
    </article>
  );
}
