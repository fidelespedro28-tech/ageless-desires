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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
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
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-success/20 to-primary/20 flex items-center justify-center">
            <CreditCard className="w-8 h-8 text-success" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Presente Especial 🎁
          </h2>
        </div>

        {/* Sender info */}
        <div className="px-6 pb-4 text-center">
          <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border-4 border-primary">
            <img src={senderImage} alt={senderName} className="w-full h-full object-cover" />
          </div>
          <p className="text-muted-foreground">
            <span className="text-primary font-semibold">{senderName}</span> te enviou um presente
          </p>
        </div>

        {/* Amount */}
        <div className="text-center mb-6">
          <div className="text-4xl font-bold gradient-text">
            {amount}
          </div>
        </div>

        {/* Security badge */}
        <div className="mx-6 mb-6 bg-success/10 border border-success/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-success" />
            <div>
              <p className="font-semibold text-foreground text-sm">Verificação de Segurança</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Check className="w-3 h-3 text-success" />
                Conta verificada para transações PIX
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="px-6 pb-8">
          <Button onClick={onClaim} variant="hero" size="lg" className="w-full">
            <CreditCard className="w-5 h-5" />
            Resgatar Presente
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-3">
            Resgate seu presente agora e aproveite os benefícios exclusivos ✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default PixPopup;
