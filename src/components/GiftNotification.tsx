import { Gift, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GiftNotificationProps {
  isOpen: boolean;
  senderName: string;
  onView: () => void;
  onClose: () => void;
}

const GiftNotification = ({ isOpen, senderName, onView, onClose }: GiftNotificationProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-20 left-3 right-3 sm:left-4 sm:right-4 z-40 animate-slide-up safe-area-bottom">
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-md border border-primary/40 rounded-xl p-3 sm:p-4 shadow-glow">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground p-2 -m-1"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center animate-heartbeat shrink-0">
            <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground text-sm sm:text-base truncate">
              {senderName} enviou um presente! 🎁
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Clique para ver o que ela te enviou
            </p>
          </div>
        </div>

        <Button
          onClick={onView}
          variant="hero"
          size="sm"
          className="w-full mt-2 sm:mt-3 min-h-[44px]"
        >
          <Gift className="w-4 h-4" />
          Ver presente
        </Button>
      </div>
    </div>
  );
};

export default GiftNotification;
