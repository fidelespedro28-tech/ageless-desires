import { useState, useCallback, useEffect } from "react";

const MATCH_LIMIT_KEY = "matchLimitData";

interface MatchLimitData {
  matchCount: number;
  hasReachedLimit: boolean;
  isPremium: boolean;
  firstMatchAt: string | null;
}

interface UseMatchLimitReturn {
  // State
  matchCount: number;
  hasReachedLimit: boolean;
  isPremium: boolean;
  
  // Checks
  canInteract: boolean;
  
  // Actions
  registerMatch: () => boolean;
  enterPremiumMode: () => void;
  resetMatchLimit: () => void;
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

  // User can interact if premium OR hasn't reached match limit
  const canInteract = data.isPremium || !data.hasReachedLimit;

  // Check if user has reached free match limit
  const hasReachedMatchLimit = useCallback((): boolean => {
    return !data.isPremium && data.matchCount >= MAX_FREE_MATCHES;
  }, [data.isPremium, data.matchCount]);

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

    if (data.matchCount >= MAX_FREE_MATCHES) {
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
      firstMatchAt: prev.firstMatchAt || new Date().toISOString(),
    }));

    console.log(`🎯 Match registrado: ${newCount}/${MAX_FREE_MATCHES}`);
    
    return true;
  }, [data.isPremium, data.matchCount]);

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
    };
    setData(initialData);
    localStorage.removeItem(MATCH_LIMIT_KEY);
    console.log("🔄 Match limit resetado");
  }, []);

  return {
    matchCount: data.matchCount,
    hasReachedLimit: data.hasReachedLimit,
    isPremium: data.isPremium,
    canInteract,
    registerMatch,
    enterPremiumMode,
    resetMatchLimit,
  };
};

// Export helper functions for external use
export const hasReachedMatchLimit = (): boolean => {
  try {
    const stored = localStorage.getItem(MATCH_LIMIT_KEY);
    if (stored) {
      const data: MatchLimitData = JSON.parse(stored);
      return !data.isPremium && data.matchCount >= MAX_FREE_MATCHES;
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
