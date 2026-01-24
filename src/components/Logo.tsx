import crownIcon from "@/assets/crown-icon.png";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

const Logo = ({ size = "md", showIcon = true }: LogoProps) => {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-5xl"
  };

  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16"
  };

  return (
    <div className="flex items-center gap-3">
      {showIcon && (
        <img 
          src={crownIcon} 
          alt="Coroa" 
          className={`${iconSizes[size]} animate-float`} 
        />
      )}
      <h1 className={`font-display font-bold ${sizeClasses[size]}`}>
        <span className="text-foreground">Clube das</span>
        <span className="gradient-text ml-2">Coroas</span>
      </h1>
    </div>
  );
};

export default Logo;
