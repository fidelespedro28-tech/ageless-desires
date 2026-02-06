import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

/**
 * Meta Pixel ID: 1507627130505065
 * 
 * Responsabilidades:
 * - PageView em navegação SPA (mudança de rota)
 * - ViewContent em visualização de perfis
 * - Purchase em confirmação de compra
 * 
 * O PageView inicial é disparado APENAS no index.html (HEAD)
 * Este componente dispara PageView SOMENTE em navegações SPA
 */
const FacebookPixel = () => {
  const location = useLocation();
  const isFirstLoad = useRef(true);
  const lastPath = useRef<string | null>(null);

  // Inicialização - NÃO dispara PageView aqui
  useEffect(() => {
    lastPath.current = location.pathname;
  }, []);

  // PageView apenas em navegação SPA (mudança de rota)
  useEffect(() => {
    // Pula o primeiro load - PageView já foi disparado no index.html
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    // Só dispara se a rota realmente mudou
    if (lastPath.current !== location.pathname) {
      lastPath.current = location.pathname;

      if (typeof window !== "undefined" && typeof window.fbq === "function") {
        window.fbq("track", "PageView");
        console.log("📄 PageView SPA:", location.pathname);
      }
    }
  }, [location.pathname]);

  return null;
};

/**
 * Dispara evento ViewContent para visualização de perfis
 * Usar quando o usuário visualiza detalhes de um perfil específico
 */
export const trackViewContent = (contentName: string, contentType: string = "profile") => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "ViewContent", {
      content_name: contentName,
      content_type: contentType,
    });
    console.log("👁️ ViewContent:", contentName);
  }
};

/**
 * Dispara evento Purchase para confirmação de compra
 * SOMENTE usar quando houver confirmação REAL de compra
 */
export const trackPurchase = (value: number, currency: string = "BRL", contentName?: string) => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "Purchase", {
      value: value,
      currency: currency,
      content_name: contentName || "VIP Plan",
    });
    console.log("💰 Purchase:", value, currency);
  }
};

export default FacebookPixel;
