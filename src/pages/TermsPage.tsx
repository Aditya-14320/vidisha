import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
      <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
        Terms of Service
      </h1>
      <p className="text-xs text-slate-500 mb-8">
        Last updated: October 2026 • Vidisha City Directory
      </p>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Vidisha City website or Progressive Web App, you agree to comply with and be bound by these Terms of Service.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">2. Nature of Directory Service</h2>
          <p>
            Vidisha City is a community directory and commercial advertising platform. Information regarding businesses, operational hours, offers, and locations is compiled from merchant submissions and public observations. Users are advised to verify details directly with the merchant before making commitments.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">3. Commercial Placements & Disclaimers</h2>
          <p>
            Paid listings, featured banners, and Top 10 slots represent paid advertising space. They do not constitute an endorsement, guarantee of merchant performance, or insurance of service quality by Vidisha City.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">4. Prohibited Content</h2>
          <p>
            Merchants may not submit unlawful, misleading, fraudulent, or infringing content. Any profile found in violation will be suspended without refund.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">5. Official Contact Details</h2>
          <p>
            For questions, legal notices, or merchant assistance, contact the Vidisha City administration:
          </p>
          <ul className="mt-2 space-y-1 text-slate-600">
            <li><strong>Phone:</strong> <a href="tel:7000845940" className="text-blue-600 hover:underline">7000845940</a></li>
            <li><strong>WhatsApp:</strong> <a href="https://wa.me/917000845940" target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">7000845940</a></li>
            <li><strong>Address:</strong> Vidisha, Madhya Pradesh – 464001</li>
            <li><strong>Email:</strong> <span className="font-semibold text-blue-600">contact@vidishacity.in</span></li>
          </ul>
        </section>
      </div>
    </div>
  );
};
