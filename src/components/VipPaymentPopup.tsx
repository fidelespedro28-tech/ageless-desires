import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Crown, Check, Clock, Shield, CreditCard, Zap } from "lucide-react";
import crownIcon from "@/assets/crown-icon.png";

interface VipPaymentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: () => void;
}

const VipPaymentPopup = ({ isOpen, onClose, onPurchase }: VipPaymentPopupProps) => {
  const [timeRemaining, setTimeRemaining] = useState(4 * 60 + 59); // 4:59
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (isOpen && timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsExpired(true);
            clearInterval(interval);
            return 0;
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
      setTimeRemaining(4 * 60 + 59);
      setIsExpired(false);
    }
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const handlePurchase = () => {
    // SEM som nos popups de planos - som só é permitido em recompensas reais
    onPurchase();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
      <div className="popup-box relative w-full max-w-md bg-gradient-to-br from-[#2c3e50] via-[#34495e] to-[#3498db] border border-primary/30 rounded-2xl shadow-popup overflow-hidden animate-scale-in">
        {/* Close button - Larger touch target */}
        <button
          onClick={onClose}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 text-white/70 hover:text-white transition-colors z-10 p-2 -m-2"
          aria-label="Fechar"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center pt-6 sm:pt-8 pb-3 sm:pb-4 px-4 sm:px-6">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="relative">
              <img src={crownIcon} alt="VIP" className="w-16 h-16 sm:w-20 sm:h-20 animate-float" />
              <div className="absolute -bottom-1 -right-1 bg-gold rounded-full p-1">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-background" />
              </div>
            </div>
          </div>
          <h2 className="popup-title font-display text-xl sm:text-2xl font-bold text-white mb-2">
            Acesso VIP Premium 👑
          </h2>
          <p className="text-white/80 text-xs sm:text-sm">
            Desbloqueie todas as funcionalidades exclusivas
          </p>
        </div>

        {/* Timer Section */}
        <div className="mx-4 sm:mx-6 mb-3 sm:mb-4">
          <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-3 sm:p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1 sm:mb-2">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 animate-pulse" />
              <span className="text-white font-semibold text-sm sm:text-base">Oferta por tempo limitado!</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
              {isExpired ? "OFERTA ENCERRADA" : formatTime(timeRemaining)}
            </div>
            <p className="text-red-400 text-xs sm:text-sm font-semibold animate-pulse">
              ⚡ Desconto especial expira em breve!
            </p>
          </div>
        </div>

        {/* Price Section */}
        <div className="mx-4 sm:mx-6 mb-3 sm:mb-4">
          <div className="bg-white/10 rounded-xl p-4 sm:p-5 text-center backdrop-blur-sm">
            <div className="text-white/60 line-through text-base sm:text-lg mb-1">
              De R$ 97,00
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-gold mb-1">
              R$ 19,90
              <span className="text-sm sm:text-lg font-normal text-white/80">/mês</span>
            </div>
            <div className="text-base sm:text-lg text-white">
              ou <span className="text-gold font-semibold">12x de R$ 1,99</span>
            </div>
            <div className="text-white/60 text-xs sm:text-sm mt-1">
              sem juros no cartão
            </div>
            <div className="mt-2 sm:mt-3 inline-block bg-success/20 text-success px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
              80% OFF - Economia de R$ 77,10
            </div>
          </div>
        </div>

        {/* Benefits - Scrollable on small screens */}
        <div className="mx-4 sm:mx-6 mb-3 sm:mb-4">
          <h4 className="font-semibold text-white mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
            <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
            Por que ser VIP?
          </h4>
          <div className="bg-white/5 rounded-xl p-3 sm:p-4 space-y-2 sm:space-y-3 max-h-[140px] sm:max-h-none overflow-y-auto">
            {[
              { icon: "💬", text: "Mensagens ilimitadas com todas as coroas" },
              { icon: "👀", text: "Veja quem visitou seu perfil" },
              { icon: "❤️", text: "Likes e matches ilimitados" },
              { icon: "🎁", text: "Receba presentes e PIX exclusivos" },
              { icon: "⭐", text: "Destaque nas buscas" },
              { icon: "🔓", text: "Acesso a perfis premium verificados" },
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 sm:gap-3 text-white/90">
                <span className="text-lg sm:text-xl">{benefit.icon}</span>
                <span className="text-xs sm:text-sm flex-1">{benefit.text}</span>
                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-success shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Security Badge */}
        <div className="mx-4 sm:mx-6 mb-3 sm:mb-4">
          <div className="bg-success/10 border border-success/30 rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-success shrink-0" />
            <div>
              <div className="text-white font-semibold text-xs sm:text-sm">Pagamento 100% Seguro</div>
              <div className="text-success text-[10px] sm:text-xs flex items-center gap-1">
                <Check className="w-3 h-3" />
                Proteção SSL • Dados criptografados
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 safe-area-bottom">
          <Button 
            onClick={handlePurchase}
            disabled={isExpired}
            className="popup-btn w-full bg-gradient-to-r from-gold via-yellow-500 to-gold text-background font-bold py-4 sm:py-6 text-base sm:text-lg rounded-xl shadow-lg hover:shadow-gold/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            {isExpired ? "Oferta Expirada" : "ATIVAR VIP AGORA"}
          </Button>

          <p className="text-center text-white/60 text-[10px] sm:text-xs mt-2 sm:mt-3">
            Cancele quando quiser • Garantia de 7 dias
          </p>

          <button 
            onClick={onClose}
            className="w-full text-center text-white/50 text-xs sm:text-sm mt-3 sm:mt-4 hover:text-white/70 transition-colors py-2"
          >
            Continuar sem VIP
          </button>
        </div>
      </div>
    </div>
  );
};

export default VipPaymentPopup;
