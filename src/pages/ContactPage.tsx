import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, MapPin, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28 text-white">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight mb-2">
          Contact Vidisha City Support
        </h1>
        <p className="text-sm text-[#a1a1aa] font-light">
          Have inquiries regarding your business listing, billing, corrections, or community feedback? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <div className="bg-[#141418] rounded-3xl p-5 border border-[#26262e] shadow-md">
            <Phone className="w-5 h-5 text-gold-400 mb-2" />
            <h3 className="text-sm font-bold text-white">Phone Support</h3>
            <p className="text-xs text-[#a1a1aa] mb-2 font-light">Mon - Sat: 9:00 AM - 7:00 PM</p>
            <a href="tel:7000845940" className="text-sm font-semibold text-gold-400 hover:underline">
              7000845940
            </a>
          </div>

          <div className="bg-[#141418] rounded-3xl p-5 border border-[#26262e] shadow-md">
            <MessageSquare className="w-5 h-5 text-gold-400 mb-2" />
            <h3 className="text-sm font-bold text-white">WhatsApp Desk</h3>
            <p className="text-xs text-[#a1a1aa] mb-2 font-light">Fast response for listings</p>
            <a
              href="https://wa.me/917000845940"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-gold-400 hover:underline"
            >
              7000845940
            </a>
          </div>

          <div className="bg-[#141418] rounded-3xl p-5 border border-[#26262e] shadow-md">
            <MapPin className="w-5 h-5 text-gold-400 mb-2" />
            <h3 className="text-sm font-bold text-white">Office Location</h3>
            <p className="text-xs text-[#a1a1aa] mb-2 font-light">Vidisha, MP</p>
            <p className="text-sm font-semibold text-white">
              Vidisha, Madhya Pradesh – 464001
            </p>
          </div>

          <div className="bg-[#141418] rounded-3xl p-5 border border-[#26262e] shadow-md">
            <Mail className="w-5 h-5 text-gold-400 mb-2" />
            <h3 className="text-sm font-bold text-white">Email Address</h3>
            <p className="text-xs text-[#a1a1aa] mb-2 font-light">Official Support Email</p>
            <a href="mailto:contact@vidishacity.in" className="text-sm font-semibold text-gold-400 hover:underline truncate block">
              contact@vidishacity.in
            </a>
          </div>
        </div>

        {/* Message Form */}
        <div className="md:col-span-2 bg-[#141418] rounded-3xl p-6 sm:p-8 border border-[#26262e] shadow-xl">
          {submitted ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-16 h-16 text-gold-400 mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-white mb-2">Message Received</h3>
              <p className="text-sm text-[#a1a1aa] max-w-md mx-auto font-light leading-relaxed">
                Thank you, {name || 'patron'}. Your enquiry has been forwarded to our Vidisha administrative desk. We will respond promptly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-serif text-xl font-bold text-white mb-2">Send an Enquiry</h2>

              <div>
                <label className="block text-xs font-semibold text-[#d4d4d8] mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full p-3 text-sm rounded-xl border border-[#2e2e38] focus:outline-none focus:border-gold-500 bg-[#1c1c22] text-white placeholder-[#71717a]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#d4d4d8] mb-1.5">
                  Phone Number or Email *
                </label>
                <input
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="e.g. 98260XXXXX or rahul@example.com"
                  className="w-full p-3 text-sm rounded-xl border border-[#2e2e38] focus:outline-none focus:border-gold-500 bg-[#1c1c22] text-white placeholder-[#71717a]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#d4d4d8] mb-1.5">
                  Your Message or Enquiry *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we assist you with Vidisha City directory?"
                  className="w-full p-3 text-sm rounded-xl border border-[#2e2e38] focus:outline-none focus:border-gold-500 bg-[#1c1c22] text-white placeholder-[#71717a]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 hover:from-gold-300 hover:to-gold-500 text-dark-950 font-bold text-sm shadow-[0_0_20px_rgba(212,168,49,0.35)] transition-all active:scale-95"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
