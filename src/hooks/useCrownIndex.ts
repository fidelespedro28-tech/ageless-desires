import { useState, useCallback, useEffect } from "react";

const CROWN_INDEX_KEY = "lastCrownIndex";

interface UseCrownIndexReturn {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  nextCrown: () => void;
}

/**
 * Hook para gerenciar o índice da coroa atual de forma persistente.
 * Salva o último índice visualizado no localStorage para que o usuário
 * continue de onde parou ao recarregar a página.
 */
export const useCrownIndex = (totalCrowns: number): UseCrownIndexReturn => {
  const [currentIndex, setCurrentIndexState] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(CROWN_INDEX_KEY);
      if (stored) {
        const index = parseInt(stored, 10);
        // Ensure index is within valid range
        if (!isNaN(index) && index >= 0) {
          return index % totalCrowns;
        }
      }
    } catch (error) {
      console.error("Failed to load crown index:", error);
    }
    return 0;
  });

  // Persist to localStorage whenever index changes
  useEffect(() => {
    try {
      localStorage.setItem(CROWN_INDEX_KEY, currentIndex.toString());
      console.log(`💾 Índice salvo: ${currentIndex}`);
    } catch (error) {
      console.error("Failed to save crown index:", error);
    }
  }, [currentIndex]);

  const setCurrentIndex = useCallback((index: number) => {
    setCurrentIndexState(index % totalCrowns);
  }, [totalCrowns]);

  const nextCrown = useCallback(() => {
    setCurrentIndexState((prev) => (prev + 1) % totalCrowns);
  }, [totalCrowns]);

  return {
    currentIndex,
    setCurrentIndex,
    nextCrown,
  };
};

// Helper functions for external use
export const saveLastCrownIndex = (index: number): void => {
  try {
    localStorage.setItem(CROWN_INDEX_KEY, index.toString());
  } catch (error) {
    console.error("Failed to save crown index:", error);
  }
};

export const getLastCrownIndex = (): number => {
  try {
    const stored = localStorage.getItem(CROWN_INDEX_KEY);
    if (stored) {
      const index = parseInt(stored, 10);
      if (!isNaN(index) && index >= 0) {
        return index;
      }
    }
  } catch (error) {
    console.error("Failed to load crown index:", error);
  }
  return 0;
};

export const resetCrownIndex = (): void => {
  try {
    localStorage.removeItem(CROWN_INDEX_KEY);
  } catch (error) {
    console.error("Failed to reset crown index:", error);
  }
};
