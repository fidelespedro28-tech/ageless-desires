import { useState, useCallback, useEffect } from "react";

const LIKES_LIMIT_KEY = "likesLimitData";
const MIN_LIKES_FOR_MATCH = 5; // Mínimo de curtidas para liberar match

interface LikesLimitData {
  likesUsed: number;
  hasReachedLimit: boolean;
  isPremium: boolean;
  lastLikeAt: string | null;
}

interface UseLikesLimitReturn {
  // State
  likesUsed: number;
  hasReachedLimit: boolean;
  isPremium: boolean;
  maxFreeLikes: number;
  minLikesForMatch: number;
  
  // Checks
  canLike: boolean;
  canReceiveMatch: boolean; // Novo: verifica se pode receber match
  
  // Actions
  registerLike: () => boolean;
  enterPremiumMode: () => void;
  resetLikesLimit: () => void;
}

const MAX_FREE_LIKES = 5;

const getInitialData = (): LikesLimitData => {
  try {
    const stored = localStorage.getItem(LIKES_LIMIT_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load likes limit data:", error);
  }
  
  return {
    likesUsed: 0,
    hasReachedLimit: false,
    isPremium: false,
    lastLikeAt: null,
  };
};

export const useLikesLimit = (): UseLikesLimitReturn => {
  const [data, setData] = useState<LikesLimitData>(getInitialData);

  // Persist to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(LIKES_LIMIT_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save likes limit data:", error);
    }
  }, [data]);

  // User can like if premium OR hasn't reached limit
  const canLike = data.isPremium || !data.hasReachedLimit;
  
  // User can receive match only after MIN_LIKES_FOR_MATCH (5 curtidas)
  const canReceiveMatch = data.isPremium || data.likesUsed >= MIN_LIKES_FOR_MATCH;

  // Register a new like
  const registerLike = useCallback((): boolean => {
    if (data.isPremium) {
      // Premium users can like unlimited
      setData((prev) => ({
        ...prev,
        likesUsed: prev.likesUsed + 1,
        lastLikeAt: new Date().toISOString(),
      }));
      return true;
    }

    if (data.likesUsed >= MAX_FREE_LIKES) {
      // Already at limit
      return false;
    }

    // Register the like and check if limit reached
    const newCount = data.likesUsed + 1;
    const reachedLimit = newCount >= MAX_FREE_LIKES;

    setData((prev) => ({
      ...prev,
      likesUsed: newCount,
      hasReachedLimit: reachedLimit,
      lastLikeAt: new Date().toISOString(),
    }));

    console.log(`❤️ Like registrado: ${newCount}/${MAX_FREE_LIKES}`);
    
    return true;
  }, [data.isPremium, data.likesUsed]);

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
  const resetLikesLimit = useCallback(() => {
    const initialData: LikesLimitData = {
      likesUsed: 0,
      hasReachedLimit: false,
      isPremium: false,
      lastLikeAt: null,
    };
    setData(initialData);
    localStorage.removeItem(LIKES_LIMIT_KEY);
    console.log("🔄 Likes limit resetado");
  }, []);

  return {
    likesUsed: data.likesUsed,
    hasReachedLimit: data.hasReachedLimit,
    isPremium: data.isPremium,
    maxFreeLikes: MAX_FREE_LIKES,
    minLikesForMatch: MIN_LIKES_FOR_MATCH,
    canLike,
    canReceiveMatch,
    registerLike,
    enterPremiumMode,
    resetLikesLimit,
  };
};

// Export helper functions for external use
export const getLikesUsed = (): number => {
  try {
    const stored = localStorage.getItem(LIKES_LIMIT_KEY);
    if (stored) {
      const data: LikesLimitData = JSON.parse(stored);
      return data.likesUsed;
    }
  } catch {
    // Ignore errors
  }
  return 0;
};

export const hasReachedLikesLimit = (): boolean => {
  try {
    const stored = localStorage.getItem(LIKES_LIMIT_KEY);
    if (stored) {
      const data: LikesLimitData = JSON.parse(stored);
      return !data.isPremium && data.likesUsed >= MAX_FREE_LIKES;
    }
  } catch {
    // Ignore errors
  }
  return false;
};

export const isPremiumUser = (): boolean => {
  try {
    const stored = localStorage.getItem(LIKES_LIMIT_KEY);
    if (stored) {
      const data: LikesLimitData = JSON.parse(stored);
      return data.isPremium;
    }
  } catch {
    // Ignore errors
  }
  return false;
};

export const MAX_LIKES = MAX_FREE_LIKES;
export const MIN_CLICKS_FOR_MATCH = MIN_LIKES_FOR_MATCH;

// Verifica se pode receber match (após 5 curtidas)
export const canReceiveMatchGlobal = (): boolean => {
  try {
    const stored = localStorage.getItem(LIKES_LIMIT_KEY);
    if (stored) {
      const data: LikesLimitData = JSON.parse(stored);
      return data.isPremium || data.likesUsed >= MIN_LIKES_FOR_MATCH;
    }
  } catch {
    // Ignore errors
  }
  return false;
};
