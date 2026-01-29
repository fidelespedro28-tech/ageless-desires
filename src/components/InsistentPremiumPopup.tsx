import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Crown, Zap, Heart, Lock, Star, X } from "lucide-react";
import crownPopupImg from "@/assets/icons/crown-popup.png";

interface InsistentPremiumPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  trigger?: "likes_complete" | "chat_end" | "matches_return" | "general";
}

// URLs de checkout para os planos Premium
const CHECKOUT_URLS = {
  essencial: "https://pay.kirvano.com/coroa-club-essencial", // Substituir pelo link real
  premium: "https://pay.kirvano.com/coroa-club-premium", // Substituir pelo link real
  ultra: "https://pay.kirvano.com/coroa-club-ultra", // Substituir pelo link real
};

const InsistentPremiumPopup = ({ 
  isOpen, 
  onClose, 
  onUpgrade,
  trigger = "general" 
}: InsistentPremiumPopupProps) => {
  const [canClose, setCanClose] = useState(false);
  const [closeTimer, setCloseTimer] = useState(5);
  const [selectedPlan, setSelectedPlan] = useState<"essencial" | "premium" | "ultra">("premium");

  // Delay no botão de fechar para aumentar conversão
  useEffect(() => {
    if (isOpen) {
      setCanClose(false);
      setCloseTimer(5);
      
      const interval = setInterval(() => {
        setCloseTimer((prev) => {
          if (prev <= 1) {
            setCanClose(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getTriggerContent = () => {
    switch (trigger) {
      case "likes_complete":
        return {
          title: "🔥 Você curtiu todas as coroas!",
          subtitle: "Mas ainda tem muito mais esperando por você...",
          cta: "Desbloquear coroas ilimitadas"
        };
      case "chat_end":
        return {
          title: "💬 A conversa está ficando quente!",
          subtitle: "Não deixe a coroa esperando... Continue a conexão!",
          cta: "Continuar conversando"
        };
      case "matches_return":
        return {
          title: "💕 Seus matches estão te esperando!",
          subtitle: "Elas querem falar com você agora mesmo...",
          cta: "Ver todos os matches"
        };
      default:
        return {
          title: "👑 Desbloqueie Tudo Agora!",
          subtitle: "Acesso ilimitado às melhores coroas da plataforma",
          cta: "Liberar Acesso VIP"
        };
    }
  };

  const content = getTriggerContent();

  const handleUpgradeClick = () => {
    // Abre o link de checkout no navegador
    window.open(CHECKOUT_URLS[selectedPlan], "_blank");
    onUpgrade();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 bg-black/95 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-gradient-to-br from-[#1a0a20] via-[#1a1a2e] to-[#0f0a15] border-2 border-primary/40 rounded-2xl shadow-2xl shadow-primary/20 overflow-hidden animate-scale-in">
        
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent pointer-events-none" />
        
        {/* Close button with delay */}
        <button
          onClick={() => canClose && onClose()}
          disabled={!canClose}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all ${
            canClose 
              ? "text-white/50 hover:text-white hover:bg-white/10" 
              : "text-white/20 cursor-not-allowed"
          }`}
          aria-label="Fechar"
        >
          {canClose ? (
            <X className="w-5 h-5" />
          ) : (
            <span className="text-xs font-mono">{closeTimer}s</span>
          )}
        </button>

        {/* Header Image */}
        <div className="relative pt-6 pb-4 text-center">
          <div className="w-20 h-20 mx-auto mb-4 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gold to-amber-500 rounded-full blur-xl opacity-60 animate-pulse" />
            <img 
              src={crownPopupImg} 
              alt="VIP Crown" 
              className="relative w-full h-full object-contain animate-float"
            />
          </div>
          
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
            {content.title}
          </h2>
          <p className="text-white/70 text-sm px-4">
            {content.subtitle}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="px-4 mb-4">
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: Heart, text: "Matches ilimitados", color: "text-pink-400" },
              { icon: Zap, text: "Mensagens sem limite", color: "text-yellow-400" },
              { icon: Star, text: "Perfis exclusivos", color: "text-purple-400" },
              { icon: Lock, text: "Conteúdo +18", color: "text-red-400" },
            ].map((benefit, i) => (
              <div 
                key={i}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-white/5 border border-white/10"
              >
                <benefit.icon className={`w-4 h-4 ${benefit.color} shrink-0`} />
                <span className="text-white/80 text-xs">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plan Selection Pills */}
        <div className="px-4 mb-4">
          <div className="flex gap-2 justify-center">
            {[
              { id: "essencial" as const, label: "R$ 19,90" },
              { id: "premium" as const, label: "R$ 37,90", popular: true },
              { id: "ultra" as const, label: "R$ 47,90" },
            ].map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative px-3 py-2 rounded-full text-xs font-semibold transition-all ${
                  selectedPlan === plan.id
                    ? "bg-gradient-to-r from-primary to-purple-accent text-white scale-105"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                {plan.popular && selectedPlan === plan.id && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gold text-background text-[8px] px-1.5 py-0.5 rounded-full">
                    TOP
                  </span>
                )}
                {plan.label}
              </button>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="px-4 pb-4">
          <Button
            onClick={handleUpgradeClick}
            className="w-full bg-gradient-to-r from-gold via-yellow-500 to-amber-500 text-background font-bold py-6 text-lg rounded-xl shadow-lg shadow-gold/30 hover:shadow-gold/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Crown className="w-5 h-5 mr-2" />
            {content.cta} 🔥
          </Button>
          
          <p className="text-center text-white/40 text-[10px] mt-3">
            🔒 Pagamento 100% seguro • Acesso imediato
          </p>
        </div>

        {/* Bottom text for non-closable state */}
        {!canClose && (
          <div className="absolute bottom-0 left-0 right-0 py-2 bg-gradient-to-t from-primary/20 to-transparent">
            <p className="text-center text-white/50 text-[10px] animate-pulse">
              Oferta exclusiva disponível por tempo limitado...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsistentPremiumPopup;

// Export checkout URLs for use elsewhere
export { CHECKOUT_URLS };
