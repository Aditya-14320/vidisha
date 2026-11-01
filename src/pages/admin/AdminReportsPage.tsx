import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, XCircle, Clock, ExternalLink } from 'lucide-react';
import { ReportItem } from '../../types';
import { ReportService } from '../../services/reportService';

export const AdminReportsPage: React.FC = () => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    setLoading(true);
    const data = await ReportService.getAllReports();
    setReports(data);
    setLoading(false);
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleStatusChange = async (reportId: string, status: ReportItem['status']) => {
    await ReportService.updateReportStatus(reportId, status, `Updated by admin on ${new Date().toLocaleDateString()}`);
    loadReports();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
          <span>Inaccuracy Reports & Corrections</span>
          <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
            {reports.filter(r => r.status === 'open').length} Open
          </span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Public submissions reporting wrong phone numbers, closed businesses, or map discrepancies.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading feedback reports...</div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No inaccurate information reports filed by the public. All directory listings in good standing.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {reports.map((rep) => (
              <div key={rep.id} className="p-5 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">{rep.businessName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                      Issue: {rep.issueType.replace('_', ' ')}
                    </span>
                    <span className="text-slate-400 text-[11px]">{new Date(rep.createdAt).toLocaleString()}</span>
                  </div>

                  <p className="text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 leading-relaxed max-w-2xl">
                    "{rep.details}"
                  </p>

                  <div className="text-[11px] text-slate-500">
                    Reported by: <span className="font-medium text-slate-700">{rep.reporterName || 'Anonymous Citizen'}</span>
                    {rep.reporterContact && <span> ({rep.reporterContact})</span>}
                  </div>
                </div>

                {/* Status action buttons */}
                <div className="flex items-center space-x-2 shrink-0">
                  {rep.status !== 'resolved' ? (
                    <button
                      onClick={() => handleStatusChange(rep.id, 'resolved')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Resolved</span>
                    </button>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px]">
                      Resolved
                    </span>
                  )}

                  {rep.status !== 'dismissed' && (
                    <button
                      onClick={() => handleStatusChange(rep.id, 'dismissed')}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
