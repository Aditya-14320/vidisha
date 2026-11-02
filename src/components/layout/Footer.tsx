import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, MessageSquare, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#09090b] text-[#a1a1aa] pt-12 sm:pt-16 pb-24 md:pb-14 border-t border-[#1c1c22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10 sm:mb-14">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#141418] border border-gold-500/40 p-1.5 flex items-center justify-center shadow-md">
                <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 8L60 28H40L50 8Z" fill="#d4a831" />
                  <path d="M50 24L75 48L50 92L25 48L50 24Z" stroke="#d4a831" strokeWidth="4" fill="#141416" />
                  <path d="M50 36L66 52L50 82L34 52L50 36Z" fill="#d4a831" fillOpacity="0.85" />
                </svg>
              </div>
              <span className="font-serif text-2xl font-bold text-white tracking-tight">
                Vidisha<span className="text-gold-500 font-serif italic ml-0.5">City</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#8e8e93] leading-relaxed font-light">
              Vidisha’s premier digital concierge and business discovery directory. Connecting residents and travelers with verified merchants, artisans, healthcare providers, and dining institutions in Vidisha, Madhya Pradesh.
            </p>
            <div className="flex items-center space-x-2 text-xs text-gold-400 pt-1">
              <MapPin className="w-4 h-4 text-gold-500 shrink-0" />
              <span>Vidisha, Madhya Pradesh – 464001</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-[#24242a] pb-2">
              Explore Vidisha
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/categories" className="text-[#a1a1aa] hover:text-gold-400 transition-colors">
                  All Business Categories
                </Link>
              </li>
              <li>
                <Link to="/offers" className="text-[#a1a1aa] hover:text-gold-400 transition-colors">
                  Current City Privileges & Deals
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-[#a1a1aa] hover:text-gold-400 transition-colors">
                  Search Directory
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-[#a1a1aa] hover:text-gold-400 transition-colors">
                  Business Placement Packages
                </Link>
              </li>
              <li>
                <Link to="/advertise" className="text-gold-400 hover:text-gold-300 transition-colors font-medium flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Banner Advertising</span>
                </Link>
              </li>
              <li>
                <Link to="/list-your-business" className="text-gold-400 hover:text-gold-300 transition-colors font-semibold">
                  Register Your Business +
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div>
            <h3 className="font-serif text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-[#24242a] pb-2">
              Transparency & Standards
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/listing-policy" className="text-[#a1a1aa] hover:text-gold-400 transition-colors">
                  Listing & Verification Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-[#a1a1aa] hover:text-gold-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-[#a1a1aa] hover:text-gold-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#a1a1aa] hover:text-gold-400 transition-colors">
                  Concierge Support & Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Support */}
          <div>
            <h3 className="font-serif text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-[#24242a] pb-2">
              Merchant Concierge
            </h3>
            <p className="text-xs text-[#8e8e93] mb-3.5 font-light">
              Need assistance with your directory listing or verified profile?
            </p>
            <div className="space-y-2.5 text-xs sm:text-sm">
              <a
                href="tel:7000845940"
                className="flex items-center space-x-2.5 text-[#d4d4d8] hover:text-gold-400 transition-colors"
              >
                <Phone className="w-4 h-4 text-gold-500" />
                <span>+91 7000845940</span>
              </a>
              <a
                href="https://wa.me/917000845940"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2.5 text-gold-400 hover:text-gold-300 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-gold-500" />
                <span>WhatsApp: 7000845940</span>
              </a>
              <a
                href="mailto:contact@vidishacity.in"
                className="flex items-center space-x-2.5 text-[#d4d4d8] hover:text-gold-400 transition-colors"
              >
                <Mail className="w-4 h-4 text-gold-500" />
                <span>contact@vidishacity.in</span>
              </a>
            </div>
          </div>
        </div>

        {/* Mandatory Transparency & Placement Disclosure Notice */}
        <div className="border-t border-[#1c1c22] pt-6 pb-6 text-xs text-[#71717a] leading-relaxed bg-[#111115] rounded-2xl p-4 sm:p-5 border border-[#222228] font-light">
          <p className="font-semibold text-gold-400 mb-1">
            Directory Placement & Commercial Disclosure:
          </p>
          <p>
            Vidisha City is an informational business directory and advertising platform. Featured placement, sponsored badges, and Priority Selection slots represent commercial directory advertising positions procured by business owners and do not constitute an independent editorial ranking or endorsement. Users are advised to exercise their own discretion when transacting with businesses.
          </p>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 text-center text-xs text-[#71717a] space-y-1">
          <p>© {new Date().getFullYear()} Vidisha City. All rights reserved.</p>
          <p className="text-gold-500/80 font-medium">Crafted with precision for Vidisha, Madhya Pradesh.</p>
        </div>
      </div>
    </footer>
  );
};
