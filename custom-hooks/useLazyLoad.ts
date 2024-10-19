import { useState, useEffect } from 'react';

type LazyloadOptions = {
  root: HTMLElement;
  rootMargin: string;
  threshold: number;
};

const defaultOptions = {
  root: null,
  rootMargin: '100px',
  threshold: 0
} as const;

export default function useLazyLoad<T extends HTMLElement = HTMLElement>(configuration: {
  elementRef: React.RefObject<T>;
  once?: boolean;
  options?: LazyloadOptions;
}) {
  const { elementRef, once, options } = configuration;
  const [isIntersecting, setIsIntersecting] = useState(false);
  useEffect(() => {
    if (elementRef.current) {
      const observer = createObserver(setIsIntersecting, options, once);
      observer.observe(elementRef.current);
    }
  }, [elementRef.current]);
  return isIntersecting;
}

function createObserver(
  setIsIntersecting: React.Dispatch<React.SetStateAction<boolean>>,
  options?: LazyloadOptions,
  once?: boolean
) {
  // Create the IntersectionObserver
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          if (once) {
            observer.unobserve(entry.target);
          }
        }
      });
    },
    {
      root: options?.root ?? defaultOptions.root,
      rootMargin: options?.rootMargin ?? defaultOptions.rootMargin,
      threshold: options?.threshold ?? defaultOptions.threshold
    }
  );
  return observer;
}
