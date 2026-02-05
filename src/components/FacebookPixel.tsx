import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

const FacebookPixel = () => {
  const location = useLocation();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    // PageView inicial (post-load real)
    if (lastPath.current === null) {
      lastPath.current = location.pathname;

      window.addEventListener("load", () => {
        if (typeof window.fbq === "function") {
          window.fbq("track", "PageView");
          console.log("✅ PageView inicial");
        }
      });

      return;
    }

    // PageView apenas em navegação SPA
    if (lastPath.current !== location.pathname) {
      lastPath.current = location.pathname;

      if (typeof window.fbq === "function") {
        window.fbq("track", "PageView");
        console.log("📄 PageView SPA:", location.pathname);
      }
    }
  }, [location.pathname]);

  return null;
};

export default FacebookPixel;

