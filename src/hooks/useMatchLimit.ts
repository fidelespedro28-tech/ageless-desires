import { useState, useCallback, useEffect } from "react";

const MATCH_LIMIT_KEY = "matchLimitData";

interface MatchLimitData {
  matchCount: number;
  hasReachedLimit: boolean;
  isPremium: boolean;
  firstMatchAt: string | null;
  freeMatchUsed: boolean; // Novo: marca se o match gratuito foi consumido
}

interface UseMatchLimitReturn {
  // State
  matchCount: number;
  hasReachedLimit: boolean;
  isPremium: boolean;
  freeMatchUsed: boolean;
  
  // Checks
  canInteract: boolean;
  
  // Actions
  registerMatch: () => boolean;
  enterPremiumMode: () => void;
  resetMatchLimit: () => void;
  markFreeMatchAsUsed: () => void; // Novo: marca o match gratuito como consumido
}

const MAX_FREE_MATCHES = 1;

const getInitialData = (): MatchLimitData => {
  try {
    const stored = localStorage.getItem(MATCH_LIMIT_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load match limit data:", error);
  }
  
  return {
    matchCount: 0,
    hasReachedLimit: false,
    isPremium: false,
    firstMatchAt: null,
    freeMatchUsed: false,
  };
};

export const useMatchLimit = (): UseMatchLimitReturn => {
  const [data, setData] = useState<MatchLimitData>(getInitialData);

  // Persist to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(MATCH_LIMIT_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save match limit data:", error);
    }
  }, [data]);

  // User can interact if premium OR hasn't used free match yet
  const canInteract = data.isPremium || (!data.hasReachedLimit && !data.freeMatchUsed);

  // Register a new match
  const registerMatch = useCallback((): boolean => {
    if (data.isPremium) {
      // Premium users can match unlimited
      setData((prev) => ({
        ...prev,
        matchCount: prev.matchCount + 1,
      }));
      return true;
    }

    if (data.matchCount >= MAX_FREE_MATCHES || data.freeMatchUsed) {
      // Already at limit
      return false;
    }

    // Register the match and check if limit reached
    const newCount = data.matchCount + 1;
    const reachedLimit = newCount >= MAX_FREE_MATCHES;

    setData((prev) => ({
      ...prev,
      matchCount: newCount,
      hasReachedLimit: reachedLimit,
      freeMatchUsed: true,
      firstMatchAt: prev.firstMatchAt || new Date().toISOString(),
    }));

    console.log(`🎯 Match registrado: ${newCount}/${MAX_FREE_MATCHES}`);
    
    return true;
  }, [data.isPremium, data.matchCount, data.freeMatchUsed]);

  // Marca o match gratuito como usado (após completar perfil)
  const markFreeMatchAsUsed = useCallback(() => {
    setData((prev) => ({
      ...prev,
      freeMatchUsed: true,
      hasReachedLimit: true,
      matchCount: 1, // Considera que já teve 1 match
      firstMatchAt: prev.firstMatchAt || new Date().toISOString(),
    }));
    console.log("🔒 Match gratuito consumido automaticamente");
  }, []);

  // Enter premium mode
  const enterPremiumMode = useCallback(() => {
    setData((prev) => ({
      ...prev,
      isPremium: true,
      hasReachedLimit: false, // Unlock interactions
    }));
    console.log("👑 Modo Premium ativado!");
  }, []);

  // Reset for testing purposes
  const resetMatchLimit = useCallback(() => {
    const initialData: MatchLimitData = {
      matchCount: 0,
      hasReachedLimit: false,
      isPremium: false,
      firstMatchAt: null,
      freeMatchUsed: false,
    };
    setData(initialData);
    localStorage.removeItem(MATCH_LIMIT_KEY);
    console.log("🔄 Match limit resetado");
  }, []);

  return {
    matchCount: data.matchCount,
    hasReachedLimit: data.hasReachedLimit,
    isPremium: data.isPremium,
    freeMatchUsed: data.freeMatchUsed,
    canInteract,
    registerMatch,
    enterPremiumMode,
    resetMatchLimit,
    markFreeMatchAsUsed,
  };
};

// Export helper functions for external use
export const hasReachedMatchLimit = (): boolean => {
  try {
    const stored = localStorage.getItem(MATCH_LIMIT_KEY);
    if (stored) {
      const data: MatchLimitData = JSON.parse(stored);
      return !data.isPremium && (data.matchCount >= MAX_FREE_MATCHES || data.freeMatchUsed);
    }
  } catch {
    // Ignore errors
  }
  return false;
};

export const isPremiumUser = (): boolean => {
  try {
    const stored = localStorage.getItem(MATCH_LIMIT_KEY);
    if (stored) {
      const data: MatchLimitData = JSON.parse(stored);
      return data.isPremium;
    }
  } catch {
    // Ignore errors
  }
  return false;
};

// Verifica se o match gratuito já foi usado
export const hasUsedFreeMatch = (): boolean => {
  try {
    const stored = localStorage.getItem(MATCH_LIMIT_KEY);
    if (stored) {
      const data: MatchLimitData = JSON.parse(stored);
      return data.freeMatchUsed;
    }
  } catch {
    // Ignore errors
  }
  return false;
};

// Marca o match gratuito como usado (função standalone)
export const markFreeMatchAsUsedGlobal = (): void => {
  try {
    const stored = localStorage.getItem(MATCH_LIMIT_KEY);
    const data: MatchLimitData = stored ? JSON.parse(stored) : {
      matchCount: 0,
      hasReachedLimit: false,
      isPremium: false,
      firstMatchAt: null,
      freeMatchUsed: false,
    };
    
    data.freeMatchUsed = true;
    data.hasReachedLimit = true;
    data.matchCount = 1;
    data.firstMatchAt = data.firstMatchAt || new Date().toISOString();
    
    localStorage.setItem(MATCH_LIMIT_KEY, JSON.stringify(data));
    console.log("🔒 Match gratuito consumido (global)");
  } catch (error) {
    console.error("Failed to mark free match as used:", error);
  }
};
