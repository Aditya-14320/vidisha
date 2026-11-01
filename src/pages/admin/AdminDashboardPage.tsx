import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  Building2,
  FileCheck,
  Award,
  CreditCard,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  History as HistoryIcon,
  Database,
  Cloud
} from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { PaymentService } from '../../services/paymentService';
import { BannerService } from '../../services/bannerService';
import { isFirebaseConfigured } from '../../lib/firebase';
import { Category, Business, ListingApplication, PaymentRecord, Banner } from '../../types';

export const AdminDashboardPage: React.FC = () => {
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [pendingApps, setPendingApps] = useState<ListingApplication[]>([]);
  const [activePaidCount, setActivePaidCount] = useState(0);
  const [expiringListings, setExpiringListings] = useState<Business[]>([]);
  const [expiredListings, setExpiredListings] = useState<Business[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [activeBannersCount, setActiveBannersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [syncingFirestore, setSyncingFirestore] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ text: string; success: boolean } | null>(null);

  const handleSyncToFirestore = async () => {
    setSyncingFirestore(true);
    setSyncMessage(null);
    try {
      const res = await StorageService.syncSeedToFirestore();
      if (res.success) {
        setSyncMessage({ text: `Successfully synced ${res.count} records (20 official Vidisha categories & platform settings) directly to Cloud Firestore!`, success: true });
      } else {
        setSyncMessage({ text: `Sync status: ${res.error || 'Failed to sync. Please ensure Firestore is created and rules permit write.'}`, success: false });
      }
    } catch (err: any) {
      setSyncMessage({ text: err.message || 'Error communicating with Cloud Firestore', success: false });
    } finally {
      setSyncingFirestore(false);
    }
  };

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const [cats, businesses, apps, payments, expiring, expired, banners] = await Promise.all([
          StorageService.getCategories(),
          StorageService.getBusinesses(),
          StorageService.getApplications(),
          StorageService.getPayments(),
          PaymentService.getExpiringBusinesses(15),
          PaymentService.getExpiredBusinesses(),
          BannerService.getBanners().catch(() => [])
        ]);

        setCategoriesCount(cats.length);
        setApprovedCount(businesses.filter(b => b.approvalStatus === 'approved').length);
        setPendingApps(apps.filter(a => a.status === 'pending'));
        setActivePaidCount(businesses.filter(b => b.paymentStatus === 'paid').length);
        setExpiringListings(expiring);
        setExpiredListings(expired);
        setActiveBannersCount(banners.filter(b => b.status === 'active').length);

        const rev = payments
          .filter(p => p.status === 'verified')
          .reduce((sum, p) => sum + (p.amount || 0), 0);
        setTotalRevenue(rev);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 skeleton-shimmer rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-2xl p-5 skeleton-shimmer" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Categories',
      value: categoriesCount,
      subtext: 'Directory Taxonomies',
      icon: Grid,
      color: 'text-blue-600 bg-blue-50',
      link: '/admin/categories'
    },
    {
      label: 'Approved Businesses',
      value: approvedCount,
      subtext: 'Publicly Visible',
      icon: Building2,
      color: 'text-emerald-600 bg-emerald-50',
      link: '/admin/businesses'
    },
    {
      label: 'Pending Applications',
      value: pendingApps.length,
      subtext: 'Awaiting Verification',
      icon: FileCheck,
      color: 'text-amber-600 bg-amber-50',
      link: '/admin/applications',
      highlight: pendingApps.length > 0
    },
    {
      label: 'Active Paid Listings',
      value: activePaidCount,
      subtext: 'Verified Monetized',
      icon: Award,
      color: 'text-purple-600 bg-purple-50',
      link: '/admin/slots'
    },
    {
      label: 'Expiring in 15 Days',
      value: expiringListings.length,
      subtext: 'Renewal Due Soon',
      icon: Clock,
      color: 'text-rose-600 bg-rose-50',
      link: '/admin/payments',
      highlight: expiringListings.length > 0
    },
    {
      label: 'Expired Listings',
      value: expiredListings.length,
      subtext: 'Slot Vacated',
      icon: AlertTriangle,
      color: 'text-slate-600 bg-slate-100',
      link: '/admin/businesses'
    },
    {
      label: 'Active Banner Ads',
      value: activeBannersCount,
      subtext: 'Paid Banner Slots',
      icon: Sparkles,
      color: 'text-amber-600 bg-amber-50',
      link: '/admin/banners'
    },
    {
      label: 'Total Verified Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      subtext: 'Directory Collections',
      icon: CreditCard,
      color: 'text-emerald-700 bg-emerald-100',
      link: '/admin/payments'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Administrative Control Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time status of businesses, listing applications, Top 10 slots, banner ads, and payments in Vidisha.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/admin/banners"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Manage Banners</span>
          </Link>
          <Link
            to="/admin/payments"
            className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-sm flex items-center space-x-1.5"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Record Payment</span>
          </Link>
          <Link
            to="/admin/applications"
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
          >
            Review Applications ({pendingApps.length})
          </Link>
        </div>
      </div>

      {/* Firebase Live Cloud Status Strip */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-700/60 text-amber-400 flex items-center justify-center shrink-0 border border-blue-500/30">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-white">Firebase Project:</span>
              <code className="bg-blue-950/70 text-amber-300 px-2 py-0.5 rounded font-mono font-bold">
                vidishahub-57555
              </code>
              <span className="inline-flex items-center space-x-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Auto-Synced</span>
              </span>
            </div>
            <p className="text-[11px] text-blue-200 mt-0.5">
              Cloud Firestore & Storage active. Collections automatically synchronize in the background.
            </p>
          </div>
        </div>

        <button
          onClick={handleSyncToFirestore}
          disabled={syncingFirestore}
          className="px-3.5 py-1.5 rounded-xl bg-blue-800/80 hover:bg-blue-700 text-blue-100 font-bold text-xs border border-blue-500/40 shadow-sm transition-all active:scale-95 disabled:opacity-50 shrink-0 flex items-center space-x-1.5"
          title="Force refresh synchronization"
        >
          <Database className="w-3.5 h-3.5" />
          <span>{syncingFirestore ? 'Syncing...' : 'Force Re-sync'}</span>
        </button>
      </div>

      {syncMessage && (
        <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
          syncMessage.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
        }`}>
          <span>{syncMessage.text}</span>
          <button onClick={() => setSyncMessage(null)} className="text-slate-400 hover:text-slate-700 font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link
              key={idx}
              to={stat.link}
              className={`p-5 rounded-2xl bg-white border transition-all hover:shadow-md flex flex-col justify-between ${
                stat.highlight ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500">{stat.label}</span>
                <div className={`p-2 rounded-xl ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-slate-900">{stat.value}</span>
                <p className="text-[11px] text-slate-400 mt-0.5">{stat.subtext}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Alert Strip: Pending Applications */}
      {pendingApps.length > 0 && (
        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <FileCheck className="w-5 h-5 text-amber-600" />
              <h3 className="text-sm font-bold text-amber-950">
                Action Required: {pendingApps.length} Pending Listing Application(s)
              </h3>
            </div>
            <Link
              to="/admin/applications"
              className="text-xs font-bold text-amber-900 hover:underline flex items-center space-x-1"
            >
              <span>Review All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {pendingApps.slice(0, 3).map((app) => (
              <div
                key={app.id}
                className="bg-white p-3 rounded-xl border border-amber-200 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900">{app.businessName}</span>
                  <span className="text-slate-500 ml-2">by {app.ownerName} ({app.locality})</span>
                </div>
                <Link
                  to="/admin/applications"
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
                >
                  Inspect & Approve
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alert Strip: Expiring Listings */}
      {expiringListings.length > 0 && (
        <div className="bg-rose-50 rounded-2xl p-5 border border-rose-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-rose-600" />
              <h3 className="text-sm font-bold text-rose-950">
                Attention: {expiringListings.length} Listing(s) Expiring Within 15 Days
              </h3>
            </div>
            <Link
              to="/admin/payments"
              className="text-xs font-bold text-rose-900 hover:underline flex items-center space-x-1"
            >
              <span>Manage Renewals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {expiringListings.map((biz) => (
              <div
                key={biz.id}
                className="bg-white p-3 rounded-xl border border-rose-200 flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-slate-900">{biz.name}</p>
                  <p className="text-[11px] text-slate-500">Expires: {biz.listingExpiresAt}</p>
                </div>
                <Link
                  to="/admin/payments"
                  className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[11px]"
                >
                  Record Renewal
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/slots"
          className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 mb-1">Top 10 Slot Manager</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Manage strictly 10 paid slots per category, handle queue waitlists, and reorder active rankings.
          </p>
        </Link>

        <Link
          to="/admin/categories"
          className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <Grid className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 mb-1">Categories System</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Create, edit, activate, or reorder all 20 business taxonomy sectors across Vidisha.
          </p>
        </Link>

        <Link
          to="/admin/audit"
          className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3 group-hover:bg-slate-900 group-hover:text-white transition-colors">
            <HistoryIcon className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 mb-1">Audit Trail & Security</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Review detailed, unalterable audit records of all slot changes, approvals, and manual payments.
          </p>
        </Link>
      </div>
    </div>
  );
};
