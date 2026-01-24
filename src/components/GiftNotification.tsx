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
    <div className="fixed bottom-20 left-4 right-4 z-40 animate-slide-up">
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-md border border-primary/40 rounded-xl p-4 shadow-glow">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center animate-heartbeat">
            <Gift className="w-6 h-6 text-primary" />
          </div>
          
          <div className="flex-1">
            <p className="font-semibold text-foreground">
              {senderName} enviou um presente! 🎁
            </p>
            <p className="text-sm text-muted-foreground">
              Clique para ver o que ela te enviou
            </p>
          </div>
        </div>

        <Button
          onClick={onView}
          variant="hero"
          size="sm"
          className="w-full mt-3"
        >
          <Gift className="w-4 h-4" />
          Ver presente
        </Button>
      </div>
    </div>
  );
};

export default GiftNotification;
