import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BackgroundGrid from "@/components/BackgroundGrid";
import Logo from "@/components/Logo";
import { ArrowLeft, User, Mail, Key, Eye, EyeOff, Crown, Check } from "lucide-react";

const Cadastro = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    pix: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate registration
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Store user name for personalization
    localStorage.setItem("userName", formData.nome.split(" ")[0]);
    
    navigate("/bem-vindo");
  };

  const benefits = [
    "Acesso a perfis premium de coroas",
    "Receba PIX das mulheres interessadas",
    "Chat ilimitado com matches",
    "Prioridade em novas conexões"
  ];

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
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-4 sm:py-8">
          <div className="w-full max-w-md">
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-5 sm:p-8 shadow-card animate-fade-in-up">
              {/* Header */}
              <div className="text-center mb-5 sm:mb-8">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <Crown className="w-7 h-7 sm:w-8 sm:h-8 text-primary-foreground" />
                </div>
                <h1 className="font-display text-xl sm:text-2xl font-bold mb-2">
                  Criar conta 💋
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Entre para o clube mais exclusivo do Brasil
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-foreground">
                    Nome completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Digite seu nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className="pl-10 text-base min-h-[48px]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-foreground">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10 text-base min-h-[48px]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-foreground">
                    Chave PIX <span className="text-muted-foreground text-[10px] sm:text-xs">(para receber presentes)</span>
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="CPF, email ou telefone"
                      value={formData.pix}
                      onChange={(e) => setFormData({ ...formData, pix: e.target.value })}
                      className="pl-10 text-base min-h-[48px]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-foreground">
                    Senha
                  </label>
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
                      placeholder="Crie uma senha"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="text-base min-h-[48px]"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="seductive"
                  size="lg"
                  className="w-full mt-4 sm:mt-6 min-h-[52px]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Criando conta...
                    </div>
                  ) : (
                    <>
                      <Crown className="w-5 h-5" />
                      Criar Minha Conta Grátis
                    </>
                  )}
                </Button>
              </form>

              {/* Benefits */}
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border">
                <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                  Ao se cadastrar, você terá acesso a:
                </p>
                <ul className="space-y-1.5 sm:space-y-2">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2 text-xs sm:text-sm">
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-success shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Login link */}
              <p className="text-center text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-6">
                Já tem uma conta?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-primary font-medium hover:underline"
                >
                  Entrar
                </button>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Cadastro;
