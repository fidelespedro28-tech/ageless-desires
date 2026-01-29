import { useState, useEffect } from "react";
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
import { useMatchLimit } from "@/hooks/useMatchLimit";
import { useBalance } from "@/hooks/useBalance";
import { useCrownIndex } from "@/hooks/useCrownIndex";
import { Heart, X, Crown, DollarSign, User, Lock, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import helenaImg from "@/assets/models/helena.jpg";
import julianaImg from "@/assets/models/juliana-new.jpg"; // Nova imagem da Juliana
import fernandaImg from "@/assets/models/fernanda.jpg";
import patriciaImg from "@/assets/models/patricia.jpg";
import carolinaImg from "@/assets/models/carolina.jpg";
import adrianaImg from "@/assets/models/adriana.jpg";
import renataImg from "@/assets/models/renata.png";
import camilaImg from "@/assets/models/camila.png";

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

const profiles: Profile[] = [
  {
    id: 1,
    name: "Helena",
    age: 43,
    location: "a 8km de você",
    description: "Elegante e sofisticada. Adoro vinhos, jantares e momentos especiais. Busco um homem que aprecie a vida.",
    interests: ["Vinhos", "Gastronomia", "Viagens"],
    image: helenaImg,
    isVip: true
  },
  {
    id: 2,
    name: "Juliana",
    age: 35,
    location: "a 3km de você",
    description: "Empresária bem-sucedida buscando companhia jovem e interessante. Adoro presentear quem me trata bem 💋",
    interests: ["Negócios", "Fitness", "Moda"],
    image: julianaImg,
    isVip: true
  },
  {
    id: 3,
    name: "Fernanda",
    age: 38,
    location: "a 12km de você",
    description: "Mulher madura e experiente. Gosto de homens que sabem o que querem. Sou generosa com quem merece.",
    interests: ["Arte", "Cinema", "Culinária"],
    image: fernandaImg,
    isVip: false
  },
  {
    id: 4,
    name: "Patrícia",
    age: 41,
    location: "a 5km de você",
    description: "Divorciada e livre. Quero aproveitar a vida com alguém especial. Adoro mimar meus matches.",
    interests: ["Spa", "Shopping", "Jazz"],
    image: patriciaImg,
    isVip: true
  },
  {
    id: 5,
    name: "Carolina",
    age: 36,
    location: "a 2km de você",
    description: "Adoro dias de sol na piscina e homens atenciosos. Recompenso muito bem quem me faz sorrir 😘",
    interests: ["Praia", "Fitness", "Viagens"],
    image: carolinaImg,
    isVip: true
  },
  {
    id: 6,
    name: "Adriana",
    age: 34,
    location: "a 6km de você",
    description: "Amo natureza e vida saudável. Procuro alguém jovem e cheio de energia para me acompanhar.",
    interests: ["Yoga", "Trilhas", "Saúde"],
    image: adrianaImg,
    isVip: false
  },
  {
    id: 7,
    name: "Renata",
    age: 32,
    location: "a 4km de você",
    description: "Executiva bem-sucedida. Gosto de praias paradisíacas e homens que sabem tratar uma mulher.",
    interests: ["Luxo", "Viagens", "Gastronomia"],
    image: renataImg,
    isVip: true
  },
  {
    id: 8,
    name: "Camila",
    age: 37,
    location: "a 1km de você",
    description: "Elegante e misteriosa. Adoro mimar quem me conquista. Você pode ser o próximo sortudo.",
    interests: ["Moda", "Arte", "Vinhos"],
    image: camilaImg,
    isVip: true
  }
];

const Descobrir = () => {
  const navigate = useNavigate();
  
  // Persistent crown index hook - continues from where user left off
  const { currentIndex, setCurrentIndex } = useCrownIndex(profiles.length);
  
  const [likes, setLikes] = useState(0);
  const [userName] = useState(() => localStorage.getItem("userName") || "Gabriel");
  const [showMatch, setShowMatch] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showVipPlans, setShowVipPlans] = useState(false);
  const [showPixReward, setShowPixReward] = useState(false);
  const [pendingReward, setPendingReward] = useState(0);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showInsistentPopup, setShowInsistentPopup] = useState(false);
  const [insistentTrigger, setInsistentTrigger] = useState<"likes_complete" | "chat_end" | "matches_return" | "general">("general");

  // Persistent balance hook - saldo consistente entre páginas
  const { balance, addBalance } = useBalance(0);

  // Match limit hook - controls free/premium interactions
  const { 
    hasReachedLimit, 
    isPremium, 
    canInteract, 
    registerMatch, 
    enterPremiumMode,
    freeMatchUsed
  } = useMatchLimit();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Show premium popup immediately if user already reached limit (page reload)
  useEffect(() => {
    if (hasReachedLimit && !isPremium) {
      setShowVipPlans(true);
    }
  }, [hasReachedLimit, isPremium]);

  // Show insistent popup when returning from matches/chat (for premium conversion)
  useEffect(() => {
    const lastPage = localStorage.getItem("lastVisitedPage");
    if (lastPage === "/chat" && !isPremium) {
      setTimeout(() => {
        setInsistentTrigger("chat_end");
        setShowInsistentPopup(true);
      }, 2000);
    }
    localStorage.setItem("lastVisitedPage", "/descobrir");
  }, [isPremium]);

  const currentProfile = profiles[currentIndex];

  const handleLike = () => {
    // Block if limit reached and not premium
    if (!canInteract) {
      setShowVipPlans(true);
      return;
    }

    const newLikes = likes + 1;
    setLikes(newLikes);
    
    // Registra like no tracker
    LeadTracker.incrementLikes();
    
    // Generate random reward between R$ 4,00 and R$ 9,90
    const reward = parseFloat((Math.random() * (9.90 - 4.00) + 4.00).toFixed(2));
    setPendingReward(reward);
    addBalance(reward); // Usa o hook persistente
    
    // Show PIX reward popup
    setShowPixReward(true);

    // Match happens on first like for free users, or every 3 likes for premium
    const shouldMatch = isPremium ? newLikes % 3 === 0 : newLikes === 1;
    
    if (shouldMatch) {
      setMatchedProfile(currentProfile);
      registerMatch(); // Register match in the limit system
      // Registra match no tracker (dispara AddToCart)
      LeadTracker.registerMatch(currentProfile.name);
    }

    // Advance to next crown (persisted)
    setCurrentIndex(currentIndex + 1);

    // Check if all profiles viewed (show insistent popup)
    if (currentIndex + 1 >= profiles.length && isPremium) {
      setTimeout(() => {
        setInsistentTrigger("likes_complete");
        setShowInsistentPopup(true);
      }, 1500);
    }
  };
  
  const handlePixRewardContinue = () => {
    setShowPixReward(false);
    
    // Check if there's a pending match
    const shouldMatch = isPremium ? likes % 3 === 0 : likes === 1;
    if (matchedProfile && shouldMatch) {
      setTimeout(() => setShowMatch(true), 300);
    }
  };

  const handleDislike = () => {
    // Block if limit reached and not premium
    if (!canInteract) {
      setShowVipPlans(true);
      return;
    }

    // Advance to next crown (persisted)
    setCurrentIndex(currentIndex + 1);
  };

  const handleVipPurchase = (plan: string) => {
    setShowVipPlans(false);
    setShowInsistentPopup(false);
    enterPremiumMode(); // Unlock premium mode
    
    // Registra compra no tracker (dispara Purchase)
    const planValues: Record<string, number> = {
      essencial: 19.90,
      premium: 37.90,
      ultra: 47.90
    };
    LeadTracker.registerPurchase(plan, planValues[plan] || 47.90);
    
    toast.success("🎉 Premium Ativado!", {
      description: `Plano ${plan.charAt(0).toUpperCase() + plan.slice(1)} ativado - Matches ilimitados!`
    });
  };

  const handleMatchClose = () => {
    setShowMatch(false);
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

  // Blocked state - show premium upgrade screen (match gratuito já foi usado)
  if ((hasReachedLimit || freeMatchUsed) && !isPremium) {
    return (
      <div className="min-h-screen relative overflow-hidden pb-16">
        <BackgroundGrid useImage />
        
        {/* Header */}
        <header className="relative z-20 flex items-center justify-between p-3 sm:p-4 bg-card/80 backdrop-blur-sm border-b border-border safe-area-top">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
            </div>
            <span className="font-medium text-foreground text-sm sm:text-base">{userName}</span>
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
              Você já teve seu match gratuito! 🎉
            </h2>
            <p className="text-muted-foreground mb-6">
              Para continuar conhecendo coroas incríveis e ter matches ilimitados, faça upgrade para Premium.
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
              ✨ Matches ilimitados • 💬 Mensagens ilimitadas • 🎁 Presentes exclusivos
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
          limitType="matches"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden pb-16">
      <BackgroundGrid useImage />

      {/* Header - Mobile optimized */}
      <header className="relative z-20 flex items-center justify-between p-3 sm:p-4 bg-card/80 backdrop-blur-sm border-b border-border safe-area-top">
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={() => setShowEditProfile(true)}
            className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center group"
          >
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-card border border-border rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Edit className="w-2.5 h-2.5 text-primary" />
            </div>
          </button>
          <span className="font-medium text-foreground text-sm sm:text-base truncate max-w-[80px] sm:max-w-none">{userName}</span>
          {isPremium && (
            <span className="bg-gradient-to-r from-gold to-amber-500 text-background text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Crown className="w-3 h-3" /> PREMIUM
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Balance */}
          <div className="flex items-center gap-1 bg-success/20 text-success px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
            <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-semibold text-xs sm:text-base">R${balance.toFixed(2)}</span>
          </div>

          {/* Premium badge or match hint */}
          {!isPremium && (
            <div className="flex items-center gap-1 bg-primary/20 text-primary px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs">
              <Heart className="w-3 h-3 fill-primary" />
              <span className="font-semibold">1 match grátis</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content - Better vertical centering on mobile */}
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

      {/* Match Popup - hide continue button for free users after match */}
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
        limitType="matches"
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
        onUpgrade={() => handleVipPurchase("premium")}
        trigger={insistentTrigger}
      />
    </div>
  );
};

export default Descobrir;
