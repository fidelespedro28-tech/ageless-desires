import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import BackgroundGrid from "@/components/BackgroundGrid";
import Logo from "@/components/Logo";
import { LeadTracker } from "@/lib/leadTracker";
import { saveNavigationState } from "@/hooks/useNavigationState";
import { 
  ArrowLeft, 
  Camera, 
  User, 
  Heart, 
  Sparkles, 
  Wine, 
  Music, 
  Plane, 
  Utensils,
  Dumbbell,
  Book,
  Film,
  Check
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Interesses disponíveis
const INTERESTS = [
  { id: "viagens", label: "Viagens", icon: Plane },
  { id: "gastronomia", label: "Gastronomia", icon: Utensils },
  { id: "musica", label: "Música", icon: Music },
  { id: "fitness", label: "Fitness", icon: Dumbbell },
  { id: "vinhos", label: "Vinhos", icon: Wine },
  { id: "leitura", label: "Leitura", icon: Book },
  { id: "cinema", label: "Cinema", icon: Film },
  { id: "romantico", label: "Romântico", icon: Heart },
];

const Perfil = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Recupera nome do localStorage
  const userName = localStorage.getItem("userName") || "Usuário";
  
  // Estados do formulário
  const [photo, setPhoto] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  // 🔄 Salvar estado de navegação
  useEffect(() => {
    saveNavigationState({ currentPage: "/perfil" });
  }, []);

  // Manipula upload de foto
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle interesse
  const toggleInterest = (interestId: string) => {
    setSelectedInterests(prev => 
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  // Salva perfil
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simula salvamento
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Salva dados do perfil no localStorage
    const profileData = {
      photo,
      bio,
      interests: selectedInterests,
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem("userProfile", JSON.stringify(profileData));

    // Atualiza leadData com informações do perfil
    LeadTracker.updateLeadData({
      pagesVisited: [...(LeadTracker.getLeadData()?.pagesVisited || []), "/perfil-completo"],
    });

    // Dispara evento de perfil completo
    LeadTracker.triggerFacebookEvent("CompleteRegistration", {
      content_name: "Perfil Completo",
      status: true,
    });

    setIsLoading(false);
    setShowConfirmPopup(true);
  };

  // Continua para página de descobrir
  const handleContinue = () => {
    setShowConfirmPopup(false);
    
    // Redireciona para descobrir (usuário começa com 5 curtidas grátis)
    navigate("/descobrir");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundGrid useImage />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-4 sm:p-6 flex items-center gap-3 sm:gap-4 safe-area-top">
          <button
            onClick={() => navigate("/cadastro")}
            className="p-2 rounded-lg bg-card/50 border border-border hover:border-primary/50 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Logo size="sm" showIcon={false} />
        </header>

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-6 py-4 sm:py-8 overflow-y-auto">
          <div className="w-full max-w-lg mx-auto">
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-5 sm:p-8 shadow-card animate-fade-in-up">
              {/* Saudação personalizada */}
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground" />
                </div>
                <h1 className="font-display text-xl sm:text-2xl font-bold mb-2">
                  Olá, {userName}! 👋
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Complete seu perfil para atrair as melhores coroas
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                {/* Upload de Foto */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Camera className="w-4 h-4 text-primary" />
                    Sua melhor foto
                  </label>
                  <div className="flex flex-col items-center gap-4">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-dashed border-primary/50 hover:border-primary cursor-pointer transition-colors flex items-center justify-center overflow-hidden bg-card/50"
                    >
                      {photo ? (
                        <img 
                          src={photo} 
                          alt="Foto do perfil" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <Camera className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                          <span className="text-xs text-muted-foreground">Clique para adicionar</span>
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    {photo && (
                      <button
                        type="button"
                        onClick={() => setPhoto(null)}
                        className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                      >
                        Remover foto
                      </button>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Sobre você
                  </label>
                  <Textarea
                    placeholder="Conte um pouco sobre você... O que te faz especial? 😏"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="min-h-[100px] resize-none text-base"
                    maxLength={300}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {bio.length}/300 caracteres
                  </p>
                </div>

                {/* Interesses */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Heart className="w-4 h-4 text-primary" />
                    Seus interesses
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Selecione o que você curte para encontrar coroas compatíveis
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {INTERESTS.map((interest) => {
                      const Icon = interest.icon;
                      const isSelected = selectedInterests.includes(interest.id);
                      return (
                        <button
                          key={interest.id}
                          type="button"
                          onClick={() => toggleInterest(interest.id)}
                          className={`
                            p-3 rounded-xl border transition-all duration-200 flex items-center gap-2
                            ${isSelected 
                              ? "bg-primary/20 border-primary text-primary" 
                              : "bg-card/50 border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                            }
                          `}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <span className="text-sm font-medium truncate">{interest.label}</span>
                          {isSelected && <Check className="w-4 h-4 ml-auto shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Botão de Salvar */}
                <Button
                  type="submit"
                  variant="seductive"
                  size="lg"
                  className="w-full mt-6 min-h-[52px]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Salvando perfil...
                    </div>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Completar Meu Perfil 💋
                    </>
                  )}
                </Button>
              </form>

              {/* Dica */}
              <p className="text-center text-xs text-muted-foreground mt-6">
                💡 Perfis completos recebem <span className="text-primary font-medium">3x mais matches</span>
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Popup de Confirmação */}
      <Dialog open={showConfirmPopup} onOpenChange={setShowConfirmPopup}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-success to-primary flex items-center justify-center">
              <Check className="w-10 h-10 text-primary-foreground" />
            </div>
            <DialogTitle className="font-display text-xl sm:text-2xl text-center">
              Perfil Completo! 🎉
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground mt-2">
              Parabéns, <span className="text-primary font-medium">{userName}</span>! 
              Seu perfil está pronto para conquistar as melhores coroas. 
              Prepare-se para receber muitos matches!
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
              <Heart className="w-5 h-5 text-primary shrink-0" />
              <span className="text-sm text-foreground">
                Coroas já estão visualizando seu perfil
              </span>
            </div>
            
            <Button
              onClick={handleContinue}
              variant="seductive"
              size="lg"
              className="w-full min-h-[52px]"
            >
              <Sparkles className="w-5 h-5" />
              Continuar e Ver Coroas 🔥
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Perfil;
