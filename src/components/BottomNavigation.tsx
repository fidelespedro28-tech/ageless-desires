import { useNavigate, useLocation } from "react-router-dom";
import { User, MessageCircle, Heart } from "lucide-react";

interface BottomNavigationProps {
  className?: string;
}

const BottomNavigation = ({ className = "" }: BottomNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      id: "perfil",
      label: "Perfil",
      icon: User,
      path: "/perfil",
    },
    {
      id: "chat",
      label: "Chat",
      icon: MessageCircle,
      path: "/chat",
    },
    {
      id: "matches",
      label: "Matches",
      icon: Heart,
      path: "/descobrir",
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`bottom-nav bg-card/95 backdrop-blur-sm border-t border-border ${className}`}>
      <div className="flex items-center justify-around px-2 sm:px-4 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-1 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 min-w-[60px] min-h-[56px] active:scale-95 ${
                active 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
            >
              <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${active ? "fill-primary/20" : ""}`} />
              <span className="text-[10px] sm:text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
