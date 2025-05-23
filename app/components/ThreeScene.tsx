// CSS-based animated background component
export default function ThreeScene() {
  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-dark">
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-neon-cyan rounded-full opacity-60 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${6 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        {/* Geometric Shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 border-2 border-fortnite-blue/30 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
        <div className="absolute bottom-32 right-32 w-24 h-24 border-2 border-fortnite-purple/30 rotate-45 animate-pulse" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-neon-green/30 animate-bounce" />

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-fortnite-blue/20 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-gradient-to-r from-fortnite-purple/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Central Logo Area */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-8xl font-gaming font-black text-fortnite-blue/10 animate-pulse select-none">
            FTW
          </div>
        </div>
      </div>
    </div>
  );
}
