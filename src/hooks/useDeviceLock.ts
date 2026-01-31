/**
 * Device Lock System - Bloqueia múltiplas contas no mesmo dispositivo
 * 
 * Este hook persiste dados críticos por dispositivo, impedindo que usuários
 * criem novas contas para reiniciar o fluxo de curtidas e ganhos.
 */

import { useState, useEffect, useCallback } from "react";

// Chave única por dispositivo (persiste mesmo com nova conta)
const DEVICE_LOCK_KEY = "deviceLockData";

interface DeviceLockData {
  // Flags de bloqueio
  likesCompleted: boolean;          // Terminou as 10 curtidas
  conversationsFinalized: boolean;  // Finalizou conversa no chat
  globalLocked: boolean;            // Bloqueio global ativo
  
  // Dados persistentes
  totalLikesEver: number;           // Total de curtidas (nunca reseta)
  totalBalanceEver: number;         // Saldo acumulado (nunca reseta)
  matchReceived: boolean;           // Já recebeu match na 5ª curtida
  firstAccountCreatedAt: string;    // Data da primeira conta
  
  // Histórico de contas (para tracking)
  accountsCreated: number;          // Quantas contas criou neste device
  
  // Estado do checkout
  returnToPopup: string | null;     // Popup para retornar após checkout
}

const getInitialLockData = (): DeviceLockData => ({
  likesCompleted: false,
  conversationsFinalized: false,
  globalLocked: false,
  totalLikesEver: 0,
  totalBalanceEver: 0,
  matchReceived: false,
  firstAccountCreatedAt: new Date().toISOString(),
  accountsCreated: 1,
  returnToPopup: null,
});

export const useDeviceLock = () => {
  const [lockData, setLockData] = useState<DeviceLockData>(() => {
    try {
      const saved = localStorage.getItem(DEVICE_LOCK_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...getInitialLockData(), ...parsed };
      }
      return getInitialLockData();
    } catch {
      return getInitialLockData();
    }
  });

  // Salvar no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem(DEVICE_LOCK_KEY, JSON.stringify(lockData));
  }, [lockData]);

  // Verificar se device está bloqueado para curtidas
  const isLikesBlocked = useCallback((): boolean => {
    return lockData.likesCompleted || lockData.globalLocked;
  }, [lockData.likesCompleted, lockData.globalLocked]);

  // Verificar se device está bloqueado globalmente
  const isGloballyLocked = useCallback((): boolean => {
    return lockData.globalLocked;
  }, [lockData.globalLocked]);

  // Registrar que curtidas foram completadas (10 likes)
  const markLikesCompleted = useCallback(() => {
    setLockData((prev) => ({
      ...prev,
      likesCompleted: true,
      globalLocked: true, // Ativa bloqueio global
    }));
    console.log("🔒 Device bloqueado: curtidas completas");
  }, []);

  // Registrar que match foi recebido (5ª curtida)
  const markMatchReceived = useCallback(() => {
    setLockData((prev) => ({
      ...prev,
      matchReceived: true,
    }));
  }, []);

  // Registrar nova conta criada neste device
  const registerNewAccount = useCallback(() => {
    setLockData((prev) => ({
      ...prev,
      accountsCreated: prev.accountsCreated + 1,
    }));
    console.log("📝 Nova conta registrada neste device");
  }, []);

  // Atualizar total de curtidas (nunca reseta)
  const updateTotalLikes = useCallback((newLikes: number) => {
    setLockData((prev) => ({
      ...prev,
      totalLikesEver: Math.max(prev.totalLikesEver, newLikes),
    }));
  }, []);

  // Atualizar saldo total (nunca reseta)
  const updateTotalBalance = useCallback((newBalance: number) => {
    setLockData((prev) => ({
      ...prev,
      totalBalanceEver: Math.max(prev.totalBalanceEver, newBalance),
    }));
  }, []);

  // Marcar conversa como finalizada
  const markConversationFinalized = useCallback(() => {
    setLockData((prev) => ({
      ...prev,
      conversationsFinalized: true,
    }));
  }, []);

  // Gerenciar retorno do checkout
  const setReturnToPopup = useCallback((popupType: string | null) => {
    setLockData((prev) => ({
      ...prev,
      returnToPopup: popupType,
    }));
  }, []);

  const getReturnToPopup = useCallback((): string | null => {
    return lockData.returnToPopup;
  }, [lockData.returnToPopup]);

  const clearReturnToPopup = useCallback(() => {
    setLockData((prev) => ({
      ...prev,
      returnToPopup: null,
    }));
  }, []);

  // Verificar se já teve match (para não dar outro)
  const hasReceivedMatch = useCallback((): boolean => {
    return lockData.matchReceived;
  }, [lockData.matchReceived]);

  // Obter dados persistentes para exibição
  const getPersistedBalance = useCallback((): number => {
    return lockData.totalBalanceEver;
  }, [lockData.totalBalanceEver]);

  const getPersistedLikes = useCallback((): number => {
    return lockData.totalLikesEver;
  }, [lockData.totalLikesEver]);

  // Verificar se é conta nova no mesmo device
  const isReturningDevice = useCallback((): boolean => {
    return lockData.accountsCreated > 1 || lockData.likesCompleted;
  }, [lockData.accountsCreated, lockData.likesCompleted]);

  // Reset completo (apenas para debug - NÃO expor na UI)
  const __debugReset = useCallback(() => {
    localStorage.removeItem(DEVICE_LOCK_KEY);
    setLockData(getInitialLockData());
    console.log("🗑️ [DEBUG] Device lock resetado");
  }, []);

  return {
    // Verificações de bloqueio
    isLikesBlocked,
    isGloballyLocked,
    isReturningDevice,
    hasReceivedMatch,
    
    // Ações de bloqueio
    markLikesCompleted,
    markMatchReceived,
    markConversationFinalized,
    registerNewAccount,
    
    // Dados persistentes
    updateTotalLikes,
    updateTotalBalance,
    getPersistedBalance,
    getPersistedLikes,
    
    // Checkout flow
    setReturnToPopup,
    getReturnToPopup,
    clearReturnToPopup,
    
    // Dados brutos
    lockData,
    
    // Debug only
    __debugReset,
  };
};

// Função standalone para verificar bloqueio (sem hook)
export const checkDeviceLocked = (): boolean => {
  try {
    const saved = localStorage.getItem(DEVICE_LOCK_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.globalLocked === true || parsed.likesCompleted === true;
    }
    return false;
  } catch {
    return false;
  }
};

// Função para obter saldo persistente (sem hook)
export const getDeviceBalance = (): number => {
  try {
    const saved = localStorage.getItem(DEVICE_LOCK_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.totalBalanceEver || 0;
    }
    return 0;
  } catch {
    return 0;
  }
};
