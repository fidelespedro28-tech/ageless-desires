import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BackgroundGrid from "@/components/BackgroundGrid";
import ChatMessage from "@/components/ChatMessage";
import GiftNotification from "@/components/GiftNotification";
import PixPopup from "@/components/PixPopup";
import VipPaymentPopup from "@/components/VipPaymentPopup";
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
  audioDuration?: string;
}

const modelResponses = [
  "Oi amor! Que bom te conhecer aqui 💋",
  "Você parece interessante... Me conta mais sobre você?",
  "Adoro homens mais jovens... vocês são tão cheios de energia 😏",
  "Sabia que eu adoro presentear quem me trata bem? 🎁",
  "Que tal a gente se conhecer melhor? Estou online agora...",
  "Você me deixou curiosa... O que você está procurando aqui?",
  "Hmm, gostei de você! Vou te enviar um presentinho 💕"
];

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
  const [showVipPayment, setShowVipPayment] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messagesRemaining, setMessagesRemaining] = useState(5);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial message from model
    setTimeout(() => {
      setMessages([{
        id: 1,
        content: `Oi! Vi que você curtiu meu perfil 💋 Sou a ${profile.name}, prazer em te conhecer aqui!`,
        isUser: false,
        timestamp: "Agora"
      }]);
    }, 1500);

    // Show gift notification after some time
    const giftTimer = setTimeout(() => {
      setShowGiftNotification(true);
    }, 15000);

    return () => clearTimeout(giftTimer);
  }, [profile.name]);

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    if (messagesRemaining <= 0) {
      setShowVipPayment(true);
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
    setMessagesRemaining((prev) => Math.max(0, prev - 1));

    // Show VIP popup when messages run out
    if (messagesRemaining <= 1) {
      setTimeout(() => {
        setShowVipPayment(true);
      }, 3000);
    }

    // Simulate typing
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      const randomResponse = modelResponses[Math.floor(Math.random() * modelResponses.length)];
      const modelMessage: Message = {
        id: messages.length + 2,
        content: randomResponse,
        isUser: false,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, modelMessage]);
    }, 2000 + Math.random() * 2000);
  };

  const handleVipPurchase = () => {
    setShowVipPayment(false);
    setMessagesRemaining(999);
    toast.success("🎉 VIP Ativado!", {
      description: "Mensagens ilimitadas desbloqueadas!"
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

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      <BackgroundGrid />

      {/* Header */}
      <header className="relative z-20 flex items-center gap-3 p-4 bg-card/80 backdrop-blur-sm border-b border-border">
        <button
          onClick={() => navigate("/descobrir")}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary">
              <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 badge-online border-2 border-card" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{profile.name}</p>
            <p className="text-xs text-success">Online agora</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-success/20 text-success px-3 py-1.5 rounded-full">
            <DollarSign className="w-4 h-4" />
            <span className="font-semibold">R${balance.toFixed(2)}</span>
          </div>
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs ${messagesRemaining <= 2 ? 'bg-destructive/20 text-destructive' : 'bg-muted text-muted-foreground'}`}>
            <span className="font-semibold">{messagesRemaining} msg</span>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="relative z-10 flex-1 overflow-y-auto p-4">
        {/* Today indicator */}
        <div className="flex justify-center mb-4">
          <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
            Hoje
          </span>
        </div>

        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            content={message.content}
            isUser={message.isUser}
            timestamp={message.timestamp}
            isAudio={message.isAudio}
            audioDuration={message.audioDuration}
            senderImage={!message.isUser ? profile.image : undefined}
          />
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
            </div>
            <div className="bg-card border border-border rounded-2xl px-4 py-3 rounded-bl-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Input */}
      <div className="relative z-20 p-4 bg-card/80 backdrop-blur-sm border-t border-border">
        <div className="flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Mensagem..."
            className="flex-1"
          />
          {inputValue.trim() ? (
            <Button onClick={sendMessage} size="icon" variant="hero">
              <Send className="w-5 h-5" />
            </Button>
          ) : (
            <Button size="icon" variant="ghost">
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

      {/* VIP Payment Popup */}
      <VipPaymentPopup
        isOpen={showVipPayment}
        onClose={() => setShowVipPayment(false)}
        onPurchase={handleVipPurchase}
      />
    </div>
  );
};

export default Chat;
