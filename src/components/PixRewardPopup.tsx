import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import cardIcon from "@/assets/icons/card-icon.png";

interface PixRewardPopupProps {
  isOpen: boolean;
  onContinue: () => void;
}

const PixRewardPopup = ({ isOpen, onContinue }: PixRewardPopupProps) => {
  const [amount, setAmount] = useState("0,00");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Generate random value between R$ 4,00 and R$ 9,90
      const randomValue = (Math.random() * (9.90 - 4.00) + 4.00).toFixed(2);
      setAmount(randomValue.replace(".", ","));

      // Play cash sound
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      {/* Audio element */}
      <audio ref={audioRef} src="/audios/audio-cash.mp3" preload="auto" />

      <div className="popup-box relative w-full max-w-sm bg-gradient-to-b from-[#1a2634] to-[#0f1419] border border-success/30 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Card Icon */}
        <div className="flex justify-center pt-6 pb-4">
          <div className="w-14 h-14 rounded-xl bg-[#2d3748] flex items-center justify-center">
            <img src={cardIcon} alt="PIX" className="w-8 h-8" />
          </div>
        </div>

        {/* Title */}
        <div className="popup-title text-center px-6 pb-4">
          <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
            <span className="text-success">✅</span> PIX Recebido!
          </h2>
        </div>

        {/* Amount */}
        <div className="text-center pb-4">
          <div className="text-4xl font-bold text-success">
            R$ {amount}
          </div>
        </div>

        {/* Message */}
        <div className="text-center px-6 pb-3">
          <p className="text-muted-foreground text-sm">
            As coroas <span className="text-primary font-semibold">AMAM</span> receber curtidas e pagam por isso!
          </p>
        </div>

        {/* Continue hint */}
        <div className="text-center px-6 pb-6">
          <p className="text-white text-sm flex items-center justify-center gap-1">
            <span className="text-primary">❤️</span> Continue curtindo para receber mais!
          </p>
        </div>

        {/* CTA Button */}
        <div className="px-6 pb-6">
          <Button 
            onClick={onContinue}
            className="popup-btn w-full bg-success hover:bg-success/90 text-white font-bold py-4 text-base rounded-xl shadow-lg transition-all duration-300"
          >
            CONTINUAR CURTINDO
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PixRewardPopup;
