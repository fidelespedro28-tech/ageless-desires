import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Crown, Check, Clock, Shield, Zap, Star, Lock, Eye, MessageCircle, Heart, Flame } from "lucide-react";
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
  const [selectedPlan, setSelectedPlan] = useState<string>("premium");

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

  // Reset timer when popup opens
  useEffect(() => {
    if (isOpen) {
      setTimeRemaining(4 * 60 + 41);
    }
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const handlePurchase = () => {
    // Play cash sound
    const audio = new Audio('/audios/audio-cash.mp3');
    audio.play().catch(() => {});
    onPurchase(selectedPlan);
  };

  const getLimitTitle = () => {
    if (limitType === "likes") {
      return "🔥 Você chegou ao topo!";
    }
    if (limitType === "messages") {
      return "💬 Limite de Mensagens Atingido!";
    }
    if (limitType === "matches") {
      return "💕 Você já usou seu match gratuito!";
    }
    return "👑 Acesse o Mundo VIP!";
  };

  const getLimitDescription = () => {
    if (limitType === "likes") {
      return `Você já curtiu ${currentLikes} coroas incríveis! Para continuar descobrindo mais mulheres maduras e generosas, libere seu acesso VIP.`;
    }
    if (limitType === "messages") {
      return `Você já enviou ${currentMessages} mensagens! Para continuar conversando sem limites e receber mais PIX, torne-se VIP.`;
    }
    if (limitType === "matches") {
      return "Parabéns pelo seu primeiro match! 🎉 Para ter matches ilimitados e conhecer mais coroas incríveis, torne-se Premium agora.";
    }
    return "Desbloqueie todas as funcionalidades exclusivas e tenha acesso ilimitado às melhores coroas da plataforma.";
  };

  const plans = [
    {
      id: "essencial",
      name: "Essencial",
      price: "19,90",
      priceLabel: "à vista",
      icon: Star,
      color: "from-blue-500 to-cyan-500",
      borderColor: "border-blue-500/30",
      bgColor: "bg-blue-500/10",
      features: [
        { icon: Heart, text: "Acesso ilimitado a todos os perfis" },
        { icon: MessageCircle, text: "Mensagens ilimitadas" },
      ]
    },
    {
      id: "premium",
      name: "Premium",
      price: "37,90",
      priceLabel: "à vista",
      icon: Crown,
      color: "from-primary to-purple-accent",
      borderColor: "border-primary/50",
      bgColor: "bg-primary/10",
      popular: true,
      features: [
        { icon: Heart, text: "Tudo do plano Essencial" },
        { icon: Eye, text: "Ver quem curtiu seu perfil" },
        { icon: Shield, text: "Acesso a perfis verificados premium" },
      ]
    },
    {
      id: "ultra",
      name: "Ultra VIP",
      price: "47,90",
      priceLabel: "à vista",
      icon: Flame,
      color: "from-gold via-yellow-500 to-amber-500",
      borderColor: "border-gold/50",
      bgColor: "bg-gold/10",
      features: [
        { icon: Crown, text: "Tudo do plano Premium" },
        { icon: Lock, text: "Acesso a conteúdo exclusivo +18 🔞" },
        { icon: Zap, text: "Prioridade máxima nos matches" },
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
      <div className="popup-box relative w-full max-w-lg bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] border border-primary/20 rounded-2xl shadow-popup overflow-hidden animate-scale-in max-h-[95vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors z-10 p-2 -m-2"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
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

        {/* Plans */}
        <div className="px-4 sm:px-6 mb-4 space-y-3">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            const isSelected = selectedPlan === plan.id;
            
            return (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`w-full p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 text-left relative ${
                  isSelected 
                    ? `${plan.borderColor} ${plan.bgColor} scale-[1.02]` 
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-purple-accent text-white text-[10px] sm:text-xs font-bold px-3 py-0.5 rounded-full">
                    MAIS POPULAR
                  </div>
                )}
                
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center shrink-0`}>
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm sm:text-base">{plan.name}</h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg sm:text-xl font-bold text-gold">R$ {plan.price}</span>
                        <span className="text-white/50 text-xs">{plan.priceLabel}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    isSelected ? 'border-primary bg-primary' : 'border-white/30'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />}
                  </div>
                </div>

                <div className="mt-3 space-y-1.5">
                  {plan.features.map((feature, idx) => {
                    const FeatureIcon = feature.icon;
                    return (
                      <div key={idx} className="flex items-center gap-2 text-white/80">
                        <FeatureIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
                        <span className="text-[11px] sm:text-xs">{feature.text}</span>
                      </div>
                    );
                  })}
                </div>
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

          <button 
            onClick={onClose}
            className="w-full text-center text-white/40 text-xs mt-3 hover:text-white/60 transition-colors py-2"
          >
            Continuar com limitações
          </button>
        </div>
      </div>
    </div>
  );
};

export default VipPlansPopup;
