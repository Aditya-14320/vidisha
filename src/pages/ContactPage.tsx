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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
          Contact Vidisha City Support
        </h1>
        <p className="text-sm text-slate-500">
          Have inquiries regarding your business listing, billing, corrections, or community feedback? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <Phone className="w-5 h-5 text-blue-600 mb-2" />
            <h3 className="text-sm font-bold text-slate-900">Phone Support</h3>
            <p className="text-xs text-slate-500 mb-2">Mon - Sat: 9:00 AM - 7:00 PM</p>
            <a href="tel:7000845940" className="text-sm font-semibold text-blue-600 hover:underline">
              7000845940
            </a>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <MessageSquare className="w-5 h-5 text-emerald-600 mb-2" />
            <h3 className="text-sm font-bold text-slate-900">WhatsApp Desk</h3>
            <p className="text-xs text-slate-500 mb-2">Fast response for listings</p>
            <a
              href="https://wa.me/917000845940"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-emerald-600 hover:underline"
            >
              7000845940
            </a>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <MapPin className="w-5 h-5 text-purple-600 mb-2" />
            <h3 className="text-sm font-bold text-slate-900">Office Location</h3>
            <p className="text-xs text-slate-500 mb-2">Vidisha, MP</p>
            <p className="text-sm font-semibold text-slate-800">
              Vidisha, Madhya Pradesh – 464001
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <Mail className="w-5 h-5 text-amber-500 mb-2" />
            <h3 className="text-sm font-bold text-slate-900">Email Inquiries</h3>
            <p className="text-xs text-slate-500 mb-2">Official communications</p>
            <a href="mailto:contact@vidishacity.in" className="text-sm font-semibold text-slate-800 hover:text-blue-600">
              contact@vidishacity.in
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Message Dispatched
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mb-6">
                  Thank you, {name}. Our local Vidisha support team will review your inquiry and reply via {contact} shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-lg font-bold text-slate-900 mb-1">
                  Send Us a Direct Message
                </h2>
                <p className="text-xs text-slate-500 mb-4">
                  Please let us know how we can assist you.
                </p>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus-ring"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Number / Email Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Where can we reach you?"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus-ring"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Message / Question *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your inquiry..."
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus-ring"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-transform active:scale-95"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
