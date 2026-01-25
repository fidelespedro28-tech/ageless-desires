import { Button } from "@/components/ui/button";
import { X, Shield, Check, CreditCard } from "lucide-react";

interface PixPopupProps {
  isOpen: boolean;
  amount: string;
  senderName: string;
  senderImage: string;
  onClaim: () => void;
  onClose: () => void;
}

const PixPopup = ({
  isOpen,
  amount,
  senderName,
  senderImage,
  onClaim,
  onClose,
}: PixPopupProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
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
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-r from-success/20 to-primary/20 flex items-center justify-center">
            <CreditCard className="w-7 h-7 sm:w-8 sm:h-8 text-success" />
          </div>
          <h2 className="popup-title font-display text-xl sm:text-2xl font-bold text-foreground">
            Presente Especial 🎁
          </h2>
        </div>

        {/* Sender info */}
        <div className="px-4 sm:px-6 pb-3 sm:pb-4 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2 sm:mb-3 rounded-full overflow-hidden border-4 border-primary">
            <img src={senderImage} alt={senderName} className="w-full h-full object-cover" />
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">
            <span className="text-primary font-semibold">{senderName}</span> te enviou um presente
          </p>
        </div>

        {/* Amount */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="text-3xl sm:text-4xl font-bold gradient-text">
            {amount}
          </div>
        </div>

        {/* Security badge */}
        <div className="mx-4 sm:mx-6 mb-4 sm:mb-6 bg-success/10 border border-success/30 rounded-xl p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-success shrink-0" />
            <div>
              <p className="font-semibold text-foreground text-xs sm:text-sm">Verificação de Segurança</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1">
                <Check className="w-3 h-3 text-success" />
                Conta verificada para transações PIX
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="px-4 sm:px-6 pb-6 sm:pb-8 safe-area-bottom">
          <Button onClick={onClaim} variant="hero" size="lg" className="popup-btn w-full">
            <CreditCard className="w-5 h-5" />
            Resgatar Presente
          </Button>
          <p className="text-[10px] sm:text-xs text-center text-muted-foreground mt-2 sm:mt-3">
            Resgate seu presente agora e aproveite os benefícios exclusivos ✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default PixPopup;
