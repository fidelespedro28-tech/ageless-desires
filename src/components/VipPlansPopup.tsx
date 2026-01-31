import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Crown, Check, Clock, Shield, Zap, Star, Lock, Eye, MessageCircle, Heart, Flame, Diamond } from "lucide-react";
import { CHECKOUT_LINKS, PLANS_ARRAY, PlanKey } from "@/lib/checkoutLinks";
import { LeadTracker } from "@/lib/leadTracker";
import crownIcon from "@/assets/crown-icon.png";

interface VipPlansPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (plan: string) => void;
  limitType?: "likes" | "messages" | "matches" | "general";
  currentLikes?: number;
  currentMessages?: number;
}

const VipPlansPopup = ({ 
  isOpen, 
  onClose, 
  onPurchase, 
  limitType = "general",
  currentLikes = 0,
  currentMessages = 0 
}: VipPlansPopupProps) => {
  const [timeRemaining, setTimeRemaining] = useState(4 * 60 + 41); // 4:41
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>("plano2");
  const [canClose, setCanClose] = useState(false);
  const [closeTimer, setCloseTimer] = useState(3);

  useEffect(() => {
    if (isOpen && timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            return 4 * 60 + 41; // Reset timer
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen, timeRemaining]);

  // Reset timer and close delay when popup opens
  useEffect(() => {
    if (isOpen) {
      setTimeRemaining(4 * 60 + 41);
      setCanClose(false);
      setCloseTimer(3);
      
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const handlePurchase = () => {
    // Salvar estado antes de abrir checkout (para retornar ao popup depois)
    // IMPORTANTE: Isso garante que ao voltar do checkout, o popup reaparece
    localStorage.setItem("lastPopup", "vipPlans");
    localStorage.setItem("returnFromCheckout", "true");
    
    console.log("🛒 VipPlansPopup: Abrindo checkout, salvando estado para retorno");
    
    // Dispara evento InitiateCheckout para Facebook Pixel
    const planValue = {
      plano1: 19.90,
      plano2: 37.90,
      plano3: 47.90,
      plano4: 97.00
    }[selectedPlan] || 37.90;
    
    LeadTracker.triggerFacebookEvent("InitiateCheckout", {
      content_name: CHECKOUT_LINKS[selectedPlan].name,
      content_type: "vip_plan",
      value: planValue,
      currency: "BRL",
    });
    
    // Open checkout link (SEM som de dinheiro nos popups)
    window.open(CHECKOUT_LINKS[selectedPlan].url, "_blank");
    
    // NÃO chamar onPurchase aqui - só quando realmente comprar
    // onPurchase fecha o popup e ativa premium, mas o usuário ainda não pagou
  };

  const getLimitTitle = () => {
    if (limitType === "likes") {
      return "🔥 Suas curtidas acabaram!";
    }
    if (limitType === "messages") {
      return "💬 Limite de Mensagens!";
    }
    if (limitType === "matches") {
      return "💕 Desbloqueie mais matches!";
    }
    return "👑 Acesse o Mundo VIP!";
  };

  const getLimitDescription = () => {
    if (limitType === "likes") {
      return `Você usou ${currentLikes} curtidas! Desbloqueie acesso ilimitado para continuar conhecendo coroas incríveis e receber mais PIX.`;
    }
    if (limitType === "messages") {
      return `Você enviou ${currentMessages} mensagens! Para continuar conversando e receber recompensas exclusivas, torne-se VIP agora.`;
    }
    if (limitType === "matches") {
      return "🎉 Parabéns pelo seu match! Para ter matches ilimitados e conhecer todas as coroas, libere seu acesso Premium.";
    }
    return "Desbloqueie todas as funcionalidades exclusivas e tenha acesso ilimitado às melhores coroas da plataforma.";
  };

  const planIcons: Record<PlanKey, typeof Star> = {
    plano1: Star,
    plano2: Crown,
    plano3: Flame,
    plano4: Diamond,
  };

  const planColors: Record<PlanKey, { gradient: string; border: string; bg: string }> = {
    plano1: { gradient: "from-blue-500 to-cyan-500", border: "border-blue-500/30", bg: "bg-blue-500/10" },
    plano2: { gradient: "from-primary to-purple-accent", border: "border-primary/50", bg: "bg-primary/10" },
    plano3: { gradient: "from-orange-500 to-red-500", border: "border-orange-500/50", bg: "bg-orange-500/10" },
    plano4: { gradient: "from-gold via-yellow-500 to-amber-500", border: "border-gold/50", bg: "bg-gold/10" },
  };

  // Benefícios únicos por plano (cada plano tem vantagens distintas)
  const planFeatures: Record<PlanKey, { icon: typeof Heart; text: string }[]> = {
    plano1: [
      { icon: Heart, text: "Curtidas ilimitadas" },
      { icon: MessageCircle, text: "Mensagens ilimitadas" },
    ],
    plano2: [
      { icon: Heart, text: "Tudo do Básico +" },
      { icon: Eye, text: "Ver quem te curtiu" },
      { icon: Shield, text: "Perfis verificados" },
    ],
    plano3: [
      { icon: Crown, text: "Tudo do Premium +" },
      { icon: Lock, text: "Conteúdo exclusivo 🔞" },
      { icon: Zap, text: "Prioridade nos matches" },
    ],
    plano4: [
      { icon: Diamond, text: "Acesso total ao app" },
      { icon: Star, text: "Suporte VIP 24h" },
      { icon: Flame, text: "Destaque máximo" },
    ],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-md animate-fade-in">
      <div className="popup-box relative w-full max-w-lg bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] border border-primary/20 rounded-2xl shadow-popup overflow-hidden animate-scale-in max-h-[95vh] overflow-y-auto">
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

        {/* Urgent Banner */}
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 py-2 px-4 text-center">
          <p className="text-white font-bold text-sm sm:text-base animate-pulse">
            ⚡ SÓ HOJE! ÚLTIMAS HORAS PARA APROVEITAR! ⚡
          </p>
        </div>

        {/* Header */}
        <div className="text-center pt-4 sm:pt-6 pb-3 px-4 sm:px-6">
          <div className="flex justify-center mb-3">
            <div className="relative">
              <img src={crownIcon} alt="VIP" className="w-14 h-14 sm:w-16 sm:h-16 animate-float" />
              <div className="absolute -bottom-1 -right-1 bg-gold rounded-full p-1">
                <Zap className="w-3 h-3 text-background" />
              </div>
            </div>
          </div>
          <h2 className="popup-title font-display text-xl sm:text-2xl font-bold text-white mb-2">
            {getLimitTitle()}
          </h2>
          <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
            {getLimitDescription()}
          </p>
        </div>

        {/* Timer */}
        <div className="mx-4 sm:mx-6 mb-4">
          <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-red-400 animate-pulse" />
              <span className="text-white font-semibold text-sm">OFERTA POR TEMPO LIMITADO</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono">
              {formatTime(timeRemaining)}
            </div>
          </div>
        </div>

        {/* Plans - 4 options with checkout links */}
        <div className="px-4 sm:px-6 mb-4 space-y-2">
          {PLANS_ARRAY.map((plan) => {
            const IconComponent = planIcons[plan.id];
            const colors = planColors[plan.id];
            const features = planFeatures[plan.id];
            const isSelected = selectedPlan === plan.id;
            
            return (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`w-full p-3 rounded-xl border-2 transition-all duration-300 text-left relative ${
                  isSelected 
                    ? `${colors.border} ${colors.bg} scale-[1.02]` 
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-purple-accent text-white text-[10px] sm:text-xs font-bold px-3 py-0.5 rounded-full">
                    MAIS POPULAR
                  </div>
                )}
                
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shrink-0`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{plan.name}</h3>
                      <span className="text-lg font-bold text-gold">{plan.price}</span>
                    </div>
                  </div>
                  
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    isSelected ? 'border-primary bg-primary' : 'border-white/30'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                </div>

                {isSelected && (
                  <div className="mt-2 space-y-1">
                    {features.map((feature, idx) => {
                      const FeatureIcon = feature.icon;
                      return (
                        <div key={idx} className="flex items-center gap-2 text-white/80">
                          <FeatureIcon className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="text-[11px]">{feature.text}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Security Note */}
        <div className="mx-4 sm:mx-6 mb-4">
          <div className="bg-success/10 border border-success/30 rounded-xl p-3 flex items-start gap-2">
            <Shield className="w-5 h-5 text-success shrink-0 mt-0.5" />
            <p className="text-white/80 text-[10px] sm:text-xs leading-relaxed">
              <span className="font-semibold text-success">Segurança garantida:</span> O acesso VIP é essencial para garantir a segurança das mulheres em nossa plataforma e proporcionar uma experiência exclusiva e verificada.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 safe-area-bottom">
          <Button 
            onClick={handlePurchase}
            className="popup-btn w-full bg-gradient-to-r from-primary via-pink-500 to-purple-accent text-white font-bold py-5 sm:py-6 text-base sm:text-lg rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 animate-pulse-glow"
          >
            <Zap className="w-5 h-5 mr-2" />
            Liberar Acesso VIP Agora 🔥
          </Button>

          <p className="text-center text-white/50 text-[10px] sm:text-xs mt-3">
            🔒 Pagamento seguro • Acesso imediato • Cancele quando quiser
          </p>

          {canClose && (
            <button 
              onClick={onClose}
              className="w-full text-center text-white/40 text-xs mt-3 hover:text-white/60 transition-colors py-2"
            >
              Continuar com limitações
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VipPlansPopup;
