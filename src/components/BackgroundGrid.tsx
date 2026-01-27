import backgroundImage from "@/assets/background-grid.jpg";

interface BackgroundGridProps {
  useImage?: boolean;
}

const BackgroundGrid = ({ useImage = false }: BackgroundGridProps) => {
  if (useImage) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Background Image with fixed attachment for depth effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        {/* Dark overlay gradient for contrast and readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/85 to-background/95" />
        {/* Subtle grid overlay for brand consistency */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(330 100% 71% / 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(330 100% 71% / 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      </div>
    );
  }

  // Default grid pattern for landing/cadastro pages
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/95" />
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(330 100% 71% / 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(330 100% 71% / 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
};

export default BackgroundGrid;
