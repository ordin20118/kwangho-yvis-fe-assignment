'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { postKeys } from '../model/keys';
import { apiClient } from '@/shared/api';
import { PaginatedResponse } from '@/shared/types/api';
import { Post } from '../model/types';

const POSTS_PER_PAGE = 5;

function fetchPosts(page: number): Promise<PaginatedResponse<Post>> {
    return apiClient<PaginatedResponse<Post>>(
        `/posts?page=${page}&limit=${POSTS_PER_PAGE}`,
    );
}

export function usePostsInfinite() {
    return useInfiniteQuery({
        queryKey: postKeys.lists(),
        queryFn: ({ pageParam }) => fetchPosts(pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const { page, totalPages } = lastPage.pagination;
            return page < totalPages ? page + 1 : undefined;
        }
    });
}