import { useEffect, useState } from "react";

/**
 * Hook to preload images for better performance
 * @param images - Array of image URLs to preload
 * @returns Loading state
 */
export function useImagePreload(images: string[]) {
  const [loaded, setLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    if (images.length === 0) {
      setLoaded(true);
      return;
    }

    let isMounted = true;
    let loadCount = 0;

    const preloadImage = (src: string) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = () => reject(src);
        img.src = src;
      });
    };

    Promise.allSettled(images.map(preloadImage)).then(() => {
      if (isMounted) {
        setLoaded(true);
        setLoadedCount(images.length);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [images]);

  return { loaded, loadedCount, total: images.length };
}
