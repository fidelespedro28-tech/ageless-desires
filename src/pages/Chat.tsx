import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BackgroundGrid from "@/components/BackgroundGrid";
import ChatMessage from "@/components/ChatMessage";
import AudioMessage from "@/components/AudioMessage";
import GiftNotification from "@/components/GiftNotification";
import PixPopup from "@/components/PixPopup";
import VipPlansPopup from "@/components/VipPlansPopup";
import { LeadTracker } from "@/lib/leadTracker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Mic, DollarSign, Crown } from "lucide-react";
import { toast } from "sonner";

import julianaImg from "@/assets/models/juliana.jpg";

interface Message {
  id: number;
  content: string;
  isUser: boolean;
  timestamp: string;
  isAudio?: boolean;
  audioSrc?: string;
}

// Áudios disponíveis das coroas
const audioFiles = ["/audios/audio1.mp3", "/audios/audio2.mp3"];

const getRandomAudio = () => audioFiles[Math.floor(Math.random() * audioFiles.length)];

const modelResponses = [
  "Oi amor! Que bom te conhecer aqui 💋",
  "Você parece interessante... Me conta mais sobre você?",
  "Adoro homens mais jovens... vocês são tão cheios de energia 😏",
  "Sabia que eu adoro presentear quem me trata bem? 🎁",
  "Que tal a gente se conhecer melhor? Estou online agora...",
  "Você me deixou curiosa... O que você está procurando aqui?",
  "Hmm, gostei de você! Vou te enviar um presentinho 💕"
];

// Mensagens de áudio que a coroa pode enviar
const audioMessages = [
  "Hmm... que voz gostosa que você deve ter 🎧",
  "Adorei receber sua mensagem... escuta o que eu tenho pra te dizer 💋",
  "Ei gatinho... escuta isso aqui com atenção 😏",
];

const MAX_MESSAGES = 4;

