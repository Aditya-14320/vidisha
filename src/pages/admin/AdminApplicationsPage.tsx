import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  Building2,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  ExternalLink,
  RotateCw
} from 'lucide-react';
import { ListingApplication } from '../../types';
import { ApplicationService } from '../../services/applicationService';
import { useAuth } from '../../context/AuthContext';

export const AdminApplicationsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState<ListingApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<ListingApplication | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const loadApplications = async () => {
    setLoading(true);
    const data = await ApplicationService.getApplications();
    setApplications(data);
    setLoading(false);
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleApprove = async (app: ListingApplication) => {
    if (!window.confirm(`Approve application for "${app.businessName}" and generate business profile?`)) return;

    try {
      const biz = await ApplicationService.convertToBusiness(app, currentUser?.email || 'admin');
      setMessage(`Application approved! Business created with ID ${biz.id}. Now awaiting manual payment verification.`);
      loadApplications();
    } catch (err: any) {
      setMessage(`Error approving application: ${err.message}`);
    }
  };

  const handleReject = async () => {
    if (!selectedApp) return;
    await ApplicationService.updateStatus(
      selectedApp.id,
      'rejected',
      rejectReason || 'Application rejected by administration.',
      currentUser?.email || 'admin'
    );
    setMessage(`Application "${selectedApp.businessName}" rejected.`);
    setShowRejectModal(false);
    setSelectedApp(null);
    setRejectReason('');
    loadApplications();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Listing Applications
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review submissions from Vidisha storefronts and onboard approved businesses.
          </p>
        </div>

        <button
          onClick={loadApplications}
          className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 shadow-sm flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 text-xs font-bold">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => {
          const count = st === 'all'
            ? applications.length
            : applications.filter(a => a.status === st).length;
          return (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-2 rounded-xl transition-all capitalize ${
                filterStatus === st
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st} ({count})
            </button>
          );
        })}
      </div>

      {message && (
        <div className="p-3 bg-blue-50 text-blue-800 border border-blue-200 rounded-xl text-xs font-semibold flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Applications List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No listing applications submitted yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {applications
              .filter(app => filterStatus === 'all' || app.status === filterStatus)
              .map((app) => (
              <div key={app.id} className="p-5 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-bold text-slate-900">{app.businessName}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        app.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {app.status}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold capitalize">
                      Package: {app.requestedPackage}
                    </span>
                  </div>

                  <div className="text-slate-600 flex flex-wrap gap-x-4 gap-y-1 items-center">
                    <span><strong>Applicant:</strong> {app.ownerName}</span>
                    <span><strong>Phone:</strong> {app.phone}</span>
                    <span><strong>Area:</strong> {app.locality}</span>
                    <span><strong>Submitted:</strong> {new Date(app.submittedAt).toLocaleDateString()}</span>
                    {app.mapUrl && (
                      <a
                        href={app.mapUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center space-x-1"
                        title="Open applicant's Google Maps link"
                      >
                        <MapPin className="w-3.5 h-3.5 text-red-500" />
                        <span>Map Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <p className="text-slate-500 line-clamp-1 max-w-xl">
                    {app.description}
                  </p>

                  {app.adminNotes && (
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-700 text-[11px]">
                      <strong>Admin Note:</strong> {app.adminNotes}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 shrink-0">
                  {app.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(app)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve & Onboard</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setShowRejectModal(true);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 font-bold border border-red-200 flex items-center space-x-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </>
                  )}

                  {app.status === 'approved' && (
                    <span className="text-emerald-600 font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Converted</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Reason Modal */}
      {showRejectModal && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200 admin-modal text-slate-900">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Reject Application: {selectedApp.businessName}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Please document the reason for rejection (e.g. invalid phone number, outside Vidisha jurisdiction).
            </p>

            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus-ring mb-4"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 font-bold text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 font-bold text-xs text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
