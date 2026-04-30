"use client";

import { useEffect, useState } from "react";

export function useSkeleton(isLoading: boolean, delay = 300) {
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      const timeout = setTimeout(() => setShowSkeleton(false), delay);
      return () => clearTimeout(timeout);
    } else {
      setShowSkeleton(true);
    }
  }, [isLoading, delay]);

  return showSkeleton;
}
