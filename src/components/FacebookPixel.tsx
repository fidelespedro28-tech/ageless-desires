import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: unknown;
  }
}

const PIXEL_ID = '1507627130505065';

const FacebookPixel = () => {
  const location = useLocation();
  const isFirstRender = useRef(true);

  // Dispara PageView a cada mudança de rota (exceto a primeira, que já foi disparada no index.html)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
      console.log('[MetaPixel] PageView SPA:', location.pathname);
    }
  }, [location.pathname]);

  return null;
};

export default FacebookPixel;
