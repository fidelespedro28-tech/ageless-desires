import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BackgroundGrid from "@/components/BackgroundGrid";
import Logo from "@/components/Logo";
import { getNavigationState, saveNavigationState } from "@/hooks/useNavigationState";
import { ArrowLeft, Mail, Eye, EyeOff, Heart } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // 🔄 Verificar se usuário já está logado
  useEffect(() => {
    const userName = localStorage.getItem("userName");
    if (userName) {
      const navState = getNavigationState();
      const validPages = ["/descobrir", "/chat", "/perfil"];
      const targetPage = navState.currentPage && validPages.includes(navState.currentPage) 
        ? navState.currentPage 
        : "/descobrir";
      navigate(targetPage, { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    localStorage.setItem("userName", "Gabriel");
    
    // 🔄 Redirecionar para última página válida ou descobrir
    const navState = getNavigationState();
    const validPages = ["/descobrir", "/chat", "/perfil"];
    const targetPage = navState.currentPage && validPages.includes(navState.currentPage) 
      ? navState.currentPage 
      : "/descobrir";
    
    saveNavigationState({ currentPage: targetPage });
    navigate(targetPage);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundGrid />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-4 sm:p-6 flex items-center gap-3 sm:gap-4 safe-area-top">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-lg bg-card/50 border border-border hover:border-primary/50 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Logo size="sm" showIcon={false} />
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-8">
          <div className="w-full max-w-md">
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-5 sm:p-8 shadow-card animate-fade-in-up">
              {/* Header */}
              <div className="text-center mb-6 sm:mb-8">
                <Logo size="md" />
                <h1 className="font-display text-xl sm:text-2xl font-bold mt-4 sm:mt-6 mb-2">
                  Entrar 💋
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Entre com seu email e senha para acessar sua conta
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="E-mail"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10 text-base min-h-[48px]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                      aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Senha"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="text-base min-h-[48px]"
                      required
                    />
                  </div>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    className="text-xs sm:text-sm text-primary hover:underline py-1"
                  >
                    Esqueceu a senha?
                  </button>
                </div>

                <Button
                  type="submit"
                  variant="seductive"
                  size="lg"
                  className="w-full min-h-[52px]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Entrando...
                    </div>
                  ) : (
                    <>
                      <Heart className="w-5 h-5" />
                      Entrar
                    </>
                  )}
                </Button>
              </form>

              {/* Register link */}
              <p className="text-center text-xs sm:text-sm text-muted-foreground mt-5 sm:mt-6">
                Ainda não tem conta?{" "}
                <button
                  onClick={() => navigate("/cadastro")}
                  className="text-primary font-medium hover:underline"
                >
                  Criar conta grátis
                </button>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Login;