const Chat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const profile = location.state?.profile || {
    name: "Juliana",
    age: 35,
    image: julianaImg
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [balance, setBalance] = useState(0);
  const [showGiftNotification, setShowGiftNotification] = useState(false);
  const [showPixPopup, setShowPixPopup] = useState(false);
  const [showVipPlans, setShowVipPlans] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messagesUsed, setMessagesUsed] = useState(0);
  const [isVip, setIsVip] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messagesRemaining = isVip ? 999 : MAX_MESSAGES - messagesUsed;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial text message from model
    setTimeout(() => {
      setMessages([{
        id: 1,
        content: `Oi gatinho! 💋 Vi que você curtiu meu perfil... Sou a ${profile.name}, prazer em te conhecer aqui! ❤️`,
        isUser: false,
        timestamp: "Agora"
      }]);
    }, 1000);

    // Send audio message after initial text
    setTimeout(() => {
      const audioMessage: Message = {
        id: 2,
        content: "Escuta essa mensagem que eu gravei especialmente pra você... 🎧💕",
        isUser: false,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        isAudio: true,
        audioSrc: getRandomAudio(),
      };
      setMessages((prev) => [...prev, audioMessage]);
    }, 3500);

    // Show gift notification after some time
    const giftTimer = setTimeout(() => {
      setShowGiftNotification(true);
    }, 20000);

    return () => clearTimeout(giftTimer);
  }, [profile.name]);

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    if (!isVip && messagesUsed >= MAX_MESSAGES) {
      setShowVipPlans(true);
      return;
    }

    const userMessage: Message = {
      id: messages.length + 1,
      content: inputValue,
      isUser: true,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setMessagesUsed((prev) => prev + 1);
    
    // Registra mensagem no tracker
    LeadTracker.incrementMessages();

    // Show VIP popup when messages run out
    if (!isVip && messagesUsed + 1 >= MAX_MESSAGES) {
      setTimeout(() => {
        setShowVipPlans(true);
      }, 3000);
    }

    // Simulate typing
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      // 30% chance to send audio message instead of text
      const sendAudio = Math.random() < 0.3;
      
      if (sendAudio) {
        const randomAudioText = audioMessages[Math.floor(Math.random() * audioMessages.length)];
        const audioMessage: Message = {
          id: messages.length + 2,
          content: randomAudioText,
          isUser: false,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          isAudio: true,
          audioSrc: getRandomAudio(),
        };
        setMessages((prev) => [...prev, audioMessage]);
      } else {
        const randomResponse = modelResponses[Math.floor(Math.random() * modelResponses.length)];
        const modelMessage: Message = {
          id: messages.length + 2,
          content: randomResponse,
          isUser: false,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, modelMessage]);
      }
    }, 2000 + Math.random() * 2000);
  };

  const handleVipPurchase = (plan: string) => {
    setShowVipPlans(false);
    setIsVip(true);
    
    // Registra compra no tracker (dispara Purchase)
    const planValues: Record<string, number> = {
      essencial: 19.90,
      premium: 37.90,
      ultra: 47.90
    };
    LeadTracker.registerPurchase(plan, planValues[plan] || 47.90);
    
    toast.success("🎉 VIP Ativado!", {
      description: `Plano ${plan.charAt(0).toUpperCase() + plan.slice(1)} - Mensagens ilimitadas!`
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleViewGift = () => {
    setShowGiftNotification(false);
    setShowPixPopup(true);
  };

  const handleClaimGift = () => {
    setShowPixPopup(false);
    setBalance((prev) => prev + 50);
    
    const giftMessage: Message = {
      id: messages.length + 1,
      content: "Acabei de te enviar um presente especial! 🎁 Espero que você goste... Isso é só um começo do que posso fazer por você 💕",
      isUser: false,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, giftMessage]);
  };

  const isInputDisabled = !isVip && messagesUsed >= MAX_MESSAGES;

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      <BackgroundGrid />

      {/* Header - Mobile optimized */}
      <header className="relative z-20 flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-card/80 backdrop-blur-sm border-b border-border safe-area-top">
        <button
          onClick={() => navigate("/descobrir")}
          className="p-2 rounded-lg hover:bg-muted transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <div className="relative shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-primary">
              <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 badge-online border-2 border-card" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-foreground text-sm sm:text-base truncate">{profile.name}</p>
            <p className="text-[10px] sm:text-xs text-success">Online agora</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {isVip && (
            <span className="bg-gradient-to-r from-gold to-amber-500 text-background text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Crown className="w-3 h-3" /> VIP
            </span>
          )}
          <div className="flex items-center gap-1 bg-success/20 text-success px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
            <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-semibold text-xs sm:text-sm">R${balance.toFixed(2)}</span>
          </div>
          {!isVip && (
            <div className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs ${messagesRemaining <= 2 ? 'bg-destructive/20 text-destructive' : 'bg-muted text-muted-foreground'}`}>
              <span className="font-semibold">{messagesRemaining} msg</span>
            </div>
          )}
        </div>
      </header>

      {/* Messages */}
      <main className="relative z-10 flex-1 overflow-y-auto p-3 sm:p-4">
        {/* Today indicator */}
        <div className="flex justify-center mb-3 sm:mb-4">
          <span className="text-[10px] sm:text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
            Hoje
          </span>
        </div>

        {messages.map((message) => (
          message.isAudio && message.audioSrc ? (
            <AudioMessage
              key={message.id}
              audioSrc={message.audioSrc}
              senderImage={profile.image}
              senderName={profile.name}
              timestamp={message.timestamp}
              autoPlay={message.id === 2}
            />
          ) : (
            <ChatMessage
              key={message.id}
              content={message.content}
              isUser={message.isUser}
              timestamp={message.timestamp}
              senderImage={!message.isUser ? profile.image : undefined}
            />
          )
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden shrink-0">
              <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
            </div>
            <div className="bg-card border border-border rounded-2xl px-3 sm:px-4 py-2 sm:py-3 rounded-bl-sm">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Limit reached banner */}
      {isInputDisabled && (
        <div className="relative z-20 px-4 py-3 bg-gradient-to-r from-primary/20 to-purple-accent/20 border-t border-primary/30">
          <p className="text-center text-white text-sm">
            💬 Você atingiu o limite de {MAX_MESSAGES} mensagens!{" "}
            <button 
              onClick={() => setShowVipPlans(true)}
              className="text-primary font-semibold underline hover:text-primary/80"
            >
              Seja VIP para continuar
            </button>
          </p>
        </div>
      )}

      {/* Input - Safe area for notched devices */}
      <div className="relative z-20 p-3 sm:p-4 bg-card/80 backdrop-blur-sm border-t border-border safe-area-bottom">
        <div className="flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isInputDisabled ? "Limite atingido - Seja VIP!" : "Mensagem..."}
            className="flex-1 text-base"
            disabled={isInputDisabled}
          />
          {inputValue.trim() ? (
            <Button 
              onClick={sendMessage} 
              size="icon" 
              variant="hero" 
              className="shrink-0 min-w-[44px] min-h-[44px]"
              disabled={isInputDisabled}
            >
              <Send className="w-5 h-5" />
            </Button>
          ) : (
            <Button 
              size="icon" 
              variant="ghost" 
              className="shrink-0 min-w-[44px] min-h-[44px]"
              disabled={isInputDisabled}
            >
              <Mic className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Gift Notification */}
      <GiftNotification
        isOpen={showGiftNotification}
        senderName={profile.name}
        onView={handleViewGift}
        onClose={() => setShowGiftNotification(false)}
      />

      {/* Pix Popup */}
      <PixPopup
        isOpen={showPixPopup}
        amount="R$50,00"
        senderName={profile.name}
        senderImage={profile.image}
        onClaim={handleClaimGift}
        onClose={() => setShowPixPopup(false)}
      />

      {/* VIP Plans Popup */}
      <VipPlansPopup
        isOpen={showVipPlans}
        onClose={() => setShowVipPlans(false)}
        onPurchase={handleVipPurchase}
        limitType="messages"
        currentMessages={messagesUsed}
      />
    </div>
  );
};

export default Chat;
