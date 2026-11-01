import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Shield, KeyRound, Lock, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { isFirebaseConfigured } from '../../lib/firebase';

export const AdminLoginPage: React.FC = () => {
  const { loginWithEmail, loginDevAdmin, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passcode, setPasscode] = useState('');
  const [activeTab, setActiveTab] = useState<'passcode' | 'firebase'>(
    isFirebaseConfigured ? 'firebase' : 'passcode'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in, redirect to admin dashboard
  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleFirebaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await loginWithEmail(email, password);
    setLoading(false);
    if (res.success) {
      navigate('/admin/dashboard');
    } else {
      setError(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handlePasscodeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await loginDevAdmin(passcode);
    setLoading(false);
    if (res.success) {
      navigate('/admin/dashboard');
    } else {
      setError(res.error || 'Invalid passcode.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Vidisha City Admin Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Restricted administrative access for listing verification, slot allocation, and directory management.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab switch between Passcode & Firebase */}
        <div className="flex rounded-xl bg-slate-100 p-1 mb-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('passcode')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'passcode'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Passcode Access
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('firebase')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'firebase'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Firebase Auth
          </button>
        </div>

        {activeTab === 'passcode' ? (
          <form onSubmit={handlePasscodeLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Administrative Passcode *
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter administrator passcode"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus-ring"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-snug">
                Initial testing default: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-700 font-mono">Vidisha@Admin2026</code>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Verifying...' : 'Access Admin Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleFirebaseLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@vidishacity.in"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus-ring"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-transform active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In with Firebase'}
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Protected endpoint with server-enforced role claims & audit logging.
          </p>
        </div>
      </div>
    </div>
  );
};
