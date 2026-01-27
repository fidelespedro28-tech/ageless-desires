import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { LeadTracker } from "@/lib/leadTracker";

// Facebook Pixel ID
const FB_PIXEL_ID = "1420518226437517";

// Declara tipo global para fbq
declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

const FacebookPixel = () => {
  const location = useLocation();

  // Inicializa o pixel na montagem
  useEffect(() => {
    // Evita reinicialização
    if (window.fbq) return;

    // Script do Facebook Pixel
    const script = document.createElement("script");
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${FB_PIXEL_ID}');
    `;
    document.head.appendChild(script);

    // Noscript fallback
    const noscript = document.createElement("noscript");
    const img = document.createElement("img");
    img.height = 1;
    img.width = 1;
    img.style.display = "none";
    img.src = `https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`;
    noscript.appendChild(img);
    document.body.appendChild(noscript);

    // Inicializa o LeadTracker
    LeadTracker.init();

    console.log("🔵 Facebook Pixel inicializado:", FB_PIXEL_ID);
  }, []);

  // Rastreia mudanças de página
  useEffect(() => {
    if (window.fbq) {
      window.fbq("track", "PageView");
      LeadTracker.trackPageVisit();
      console.log("📄 PageView tracked:", location.pathname);
    }
  }, [location.pathname]);

  return null;
};

export default FacebookPixel;
