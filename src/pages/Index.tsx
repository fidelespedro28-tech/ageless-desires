import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BackgroundGrid from "@/components/BackgroundGrid";
import Logo from "@/components/Logo";
import VipPopup from "@/components/VipPopup";
import { Crown, Heart, Gift, Shield, Users, Star } from "lucide-react";

import helenaImg from "@/assets/models/helena.jpg";
import julianaImg from "@/assets/models/juliana.jpg";
import fernandaImg from "@/assets/models/fernanda.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [showVipPopup, setShowVipPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVipPopup(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: <Crown className="w-6 h-6" />,
      title: "Mulheres Exclusivas",
      description: "Perfis verificados de mulheres maduras e sofisticadas"
    },
    {
      icon: <Gift className="w-6 h-6" />,
      title: "Presentes e PIX",
      description: "Receba presentes e valores das coroas interessadas"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "100% Seguro",
      description: "Ambiente verificado e sigiloso para suas conexões"
    }
  ];

  const testimonialModels = [
    { img: helenaImg, name: "Helena, 43", online: true },
    { img: julianaImg, name: "Juliana, 35", online: true },
    { img: fernandaImg, name: "Fernanda, 38", online: false },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundGrid />

      {/* Hero Section */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6">
          <Logo size="md" />
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
          <div className="max-w-2xl mx-auto text-center animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">
                +2.847 mulheres online agora
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Onde o charme da{" "}
              <span className="gradient-text">maturidade</span>
              <br />
              encontra o desejo da{" "}
              <span className="gradient-text">juventude</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
              Mulheres incríveis com mais de 30 anos se conectam com jovens de 18+ 
              em uma relação leve, envolvente e{" "}
              <span className="text-primary font-semibold">vantajosa</span> 💋
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                onClick={() => navigate("/cadastro")}
                variant="seductive"
                size="xl"
                className="group"
              >
                <Heart className="w-5 h-5 group-hover:animate-heartbeat" />
                Começar Agora — É Grátis
              </Button>
              <Button
                onClick={() => navigate("/login")}
                variant="outline"
                size="lg"
              >
                Já tenho conta
              </Button>
            </div>

            {/* Online Models Preview */}
            <div className="flex justify-center items-center gap-2 mb-8">
              <div className="flex -space-x-3">
                {testimonialModels.map((model, index) => (
                  <div
                    key={index}
                    className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary"
                    style={{ zIndex: testimonialModels.length - index }}
                  >
                    <img
                      src={model.img}
                      alt={model.name}
                      className="w-full h-full object-cover"
                    />
                    {model.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 badge-online border-2 border-background" />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground ml-2">
                <span className="text-primary font-semibold">Helena</span> e outras estão te esperando...
              </p>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-success" />
                Perfis Verificados
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-gold" />
                4.9/5 Avaliação
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4 text-primary" />
                +50k Matches
              </div>
            </div>
          </div>
        </main>

        {/* Features Section */}
        <section className="relative z-10 py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 text-center hover:border-primary/50 transition-all duration-300 hover:shadow-glow animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 py-6 px-6 text-center text-sm text-muted-foreground border-t border-border">
          <p>© 2024 Clube das Coroas. Apenas para maiores de 18 anos.</p>
        </footer>
      </div>

      {/* VIP Popup */}
      <VipPopup
        isOpen={showVipPopup}
        onClose={() => setShowVipPopup(false)}
        onAccept={() => {
          setShowVipPopup(false);
          navigate("/cadastro");
        }}
      />
    </div>
  );
};

export default Index;
