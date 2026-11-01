import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

export const ListingPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
      <div className="mb-8">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Operational Standard</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Vidisha City Listing & Verification Policy
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Effective Date: January 1, 2026 • Vidisha, Madhya Pradesh
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8 text-sm text-slate-700 leading-relaxed">
        {/* Core Philosophy */}
        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">
            1. Core Principles of the Directory
          </h2>
          <p>
            Vidisha City is a community-first digital discovery platform dedicated to connecting the residents and visitors of Vidisha, MP, with local businesses. To maintain trust and utility:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5 text-slate-600">
            <li>We do not generate fabricated reviews, synthetic star ratings, or exaggerated customer counts.</li>
            <li>We clearly distinguish paid commercial advertising from organic directory listings.</li>
            <li>We do not claim that any business is the "best" or "number one" based on payment.</li>
          </ul>
        </section>

        {/* Top 10 Slot Rules */}
        <section className="bg-blue-50/60 p-5 rounded-2xl border border-blue-200">
          <h2 className="text-base font-bold text-blue-900 mb-2 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>2. Strict Top 10 Slot Placement Rules</span>
          </h2>
          <p className="mb-2">
            The Top 10 slots within each category represent premium commercial directory positioning managed directly by administrators under strict rules:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-blue-950/80">
            <li><strong>Strict Numerical Cap:</strong> No category will ever display more than 10 active paid Top 10 placements. This cap is strictly enforced server-side.</li>
            <li><strong>Payment & Verification Prerequisite:</strong> A listing must have an approved application status and a verified active payment record.</li>
            <li><strong>Automatic Expiry Demotion:</strong> When a paid listing term expires without renewal, the slot is immediately vacated or reassigned to a waitlisted merchant.</li>
            <li><strong>Commercial Nature:</strong> Purchasing a Top 10 slot secures visibility and placement; it is not a quality endorsement or warranty of sales by Vidisha City.</li>
          </ul>
        </section>

        {/* Verification and Onboarding Process */}
        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">
            3. Onboarding & Payment Verification
          </h2>
          <p>
            To prevent fraud and maintain directory safety:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5 text-slate-600">
            <li>All listing applications are initially submitted with <span className="font-semibold text-slate-900">"Pending"</span> status and are concealed from public viewing.</li>
            <li>Administrators verify the physical operational presence of the establishment in Vidisha.</li>
            <li>Payments are recorded manually via administrative receipt verification or verified payment gateway webhooks. Screenshot submission alone does not activate a listing.</li>
          </ul>
        </section>

        {/* Data Correction & Removal */}
        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">
            4. Business Correction and Removal Requests
          </h2>
          <p>
            If a business permanently relocates, closes, changes contact numbers, or if an unauthorized party listed a profile, any user can click the "Report Incorrect Information" button found on every profile page. Alternatively, contact the Vidisha City team directly at <a href="tel:7000845940" className="font-semibold text-blue-600 hover:underline">7000845940</a>, WhatsApp at <a href="https://wa.me/917000845940" target="_blank" rel="noreferrer" className="font-semibold text-emerald-600 hover:underline">7000845940</a>, in person at Vidisha, Madhya Pradesh – 464001, or email <span className="font-semibold text-blue-600">contact@vidishacity.in</span>. We investigate and resolve legitimate corrections within 48 business hours.
          </p>
        </section>
      </div>
    </div>
  );
};
