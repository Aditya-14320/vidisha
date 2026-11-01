import React from 'react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
      <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
        Privacy Policy
      </h1>
      <p className="text-xs text-slate-500 mb-8">
        Last updated: October 2026 • Vidisha City Directory
      </p>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">1. Information We Collect</h2>
          <p>
            Vidisha City collects information submitted voluntarily when listing a business or contacting support:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600">
            <li>Business details: Business name, address in Vidisha, operational telephone, WhatsApp number, operational hours, category, and photographs.</li>
            <li>Contact details: Authorized owner or applicant contact name and email address.</li>
            <li>Usage metrics: Anonymized page views and search interaction counts.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">2. Confidentiality of Private Records</h2>
          <p>
            We strictly distinguish public business listings from private administrative data. Private owner identification details, internal admin verification notes, and payment receipts are never exposed through public API endpoints or frontend directories.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">3. Progressive Web App (PWA) Storage</h2>
          <p>
            When utilizing Vidisha City as an installable PWA, static assets (icons, stylesheets, scripts) are cached locally on your device for fast launching. Personal private user information is never stored unencrypted in public caches.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">4. Contact & Inquiries</h2>
          <p>
            For privacy inquiries, official support or data removal, please contact our team at:
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
