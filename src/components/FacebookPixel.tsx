import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { LeadTracker } from "@/lib/leadTracker";

// Facebook Pixel ID
const FB_PIXEL_ID = "1420518226437517";

// Declara tipo global para fbq
declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    _fbq: any;
  }
}

const FacebookPixel = () => {
  const location = useLocation();
  const isFirstRender = useRef(true);
  const previousPath = useRef<string | null>(null);

  // Inicializa o LeadTracker na montagem
  useEffect(() => {
    LeadTracker.init();
    console.log("🔵 Facebook Pixel ativo:", FB_PIXEL_ID);
    console.log("📍 Rota inicial:", location.pathname);
  }, []);

  // Rastreia mudanças de página (SPA navigation)
  useEffect(() => {
    // Primeiro render: o PageView inicial já foi disparado pelo script no index.html
    // Apenas registra a página no LeadTracker, sem duplicar o fbq
    if (isFirstRender.current) {
      isFirstRender.current = false;
      previousPath.current = location.pathname;
      LeadTracker.trackPageVisit();
      console.log("📄 Página inicial registrada (PageView via index.html):", location.pathname);
      return;
    }

    // Evita disparo duplicado se a rota não mudou realmente
    if (previousPath.current === location.pathname) {
      return;
    }

    previousPath.current = location.pathname;

    // Dispara PageView apenas em navegações SPA subsequentes
    if (typeof window.fbq === "function") {
      window.fbq("track", "PageView");
      LeadTracker.trackPageVisit();
      console.log("📄 PageView tracked (SPA):", location.pathname);
    } else {
      console.warn("⚠️ fbq não disponível para tracking");
    }
  }, [location.pathname]);

  return null;
};

export default FacebookPixel;
