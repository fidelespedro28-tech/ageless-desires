import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundGrid from "@/components/BackgroundGrid";
import ProfileCard from "@/components/ProfileCard";
import MatchPopup from "@/components/MatchPopup";
import VipPaymentPopup from "@/components/VipPaymentPopup";
import PixRewardPopup from "@/components/PixRewardPopup";
import { Heart, X, Crown, DollarSign, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import helenaImg from "@/assets/models/helena.jpg";
import julianaImg from "@/assets/models/juliana.jpg";
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [balance, setBalance] = useState(0);
  const [userName] = useState(() => localStorage.getItem("userName") || "Gabriel");
  const [showMatch, setShowMatch] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showVipPayment, setShowVipPayment] = useState(false);
  const [showPixReward, setShowPixReward] = useState(false);
  const [pendingReward, setPendingReward] = useState(0);
  const [likesRemaining, setLikesRemaining] = useState(6);
  const [dislikesRemaining, setDislikesRemaining] = useState(3);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Check if limits reached and show VIP popup
  useEffect(() => {
    if (likesRemaining <= 0 && dislikesRemaining <= 0) {
      const timer = setTimeout(() => {
        setShowVipPayment(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [likesRemaining, dislikesRemaining]);

  const currentProfile = profiles[currentIndex % profiles.length];

  const handleLike = () => {
    if (likesRemaining <= 0) {
      setShowVipPayment(true);
      return;
    }

    const newLikes = likes + 1;
    setLikes(newLikes);
    setLikesRemaining((prev) => Math.max(0, prev - 1));
    
    // Generate random reward between R$ 4,00 and R$ 9,90
    const reward = parseFloat((Math.random() * (9.90 - 4.00) + 4.00).toFixed(2));
    setPendingReward(reward);
    setBalance((prev) => prev + reward);
    
    // Show PIX reward popup
    setShowPixReward(true);

    // Check for match (every 3 likes)
    if (newLikes % 3 === 0) {
      setMatchedProfile(currentProfile);
    }

    setCurrentIndex((prev) => prev + 1);
  };
  
  const handlePixRewardContinue = () => {
    setShowPixReward(false);
    
    // If there's a pending match, show it after closing PIX popup
    if (matchedProfile && likes % 3 === 0) {
      setTimeout(() => setShowMatch(true), 300);
    }
  };

  const handleDislike = () => {
    if (dislikesRemaining <= 0) {
      setShowVipPayment(true);
      return;
    }

    setDislikes((prev) => prev + 1);
    setDislikesRemaining((prev) => Math.max(0, prev - 1));
    setCurrentIndex((prev) => prev + 1);
  };

  const handleVipPurchase = () => {
    setShowVipPayment(false);
    setLikesRemaining(999);
    setDislikesRemaining(999);
    toast.success("🎉 VIP Ativado!", {
      description: "Agora você tem acesso ilimitado!"
    });
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

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundGrid />

      {/* Header - Mobile optimized */}
      <header className="relative z-20 flex items-center justify-between p-3 sm:p-4 bg-card/80 backdrop-blur-sm border-b border-border safe-area-top">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
          </div>
          <span className="font-medium text-foreground text-sm sm:text-base truncate max-w-[80px] sm:max-w-none">{userName}</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Balance */}
          <div className="flex items-center gap-1 bg-success/20 text-success px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
            <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-semibold text-xs sm:text-base">R${balance.toFixed(2)}</span>
          </div>

          {/* Stats with remaining */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-primary fill-primary" />
              <span className={`font-semibold ${likesRemaining <= 2 ? 'text-destructive' : 'text-foreground'}`}>
                {likesRemaining}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <X className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
              <span className={`font-semibold ${dislikesRemaining <= 1 ? 'text-destructive' : 'text-foreground'}`}>
                {dislikesRemaining}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Better vertical centering on mobile */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-80px)] p-3 sm:p-4 pb-16 sm:pb-4">
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

      {/* Bottom hint - Safe area */}
      <div className="fixed bottom-2 sm:bottom-4 left-0 right-0 z-20 text-center safe-area-bottom">
        <p className="text-[10px] sm:text-xs text-muted-foreground px-4">
          💡 Curta para ganhar recompensas e encontrar seu match!
        </p>
      </div>

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
        onClose={() => setShowMatch(false)}
      />

      {/* VIP Payment Popup */}
      <VipPaymentPopup
        isOpen={showVipPayment}
        onClose={() => setShowVipPayment(false)}
        onPurchase={handleVipPurchase}
      />

      {/* PIX Reward Popup */}
      <PixRewardPopup
        isOpen={showPixReward}
        onContinue={handlePixRewardContinue}
      />
    </div>
  );
};

export default Descobrir;
