'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query';
import { apiClient } from '@/shared/api';
import { ApiResponse, PaginatedResponse } from '@/shared/types/api';
import { Post, postKeys } from '@/entities/post';

const LIKE_DEBOUNCE_MS = 300;

function toggleLikeApi(postId: string): Promise<ApiResponse<Post>> {
  return apiClient<ApiResponse<Post>>(`/posts/${postId}/like`, {
    method: 'PATCH',
  });
}

export function useLikePost() {
  const queryClient = useQueryClient();
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const clickCounts = useRef(new Map<string, number>());
  const snapshots = useRef(
    new Map<string, { isLiked: boolean; likeCount: number }>(),
  );

  // 언마운트 시 모든 타이머 정리
  useEffect(() => {
    const timersRef = timers.current;
    const clickCountsRef = clickCounts.current;
    const snapshotsRef = snapshots.current;
    return () => {
      timersRef.forEach((timer) => clearTimeout(timer));
      timersRef.clear();
      clickCountsRef.clear();
      snapshotsRef.clear();
    };
  }, []);

  const findPost = useCallback(
    (postId: string): Post | undefined => {
      const data =
        queryClient.getQueryData<InfiniteData<PaginatedResponse<Post>>>(
          postKeys.lists(),
        );
      if (!data) return undefined;
      for (const page of data.pages) {
        const found = page.data.find((p) => p.id === postId);
        if (found) return found;
      }
      return undefined;
    },
    [queryClient],
  );

  const mutation = useMutation({
    mutationFn: toggleLikeApi,
    onError: (_error, postId) => {
      // 에러 시 디바운스 시작 전 스냅샷으로 롤백
      const snapshot = snapshots.current.get(postId);
      if (snapshot) {
        queryClient.setQueryData<InfiniteData<PaginatedResponse<Post>>>(
          postKeys.lists(),
          (old) => {
            if (!old) return old;
            return {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                data: page.data.map((post) =>
                  post.id === postId ? { ...post, ...snapshot } : post,
                ),
              })),
            };
          },
        );
      }
      snapshots.current.delete(postId);
    },
    onSuccess: (_data, postId) => {
      snapshots.current.delete(postId);
    },
  });

  const updateCache = useCallback(
    (postId: string) => {
      queryClient.setQueryData<InfiniteData<PaginatedResponse<Post>>>(
        postKeys.lists(),
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.map((post) =>
                post.id === postId
                  ? {
                      ...post,
                      isLiked: !post.isLiked,
                      likeCount: post.isLiked
                        ? post.likeCount - 1
                        : post.likeCount + 1,
                    }
                  : post,
              ),
            })),
          };
        },
      );
    },
    [queryClient],
  );

  const toggleLike = useCallback(
    (postId: string) => {
      // 첫 클릭 시 원본 상태 스냅샷 저장
      if (!snapshots.current.has(postId)) {
        const post = findPost(postId);
        if (post) {
          snapshots.current.set(postId, {
            isLiked: post.isLiked,
            likeCount: post.likeCount,
          });
        }
      }

      // UI 즉시 토글
      updateCache(postId);

      // 클릭 횟수 추적
      const currentCount = clickCounts.current.get(postId) ?? 0;
      clickCounts.current.set(postId, currentCount + 1);

      // 기존 타이머 초기화
      const existingTimer = timers.current.get(postId);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      // 디바운스: 연타가 멈추면 홀수 번 클릭일 때만 API 호출
      const timer = setTimeout(() => {
        const count = clickCounts.current.get(postId) ?? 0;
        timers.current.delete(postId);
        clickCounts.current.delete(postId);

        if (count % 2 === 1) {
          mutation.mutate(postId);
        } else {
          // 짝수 번 클릭 = 원래 상태로 돌아옴, API 호출 불필요
          snapshots.current.delete(postId);
        }
      }, LIKE_DEBOUNCE_MS);

      timers.current.set(postId, timer);
    },
    [mutation, updateCache, findPost],
  );

  return { toggleLike };
}
