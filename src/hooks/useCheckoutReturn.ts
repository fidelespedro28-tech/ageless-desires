import { useEffect, useCallback } from "react";
import { checkDeviceLocked } from "./useDeviceLock";

/**
 * Hook para gerenciar retorno do checkout
 * Quando o lead vai para o checkout e volta, ele deve ver o popup novamente
 * 
 * REGRAS:
 * 1. Se o device está bloqueado (10 curtidas), sempre mostrar popup
 * 2. Se veio do checkout, mostrar o popup específico que estava vendo
 * 3. Nunca permitir retorno para tela de curtidas se bloqueado
 */
export const useCheckoutReturn = (
  onShowVipPlans: () => void,
  onShowInsistent: () => void
) => {
  // Verificar se está retornando do checkout ao montar
  useEffect(() => {
    const shouldReturnToPopup = localStorage.getItem("returnFromCheckout") === "true";
    const lastPopup = localStorage.getItem("lastPopup");
    const isDeviceLocked = checkDeviceLocked();
    
    // Se device está bloqueado, SEMPRE mostrar popup (mesmo sem flag de retorno)
    if (isDeviceLocked) {
      console.log("🔒 Device bloqueado - exibindo popup premium automaticamente");
      
      // Limpar flags antigas
      localStorage.removeItem("returnFromCheckout");
      
      // Mostrar popup apropriado após delay curto
      setTimeout(() => {
        if (lastPopup === "insistentPremium") {
          onShowInsistent();
        } else {
          // Default: VIP Plans para device bloqueado
          onShowVipPlans();
        }
      }, 300);
      return;
    }
    
    // Se está retornando do checkout (não bloqueado ainda)
    if (shouldReturnToPopup) {
      console.log("🔄 Retornando do checkout para popup:", lastPopup);
      
      // Limpar flags
      localStorage.removeItem("returnFromCheckout");
      
      // Mostrar popup apropriado após delay
      setTimeout(() => {
        if (lastPopup === "vipPlans") {
          onShowVipPlans();
        } else if (lastPopup === "insistentPremium") {
          onShowInsistent();
        } else {
          // Default: mostrar VIP plans
          onShowVipPlans();
        }
      }, 500);
    }
  }, [onShowVipPlans, onShowInsistent]);

  // Marcar que está indo para checkout (salva o popup atual)
  const markGoingToCheckout = useCallback((popupType: "vipPlans" | "insistentPremium") => {
    localStorage.setItem("returnFromCheckout", "true");
    localStorage.setItem("lastPopup", popupType);
    console.log("🛒 Indo para checkout, popup salvo:", popupType);
  }, []);

  // Limpar flags de checkout (quando compra é concluída)
  const clearCheckoutState = useCallback(() => {
    localStorage.removeItem("returnFromCheckout");
    localStorage.removeItem("lastPopup");
    console.log("✅ Estado de checkout limpo");
  }, []);

  // Verificar se deve mostrar popup imediatamente (para uso externo)
  const shouldShowPopupImmediately = useCallback((): boolean => {
    return checkDeviceLocked() || localStorage.getItem("returnFromCheckout") === "true";
  }, []);

  return {
    markGoingToCheckout,
    clearCheckoutState,
    shouldShowPopupImmediately,
  };
};

// Função standalone para verificar se deve redirecionar para popup
export const shouldRedirectToPopup = (): boolean => {
  return checkDeviceLocked() || localStorage.getItem("returnFromCheckout") === "true";
};
