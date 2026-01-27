// Lead Tracking System - Captura, rastreamento e armazenamento de dados do lead

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export interface LeadData {
  // Dados do usuário
  userName: string;
  userEmail: string;
  userPixKey: string;
  
  // Métricas de engajamento
  likeCount: number;
  msgCount: number;
  
  // Timestamps
  entryTime: string;
  matchTime: string | null;
  purchaseTime: string | null;
  updatedAt: string;
  
  // Navegação
  pagesVisited: string[];
  
  // UTMs
  utms: UTMParams;
  
  // Status
  isVip: boolean;
  matchedProfiles: string[];
}

const LEAD_DATA_KEY = "leadData";
const UTM_COOKIE_KEY = "utm_params";

// Função para criar dados iniciais do lead
const createInitialLeadData = (): LeadData => ({
  userName: "",
  userEmail: "",
  userPixKey: "",
  likeCount: 0,
  msgCount: 0,
  entryTime: new Date().toISOString(),
  matchTime: null,
  purchaseTime: null,
  updatedAt: new Date().toISOString(),
  pagesVisited: [],
  utms: {},
  isVip: false,
  matchedProfiles: [],
});

// Classe principal de rastreamento
class LeadTrackerClass {
  private initialized = false;

  // Inicializa o tracker
  init(): void {
    if (this.initialized) return;
    
    try {
      // Captura UTMs na primeira visita
      this.captureUTMs();
      
      // Inicializa dados do lead se não existirem
      if (!this.getLeadData()) {
        this.saveLeadData(createInitialLeadData());
      }
      
      // Registra página visitada
      this.trackPageVisit();
      
      // Dispara PageView
      this.triggerFacebookEvent("PageView");
      
      this.initialized = true;
      console.log("✅ LeadTracker inicializado com sucesso");
    } catch (error) {
      console.error("❌ Erro ao inicializar LeadTracker:", error);
    }
  }

