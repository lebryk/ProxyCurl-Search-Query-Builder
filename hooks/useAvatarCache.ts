import { useEffect, useRef } from 'react';

const imageCache = new Map<string, HTMLImageElement>();

export const useAvatarCache = (imageUrls: (string | undefined)[]) => {
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const uniqueUrls = [...new Set(imageUrls.filter((url): url is string => !!url))];
    
    uniqueUrls.forEach(url => {
      if (!imageCache.has(url)) {
        const img = new Image();
        img.src = url;
        imageCache.set(url, img);
      }
    });
  }, [imageUrls]);

  const getImage = (url: string | undefined): string | undefined => {
    if (!url) return undefined;
    return imageCache.has(url) ? url : undefined;
  };

  return { getImage };
};
