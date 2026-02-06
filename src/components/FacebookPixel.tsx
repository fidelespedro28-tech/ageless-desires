import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
  }
}

/**
 * Meta Pixel ID: 1507627130505065
 * 
 * PageView inicial: disparado APENAS no index.html (HEAD)
 * Este componente: dispara PageView SOMENTE em navegações SPA
 */
const FacebookPixel = () => {
  const location = useLocation();
  const isFirstLoad = useRef(true);
  const lastPath = useRef(location.pathname);

  useEffect(() => {
    // Pula o primeiro render - PageView já foi disparado no index.html
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    // Só dispara se a rota realmente mudou
    if (lastPath.current !== location.pathname) {
      lastPath.current = location.pathname;

      if (typeof window !== "undefined" && typeof window.fbq === "function") {
        window.fbq("track", "PageView");
      }
    }
  }, [location.pathname]);

  return null;
};

/**
 * Dispara evento ViewContent para visualização de perfis
 */
export const trackViewContent = (contentName: string, contentType = "profile") => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "ViewContent", {
      content_name: contentName,
      content_type: contentType,
    });
  }
};

/**
 * Dispara evento Purchase para confirmação de compra
 */
export const trackPurchase = (value: number, currency = "BRL", contentName?: string) => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "Purchase", {
      value,
      currency,
      content_name: contentName || "VIP Plan",
    });
  }
};

export default FacebookPixel;
