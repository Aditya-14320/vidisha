import React from 'react';
import { Link, Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Grid,
  Building2,
  FileCheck,
  Award,
  CreditCard,
  Tag,
  Image as ImageIcon,
  AlertTriangle,
  History as HistoryIcon,
  LogOut,
  ExternalLink,
  Shield,
  Menu,
  X,
  Database
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { currentUser, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // If not admin, redirect to admin login
  if (!isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/admin');
  };

  const navLinks = [
    { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Categories', path: '/admin/categories', icon: Grid },
    { name: 'Businesses', path: '/admin/businesses', icon: Building2 },
    { name: 'Applications', path: '/admin/applications', icon: FileCheck },
    { name: 'Top 10 Slots', path: '/admin/slots', icon: Award },
    { name: 'Payments & Revenue', path: '/admin/payments', icon: CreditCard },
    { name: 'Banner Advertising', path: '/admin/banners', icon: ImageIcon },
    { name: 'Offers & Deals', path: '/admin/offers', icon: Tag },
    { name: 'Database Manager', path: '/admin/database', icon: Database },
    { name: 'Reports & Flagged', path: '/admin/reports', icon: AlertTriangle },
    { name: 'Audit Logs', path: '/admin/audit', icon: HistoryIcon },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Header for Admin */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-amber-400" />
          <span className="font-bold text-sm tracking-tight">Vidisha Admin Console</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300"
          aria-label="Toggle navigation"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static shrink-0 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 border border-gold-500/50 p-0.5 flex items-center justify-center shrink-0">
              <img src="/logo.png" alt="Vidisha City Logo" className="w-full h-full object-contain rounded-full" />
            </div>
            <div>
              <span className="font-black text-white text-base tracking-tight">
                Vidisha<span className="text-amber-400">Admin</span>
              </span>
              <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                Management Portal
              </p>
            </div>
          </div>
          <div className="text-xs text-slate-400 truncate">
            {currentUser?.email || 'portal-admin'}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                  active
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
