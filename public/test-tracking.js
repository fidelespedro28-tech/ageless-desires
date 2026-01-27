/**
 * 🧪 Script de Testes - Lead Tracking System
 * Cole este script no console do navegador para verificar o sistema de rastreamento
 */

(function() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("🧪 INICIANDO TESTES DO SISTEMA DE RASTREAMENTO");
  console.log("═══════════════════════════════════════════════════════════\n");

  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  function test(name, fn) {
    try {
      const result = fn();
      if (result.success) {
        console.log(`✅ ${name}`);
        if (result.data) console.log("   📦", result.data);
        results.passed++;
        results.tests.push({ name, status: "passed", data: result.data });
      } else {
        console.log(`❌ ${name}: ${result.message}`);
        results.failed++;
        results.tests.push({ name, status: "failed", message: result.message });
      }
    } catch (error) {
      console.log(`❌ ${name}: Erro - ${error.message}`);
      results.failed++;
      results.tests.push({ name, status: "error", message: error.message });
    }
  }

  // ═══════════════════════════════════════════════════════════
  // TESTE 1: Verificar se leadData existe no localStorage
  // ═══════════════════════════════════════════════════════════
  console.log("\n📋 TESTE 1: Verificando leadData no localStorage\n");
  
  test("leadData existe no localStorage", () => {
    const data = localStorage.getItem("leadData");
    if (!data) return { success: false, message: "leadData não encontrado" };
    
    const parsed = JSON.parse(data);
    return { success: true, data: parsed };
  });

  test("leadData contém campo userName", () => {
    const data = JSON.parse(localStorage.getItem("leadData") || "{}");
    return { success: "userName" in data, message: "Campo userName ausente" };
  });

  test("leadData contém campo userEmail", () => {
    const data = JSON.parse(localStorage.getItem("leadData") || "{}");
    return { success: "userEmail" in data, message: "Campo userEmail ausente" };
  });

  test("leadData contém campo userPixKey", () => {
    const data = JSON.parse(localStorage.getItem("leadData") || "{}");
    return { success: "userPixKey" in data, message: "Campo userPixKey ausente" };
  });

  test("leadData contém campo likeCount", () => {
    const data = JSON.parse(localStorage.getItem("leadData") || "{}");
    return { success: "likeCount" in data, message: "Campo likeCount ausente" };
  });

  test("leadData contém campo msgCount", () => {
    const data = JSON.parse(localStorage.getItem("leadData") || "{}");
    return { success: "msgCount" in data, message: "Campo msgCount ausente" };
  });

  test("leadData contém campo utms", () => {
    const data = JSON.parse(localStorage.getItem("leadData") || "{}");
    return { success: "utms" in data, message: "Campo utms ausente" };
  });

  test("leadData contém campo pagesVisited", () => {
    const data = JSON.parse(localStorage.getItem("leadData") || "{}");
    return { success: "pagesVisited" in data, message: "Campo pagesVisited ausente" };
  });

  // ═══════════════════════════════════════════════════════════
  // TESTE 2: Verificar UTMs
  // ═══════════════════════════════════════════════════════════
  console.log("\n📋 TESTE 2: Verificando captura de UTMs\n");

  test("UTMs salvos no leadData", () => {
    const data = JSON.parse(localStorage.getItem("leadData") || "{}");
    const utms = data.utms || {};
    const hasUtms = Object.keys(utms).length > 0;
    return { 
      success: true, 
      data: hasUtms ? utms : "Nenhum UTM capturado (acesse com ?utm_source=teste para testar)" 
    };
  });

  // Simula captura de UTMs
  test("Simulação de captura de UTMs", () => {
    const testUrl = "?utm_source=google&utm_medium=cpc&utm_campaign=vip_test";
    const params = new URLSearchParams(testUrl);
    const captured = {
      utm_source: params.get("utm_source"),
      utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign")
    };
    return { success: true, data: captured };
  });

  // ═══════════════════════════════════════════════════════════
  // TESTE 3: Verificar LeadTracker global
  // ═══════════════════════════════════════════════════════════
  console.log("\n📋 TESTE 3: Verificando LeadTracker global\n");

  test("LeadTracker existe no window", () => {
    return { 
      success: typeof window.LeadTracker !== "undefined", 
      message: "LeadTracker não está disponível globalmente" 
    };
  });

  test("LeadTracker.getLeadData() funciona", () => {
    if (!window.LeadTracker) return { success: false, message: "LeadTracker não disponível" };
    const data = window.LeadTracker.getLeadData();
    return { success: data !== null, data: data };
  });

  test("LeadTracker.updateLeadData() funciona", () => {
    if (!window.LeadTracker) return { success: false, message: "LeadTracker não disponível" };
    
    const before = window.LeadTracker.getLeadData();
    const testValue = "teste_" + Date.now();
    
    window.LeadTracker.updateLeadData({ userName: testValue });
    const after = window.LeadTracker.getLeadData();
    
    // Restaura valor original
    window.LeadTracker.updateLeadData({ userName: before?.userName || "" });
    
    return { 
      success: after?.userName === testValue, 
      data: `Valor atualizado: ${testValue}` 
    };
  });

  // ═══════════════════════════════════════════════════════════
  // TESTE 4: Verificar eventos CustomEvent (UTMify)
  // ═══════════════════════════════════════════════════════════
  console.log("\n📋 TESTE 4: Verificando eventos customizados\n");

  test("triggerFacebookEvent dispara CustomEvent", () => {
    if (!window.LeadTracker) return { success: false, message: "LeadTracker não disponível" };
    
    let eventReceived = false;
    let eventData = null;
    
    const handler = (e) => {
      eventReceived = true;
      eventData = e.detail;
    };
    
    window.addEventListener("utmify", handler, { once: true });
    window.LeadTracker.triggerFacebookEvent("TestEvent", { test: true });
    
    return { 
      success: eventReceived, 
      data: eventData,
      message: "Evento não foi recebido" 
    };
  });

  // ═══════════════════════════════════════════════════════════
  // TESTE 5: Verificar Facebook Pixel
  // ═══════════════════════════════════════════════════════════
  console.log("\n📋 TESTE 5: Verificando Facebook Pixel\n");

  test("Facebook Pixel (fbq) está carregado", () => {
    return { 
      success: typeof window.fbq === "function", 
      message: "fbq não está disponível" 
    };
  });

  test("Facebook Pixel ID correto", () => {
    // Verifica se o pixel foi inicializado (procura no HTML)
    const scripts = document.querySelectorAll("script");
    let pixelFound = false;
    scripts.forEach(script => {
      if (script.innerHTML && script.innerHTML.includes("1420518226437517")) {
        pixelFound = true;
      }
    });
    return { 
      success: pixelFound, 
      data: pixelFound ? "Pixel ID: 1420518226437517" : null,
      message: "Pixel não encontrado no HTML" 
    };
  });

  // ═══════════════════════════════════════════════════════════
  // TESTE 6: Simular eventos do funil
  // ═══════════════════════════════════════════════════════════
  console.log("\n📋 TESTE 6: Simulando eventos do funil\n");

  test("Evento PageView", () => {
    if (!window.LeadTracker) return { success: false, message: "LeadTracker não disponível" };
    window.LeadTracker.triggerFacebookEvent("PageView");
    return { success: true, data: "PageView disparado" };
  });

  test("Evento Lead", () => {
    if (!window.LeadTracker) return { success: false, message: "LeadTracker não disponível" };
    window.LeadTracker.triggerFacebookEvent("Lead", { content_name: "Test Lead" });
    return { success: true, data: "Lead disparado" };
  });

  test("Evento AddToCart", () => {
    if (!window.LeadTracker) return { success: false, message: "LeadTracker não disponível" };
    window.LeadTracker.triggerFacebookEvent("AddToCart", { content_name: "Test Match" });
    return { success: true, data: "AddToCart disparado" };
  });

  test("Evento Purchase", () => {
    if (!window.LeadTracker) return { success: false, message: "LeadTracker não disponível" };
    window.LeadTracker.triggerFacebookEvent("Purchase", { value: 47.90, currency: "BRL" });
    return { success: true, data: "Purchase disparado" };
  });

  // ═══════════════════════════════════════════════════════════
  // RESUMO
  // ═══════════════════════════════════════════════════════════
  console.log("\n═══════════════════════════════════════════════════════════");
  console.log("📊 RESUMO DOS TESTES");
  console.log("═══════════════════════════════════════════════════════════");
  console.log(`✅ Passou: ${results.passed}`);
  console.log(`❌ Falhou: ${results.failed}`);
  console.log(`📈 Taxa de sucesso: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);
  console.log("═══════════════════════════════════════════════════════════\n");

  // Listener para capturar eventos UTMify
  console.log("👂 Listener de eventos UTMify ativo. Eventos serão logados automaticamente:\n");
  window.addEventListener("utmify", (e) => {
    console.log("🎯 Evento UTMify capturado:", e.detail);
  });

  // Retorna resultados para uso programático
  return results;
})();
