import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ListingPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28 text-white">
      <div className="mb-8">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#1c1c24] border border-gold-500/30 text-gold-400 text-xs font-bold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Operational Standard</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight">
          Vidisha City Listing & Verification Policy
        </h1>
        <p className="text-sm text-[#a1a1aa] mt-1 font-light">
          Effective Date: January 1, 2026 • Vidisha, Madhya Pradesh
        </p>
      </div>

      <div className="bg-[#141418] rounded-3xl p-6 sm:p-10 border border-[#26262e] shadow-xl space-y-8 text-sm text-[#d4d4d8] leading-relaxed font-light">
        {/* Core Philosophy */}
        <section>
          <h2 className="font-serif text-base font-bold text-white mb-2">
            1. Core Principles of the Directory
          </h2>
          <p>
            Vidisha City is a community-first digital discovery platform dedicated to connecting the residents and visitors of Vidisha, MP, with local businesses. To maintain trust and utility:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5 text-[#a1a1aa]">
            <li>We do not generate fabricated reviews, synthetic star ratings, or exaggerated customer counts.</li>
            <li>We clearly distinguish paid commercial advertising from organic directory listings.</li>
            <li>We do not claim that any business is the "best" or "number one" based on payment.</li>
          </ul>
        </section>

        {/* Top 10 Slot Rules */}
        <section className="bg-[#1a1a24] p-5 rounded-2xl border border-gold-500/30">
          <h2 className="font-serif text-base font-bold text-gold-400 mb-2 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-gold-400" />
            <span>2. Strict Top 10 Slot Placement Rules</span>
          </h2>
          <p className="mb-2 text-[#e4e4e7]">
            The Top 10 slots within each category represent premium commercial directory positioning managed directly by administrators under strict rules:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-[#a1a1aa]">
            <li><strong>Strict Numerical Cap:</strong> No category will ever display more than 10 active paid Top 10 placements. This cap is strictly enforced server-side.</li>
            <li><strong>Payment & Verification Prerequisite:</strong> A listing must have an approved application status and a verified active payment record.</li>
            <li><strong>Automatic Expiry Demotion:</strong> When a paid listing term expires without renewal, the slot is immediately vacated or reassigned to a waitlisted merchant.</li>
            <li><strong>Commercial Nature:</strong> Purchasing a Top 10 slot secures visibility and placement; it is not a quality endorsement or warranty of sales by Vidisha City.</li>
          </ul>
        </section>

        {/* Verification and Onboarding Process */}
        <section>
          <h2 className="font-serif text-base font-bold text-white mb-2">
            3. Onboarding & Payment Verification
          </h2>
          <p>
            To prevent fraud and maintain directory safety:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5 text-[#a1a1aa]">
            <li>All public onboarding applications enter a secure Pending Approval queue for administrative review before going live.</li>
            <li>Physical storefronts and establishment legitimacy in Vidisha are confirmed prior to activation.</li>
            <li>Subscription payments are verified manually by local administrators against official transaction references.</li>
          </ul>
        </section>

        {/* Transparency Disclosure */}
        <section className="p-4 bg-[#111114] rounded-2xl border border-[#24242c] text-xs text-[#a1a1aa]">
          <p className="font-semibold text-gold-400 mb-1">
            Official Placement Disclosure:
          </p>
          <p>
            Vidisha City is an informational business directory and advertising platform. Featured placement, sponsored badges, and Priority Selection slots represent commercial directory advertising positions procured by business owners and do not constitute an independent editorial ranking or endorsement. Users are advised to exercise their own discretion when transacting with businesses.
          </p>
        </section>
      </div>
    </div>
  );
};

export default ListingPolicyPage;
