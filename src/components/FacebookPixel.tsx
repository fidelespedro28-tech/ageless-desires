import { useEffect } from "react";
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

  // Inicializa o LeadTracker na montagem
  useEffect(() => {
    LeadTracker.init();
    console.log("🔵 Facebook Pixel ativo:", FB_PIXEL_ID);
  }, []);

  // Rastreia mudanças de página (SPA navigation)
  useEffect(() => {
    if (typeof window.fbq === "function") {
      window.fbq("track", "PageView");
      LeadTracker.trackPageVisit();
      console.log("📄 PageView tracked:", location.pathname);
    }
  }, [location.pathname]);

  return null;
};

export default FacebookPixel;
