import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import cardIcon from "@/assets/icons/card-icon.png";

interface PixRewardPopupProps {
  isOpen: boolean;
  onContinue: () => void;
}

// Array de mensagens de incentivo variadas
const incentiveMessages = [
  { main: "As coroas <span class='text-primary font-semibold'>AMAM</span> receber curtidas e pagam por isso!", hint: "❤️ Continue curtindo para receber mais!" },
  { main: "Ela ficou <span class='text-primary font-semibold'>ENCANTADA</span> com sua curtida e te recompensou!", hint: "💰 Quanto mais curtidas, mais PIX você ganha!" },
  { main: "Mulheres maduras <span class='text-primary font-semibold'>ADORAM</span> atenção e pagam bem por isso!", hint: "🔥 Continue conquistando coroas!" },
  { main: "Sua curtida foi <span class='text-primary font-semibold'>MUITO ESPECIAL</span> pra ela!", hint: "💸 Ganhe mais recompensas agora!" },
  { main: "As coroas são <span class='text-primary font-semibold'>GENEROSAS</span> com quem as valoriza!", hint: "✨ Mais curtidas = Mais dinheiro!" },
  { main: "Ela <span class='text-primary font-semibold'>AMOU</span> seu interesse e quis te agradecer!", hint: "💝 Não pare agora, tem mais PIX te esperando!" },
  { main: "Coroas ricas <span class='text-primary font-semibold'>RECOMPENSAM</span> quem dá atenção!", hint: "🎁 Sua próxima curtida pode valer mais!" },
  { main: "Você fez ela se sentir <span class='text-primary font-semibold'>DESEJADA</span>! Parabéns!", hint: "💕 Continue e acumule mais recompensas!" },
];

const PixRewardPopup = ({ isOpen, onContinue }: PixRewardPopupProps) => {
  const [amount, setAmount] = useState("0,00");
  const [message, setMessage] = useState(incentiveMessages[0]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Generate random value between R$ 4,00 and R$ 9,00
      const randomValue = (Math.random() * (9.00 - 4.00) + 4.00).toFixed(2);
      setAmount(randomValue.replace(".", ","));

      // Select random message
      const randomMessage = incentiveMessages[Math.floor(Math.random() * incentiveMessages.length)];
      setMessage(randomMessage);

      // Som de dinheiro só toca aqui (recompensa de curtida) - é o único lugar permitido
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      {/* Audio element */}
      <audio ref={audioRef} src="/audios/audio-cash.mp3" preload="auto" />

      <div className="popup-box relative w-full max-w-sm bg-gradient-to-b from-[#1a2634] to-[#0f1419] border border-success/30 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Card Icon */}
        <div className="flex justify-center pt-5 sm:pt-6 pb-3 sm:pb-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#2d3748] flex items-center justify-center">
            <img src={cardIcon} alt="PIX" className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
        </div>

        {/* Title */}
        <div className="popup-title text-center px-4 sm:px-6 pb-3 sm:pb-4">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center justify-center gap-2">
            <span className="text-success">✅</span> PIX Recebido!
          </h2>
        </div>

        {/* Amount */}
        <div className="text-center pb-3 sm:pb-4">
          <div className="text-3xl sm:text-4xl font-bold text-success">
            R$ {amount}
          </div>
        </div>

        {/* Message - with dangerouslySetInnerHTML for styled text */}
        <div className="text-center px-4 sm:px-6 pb-2 sm:pb-3">
          <p 
            className="text-muted-foreground text-xs sm:text-sm"
            dangerouslySetInnerHTML={{ __html: message.main }}
          />
        </div>

        {/* Continue hint */}
        <div className="text-center px-4 sm:px-6 pb-4 sm:pb-6">
          <p className="text-white text-xs sm:text-sm">
            {message.hint}
          </p>
        </div>

        {/* CTA Button */}
        <div className="px-4 sm:px-6 pb-5 sm:pb-6 safe-area-bottom">
          <Button 
            onClick={onContinue}
            className="popup-btn w-full bg-success hover:bg-success/90 text-white font-bold py-4 text-sm sm:text-base rounded-xl shadow-lg transition-all duration-300 active:scale-95"
          >
            CONTINUAR CURTINDO
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PixRewardPopup;
