import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Crown, Gift, Star, Check } from "lucide-react";
import crownIcon from "@/assets/crown-icon.png";

interface VipPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const VipPopup = ({ isOpen, onClose, onAccept }: VipPopupProps) => {
  const [remainingSlots, setRemainingSlots] = useState(7);

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setRemainingSlots((prev) => Math.max(3, prev - Math.floor(Math.random() * 2)));
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in-up">
      <div className="popup-box relative w-full max-w-md bg-gradient-to-b from-card to-background border border-primary/30 rounded-2xl shadow-popup overflow-hidden animate-scale-in">
        {/* Close button - Larger touch target */}
        <button
          onClick={onClose}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 text-muted-foreground hover:text-foreground transition-colors z-10 p-2 -m-2"
          aria-label="Fechar"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center pt-6 sm:pt-8 pb-3 sm:pb-4 px-4 sm:px-6">
          <div className="flex justify-center mb-3 sm:mb-4">
            <img src={crownIcon} alt="Coroa VIP" className="w-16 h-16 sm:w-20 sm:h-20 animate-float" />
          </div>
          <h2 className="popup-title font-display text-xl sm:text-2xl font-bold text-foreground mb-2">
            Convite Exclusivo 💋
          </h2>
          <div className="flex justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-gold fill-gold" />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 pb-5 sm:pb-6">
          <p className="text-center text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6">
            Você foi selecionado para ter acesso à nossa plataforma exclusiva de encontros 🔥
          </p>

          {/* Urgency Box */}
          <div className="bg-muted/50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-primary/20">
            <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
              <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-primary animate-heartbeat" />
              <span className="font-semibold text-foreground text-sm sm:text-base">Oportunidade Limitada</span>
            </div>
            <p className="text-xs sm:text-sm text-center text-muted-foreground mb-2 sm:mb-3">
              Apenas <span className="text-primary font-bold">50 vagas</span> disponíveis hoje
            </p>
            
            {/* Progress bar */}
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                style={{ width: `${((50 - remainingSlots) / 50) * 100}%` }}
              />
            </div>
            <p className="text-xs sm:text-sm text-center">
              Vagas restantes: <span className="text-primary font-bold">{remainingSlots}</span>
            </p>
          </div>

          {/* Benefits */}
          <div className="mb-4 sm:mb-6">
            <h4 className="font-semibold text-foreground mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
              <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
              Benefícios exclusivos:
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 max-h-[120px] sm:max-h-none overflow-y-auto">
              {[
                "Acesso a perfis premium de mulheres maduras",
                "Receba presentes e PIX das coroas 💰",
                "Prioridade em matches e conversas",
                "Chat ilimitado com mulheres experientes"
              ].map((benefit, index) => (
                <li key={index} className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-success shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <Button 
            onClick={onAccept}
            variant="seductive" 
            size="lg" 
            className="popup-btn w-full"
          >
            <Crown className="w-5 h-5" />
            Aceitar Convite VIP
          </Button>

          <p className="text-[10px] sm:text-xs text-center text-muted-foreground mt-3 sm:mt-4">
            ⏱️ Oferta válida por tempo limitado
          </p>
        </div>
      </div>
    </div>
  );
};

export default VipPopup;
