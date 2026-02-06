<script>
/**
 * META PIXEL GLOBAL SCRIPT
 * - Carrega o Pixel uma única vez
 * - Funciona em sites normais e SPA
 * - Dispara PageView automaticamente
 * - Expõe eventos padrão
 */

(function () {
  const MetaPixelGlobal = {
    pixelId: null,
    initialized: false,
    lastUrl: location.href,

    init(pixelId) {
      if (!pixelId) {
        console.warn('[MetaPixel] Pixel ID não informado');
        return;
      }

      this.pixelId = pixelId;

      // Evita carregar duas vezes
      if (window.fbq && window.fbq.loaded) {
        console.log('[MetaPixel] Pixel já carregado');
        this.initialized = true;
        return;
      }

      // Script oficial Meta
      !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = true;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

      fbq('init', pixelId);
      fbq('track', 'PageView');

      this.initialized = true;

      console.log('[MetaPixel] Pixel inicializado:', pixelId);
    },

    track(event, params = {}) {
      if (!window.fbq || !this.initialized) return;
      fbq('track', event, params);
      console.log('[MetaPixel] Evento:', event, params);
    },

    pageView() {
      this.track('PageView');
    },

    viewContent(params) {
      this.track('ViewContent', params);
    },

    addToCart(params) {
      this.track('AddToCart', params);
    },

    initiateCheckout(params) {
      this.track('InitiateCheckout', params);
    },

    purchase(params) {
      this.track('Purchase', params);
    },

    // Detecta navegação SPA
    watchUrlChange() {
      setInterval(() => {
        if (this.lastUrl !== location.href) {
          this.lastUrl = location.href;
          console.log('[MetaPixel] Mudança de página detectada');
          this.pageView();
        }
      }, 500);
    }
  };

  // Expondo globalmente
  window.MetaPixel = MetaPixelGlobal;

  // 🔥 INICIALIZA AQUI
  MetaPixelGlobal.init('SEU_PIXEL_ID_AQUI');

  // 🔥 MONITORA TROCA DE PÁGINA (SPA)
  MetaPixelGlobal.watchUrlChange();
})();
</script>
