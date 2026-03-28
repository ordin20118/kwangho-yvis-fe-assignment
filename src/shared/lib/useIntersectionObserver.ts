'use client'

import { useEffect, useRef } from "react"

interface UseIntersectionObserverOptions {
    onIntersect: () => void;
    enabled?: boolean;
    threshold?: number;
    rootMargin?: string;
}

export function useIntersectionObserver({
    onIntersect,
    enabled = true,
    threshold = 0.1,
    rootMargin = '0px',
}: UseIntersectionObserverOptions) {
    const targetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const target = targetRef.current;
        if(!target || !enabled) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if(entries[0].isIntersecting) {
                    onIntersect();
                }
            },
            { threshold, rootMargin },
        );

        observer.observe(target);
        return () => observer.disconnect();
    }, [onIntersect, enabled, threshold, rootMargin]);
    
    return targetRef;
}
