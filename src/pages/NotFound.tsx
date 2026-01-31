import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getNavigationState } from "@/hooks/useNavigationState";
import BackgroundGrid from "@/components/BackgroundGrid";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Heart } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    console.warn("404: Rota não encontrada:", location.pathname);
    
    // 🔄 Tentar redirecionar para última página válida
    const userName = localStorage.getItem("userName");
    const navState = getNavigationState();
    
    if (userName) {
      // Usuário logado - redirecionar para descobrir ou última página
      const validPages = ["/descobrir", "/chat", "/perfil", "/bem-vindo"];
      const targetPage = navState.currentPage && validPages.includes(navState.currentPage) 
        ? navState.currentPage 
        : "/descobrir";
      
      console.log("🔄 Redirecionando usuário para:", targetPage);
      navigate(targetPage, { replace: true });
    } else {
      // Novo usuário - mostrar 404 com opções
      setIsRedirecting(false);
    }
  }, [location.pathname, navigate]);

  // Enquanto redireciona, mostrar loading
  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <BackgroundGrid />
        <div className="text-center z-10 animate-fade-in-up">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      <BackgroundGrid />
      <div className="relative z-10 text-center max-w-md mx-auto animate-fade-in-up">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
          <Heart className="w-10 h-10 text-primary" />
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-2">Página não encontrada</h1>
        <p className="text-muted-foreground mb-6">
          Parece que você se perdeu... mas não se preocupe, as coroas ainda estão te esperando! 💋
        </p>
        
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => navigate("/cadastro")}
            variant="seductive"
            size="lg"
            className="w-full"
          >
            <Heart className="w-5 h-5" />
            Conhecer as Coroas
          </Button>
          
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            size="lg"
            className="w-full"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </Button>
          
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            size="lg"
            className="w-full"
          >
            <Home className="w-5 h-5" />
            Página Inicial
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
