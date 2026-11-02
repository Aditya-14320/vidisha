import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ReportService } from '../../services/reportService';
import { Business } from '../../types';

interface ReportModalProps {
  business: Business;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ business, isOpen, onClose }) => {
  const [issueType, setIssueType] = useState<any>('wrong_phone');
  const [details, setDetails] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) {
      setError('Please describe the incorrect details or corrections needed.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await ReportService.submitReport({
        businessId: business.id,
        businessName: business.name,
        issueType,
        details,
        reporterName: reporterName.trim() || undefined,
        reporterContact: reporterContact.trim() || undefined
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#141418] rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative border border-gold-500/40 animate-in zoom-in-95 duration-200 text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#a1a1aa] hover:text-white rounded-full hover:bg-[#202028] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-14 h-14 text-gold-400 mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold text-white mb-2">
              Feedback Received
            </h3>
            <p className="text-sm text-[#a1a1aa] mb-7 font-light leading-relaxed">
              Thank you for helping keep Vidisha City directory accurate and reliable. Our moderation team will verify this report.
            </p>
            <button
              onClick={onClose}
              className="px-8 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-dark-950 font-bold text-sm shadow transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-2.5 pb-4 border-b border-[#24242c]">
              <AlertTriangle className="w-5 h-5 text-gold-400 shrink-0" />
              <div>
                <h3 className="font-serif text-lg font-bold text-white">
                  Report Information
                </h3>
                <p className="text-xs text-[#a1a1aa] truncate">{business.name}</p>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#d4d4d8] mb-1.5">
                Issue Type
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full py-2.5 px-3 text-xs sm:text-sm rounded-xl border border-[#2e2e38] focus:outline-none focus:border-gold-500 bg-[#1c1c22] text-white cursor-pointer"
              >
                <option value="wrong_phone" className="bg-[#18181c]">Incorrect Phone / Contact</option>
                <option value="wrong_address" className="bg-[#18181c]">Wrong Location or Address</option>
                <option value="permanently_closed" className="bg-[#18181c]">Permanently Closed or Relocated</option>
                <option value="wrong_hours" className="bg-[#18181c]">Incorrect Working Hours</option>
                <option value="other" className="bg-[#18181c]">Other Discrepancy</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#d4d4d8] mb-1.5">
                Description of the Error *
              </label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Please describe what information is outdated or incorrect..."
                className="w-full p-3 text-xs sm:text-sm rounded-xl border border-[#2e2e38] focus:outline-none focus:border-gold-500 bg-[#1c1c22] text-white placeholder-[#71717a]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#a1a1aa] mb-1">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full py-2 px-3 text-xs rounded-xl border border-[#2e2e38] focus:outline-none focus:border-gold-500 bg-[#1c1c22] text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#a1a1aa] mb-1">
                  Your Phone / Email (Optional)
                </label>
                <input
                  type="text"
                  value={reporterContact}
                  onChange={(e) => setReporterContact(e.target.value)}
                  placeholder="For clarification"
                  className="w-full py-2 px-3 text-xs rounded-xl border border-[#2e2e38] focus:outline-none focus:border-gold-500 bg-[#1c1c22] text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-[#24242c]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full text-xs font-semibold text-[#a1a1aa] hover:text-white border border-[#2a2a34] hover:bg-[#202028] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-dark-950 font-bold text-xs shadow-md disabled:opacity-50 transition-colors"
              >
                {submitting ? 'Submitting...' : 'Send Feedback'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
