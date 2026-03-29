'use client'

import { usePostsInfinite, PostCard } from "@/entities/post";
import { useLikePost } from "@/features/like-post";
import { useIntersectionObserver } from "@/shared/lib";
import { Spinner } from "@/shared/ui";

export function PostFeed() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = usePostsInfinite();

    const { toggleLike } = useLikePost();

    const loadMoreRef = useIntersectionObserver({
        onIntersect: fetchNextPage,
        enabled: hasNextPage && !isFetchingNextPage,
    });

    // 로딩 상태
    if(isLoading) {
        return (
            <div className="flex justify-center py-10">
                <Spinner/>
            </div>
        )
    }

     // 에러 상태
    if (isError) {
        return (
        <p className="py-10 text-center text-red-500">
            포스트를 불러오는 데 실패했습니다.
        </p>
        );
    }

    const posts = data?.pages.flatMap((page) => page.data) ?? [];

    // 빈 상태
    if (posts.length === 0) {
        return (
        <p className="py-10 text-center text-gray-500">
            포스트가 없습니다.
        </p>
        );
    }

    return (
        <div className="flex flex-col">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onLikeToggle={() => toggleLike(post.id)} />
          ))}
    
          {/* 무한 스크롤 트리거 */}
          <div ref={loadMoreRef} className="py-4">
            {isFetchingNextPage && (
              <div className="flex justify-center">
                <Spinner />
              </div>
            )}
            {!hasNextPage && posts.length > 0 && (
              <p className="text-center text-sm text-gray-400">
                모든 포스트를 불러왔습니다.
              </p>
            )}
          </div>
        </div>
      );
}