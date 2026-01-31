import { useEffect, useCallback } from "react";

/**
 * Hook para gerenciar retorno do checkout
 * Quando o lead vai para o checkout e volta, ele deve ver o popup novamente
 */
export const useCheckoutReturn = (
  onShowVipPlans: () => void,
  onShowInsistent: () => void
) => {
  // Verificar se está retornando do checkout ao montar
  useEffect(() => {
    const shouldReturnToPopup = localStorage.getItem("returnFromCheckout") === "true";
    const lastPopup = localStorage.getItem("lastPopup");
    
    if (shouldReturnToPopup) {
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

  // Marcar que está indo para checkout
  const markGoingToCheckout = useCallback((popupType: "vipPlans" | "insistentPremium") => {
    localStorage.setItem("returnFromCheckout", "true");
    localStorage.setItem("lastPopup", popupType);
  }, []);

  // Limpar flags de checkout (quando compra é concluída)
  const clearCheckoutState = useCallback(() => {
    localStorage.removeItem("returnFromCheckout");
    localStorage.removeItem("lastPopup");
  }, []);

  return {
    markGoingToCheckout,
    clearCheckoutState,
  };
};
