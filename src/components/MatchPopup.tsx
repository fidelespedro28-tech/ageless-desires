import { Button } from "@/components/ui/button";
import { Heart, MessageCircle } from "lucide-react";

interface MatchPopupProps {
  isOpen: boolean;
  userName: string;
  userImage?: string;
  matchName: string;
  matchImage: string;
  onStartChat: () => void;
  onClose: () => void;
}

const MatchPopup = ({
  isOpen,
  userName,
  userImage,
  matchName,
  matchImage,
  onStartChat,
  onClose,
}: MatchPopupProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="text-center animate-scale-in">
        {/* Hearts animation */}
        <div className="flex justify-center mb-6">
          <Heart className="w-16 h-16 text-primary animate-heartbeat fill-primary" />
        </div>

        <h2 className="font-display text-4xl font-bold gradient-text mb-2">
          É um Match! 💕
        </h2>
        <p className="text-muted-foreground mb-8">
          Você e {matchName} combinaram!
        </p>

        {/* Profile images */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-3xl border-4 border-primary overflow-hidden">
              {userImage ? (
                <img src={userImage} alt={userName} className="w-full h-full object-cover" />
              ) : (
                "👤"
              )}
            </div>
          </div>

          <div className="text-4xl animate-heartbeat">❤️</div>

          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary">
              <img src={matchImage} alt={matchName} className="w-full h-full object-cover" />
            </div>
            <span className="absolute -top-1 -right-1 badge-online w-5 h-5 border-2 border-background" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <Button onClick={onStartChat} variant="hero" size="lg" className="w-full">
            <MessageCircle className="w-5 h-5" />
            Começar Conversa
          </Button>
          <Button onClick={onClose} variant="ghost" size="lg" className="w-full">
            Continuar Descobrindo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MatchPopup;
