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
      setError('Please describe the incorrect details or corrections.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Feedback Received
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Thank you for helping keep Vidisha City directory accurate and up to date. Our moderation team will verify this report.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-2 text-amber-600 mb-1">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-lg font-bold text-slate-900">
                Report Incorrect Information
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Reporting for <span className="font-semibold text-slate-800">{business.name}</span>
            </p>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                What seems inaccurate? *
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus-ring bg-slate-50"
              >
                <option value="wrong_phone">Incorrect or unworking phone number</option>
                <option value="closed_down">Business is permanently closed or shifted</option>
                <option value="wrong_address">Inaccurate address or map pin</option>
                <option value="wrong_hours">Operating hours are wrong</option>
                <option value="fraud">Fraudulent listing or unauthorized owner</option>
                <option value="other">Other corrections</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Correction Details *
              </label>
              <textarea
                rows={3}
                required
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Please share correct phone number, address, or details..."
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus-ring"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus-ring"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Phone / Email (Optional)
                </label>
                <input
                  type="text"
                  value={reporterContact}
                  onChange={(e) => setReporterContact(e.target.value)}
                  placeholder="In case we need clarification"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus-ring"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md disabled:opacity-50"
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
