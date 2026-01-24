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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in-up">
      <div className="relative w-full max-w-md bg-gradient-to-b from-card to-background border border-primary/30 rounded-2xl shadow-popup overflow-hidden animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center pt-8 pb-4 px-6">
          <div className="flex justify-center mb-4">
            <img src={crownIcon} alt="Coroa VIP" className="w-20 h-20 animate-float" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Convite Exclusivo 💋
          </h2>
          <div className="flex justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-gold fill-gold" />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <p className="text-center text-muted-foreground mb-6">
            Você foi selecionado para ter acesso à nossa plataforma exclusiva de encontros 🔥
          </p>

          {/* Urgency Box */}
          <div className="bg-muted/50 rounded-xl p-4 mb-6 border border-primary/20">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Gift className="w-6 h-6 text-primary animate-heartbeat" />
              <span className="font-semibold text-foreground">Oportunidade Limitada</span>
            </div>
            <p className="text-sm text-center text-muted-foreground mb-3">
              Apenas <span className="text-primary font-bold">50 vagas</span> disponíveis hoje
            </p>
            
            {/* Progress bar */}
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                style={{ width: `${((50 - remainingSlots) / 50) * 100}%` }}
              />
            </div>
            <p className="text-sm text-center">
              Vagas restantes: <span className="text-primary font-bold">{remainingSlots}</span>
            </p>
          </div>

          {/* Benefits */}
          <div className="mb-6">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Crown className="w-5 h-5 text-gold" />
              Benefícios exclusivos:
            </h4>
            <ul className="space-y-2">
              {[
                "Acesso a perfis premium de mulheres maduras",
                "Receba presentes e PIX das coroas 💰",
                "Prioridade em matches e conversas",
                "Chat ilimitado com mulheres experientes"
              ].map((benefit, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-success shrink-0" />
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
            className="w-full"
          >
            <Crown className="w-5 h-5" />
            Aceitar Convite VIP
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-4">
            ⏱️ Oferta válida por tempo limitado
          </p>
        </div>
      </div>
    </div>
  );
};

export default VipPopup;
