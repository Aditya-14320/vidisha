import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Lock, AlertCircle, ArrowRight, ShieldCheck, Mail, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLoginPage: React.FC = () => {
  const { loginWithEmail, loginWithGoogle, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    const res = await loginWithGoogle();
    setLoading(false);
    if (res.success) {
      navigate('/admin/dashboard');
    } else {
      setError(res.error || 'Google sign-in failed. Ensure your account is authorized.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl relative overflow-hidden">
        {/* Top accent badge */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-900 border-2 border-gold-500/80 p-1 flex items-center justify-center mx-auto mb-3 shadow-lg">
            <img src="/logo.png" alt="Vidisha City Logo" className="w-full h-full object-contain rounded-full" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Vidisha City Admin Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Restricted portal for verified administrators. All administrative access is authenticated and audited.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleFirebaseLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Admin Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@vidishacity.in"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-900 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Secure Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-900 bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm shadow-md transition-all disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In as Administrator'}</span>
          </button>
        </form>

        <div className="mt-5 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-400 font-semibold tracking-wider">or</span>
          </div>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 active:scale-[0.99] font-bold text-xs text-slate-700 shadow-sm transition-all flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Google Admin</span>
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center flex items-center justify-center space-x-1.5 text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <p className="text-[11px]">
            Server-verified administrator role required for access.
          </p>
        </div>
      </div>
    </div>
  );
};
