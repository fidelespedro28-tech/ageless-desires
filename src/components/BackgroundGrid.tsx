const BackgroundGrid = () => {
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
