import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, MessageSquare } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-10 sm:pt-12 pb-16 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 sm:mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 p-1 flex items-center justify-center">
                <img src="/logo.svg" alt="Vidisha City" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Vidisha<span className="text-blue-400">City</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              The premier progressive web platform dedicated to connecting residents and visitors with verified local shops, services, doctors, and artisans in Vidisha, Madhya Pradesh.
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Vidisha, Madhya Pradesh – 464001</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Explore Vidisha
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/categories" className="hover:text-white transition-colors">
                  All 20 Business Categories
                </Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-white transition-colors">
                  Current City Offers & Deals
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-white transition-colors">
                  Search Directory
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition-colors">
                  Business Listing Packages
                </Link>
              </li>
              <li>
                <Link to="/advertise" className="hover:text-white transition-colors text-amber-300 font-semibold">
                  Banner Advertising (New)
                </Link>
              </li>
              <li>
                <Link to="/list-your-business" className="hover:text-white transition-colors font-medium text-blue-400">
                  Register Your Business +
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Transparency & Policies
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/listing-policy" className="hover:text-white transition-colors">
                  Listing & Verification Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Support & Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Support */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Directory Support
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Have inquiries about your listing, slot assignments, or need corrections?
            </p>
            <div className="space-y-2 text-sm">
              <a
                href="tel:7000845940"
                className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-blue-400" />
                <span>7000845940</span>
              </a>
              <a
                href="https://wa.me/917000845940"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp: 7000845940</span>
              </a>
              <a
                href="mailto:contact@vidishacity.in"
                className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-amber-400" />
                <span>contact@vidishacity.in</span>
              </a>
            </div>
          </div>
        </div>

        {/* Mandatory Transparency & Placement Disclosure Notice */}
        <div className="border-t border-slate-800 pt-6 pb-6 text-xs text-slate-400 leading-relaxed bg-slate-950/40 rounded-xl p-4">
          <p className="font-semibold text-slate-300 mb-1">
            Directory Placement Disclosure:
          </p>
          <p>
            Vidisha City is an informational business directory and advertising platform. Featured placement, sponsored badges, and Top 10 slots represent paid commercial directory advertising positions procured by business owners and do not constitute an independent editorial ranking, quality certification, or guarantee of commercial outcomes. Users are advised to exercise their own discretion when transacting with businesses.
          </p>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 text-center text-xs text-slate-400 space-y-1">
          <p>© {new Date().getFullYear()} Vidisha City. All rights reserved.</p>
          <p>Built with ❤️ for Vidisha, Madhya Pradesh.</p>
        </div>
      </div>
    </footer>
  );
};
