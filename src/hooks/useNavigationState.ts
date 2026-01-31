/**
 * Navigation State Persistence Hook
 * 
 * Salva e restaura o estado de navegação do usuário para evitar:
 * - Erros 404 ao recarregar páginas
 * - Perda de contexto de popups
 * - Redirecionamentos incorretos
 */

import { useCallback, useEffect } from "react";

const NAV_STATE_KEY = "navigationState";

export interface NavigationState {
  // Última página visitada
  currentPage: string;
  // Último popup ativo
  activePopup: "vipPlans" | "insistent" | "match" | "pixReward" | "pixGift" | null;
  // Timestamp da última atualização
  timestamp: string;
  // Se veio do checkout
  returnFromCheckout: boolean;
  // Contexto extra (ex: profile no chat)
  context?: Record<string, unknown>;
}

const getDefaultState = (): NavigationState => ({
  currentPage: "/",
  activePopup: null,
  timestamp: new Date().toISOString(),
  returnFromCheckout: false,
  context: {},
});

// Função standalone para obter estado sem hook
export const getNavigationState = (): NavigationState => {
  try {
    const saved = localStorage.getItem(NAV_STATE_KEY);
    if (saved) {
      return { ...getDefaultState(), ...JSON.parse(saved) };
    }
    return getDefaultState();
  } catch {
    return getDefaultState();
  }
};

// Função standalone para salvar estado
export const saveNavigationState = (state: Partial<NavigationState>): void => {
  try {
    const current = getNavigationState();
    const updated = { 
      ...current, 
      ...state, 
      timestamp: new Date().toISOString() 
    };
    localStorage.setItem(NAV_STATE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Erro ao salvar estado de navegação:", error);
  }
};

// Função para verificar se deve redirecionar para última página
export const shouldRestorePage = (): string | null => {
  try {
    const state = getNavigationState();
    const currentPath = window.location.pathname;
    
    // Se está na página inicial e tem estado salvo válido
    if (currentPath === "/" || currentPath === "/cadastro" || currentPath === "/login") {
      // Verificar se o usuário já passou pelo cadastro
      const userName = localStorage.getItem("userName");
      if (userName && state.currentPage && state.currentPage !== "/") {
        // Verificar se a página salva é válida
        const validPages = ["/descobrir", "/chat", "/perfil", "/bem-vindo"];
        if (validPages.includes(state.currentPage)) {
          return state.currentPage;
        }
      }
    }
    return null;
  } catch {
    return null;
  }
};

// Hook principal
export const useNavigationState = (currentPage: string) => {
  // Salvar página atual ao carregar
  useEffect(() => {
    saveNavigationState({ currentPage });
  }, [currentPage]);

  // Salvar popup ativo
  const setActivePopup = useCallback((popup: NavigationState["activePopup"]) => {
    saveNavigationState({ activePopup: popup });
  }, []);

  // Limpar popup ativo
  const clearActivePopup = useCallback(() => {
    saveNavigationState({ activePopup: null });
  }, []);

  // Marcar retorno do checkout
  const markReturnFromCheckout = useCallback(() => {
    saveNavigationState({ returnFromCheckout: true });
  }, []);

  // Limpar flag de retorno do checkout
  const clearReturnFromCheckout = useCallback(() => {
    saveNavigationState({ returnFromCheckout: false });
  }, []);

  // Salvar contexto extra (ex: profile no chat)
  const saveContext = useCallback((context: Record<string, unknown>) => {
    saveNavigationState({ context });
  }, []);

  // Obter estado atual
  const getState = useCallback(() => {
    return getNavigationState();
  }, []);

  return {
    setActivePopup,
    clearActivePopup,
    markReturnFromCheckout,
    clearReturnFromCheckout,
    saveContext,
    getState,
  };
};
