export const postKeys = {
    all: ['posts'] as const,
    lists: () => [...postKeys.all, 'list'] as const,
    detail: (id: string) => [...postKeys.all, id] as const,
}