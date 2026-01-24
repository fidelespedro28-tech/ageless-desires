import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundGrid from "@/components/BackgroundGrid";
import ProfileCard from "@/components/ProfileCard";
import MatchPopup from "@/components/MatchPopup";
import { Heart, X, Crown, DollarSign, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import helenaImg from "@/assets/models/helena.jpg";
import julianaImg from "@/assets/models/juliana.jpg";
import fernandaImg from "@/assets/models/fernanda.jpg";
import patriciaImg from "@/assets/models/patricia.jpg";

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

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const currentProfile = profiles[currentIndex % profiles.length];

  const handleLike = () => {
    const newLikes = likes + 1;
    setLikes(newLikes);
    
    // Random reward
    if (Math.random() > 0.3) {
      const reward = Math.floor(Math.random() * 10) + 2;
      setBalance((prev) => prev + reward);
      toast.success(`💰 Você ganhou R$${reward.toFixed(2)} por curtir!`, {
        description: `${currentProfile.name} gostou de você!`,
      });
    }

    // Check for match (every 3 likes)
    if (newLikes % 3 === 0) {
      setMatchedProfile(currentProfile);
      setShowMatch(true);
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const handleDislike = () => {
    setDislikes((prev) => prev + 1);
    setCurrentIndex((prev) => prev + 1);
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

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between p-4 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <User className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-medium text-foreground">{userName}</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Balance */}
          <div className="flex items-center gap-1 bg-success/20 text-success px-3 py-1.5 rounded-full">
            <DollarSign className="w-4 h-4" />
            <span className="font-semibold">R${balance.toFixed(2)}</span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4 text-primary fill-primary" />
              <span className="text-foreground">{likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <X className="w-4 h-4 text-destructive" />
              <span className="text-foreground">{dislikes}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
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

      {/* Bottom hint */}
      <div className="fixed bottom-4 left-0 right-0 z-20 text-center">
        <p className="text-xs text-muted-foreground">
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
    </div>
  );
};

export default Descobrir;
