import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundGrid from "@/components/BackgroundGrid";
import ProfileCard from "@/components/ProfileCard";
import MatchPopup from "@/components/MatchPopup";
import VipPlansPopup from "@/components/VipPlansPopup";
import PixRewardPopup from "@/components/PixRewardPopup";
import BottomNavigation from "@/components/BottomNavigation";
import EditProfileModal from "@/components/EditProfileModal";
import InsistentPremiumPopup from "@/components/InsistentPremiumPopup";
import { LeadTracker } from "@/lib/leadTracker";
import { useLikesLimit } from "@/hooks/useLikesLimit";
import { useBalance } from "@/hooks/useBalance";
import { useCrownIndex } from "@/hooks/useCrownIndex";
import { useCheckoutReturn } from "@/hooks/useCheckoutReturn";
import { useDeviceLock } from "@/hooks/useDeviceLock";
import { Heart, X, Crown, DollarSign, User, Lock, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Novas imagens das coroas
import silviaImg from "@/assets/models/silvia-2.jpg";
import tatianaImg from "@/assets/models/tatiana-2.jpeg";
import vanessaImg from "@/assets/models/vanessa-2.jpg";
import raquelImg from "@/assets/models/raquel-2.jpeg";
import luizaImg from "@/assets/models/luiza-2.jpg";
import lucianaImg from "@/assets/models/luciana-2.jpg";
import beatrizImg from "@/assets/models/beatriz.jpg";
import marianaImg from "@/assets/models/mariana.jpg";
import gabrielaImg from "@/assets/models/gabriela.png";
import isabelaImg from "@/assets/models/isabela.png";

interface Profile {
  id: number;
  name: string;
  age: number;
  location: string;
  description: string;
  interests: string[];
  image: string;
  isVip: boolean;
}

// 10 perfis únicos de coroas (38-52 anos)
const profiles: Profile[] = [
  {
    id: 1,
    name: "Silvia",
    age: 42,
    location: "a 5km de você",
    description: "Confiante, intensa e apaixonada por boas conversas e momentos únicos. Sei valorizar quem me trata bem.",
    interests: ["Vinhos", "Viagens", "Jantares"],
    image: silviaImg,
    isVip: true
  },
  {
    id: 2,
    name: "Tatiana",
    age: 38,
    location: "a 3km de você",
    description: "Mulher decidida e elegante. Adoro moda, lifestyle e homens que sabem o que querem.",
    interests: ["Moda", "Shopping", "Lifestyle"],
    image: tatianaImg,
    isVip: true
  },
  {
    id: 3,
    name: "Vanessa",
    age: 40,
    location: "a 8km de você",
    description: "Sorriso fácil e energia contagiante. Gosto de cuidar de quem cuida de mim 💋",
    interests: ["Fitness", "Praia", "Dança"],
    image: vanessaImg,
    isVip: false
  },
  {
    id: 4,
    name: "Raquel",
    age: 45,
    location: "a 2km de você",
    description: "Sofisticada e misteriosa. Aprecio vinhos, eventos exclusivos e companhias interessantes.",
    interests: ["Vinhos", "Eventos", "Luxo"],
    image: raquelImg,
    isVip: true
  },
  {
    id: 5,
    name: "Luiza",
    age: 39,
    location: "a 4km de você",
    description: "Empresária bem-sucedida buscando conexões genuínas. Adoro mimar quem me conquista.",
    interests: ["Negócios", "Gastronomia", "Viagens"],
    image: luizaImg,
    isVip: true
  },
  {
    id: 6,
    name: "Luciana",
    age: 41,
    location: "a 6km de você",
    description: "Alegre, sensual e cheia de vida. Gosto de festas, praia e momentos inesquecíveis.",
    interests: ["Festas", "Praia", "Música"],
    image: lucianaImg,
    isVip: true
  },
  {
    id: 7,
    name: "Beatriz",
    age: 43,
    location: "a 7km de você",
    description: "Espontânea e divertida. Adoro dias de sol, praia e homens com bom humor.",
    interests: ["Praia", "Sol", "Aventura"],
    image: beatrizImg,
    isVip: false
  },
  {
    id: 8,
    name: "Mariana",
    age: 44,
    location: "a 1km de você",
    description: "Divorciada e livre. Quero aproveitar a vida com alguém especial. Recompenso bem quem merece.",
    interests: ["Piscina", "Verão", "Relaxar"],
    image: marianaImg,
    isVip: true
  },
  {
    id: 9,
    name: "Gabriela",
    age: 46,
    location: "a 9km de você",
    description: "Elegante e sedutora. Amo praias paradisíacas e homens que sabem tratar uma mulher.",
    interests: ["Praia", "Viagens", "Natureza"],
    image: gabrielaImg,
    isVip: true
  },
  {
    id: 10,
    name: "Isabela",
    age: 47,
    location: "a 3km de você",
    description: "Sofisticada e exigente. Busco conexões intensas com homens jovens e interessantes.",
    interests: ["Luxo", "Moda", "Exclusividade"],
    image: isabelaImg,
    isVip: true
  }
];

const MATCH_AT = 5; // Match acontece EXATAMENTE na 5ª curtida

const Descobrir = () => {
  const navigate = useNavigate();
  
  // 🔒 Device Lock System - Bloqueio por dispositivo (persiste mesmo com nova conta)
  const {
    isLikesBlocked,
    isGloballyLocked,
    markLikesCompleted,
    markMatchReceived,
    hasReceivedMatch,
    updateTotalLikes,
    updateTotalBalance,
    getPersistedBalance,
  } = useDeviceLock();
  
  // Persistent crown index hook - continues from where user left off
  const { currentIndex, setCurrentIndex } = useCrownIndex(profiles.length);
  
  // User data from localStorage
  const [userName] = useState(() => localStorage.getItem("userName") || "Visitante");
  const [userPhoto] = useState(() => localStorage.getItem("userPhoto") || "");
  
  const [showMatch, setShowMatch] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showVipPlans, setShowVipPlans] = useState(false);
  const [showPixReward, setShowPixReward] = useState(false);
  const [pendingReward, setPendingReward] = useState(0);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showInsistentPopup, setShowInsistentPopup] = useState(false);
  const [insistentTrigger, setInsistentTrigger] = useState<"likes_complete" | "chat_end" | "matches_return" | "new_chat" | "general">("general");

  // Persistent balance hook (usa saldo do device se existir)
  const { balance, addBalance } = useBalance(getPersistedBalance());

  // Likes limit hook - 10 likes grátis, match só na 5ª
  const { 
    likesUsed,
    hasReachedLimit, 
    isPremium, 
    canLike,
    maxFreeLikes,
    registerLike, 
    enterPremiumMode,
  } = useLikesLimit();

  // Hook para gerenciar retorno do checkout
  const handleShowVipPlans = useCallback(() => setShowVipPlans(true), []);
  const handleShowInsistent = useCallback(() => setShowInsistentPopup(true), []);
  useCheckoutReturn(handleShowVipPlans, handleShowInsistent);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // 🔒 Verificar bloqueio por device ao carregar
  useEffect(() => {
    if (isLikesBlocked() && !isPremium) {
      console.log("🔒 Device bloqueado - exibindo popup premium");
      setShowVipPlans(true);
    }
  }, [isLikesBlocked, isPremium]);

  // Show premium popup immediately if user already reached limit (page reload)
  useEffect(() => {
    if ((hasReachedLimit || isGloballyLocked()) && !isPremium) {
      setShowVipPlans(true);
    }
  }, [hasReachedLimit, isPremium, isGloballyLocked]);

  // Show insistent popup when returning from matches/chat
  useEffect(() => {
    const lastPage = localStorage.getItem("lastVisitedPage");
    if (lastPage === "/chat" && !isPremium) {
      setTimeout(() => {
        setInsistentTrigger("chat_end");
        setShowInsistentPopup(true);
      }, 2000);
    }
    if (lastPage === "/matches" && !isPremium) {
      setTimeout(() => {
        setInsistentTrigger("matches_return");
        setShowInsistentPopup(true);
      }, 1500);
    }
    localStorage.setItem("lastVisitedPage", "/descobrir");
  }, [isPremium]);

  const currentProfile = profiles[currentIndex];

  const handleLike = () => {
    // 🔒 Block if device is locked (mesmo com nova conta)
    if (isLikesBlocked() && !isPremium) {
      console.log("🔒 Curtidas bloqueadas neste dispositivo");
      setShowVipPlans(true);
      toast.error("Curtidas esgotadas!", {
        description: "Você já concluiu suas curtidas neste dispositivo. Seja VIP para continuar!",
      });
      return;
    }

    // Block if limit reached and not premium
    if (!canLike) {
      setShowVipPlans(true);
      return;
    }

    // Calculate new count BEFORE registering
    const newLikesCount = likesUsed + 1;

    // Try to register like
    const registered = registerLike();
    if (!registered) {
      setShowVipPlans(true);
      return;
    }
    
    // Track like
    LeadTracker.incrementLikes();
    
    // 🔒 Atualizar contador persistente por device
    updateTotalLikes(newLikesCount);
    
    // Generate random reward R$ 4,00 - R$ 9,90
    const reward = parseFloat((Math.random() * (9.90 - 4.00) + 4.00).toFixed(2));
    setPendingReward(reward);
    addBalance(reward);
    
    // 🔒 Atualizar saldo persistente por device
    updateTotalBalance(balance + reward);
    
    // Show PIX reward popup
    setShowPixReward(true);

    // 🎯 LÓGICA DE MATCH:
    // FREE: Match EXATAMENTE na 5ª curtida (não antes, não depois) - APENAS UMA VEZ POR DEVICE
    // PREMIUM: Match a cada 3 curtidas
    const shouldMatch = isPremium 
      ? newLikesCount % 3 === 0 
      : (newLikesCount === MATCH_AT && !hasReceivedMatch());
    
    if (shouldMatch) {
      setMatchedProfile(currentProfile);
      LeadTracker.registerMatch(currentProfile.name);
      
      // 🔒 Marcar match recebido por device (nunca mais dará outro match free)
      if (!isPremium) {
        markMatchReceived();
      }
      
      console.log(`🎯 Match liberado na curtida ${newLikesCount}!`);
    }

    // Advance to next crown (persisted)
    setCurrentIndex(currentIndex + 1);

    // Check if reached limit (10 likes) - show premium popup AND lock device
    if (!isPremium && newLikesCount >= maxFreeLikes) {
      // 🔒 Bloquear device permanentemente
      markLikesCompleted();
      
      setTimeout(() => {
        setInsistentTrigger("likes_complete");
        setShowInsistentPopup(true);
      }, 1500);
    }

    // Check if all profiles viewed
    if (currentIndex + 1 >= profiles.length) {
      // 🔒 Bloquear device permanentemente
      markLikesCompleted();
      
      setTimeout(() => {
        setInsistentTrigger("likes_complete");
        setShowInsistentPopup(true);
      }, 1500);
    }
  };
  
  const handlePixRewardContinue = () => {
    setShowPixReward(false);
    
    // Show match popup if there's a pending match
    if (matchedProfile) {
      setTimeout(() => setShowMatch(true), 300);
    }
  };

  const handleDislike = () => {
    // Block if limit reached and not premium
    if (!canLike) {
      setShowVipPlans(true);
      return;
    }

    // Advance to next crown (persisted)
    setCurrentIndex(currentIndex + 1);
  };

  const handleVipPurchase = (plan: string) => {
    setShowVipPlans(false);
    setShowInsistentPopup(false);
    enterPremiumMode();
    
    // Track purchase
    const planValues: Record<string, number> = {
      plano1: 19.90,
      plano2: 37.90,
      plano3: 47.90,
      plano4: 97.00
    };
    LeadTracker.registerPurchase(plan, planValues[plan] || 47.90);
    
    toast.success("🎉 Premium Ativado!", {
      description: "Curtidas e matches ilimitados liberados!"
    });
  };

  const handleMatchClose = () => {
    setShowMatch(false);
    setMatchedProfile(null);
    // If free user reached limit, show VIP popup
    if (hasReachedLimit && !isPremium) {
      setTimeout(() => setShowVipPlans(true), 300);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <BackgroundGrid />
        <div className="text-center z-10 animate-fade-in-up">
          <div className="text-6xl mb-4 animate-heartbeat">❤️</div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Iniciando sua experiência...</h2>
          <p className="text-muted-foreground">Encontrando as melhores coroas para você</p>
        </div>
      </div>
    );
  }

  // Blocked state - show premium upgrade screen (curtidas esgotadas)
  if (hasReachedLimit && !isPremium) {
    return (
      <div className="min-h-screen relative overflow-hidden pb-16">
        <BackgroundGrid useImage />
        
        {/* Header */}
        <header className="relative z-20 flex items-center justify-between p-3 sm:p-4 bg-card/80 backdrop-blur-sm border-b border-border safe-area-top">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* User Avatar with gradient border */}
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full p-[2px] bg-gradient-to-r from-primary via-secondary to-primary">
              {userPhoto ? (
                <img 
                  src={userPhoto} 
                  alt={userName}
                  className="w-full h-full rounded-full object-cover border-2 border-background"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center border-2 border-background">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
                </div>
              )}
            </div>
            <span className="font-medium text-foreground text-sm sm:text-base truncate max-w-[80px] sm:max-w-none">{userName}</span>
          </div>
          <div className="flex items-center gap-1 bg-success/20 text-success px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
            <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-semibold text-xs sm:text-base">R${balance.toFixed(2)}</span>
          </div>
        </header>

        {/* Blocked Content */}
        <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-140px)] p-4">
          <div className="text-center max-w-md mx-auto animate-fade-in-up">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
              <Lock className="w-10 h-10 text-primary" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Você usou suas {maxFreeLikes} curtidas grátis! 🔥
            </h2>
            <p className="text-muted-foreground mb-6">
              Para continuar conhecendo coroas incríveis e ter curtidas ilimitadas, faça upgrade para Premium.
            </p>
            
            <Button 
              onClick={() => setShowVipPlans(true)} 
              variant="hero" 
              size="lg" 
              className="w-full max-w-xs mx-auto"
            >
              <Crown className="w-5 h-5" />
              Tornar-se Premium
            </Button>

            <p className="text-xs text-muted-foreground mt-4">
              ✨ Curtidas ilimitadas • 💬 Mensagens ilimitadas • 🎁 Presentes exclusivos
            </p>
          </div>
        </main>

        {/* Bottom Navigation */}
        <BottomNavigation />

        {/* VIP Plans Popup */}
        <VipPlansPopup
          isOpen={showVipPlans}
          onClose={() => setShowVipPlans(false)}
          onPurchase={handleVipPurchase}
          limitType="likes"
          currentLikes={likesUsed}
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
  }

  return (
    <div className="min-h-screen relative overflow-hidden pb-16">
      <BackgroundGrid useImage />

      {/* Header - Mobile optimized with user avatar */}
      <header className="relative z-20 flex items-center justify-between p-3 sm:p-4 bg-card/80 backdrop-blur-sm border-b border-border safe-area-top">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User Avatar with gradient border */}
          <button 
            onClick={() => setShowEditProfile(true)}
            className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full p-[2px] bg-gradient-to-r from-primary via-secondary to-primary group"
          >
            {userPhoto ? (
              <img 
                src={userPhoto} 
                alt={userName}
                className="w-full h-full rounded-full object-cover border-2 border-background"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center border-2 border-background">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-card border border-border rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Edit className="w-2.5 h-2.5 text-primary" />
            </div>
          </button>
          <span className="font-medium text-foreground text-sm sm:text-base truncate max-w-[70px] sm:max-w-none">{userName}</span>
          {isPremium && (
            <span className="bg-gradient-to-r from-gold to-amber-500 text-background text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Crown className="w-3 h-3" /> VIP
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Balance */}
          <div className="flex items-center gap-1 bg-success/20 text-success px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
            <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-semibold text-xs sm:text-sm">R${balance.toFixed(2)}</span>
          </div>

          {/* Likes counter - 💖 0/10 */}
          {!isPremium && (
            <div className="flex items-center gap-1 bg-primary/20 text-primary px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs">
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 fill-primary" />
              <span className="font-semibold">{likesUsed}/{maxFreeLikes}</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-140px)] p-3 sm:p-4">
        <ProfileCard
          key={currentProfile.id}
          name={currentProfile.name}
          age={currentProfile.age}
          location={currentProfile.location}
          description={currentProfile.description}
          interests={currentProfile.interests}
          image={currentProfile.image}
          isVip={currentProfile.isVip}
          onLike={handleLike}
          onDislike={handleDislike}
        />
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
      />

      {/* Match Popup */}
      <MatchPopup
        isOpen={showMatch}
        userName={userName}
        matchName={matchedProfile?.name || ""}
        matchImage={matchedProfile?.image || ""}
        onStartChat={() => {
          setShowMatch(false);
          navigate("/chat", { state: { profile: matchedProfile } });
        }}
        onClose={handleMatchClose}
        showContinueButton={isPremium}
        isPremium={isPremium}
      />

      {/* VIP Plans Popup */}
      <VipPlansPopup
        isOpen={showVipPlans}
        onClose={() => setShowVipPlans(false)}
        onPurchase={handleVipPurchase}
        limitType="likes"
        currentLikes={likesUsed}
      />

      {/* PIX Reward Popup */}
      <PixRewardPopup
        isOpen={showPixReward}
        onContinue={handlePixRewardContinue}
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

export default Descobrir;
