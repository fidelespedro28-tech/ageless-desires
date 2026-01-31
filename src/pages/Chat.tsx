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
import { useChatMessages } from "@/hooks/useChatMessages";
import { saveNavigationState } from "@/hooks/useNavigationState";
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

// Áudios específicos das coroas (SEM som de dinheiro nos popups)
const AUDIO_START = "/audios/audio1.mp3"; // Áudio de boas-vindas (12s)
const AUDIO_END = "/audios/audio2.mp3";   // Áudio de despedida/final (~20s)
const AUDIO_CASH = "/audios/audio-cash.mp3"; // Som de dinheiro - SÓ para PIX de presente

const MAX_MESSAGES = 4;
const PIX_GIFT_AMOUNT = 40; // R$40,00 de presente

// Preload audio for instant playback
const preloadedCashAudio = new Audio(AUDIO_CASH);
preloadedCashAudio.preload = "auto";

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
  const [userMessagesCount, setUserMessagesCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Sistema de mensagens inteligente com persistência
  const {
    getOpeningMessage,
    getResponseForMessage,
    markIntroAudioSent,
    markFinalAudioSent,
    markGiftSent,
    shouldSendIntroAudio,
    shouldSendFinalAudio,
    shouldSendGift,
    audioIntroSent,
    audioFinalSent,
    giftSent,
    saveMessages,
    getSavedMessages,
    hasSavedConversation,
  } = useChatMessages(profile.name);
  
  // Likes/Premium limit hook
  const { isPremium, enterPremiumMode } = useLikesLimit();
  const isVip = isPremium;
  
  // Track last page for insistent popup triggers + navigation persistence
  useEffect(() => {
    localStorage.setItem("lastVisitedPage", "/chat");
    saveNavigationState({ 
      currentPage: "/chat",
      context: { profileName: profile.name, profileImage: profile.image }
    });
  }, [profile.name, profile.image]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Salvar mensagens sempre que mudarem
  useEffect(() => {
    if (messages.length > 0) {
      saveMessages(messages);
    }
  }, [messages, saveMessages]);

  // Função para obter timestamp atual
  const getCurrentTimestamp = () => {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  // Enviar áudio da coroa (SEM som de dinheiro)
  const sendCoroaAudio = useCallback((audioType: 'start' | 'end') => {
    const audioSrc = audioType === 'start' ? AUDIO_START : AUDIO_END;
    const messageText = audioType === 'start' 
      ? "Escuta essa mensagem especial que eu gravei só pra você... 🎧💕"
      : "Antes de você ir... escuta isso aqui, gatinho 💋🔥";
    
    const audioMessage: Message = {
      id: Date.now(),
      content: messageText,
      isUser: false,
      timestamp: getCurrentTimestamp(),
      isAudio: true,
      audioSrc: audioSrc,
    };
    
    setMessages((prev) => [...prev, audioMessage]);
    
    if (audioType === 'start') {
      markIntroAudioSent();
    } else {
      markFinalAudioSent();
    }
    
    console.log(`🎵 Áudio ${audioType} enviado`);
  }, [markIntroAudioSent, markFinalAudioSent]);

  // Inicialização do chat - verificar conversas salvas OU começar nova
  useEffect(() => {
    if (isInitialized) return;
    
    // Verificar se tem conversa salva
    if (hasSavedConversation()) {
      const savedMessages = getSavedMessages();
      if (savedMessages.length > 0) {
        setMessages(savedMessages);
        // Contar mensagens do usuário para controle de limite
        const userMsgs = savedMessages.filter(m => m.isUser).length;
        setUserMessagesCount(userMsgs);
        setIsInitialized(true);
        console.log("📩 Conversa restaurada:", savedMessages.length, "mensagens");
        return;
      }
    }
    
    // Nova conversa - mensagem de texto inicial (única e não repetida)
    const textTimer = setTimeout(() => {
      const openingMessage = getOpeningMessage();
      setMessages([{
        id: 1,
        content: openingMessage,
        isUser: false,
        timestamp: "Agora"
      }]);
      setIsInitialized(true);
    }, 1000);

    // Áudio de boas-vindas - enviado apenas se ainda não foi enviado (delay 3-4s)
    const audioTimer = setTimeout(() => {
      if (shouldSendIntroAudio()) {
        sendCoroaAudio('start');
      }
    }, 3500);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(audioTimer);
    };
  }, [isInitialized, getOpeningMessage, shouldSendIntroAudio, sendCoroaAudio, hasSavedConversation, getSavedMessages]);

  // Tocar som de dinheiro instantaneamente (preloaded)
  const playCashSound = useCallback(() => {
    try {
      preloadedCashAudio.currentTime = 0;
      preloadedCashAudio.play().catch(() => {});
    } catch (e) {
      console.log("Erro ao tocar som:", e);
    }
  }, []);

  // Enviar presente PIX após resposta da 2ª mensagem
  const sendPixGift = useCallback(() => {
    // Mensagem da coroa sobre o presente
    const giftMessage: Message = {
      id: Date.now() + 100,
      content: "Acabei de te mandar um presente especial 💸... Espero que você goste, é só o começo do que posso fazer por você 😘",
      isUser: false,
      timestamp: getCurrentTimestamp()
    };
    setMessages((prev) => [...prev, giftMessage]);
    
    // Tocar som de dinheiro INSTANTANEAMENTE
    playCashSound();
    
    // Mostrar notificação de presente
    setTimeout(() => {
      setShowGiftNotification(true);
    }, 1500);
    
    // Marcar como enviado
    markGiftSent();
    console.log("🎁 Presente PIX de R$" + PIX_GIFT_AMOUNT + " enviado!");
  }, [markGiftSent, playCashSound]);

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    if (!isVip && userMessagesCount >= MAX_MESSAGES) {
      setShowVipPlans(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      content: inputValue,
      isUser: true,
      timestamp: getCurrentTimestamp()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    const newMessagesCount = userMessagesCount + 1;
    setUserMessagesCount(newMessagesCount);
    
    // Registra mensagem no tracker
    LeadTracker.incrementMessages();

    // Verifica se é a última mensagem do lead (fim da conversa)
    const isLastMessage = !isVip && newMessagesCount >= MAX_MESSAGES;

    // Show VIP popup when messages run out
    if (isLastMessage) {
      setTimeout(() => {
        setShowVipPlans(true);
      }, 4000);
      
      // Show insistent popup after VIP plans
      setTimeout(() => {
        if (!isVip) {
          setInsistentTrigger("chat_end");
          setShowInsistentPopup(true);
        }
      }, 12000);
    }

    // Simulate typing with natural delay (2-4 seconds)
    setIsTyping(true);
    const typingDelay = 2000 + Math.random() * 2000;
    
    setTimeout(() => {
      setIsTyping(false);
      
      // Resposta de texto da coroa
      const responseText = getResponseForMessage(newMessagesCount);
      const textMessage: Message = {
        id: Date.now(),
        content: responseText,
        isUser: false,
        timestamp: getCurrentTimestamp()
      };
      setMessages((prev) => [...prev, textMessage]);
      
      // APÓS a 2ª mensagem: enviar presente PIX (R$40)
      if (shouldSendGift(newMessagesCount) && !giftSent) {
        setTimeout(() => {
          sendPixGift();
        }, 2000);
      }
      
      // APÓS a 3ª mensagem: enviar áudio final íntimo
      if (shouldSendFinalAudio(newMessagesCount) && !audioFinalSent) {
        setTimeout(() => {
          sendCoroaAudio('end');
        }, 2500);
      }
    }, typingDelay);
  };

  const handleVipPurchase = (plan: string) => {
    // Salvar estado do popup antes de ir para checkout
    localStorage.setItem("lastPopup", "vipPlans");
    localStorage.setItem("returnFromCheckout", "true");
    
    setShowVipPlans(false);
    setShowInsistentPopup(false);
    enterPremiumMode();
    
    // Registra compra no tracker
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
    addBalance(PIX_GIFT_AMOUNT);
    toast.success(`🎁 R$${PIX_GIFT_AMOUNT},00 adicionado ao seu saldo!`);
  };

  const isInputDisabled = !isVip && userMessagesCount >= MAX_MESSAGES;

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
              autoPlay={false}
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

      {/* Gift Notification - SEM som de dinheiro */}
      <GiftNotification
        isOpen={showGiftNotification}
        senderName={profile.name}
        onView={handleViewGift}
        onClose={() => setShowGiftNotification(false)}
      />

      {/* Pix Popup - SEM som aqui (som já tocou na notificação) */}
      <PixPopup
        isOpen={showPixPopup}
        amount={`R$${PIX_GIFT_AMOUNT},00`}
        senderName={profile.name}
        senderImage={profile.image}
        onClaim={handleClaimGift}
        onClose={() => setShowPixPopup(false)}
      />

      {/* VIP Plans Popup - SEM som */}
      <VipPlansPopup
        isOpen={showVipPlans}
        onClose={() => setShowVipPlans(false)}
        onPurchase={handleVipPurchase}
        limitType="messages"
        currentMessages={userMessagesCount}
      />

      {/* Insistent Premium Popup - SEM som */}
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
