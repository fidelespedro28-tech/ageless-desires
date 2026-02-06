<script>
/**
 * META PIXEL – SPA GLOBAL DEFINITIVO
 * Compatível com React, Vue, Next, qualquer SPA
 */

(function () {
  var PIXEL_ID = '1507627130505065';
  var initialized = false;

  // ===== Carrega o Pixel =====
  function loadPixel() {
    if (initialized) return;

    if (!window.fbq) {
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
    }

    fbq('init', PIXEL_ID);
    initialized = true;

    console.log('[MetaPixel] Pixel carregado');
  }

  // ===== PageView seguro =====
  function trackPageView() {
    if (!window.fbq || !initialized) return;
    fbq('track', 'PageView');
    console.log('[MetaPixel] PageView:', location.pathname);
  }

  // ===== Intercepta SPA =====
  function hookHistory() {
    var pushState = history.pushState;
    var replaceState = history.replaceState;

    history.pushState = function () {
      pushState.apply(this, arguments);
      trackPageView();
    };

    history.replaceState = function () {
      replaceState.apply(this, arguments);
      trackPageView();
    };

    window.addEventListener('popstate', function () {
      trackPageView();
    });
  }

  // ===== Eventos globais =====
  window.MetaPixel = {
    viewContent: function (p) {
      fbq('track', 'ViewContent', p || {});
    },
    addToCart: function (p) {
      fbq('track', 'AddToCart', p || {});
    },
    initiateCheckout: function (p) {
      fbq('track', 'InitiateCheckout', p || {});
    },
    purchase: function (p) {
      fbq('track', 'Purchase', p || {});
    }
  };

  // ===== Init =====
  loadPixel();
  trackPageView(); // primeira página
  hookHistory();
})();
</script>
