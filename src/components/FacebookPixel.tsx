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
  const isFirstLoad = useRef(true);
  const lastPath = useRef<string | null>(null);

  // Inicialização única - NÃO dispara PageView aqui
  // PageView inicial vem EXCLUSIVAMENTE do index.html
  useEffect(() => {
    LeadTracker.init();
    lastPath.current = location.pathname;
    console.log("🔵 Facebook Pixel ativo:", FB_PIXEL_ID);
    console.log("📍 Rota inicial (PageView via index.html):", location.pathname);
  }, []);

  // Rastreia APENAS mudanças de rota SPA (navegações subsequentes)
  useEffect(() => {
    // Primeira renderização: pula, pois PageView já foi disparado no index.html
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    // Só dispara se a rota realmente mudou
    if (lastPath.current !== location.pathname) {
      lastPath.current = location.pathname;

      // Validação robusta antes de disparar
      if (
        typeof window !== "undefined" &&
        typeof window.fbq === "function"
      ) {
        window.fbq("track", "PageView");
        LeadTracker.trackPageVisit();
        console.log("📄 PageView SPA:", location.pathname);
      }
    }
  }, [location.pathname]);

  return null;
};

export default FacebookPixel;
