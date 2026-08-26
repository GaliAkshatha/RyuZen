import { useEffect } from "react";

/**
 * Adds the scrollbar-hiding class to <html> only while the calling
 * component is mounted, removing it on unmount - so navigating away
 * to any real app dashboard restores the normal, visible scrollbar
 * there.
 */
export function useHideScrollbar() {
  useEffect(() => {
    document.documentElement.classList.add("rz-hide-scrollbar");
    return () => {
      document.documentElement.classList.remove("rz-hide-scrollbar");
    };
  }, []);
}
