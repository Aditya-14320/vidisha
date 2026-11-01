import React, { useState, useEffect } from 'react';
import { History as HistoryIcon, Shield, Clock, FileText } from 'lucide-react';
import { AuditLog } from '../../types';
import { AuditService } from '../../services/auditService';

export const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AuditService.getAuditLogs()
      .then(setLogs)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
          <span>Security Audit Trail</span>
          <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
            Tamper Evident
          </span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Chronological record of all administrative actions: Top 10 slot allocations, approvals, and verified payments.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Timestamp</th>
                <th className="px-4 py-3.5">Action</th>
                <th className="px-4 py-3.5">Target & Context</th>
                <th className="px-4 py-3.5">Performed By</th>
                <th className="px-4 py-3.5">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">Loading audit records...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">No audit events recorded yet.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded uppercase text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{log.targetName || log.targetId}</div>
                      <div className="text-[10px] uppercase text-slate-400 font-semibold">{log.targetType}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-700">{log.performedBy}</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-600 max-w-xs truncate">
                      {log.details ? JSON.stringify(log.details) : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
