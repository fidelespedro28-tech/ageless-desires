import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BackgroundGrid from "@/components/BackgroundGrid";
import { saveNavigationState } from "@/hooks/useNavigationState";
import { Check, Crown, Gift, Heart, Star } from "lucide-react";

const BemVindo = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Gabriel");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);

    // 🔄 Salvar estado de navegação
    saveNavigationState({ currentPage: "/bem-vindo" });

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <BackgroundGrid useImage />
        <div className="text-center z-10 animate-fade-in-up">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundGrid useImage />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md text-center animate-fade-in-up">
          {/* User Avatar */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="w-full h-full rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-4xl">
              👤
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-success rounded-full flex items-center justify-center border-4 border-background">
              <Check className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Welcome Message */}
          <h1 className="font-display text-3xl font-bold mb-2">
            Bem-vindo, <span className="gradient-text">{userName}</span>! 🎉
          </h1>
          <p className="text-muted-foreground mb-8">
            Sua conta foi criada com sucesso!<br />
            Você agora faz parte do Clube das Coroas
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-card/50 border border-border rounded-xl p-4">
              <Heart className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">0</p>
              <p className="text-xs text-muted-foreground">Matches</p>
            </div>
            <div className="bg-card/50 border border-border rounded-xl p-4">
              <Gift className="w-6 h-6 text-gold mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">R$0</p>
              <p className="text-xs text-muted-foreground">Recebidos</p>
            </div>
            <div className="bg-card/50 border border-border rounded-xl p-4">
              <Star className="w-6 h-6 text-secondary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">5</p>
              <p className="text-xs text-muted-foreground">Curtidas</p>
            </div>
          </div>

          {/* VIP Card */}
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Crown className="w-6 h-6 text-gold" />
              <span className="font-semibold text-foreground">Bônus de Boas-vindas!</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Você ganhou <span className="text-primary font-bold">5 curtidas grátis</span> para começar 
              a conhecer as coroas mais incríveis da plataforma! 💕
            </p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Heart key={i} className="w-6 h-6 text-primary fill-primary animate-heartbeat" style={{ animationDelay: `${i * 100}ms` }} />
              ))}
            </div>
          </div>

          {/* CTA */}
          <Button
            onClick={() => navigate("/descobrir")}
            variant="seductive"
            size="xl"
            className="w-full"
          >
            <Heart className="w-5 h-5" />
            Começar a Descobrir Coroas
          </Button>

          <p className="text-xs text-muted-foreground mt-4">
            Dica: Curta os perfis para ganhar presentes e matches! 🎁
          </p>
        </div>
      </div>
    </div>
  );
};

export default BemVindo;
