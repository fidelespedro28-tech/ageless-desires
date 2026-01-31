import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Crown, Zap, Heart, Lock, Star, X, Diamond, Check, Flame } from "lucide-react";
import { PLANS_ARRAY, PlanKey, CHECKOUT_LINKS } from "@/lib/checkoutLinks";
import crownPopupImg from "@/assets/icons/crown-popup.png";

interface InsistentPremiumPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  trigger?: "likes_complete" | "chat_end" | "matches_return" | "new_chat" | "general";
}

const InsistentPremiumPopup = ({ 
  isOpen, 
  onClose, 
  onUpgrade,
  trigger = "general" 
}: InsistentPremiumPopupProps) => {
  const [canClose, setCanClose] = useState(false);
  const [closeTimer, setCloseTimer] = useState(5);
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>("plano2");

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
          title: "🔥 Você usou todas as curtidas!",
          subtitle: "Mas ainda tem muito mais coroas esperando por você...",
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
      case "new_chat":
        return {
          title: "💋 Quer iniciar uma nova conversa?",
          subtitle: "Desbloqueie o acesso ilimitado para conversar sem limites!",
          cta: "Liberar conversas ilimitadas"
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
    // Salvar estado antes de abrir checkout (para retornar ao popup depois)
    localStorage.setItem("lastPopup", "insistentPremium");
    localStorage.setItem("returnFromCheckout", "true");
    
    // Abre o link de checkout no navegador (SEM som)
    window.open(CHECKOUT_LINKS[selectedPlan].url, "_blank");
    onUpgrade();
  };

  const planIcons: Record<PlanKey, typeof Star> = {
    plano1: Star,
    plano2: Crown,
    plano3: Flame,
    plano4: Diamond,
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 bg-black/95 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-gradient-to-br from-[#1a0a20] via-[#1a1a2e] to-[#0f0a15] border-2 border-primary/40 rounded-2xl shadow-2xl shadow-primary/20 overflow-hidden animate-scale-in max-h-[95vh] overflow-y-auto">
        
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

        {/* Plan Selection - 4 options with real checkout links */}
        <div className="px-4 mb-4">
          <p className="text-white/60 text-xs text-center mb-2">Escolha seu plano:</p>
          <div className="grid grid-cols-2 gap-2">
            {PLANS_ARRAY.map((plan) => {
              const IconComponent = planIcons[plan.id];
              const isSelected = selectedPlan === plan.id;
              
              return (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative p-3 rounded-xl text-center transition-all ${
                    isSelected
                      ? "bg-gradient-to-r from-primary to-purple-accent text-white scale-105 border-2 border-primary"
                      : "bg-white/10 text-white/70 hover:bg-white/20 border border-white/10"
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gold text-background text-[8px] px-1.5 py-0.5 rounded-full font-bold">
                      TOP
                    </span>
                  )}
                  <IconComponent className={`w-5 h-5 mx-auto mb-1 ${isSelected ? "text-white" : "text-white/60"}`} />
                  <div className="text-xs font-medium">{plan.name}</div>
                  <div className="text-sm font-bold">{plan.price}</div>
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                  )}
                </button>
              );
            })}
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
          <div className="py-2 bg-gradient-to-t from-primary/20 to-transparent">
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
