import { Cpu } from 'lucide-react';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xl" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <Cpu className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
              <div className="absolute -top-1 -right-1 bg-green-500 text-black text-[7px] sm:text-[8px] px-1 rounded font-bold">
                BETA
              </div>
            </div>
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight">
              GROK AI
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <a href="#how-it-works" className="text-sm text-white/70 hover:text-green-500 transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="text-sm text-white/70 hover:text-green-500 transition-colors">
              Pricing
            </a>
            <a href="#legal" className="text-sm text-white/70 hover:text-green-500 transition-colors">
              Legal
            </a>
          </nav>

          {/* CTA */}
          <a
            href="/login"
            className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-2.5 bg-white text-black hover:bg-green-500 transition-all duration-300 rounded-lg text-xs sm:text-sm font-medium"
          >
            Login
          </a>
        </div>
      </div>
    </header>
  );
}