  // Obtém dados do lead do localStorage
  getLeadData(): LeadData | null {
    try {
      const data = localStorage.getItem(LEAD_DATA_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  // Salva dados do lead no localStorage
  saveLeadData(data: LeadData): void {
    try {
      data.updatedAt = new Date().toISOString();
      localStorage.setItem(LEAD_DATA_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Erro ao salvar leadData:", error);
    }
  }

  // Atualiza campos específicos do lead
  updateLeadData(updates: Partial<LeadData>): LeadData | null {
    try {
      const current = this.getLeadData() || createInitialLeadData();
      const updated = { ...current, ...updates, updatedAt: new Date().toISOString() };
      this.saveLeadData(updated);
      return updated;
    } catch (error) {
      console.error("Erro ao atualizar leadData:", error);
      return null;
    }
  }

  // Captura parâmetros UTM da URL
  captureUTMs(): UTMParams {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const utms: UTMParams = {};

      const utmKeys: (keyof UTMParams)[] = [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_term",
        "utm_content",
      ];

      utmKeys.forEach((key) => {
        const value = urlParams.get(key);
        if (value) {
          utms[key] = value;
        }
      });

      // Se encontrou UTMs, salva no localStorage e cookie
      if (Object.keys(utms).length > 0) {
        // Salva em cookie como fallback
        this.saveUTMsToCookie(utms);
        
        // Atualiza leadData com UTMs
        const leadData = this.getLeadData() || createInitialLeadData();
        leadData.utms = { ...leadData.utms, ...utms };
        this.saveLeadData(leadData);
        
        console.log("📊 UTMs capturados:", utms);
      } else {
        // Tenta recuperar de cookie
        const cookieUtms = this.getUTMsFromCookie();
        if (cookieUtms && Object.keys(cookieUtms).length > 0) {
          const leadData = this.getLeadData() || createInitialLeadData();
          if (Object.keys(leadData.utms).length === 0) {
            leadData.utms = cookieUtms;
            this.saveLeadData(leadData);
          }
        }
      }

      return utms;
    } catch (error) {
      console.error("Erro ao capturar UTMs:", error);
      return {};
    }
  }

  // Salva UTMs em cookie (fallback)
  private saveUTMsToCookie(utms: UTMParams): void {
    try {
      const expires = new Date();
      expires.setDate(expires.getDate() + 30);
      document.cookie = `${UTM_COOKIE_KEY}=${encodeURIComponent(JSON.stringify(utms))};expires=${expires.toUTCString()};path=/`;
    } catch (error) {
      console.error("Erro ao salvar UTMs em cookie:", error);
    }
  }

  // Recupera UTMs do cookie
  private getUTMsFromCookie(): UTMParams | null {
    try {
      const cookies = document.cookie.split(";");
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split("=");
        if (name === UTM_COOKIE_KEY) {
          return JSON.parse(decodeURIComponent(value));
        }
      }
      return null;
    } catch {
      return null;
    }
  }

  // Registra página visitada
  trackPageVisit(): void {
    try {
      const leadData = this.getLeadData();
      if (leadData) {
        const currentPage = window.location.pathname;
        if (!leadData.pagesVisited.includes(currentPage)) {
          leadData.pagesVisited.push(currentPage);
          this.saveLeadData(leadData);
        }
      }
    } catch (error) {
      console.error("Erro ao registrar página:", error);
    }
  }

  // Incrementa contador de likes
  incrementLikes(): void {
    const leadData = this.getLeadData();
    if (leadData) {
      leadData.likeCount += 1;
      this.saveLeadData(leadData);
    }
  }

  // Incrementa contador de mensagens
  incrementMessages(): void {
    const leadData = this.getLeadData();
    if (leadData) {
      leadData.msgCount += 1;
      this.saveLeadData(leadData);
    }
  }

  // Registra match
  registerMatch(profileName: string): void {
    const leadData = this.getLeadData();
    if (leadData) {
      leadData.matchTime = new Date().toISOString();
      if (!leadData.matchedProfiles.includes(profileName)) {
        leadData.matchedProfiles.push(profileName);
      }
      this.saveLeadData(leadData);
      
      // Dispara evento AddToCart (match = interesse forte)
      this.triggerFacebookEvent("AddToCart", {
        content_name: profileName,
        content_type: "match",
        value: 0,
        currency: "BRL",
      });
    }
  }

  // Registra cadastro (Lead)
  registerSignup(name: string, email: string, pixKey: string): void {
    const leadData = this.getLeadData() || createInitialLeadData();
    leadData.userName = name;
    leadData.userEmail = email;
    leadData.userPixKey = pixKey;
    this.saveLeadData(leadData);
    
    // Dispara evento Lead
    this.triggerFacebookEvent("Lead", {
      content_name: "Cadastro Completo",
      value: 0,
      currency: "BRL",
    });
  }

  // Registra compra VIP
  registerPurchase(planName: string, value: number): void {
    const leadData = this.getLeadData();
    if (leadData) {
      leadData.isVip = true;
      leadData.purchaseTime = new Date().toISOString();
      this.saveLeadData(leadData);
      
      // Dispara evento Purchase
      this.triggerFacebookEvent("Purchase", {
        content_name: planName,
        content_type: "vip_plan",
        value: value,
        currency: "BRL",
      });
    }
  }

  // Dispara evento do Facebook Pixel
  triggerFacebookEvent(eventName: string, params?: Record<string, unknown>): void {
    try {
      // Facebook Pixel
      if (typeof window !== "undefined" && (window as any).fbq) {
        if (params) {
          (window as any).fbq("track", eventName, params);
        } else {
          (window as any).fbq("track", eventName);
        }
        console.log(`📈 FB Pixel Event: ${eventName}`, params || "");
      }

      // Dispara CustomEvent para UTMify ou outros listeners
      const customEvent = new CustomEvent("utmify", {
        detail: {
          event: eventName,
          params: params || {},
          timestamp: new Date().toISOString(),
        },
      });
      window.dispatchEvent(customEvent);
      console.log(`🎯 CustomEvent disparado: ${eventName}`);
    } catch (error) {
      console.error("Erro ao disparar evento:", error);
    }
  }

  // Envia dados para webhook/backend (opcional)
  async sendLeadData(endpoint?: string): Promise<boolean> {
    const webhookUrl = endpoint || "/api/leads";
    
    try {
      const leadData = this.getLeadData();
      if (!leadData) {
        console.warn("Nenhum dado de lead para enviar");
        return false;
      }

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...leadData,
          sentAt: new Date().toISOString(),
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          currentUrl: window.location.href,
        }),
      });

      if (response.ok) {
        console.log("✅ Dados do lead enviados com sucesso");
        return true;
      } else {
        console.error("❌ Erro ao enviar dados:", response.status);
        return false;
      }
    } catch (error) {
      console.error("❌ Erro ao enviar dados do lead:", error);
      return false;
    }
  }

  // Limpa todos os dados (para testes)
  clearAllData(): void {
    try {
      localStorage.removeItem(LEAD_DATA_KEY);
      document.cookie = `${UTM_COOKIE_KEY}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
      console.log("🗑️ Dados do lead limpos");
    } catch (error) {
      console.error("Erro ao limpar dados:", error);
    }
  }
}

// Exporta instância única
export const LeadTracker = new LeadTrackerClass();

// Expõe globalmente para testes no console
if (typeof window !== "undefined") {
  (window as any).LeadTracker = LeadTracker;
}
