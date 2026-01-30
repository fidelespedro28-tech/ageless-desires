import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BackgroundGrid from "@/components/BackgroundGrid";
import ChatMessage from "@/components/ChatMessage";
import AudioMessage from "@/components/AudioMessage";
import GiftNotification from "@/components/GiftNotification";
import PixPopup from "@/components/PixPopup";
import VipPlansPopup from "@/components/VipPlansPopup";
import InsistentPremiumPopup from "@/components/InsistentPremiumPopup";
import { LeadTracker } from "@/lib/leadTracker";
import { useBalance } from "@/hooks/useBalance";
import { useLikesLimit } from "@/hooks/useLikesLimit";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Mic, DollarSign, Crown } from "lucide-react";
import { toast } from "sonner";

import julianaImg from "@/assets/models/juliana-new.jpg";

interface Message {
  id: number;
  content: string;
  isUser: boolean;
  timestamp: string;
  isAudio?: boolean;
  audioSrc?: string;
}

// Áudios específicos das coroas (em ordem)
const AUDIO_START = "/audios/audio1.mp3"; // Áudio de boas-vindas (12s)
const AUDIO_END = "/audios/audio2.mp3";   // Áudio de despedida/final
const AUDIO_CASH = "/audios/audio-cash.mp3"; // Áudio do PIX

const modelResponses = [
  "Oi amor! Que bom te conhecer aqui 💋",
  "Você parece interessante... Me conta mais sobre você?",
  "Adoro homens mais jovens... vocês são tão cheios de energia 😏",
  "Sabia que eu adoro presentear quem me trata bem? 🎁",
  "Que tal a gente se conhecer melhor? Estou online agora...",
  "Você me deixou curiosa... O que você está procurando aqui?",
  "Hmm, gostei de você! Vou te enviar um presentinho 💕"
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

  // Persistent balance hook
  const { balance, addBalance } = useBalance(0);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showGiftNotification, setShowGiftNotification] = useState(false);
  const [showPixPopup, setShowPixPopup] = useState(false);
  const [showVipPlans, setShowVipPlans] = useState(false);
  const [showInsistentPopup, setShowInsistentPopup] = useState(false);
  const [insistentTrigger, setInsistentTrigger] = useState<"likes_complete" | "chat_end" | "matches_return" | "new_chat" | "general">("chat_end");
  const [isTyping, setIsTyping] = useState(false);
  const [messagesUsed, setMessagesUsed] = useState(0);
  
  // Controle de áudios automáticos (evita repetição)
  const [hasSentStartAudio, setHasSentStartAudio] = useState(false);
  const [hasSentEndAudio, setHasSentEndAudio] = useState(false);
  
  // Likes/Premium limit hook
  const { isPremium, enterPremiumMode } = useLikesLimit();
  const isVip = isPremium;
  
  // Track last page for insistent popup triggers
  useEffect(() => {
    localStorage.setItem("lastVisitedPage", "/chat");
  }, []);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Verifica se é o fim da conversa
  const isEndOfConversation = useCallback(() => {
    return !isVip && messagesUsed >= MAX_MESSAGES - 1;
  }, [isVip, messagesUsed]);

  // Envia áudio automático da coroa
  const sendCoroaAudio = useCallback((audioType: 'start' | 'end') => {
    const audioSrc = audioType === 'start' ? AUDIO_START : AUDIO_END;
    const messageText = audioType === 'start' 
      ? "Escuta essa mensagem especial que eu gravei só pra você... 🎧💕"
      : "Antes de você ir... escuta isso aqui, gatinho 💋🔥";
    
    const audioMessage: Message = {
      id: Date.now(),
      content: messageText,
      isUser: false,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      isAudio: true,
      audioSrc: audioSrc,
    };
    
    setMessages((prev) => [...prev, audioMessage]);
    
    if (audioType === 'start') {
      setHasSentStartAudio(true);
    } else {
      setHasSentEndAudio(true);
    }
    
    console.log(`🎵 Áudio ${audioType} enviado automaticamente`);
  }, []);

  // Inicialização do chat - mensagem de texto + áudio de boas-vindas
  useEffect(() => {
    // Mensagem de texto inicial
    const textTimer = setTimeout(() => {
      setMessages([{
        id: 1,
        content: `Oi gatinho! 💋 Vi que você curtiu meu perfil... Sou a ${profile.name}, prazer em te conhecer aqui! ❤️`,
        isUser: false,
        timestamp: "Agora"
      }]);
    }, 1000);

    // Áudio de boas-vindas (audio1.mp3) - enviado automaticamente
    const audioTimer = setTimeout(() => {
      if (!hasSentStartAudio) {
        sendCoroaAudio('start');
      }
    }, 3500);

    // Show gift notification after some time
    const giftTimer = setTimeout(() => {
      setShowGiftNotification(true);
    }, 20000);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(audioTimer);
      clearTimeout(giftTimer);
    };
  }, [profile.name, hasSentStartAudio, sendCoroaAudio]);

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    if (!isVip && messagesUsed >= MAX_MESSAGES) {
      setShowVipPlans(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      content: inputValue,
      isUser: true,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    const newMessagesUsed = messagesUsed + 1;
    setMessagesUsed(newMessagesUsed);
    
    // Registra mensagem no tracker
    LeadTracker.incrementMessages();

    // Verifica se é a última mensagem do lead (fim da conversa)
    const isLastMessage = !isVip && newMessagesUsed >= MAX_MESSAGES;

    // Show VIP popup when messages run out, then show insistent popup
    if (isLastMessage) {
      setTimeout(() => {
        setShowVipPlans(true);
      }, 3000);
      
      // Show insistent popup after VIP plans is closed
      setTimeout(() => {
        if (!isVip) {
          setInsistentTrigger("chat_end");
          setShowInsistentPopup(true);
        }
      }, 10000);
    }

    // Simulate typing
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      // Se é a última mensagem, envia o áudio de despedida (audio2.mp3)
      if (isLastMessage && !hasSentEndAudio) {
        sendCoroaAudio('end');
      } else {
        // Resposta normal da coroa (texto)
        const randomResponse = modelResponses[Math.floor(Math.random() * modelResponses.length)];
        const modelMessage: Message = {
          id: Date.now() + 1,
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
    setShowInsistentPopup(false);
    enterPremiumMode();
    
    // Registra compra no tracker (dispara Purchase)
    const planValues: Record<string, number> = {
      plano1: 19.90,
      plano2: 37.90,
      plano3: 47.90,
      plano4: 97.00
    };
    LeadTracker.registerPurchase(plan, planValues[plan] || 47.90);
    
    toast.success("🎉 VIP Ativado!", {
      description: "Mensagens ilimitadas liberadas!"
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
    addBalance(50);
    
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
      <BackgroundGrid useImage />

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

      {/* Insistent Premium Popup */}
      <InsistentPremiumPopup
        isOpen={showInsistentPopup}
        onClose={() => setShowInsistentPopup(false)}
        onUpgrade={() => handleVipPurchase("plano2")}
        trigger={insistentTrigger}
      />
    </div>
  );
};

export default Chat;
