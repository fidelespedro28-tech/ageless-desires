import { useState, useEffect, useCallback } from "react";
import { LeadTracker } from "@/lib/leadTracker";

const BALANCE_STORAGE_KEY = "userBalance";

interface UseBalanceReturn {
  balance: number;
  addBalance: (amount: number) => void;
  deductBalance: (amount: number) => boolean;
  hasEnoughBalance: (amount: number) => boolean;
  resetBalance: () => void;
}

export const useBalance = (initialBalance = 0): UseBalanceReturn => {
  const [balance, setBalance] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(BALANCE_STORAGE_KEY);
      if (stored) {
        return parseFloat(stored) || initialBalance;
      }
      return initialBalance;
    } catch {
      return initialBalance;
    }
  });

  // Persist balance to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(BALANCE_STORAGE_KEY, balance.toString());
      // Also update leadData for tracking purposes
      LeadTracker.updateLeadData({ userBalance: balance });
    } catch (error) {
      console.error("Failed to save balance:", error);
    }
  }, [balance]);

  const addBalance = useCallback((amount: number) => {
    if (amount > 0) {
      setBalance((prev) => {
        const newBalance = prev + amount;
        return Math.round(newBalance * 100) / 100; // Round to 2 decimal places
      });
    }
  }, []);

  const deductBalance = useCallback((amount: number): boolean => {
    if (amount <= 0) return false;
    
    let success = false;
    setBalance((prev) => {
      if (prev >= amount) {
        success = true;
        return Math.round((prev - amount) * 100) / 100;
      }
      return prev;
    });
    return success;
  }, []);

  const hasEnoughBalance = useCallback((amount: number): boolean => {
    return balance >= amount;
  }, [balance]);

  const resetBalance = useCallback(() => {
    setBalance(0);
    try {
      localStorage.removeItem(BALANCE_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to reset balance:", error);
    }
  }, []);

  return {
    balance,
    addBalance,
    deductBalance,
    hasEnoughBalance,
    resetBalance
  };
};
