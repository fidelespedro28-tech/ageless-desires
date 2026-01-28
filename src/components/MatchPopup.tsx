import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Crown } from "lucide-react";

interface MatchPopupProps {
  isOpen: boolean;
  userName: string;
  userImage?: string;
  matchName: string;
  matchImage: string;
  onStartChat: () => void;
  onClose: () => void;
  showContinueButton?: boolean;
  isPremium?: boolean;
}

const MatchPopup = ({
  isOpen,
  userName,
  userImage,
  matchName,
  matchImage,
  onStartChat,
  onClose,
  showContinueButton = true,
  isPremium = false,
}: MatchPopupProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md">
      <div className="popup-box text-center animate-scale-in max-w-sm w-full px-4 sm:px-6 py-6 sm:py-8">
        {/* Hearts animation */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-primary animate-heartbeat fill-primary" />
        </div>

        <h2 className="popup-title font-display text-3xl sm:text-4xl font-bold gradient-text mb-2">
          É um Match! 💕
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base mb-6 sm:mb-8">
          Você e {matchName} combinaram!
        </p>

        {/* Profile images */}
        <div className="flex justify-center items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-muted flex items-center justify-center text-2xl sm:text-3xl border-4 border-primary overflow-hidden">
              {userImage ? (
                <img src={userImage} alt={userName} className="w-full h-full object-cover" />
              ) : (
                "👤"
              )}
            </div>
          </div>

          <div className="text-3xl sm:text-4xl animate-heartbeat">❤️</div>

          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-primary">
              <img src={matchImage} alt={matchName} className="w-full h-full object-cover" />
            </div>
            <span className="absolute -top-1 -right-1 badge-online w-4 h-4 sm:w-5 sm:h-5 border-2 border-background" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 sm:gap-3 max-w-xs mx-auto safe-area-bottom">
          <Button onClick={onStartChat} variant="hero" size="lg" className="w-full popup-btn">
            <MessageCircle className="w-5 h-5" />
            Começar Conversa
          </Button>
          
          {/* Show continue button only if allowed (premium or first match not reached) */}
          {showContinueButton && isPremium && (
            <Button onClick={onClose} variant="ghost" size="lg" className="w-full">
              Continuar Descobrindo
            </Button>
          )}
          
          {/* Premium upgrade hint for free users who reached limit */}
          {!showContinueButton && !isPremium && (
            <div className="mt-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Crown className="w-3 h-3 text-gold" />
                Seja Premium para mais matches!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchPopup;
