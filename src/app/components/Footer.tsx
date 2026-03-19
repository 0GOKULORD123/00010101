import { Cpu, Twitter, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/10 py-8 sm:py-12 md:py-16">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12 mb-8 sm:mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="relative">
                <Cpu className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                <div className="absolute -top-1 -right-1 bg-green-500 text-black text-[7px] sm:text-[8px] px-1 rounded font-bold">
                  BETA
                </div>
              </div>
              <span className="text-lg sm:text-xl font-bold text-white tracking-tight">
                GROK AI
              </span>
            </div>
            <p className="text-white/60 text-xs sm:text-sm">
              Automated cryptocurrency trading powered by advanced AI algorithms. Trade smarter, not harder.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">Platform</h4>
            <ul className="space-y-2">
              <li>
                <a href="#how-it-works" className="text-white/60 hover:text-green-500 text-xs sm:text-sm transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-white/60 hover:text-green-500 text-xs sm:text-sm transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#legal" className="text-white/60 hover:text-green-500 text-xs sm:text-sm transition-colors">
                  Legal
                </a>
              </li>
              <li>
                <a href="mailto:support@grokai.com" className="text-white/60 hover:text-green-500 text-xs sm:text-sm transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#legal" className="text-white/60 hover:text-green-500 text-xs sm:text-sm transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#legal" className="text-white/60 hover:text-green-500 text-xs sm:text-sm transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#legal" className="text-white/60 hover:text-green-500 text-xs sm:text-sm transition-colors">
                  Risk Disclosure
                </a>
              </li>
              <li>
                <a href="#legal" className="text-white/60 hover:text-green-500 text-xs sm:text-sm transition-colors">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#legal" className="text-white/60 hover:text-green-500 text-xs sm:text-sm transition-colors">
                  Compliance
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">Connect</h4>
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <a
                href="https://twitter.com/grokai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-500/50 flex items-center justify-center transition-all duration-300"
              >
                <Twitter className="w-4 h-4 sm:w-5 sm:h-5 text-white/60 hover:text-green-500" />
              </a>
              <a
                href="https://linkedin.com/company/grokai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-500/50 flex items-center justify-center transition-all duration-300"
              >
                <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-white/60 hover:text-green-500" />
              </a>
              <a
                href="mailto:support@grokai.com"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-500/50 flex items-center justify-center transition-all duration-300"
              >
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white/60 hover:text-green-500" />
              </a>
            </div>
            <p className="text-white/60 text-xs sm:text-sm">
              <strong className="text-white">Email:</strong><br />
              support@grokai.com
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 sm:pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-white/40 text-xs sm:text-sm text-center sm:text-left">
              © {currentYear} GROK AI. All rights reserved. <span className="text-green-500">BETA</span>
            </p>
            <p className="text-white/40 text-[10px] sm:text-xs max-w-md text-center sm:text-right">
              Cryptocurrency trading involves substantial risk. Only invest what you can afford to lose.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}