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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative border border-ivory-300 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-charcoal-400 hover:text-charcoal-700 rounded-full hover:bg-ivory-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-14 h-14 text-forest-600 mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold text-forest-950 mb-2">
              Feedback Received
            </h3>
            <p className="text-sm text-charcoal-600 mb-7 font-light leading-relaxed">
              Thank you for helping keep Vidisha City directory accurate and reliable. Our moderation team will verify this report.
            </p>
            <button
              onClick={onClose}
              className="px-7 py-2.5 rounded-xl bg-forest-900 text-gold-300 font-semibold text-sm hover:bg-forest-950 border border-gold-500/30 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center space-x-2.5 pb-4 border-b border-ivory-200">
              <AlertTriangle className="w-5 h-5 text-gold-600 shrink-0" />
              <div>
                <h3 className="font-serif text-lg font-bold text-forest-950">
                  Report Incorrect Information
                </h3>
                <p className="text-xs text-charcoal-500 font-light mt-0.5">
                  Reporting for <span className="font-semibold text-charcoal-800">{business.name}</span>
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1.5">
                What seems inaccurate? *
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-ivory-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400 bg-ivory-50 text-charcoal-800"
              >
                <option value="wrong_phone">Incorrect or unworking phone number</option>
                <option value="closed_down">Business is permanently closed or relocated</option>
                <option value="wrong_address">Inaccurate address or map pin</option>
                <option value="wrong_hours">Operating hours are incorrect</option>
                <option value="fraud">Fraudulent listing or unauthorized owner</option>
                <option value="other">Other corrections needed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1.5">
                Correction Details *
              </label>
              <textarea
                rows={3}
                required
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Please share the correct phone number, address, or details..."
                className="w-full px-3 py-2.5 text-sm border border-ivory-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400 font-light text-charcoal-800 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1.5">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2.5 text-sm border border-ivory-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400 bg-ivory-50 text-charcoal-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1.5">
                  Contact (Optional)
                </label>
                <input
                  type="text"
                  value={reporterContact}
                  onChange={(e) => setReporterContact(e.target.value)}
                  placeholder="Phone or email for follow-up"
                  className="w-full px-3 py-2.5 text-sm border border-ivory-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400 bg-ivory-50 text-charcoal-800"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-charcoal-600 hover:bg-ivory-100 transition-colors border border-ivory-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-950 text-gold-300 text-sm font-semibold border border-gold-500/30 shadow-md disabled:opacity-50 transition-colors"
              >
                {submitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
