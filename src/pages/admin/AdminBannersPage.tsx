import React, { useState, useEffect } from 'react';
import {
  Image,
  Plus,
  CheckCircle2,
  XCircle,
  Pause,
  Play,
  Trash2,
  Edit,
  Download,
  Eye,
  Search,
  Filter,
  CreditCard,
  Calendar,
  AlertTriangle,
  X,
  ExternalLink,
  Save,
  Clock,
  Layers,
  Sparkles,
  Upload,
  Loader2
} from 'lucide-react';
import {
  Banner,
  BannerPackage,
  BannerPlacement,
  BannerStatus
} from '../../types';
import { BannerService } from '../../services/bannerService';
import { useAuth } from '../../context/AuthContext';
import { uploadToCloudinary } from '../../services/cloudinaryService';

function getSafeImageUrl(url?: string): string {
  if (!url) return '';
  const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
  }
  const driveIdMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (url.includes('drive.google.com') && driveIdMatch && driveIdMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveIdMatch[1]}`;
  }
  return url;
}

const PLACEMENT_OPTIONS: { value: BannerPlacement; label: string }[] = [
  { value: 'homepage_hero', label: 'Homepage Hero Banner' },
  { value: 'homepage_mid', label: 'Homepage Mid-Page Banner' },
  { value: 'category', label: 'Category Page Banner' },
  { value: 'offers', label: 'Offers Page Banner' },
  { value: 'mobile_responsive', label: 'Mobile Responsive Banner' },
];

const STATUS_OPTIONS: { value: BannerStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending Review' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'paused', label: 'Paused' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'expired', label: 'Expired' },
  { value: 'refunded', label: 'Refunded' },
];

export const AdminBannersPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [packages, setPackages] = useState<BannerPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BannerStatus | 'all'>('all');
  const [placementFilter, setPlacementFilter] = useState<BannerPlacement | 'all'>('all');

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);

  // Form States (Create / Edit)
  const [formData, setFormData] = useState({
    businessName: '',
    title: '',
    description: '',
    packageId: 'starter',
    placement: 'category' as BannerPlacement,
    imageUrl: '',
    destinationUrl: '',
    startDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
  });

  // Slot conflict warnings
  const [conflicts, setConflicts] = useState<Banner[]>([]);

  // Payment Form States
  const [paymentForm, setPaymentForm] = useState({
    referenceNumber: '',
    paymentMethod: 'upi' as 'upi' | 'bank_transfer' | 'cash' | 'cheque',
    amount: 0,
  });

  // Rejection reason state
  const [rejectionReason, setRejectionReason] = useState('');

  // Editable Packages Form State
  const [editablePackages, setEditablePackages] = useState<BannerPackage[]>([]);
  const [packageSaving, setPackageSaving] = useState(false);

  // Load data
  const loadData = async () => {
    try {
      setLoading(true);
      const expiredCount = await BannerService.autoExpireBanners();
      if (expiredCount > 0) {
        console.info(`[AdminBanners] Auto-expired ${expiredCount} past-due banners.`);
      }

      const [loadedBanners, loadedPackages] = await Promise.all([
        BannerService.getBanners(),
        BannerService.getPackages(),
      ]);

      setBanners(loadedBanners);
      setPackages(loadedPackages);
      setEditablePackages(JSON.parse(JSON.stringify(loadedPackages)));
    } catch (err: any) {
      console.error('Failed to load banner data:', err);
      setMessage({ text: 'Failed to load banner data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Recalculate expiry date whenever start date or package changes
  useEffect(() => {
    const selectedPkg = packages.find((p) => p.id === formData.packageId);
    const duration = selectedPkg ? selectedPkg.durationDays : 7;
    const start = new Date(formData.startDate || new Date());
    start.setDate(start.getDate() + duration);
    const calculatedExpiry = start.toISOString().split('T')[0];
    setFormData((prev) => ({ ...prev, expiryDate: calculatedExpiry }));
  }, [formData.startDate, formData.packageId, packages]);

  // Check conflicts when placement or dates change in modal
  useEffect(() => {
    if ((showCreateModal || showEditModal) && formData.placement && formData.startDate && formData.expiryDate) {
      BannerService.checkSlotConflict(
        formData.placement,
        formData.startDate,
        formData.expiryDate,
        selectedBanner?.id
      ).then((overlapping) => {
        setConflicts(overlapping);
      });
    } else {
      setConflicts([]);
    }
  }, [formData.placement, formData.startDate, formData.expiryDate, showCreateModal, showEditModal, selectedBanner]);

  const [uploadingImage, setUploadingImage] = useState(false);

  // File upload handler to Cloudinary
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const url = await uploadToCloudinary(file, 'vidisha-banners');
      setFormData((prev) => ({ ...prev, imageUrl: url }));
      setMessage({ text: 'Banner image uploaded to Cloudinary successfully!', type: 'success' });
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to upload image.', type: 'error' });
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  // Open Create Modal
  const openCreateModal = () => {
    const defaultPkg = packages[0] || { id: 'starter', durationDays: 7 };
    const today = new Date().toISOString().split('T')[0];
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + defaultPkg.durationDays);

    setFormData({
      businessName: '',
      title: '',
      description: '',
      packageId: defaultPkg.id,
      placement: (defaultPkg.allowedPlacements?.[0] as BannerPlacement) || 'category',
      imageUrl: '',
      destinationUrl: 'https://',
      startDate: today,
      expiryDate: expiry.toISOString().split('T')[0],
    });
    setSelectedBanner(null);
    setShowCreateModal(true);
  };

  // Open Edit Modal
  const openEditModal = (banner: Banner) => {
    setSelectedBanner(banner);
    setFormData({
      businessName: banner.businessName,
      title: banner.title,
      description: banner.description,
      packageId: banner.packageId,
      placement: banner.placement,
      imageUrl: banner.imageUrl,
      destinationUrl: banner.destinationUrl,
      startDate: banner.startDate,
      expiryDate: banner.expiryDate,
    });
    setShowEditModal(true);
  };

  // Submit Create Campaign
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName.trim() || !formData.title.trim()) {
      setMessage({ text: 'Business Name and Title are required.', type: 'error' });
      return;
    }

    try {
      await BannerService.createBannerCampaign({
        businessName: formData.businessName.trim(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        packageId: formData.packageId,
        placement: formData.placement,
        imageUrl: formData.imageUrl.trim(),
        destinationUrl: formData.destinationUrl.trim(),
        startDate: formData.startDate,
        expiryDate: formData.expiryDate,
      });

      setMessage({ text: `Banner campaign "${formData.title}" created successfully!`, type: 'success' });
      setShowCreateModal(false);
      await loadData();
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to create campaign', type: 'error' });
    }
  };

  // Submit Edit Campaign
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBanner) return;

    try {
      await BannerService.saveBanner({
        ...selectedBanner,
        businessName: formData.businessName.trim(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        packageId: formData.packageId,
        placement: formData.placement,
        imageUrl: formData.imageUrl.trim(),
        destinationUrl: formData.destinationUrl.trim(),
        startDate: formData.startDate,
        expiryDate: formData.expiryDate,
      });

      setMessage({ text: `Banner "${formData.title}" updated successfully!`, type: 'success' });
      setShowEditModal(false);
      await loadData();
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to update campaign', type: 'error' });
    }
  };

  // Approve Banner
  const handleApprove = async (banner: Banner) => {
    try {
      const updated = await BannerService.approveBanner(banner.id, currentUser?.email || 'admin');
      setMessage({ text: `Campaign "${banner.title}" status set to ${updated.status}.`, type: 'success' });
      await loadData();
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to approve', type: 'error' });
    }
  };

  // Open Payment Verification Modal
  const openPaymentModal = (banner: Banner) => {
    setSelectedBanner(banner);
    const pkg = packages.find((p) => p.id === banner.packageId);
    setPaymentForm({
      referenceNumber: banner.paymentReference || '',
      paymentMethod: banner.paymentMethod || 'upi',
      amount: banner.amountPaid || (pkg ? pkg.price : 499),
    });
    setShowPaymentModal(true);
  };

  // Submit Payment Verification
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBanner) return;
    if (!paymentForm.referenceNumber.trim()) {
      setMessage({ text: 'Please enter a valid UPI reference or Bank Transaction ID.', type: 'error' });
      return;
    }

    try {
      await BannerService.verifyPayment(
        selectedBanner.id,
        {
          paymentReference: paymentForm.referenceNumber.trim(),
          paymentMethod: paymentForm.paymentMethod,
          amountPaid: Number(paymentForm.amount),
        },
        currentUser?.email || 'admin'
      );

      setMessage({ text: `Payment of ₹${paymentForm.amount} verified for "${selectedBanner.businessName}".`, type: 'success' });
      setShowPaymentModal(false);
      await loadData();
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to verify payment', type: 'error' });
    }
  };

  // Open Rejection Modal
  const openRejectModal = (banner: Banner) => {
    setSelectedBanner(banner);
    setRejectionReason(banner.rejectionReason || '');
    setShowRejectModal(true);
  };

  // Submit Rejection
  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBanner) return;
    if (!rejectionReason.trim()) {
      setMessage({ text: 'Please specify the rejection reason.', type: 'error' });
      return;
    }

    try {
      await BannerService.rejectBanner(
        selectedBanner.id,
        rejectionReason.trim(),
        currentUser?.email || 'admin'
      );
      setMessage({ text: `Campaign "${selectedBanner.title}" rejected.`, type: 'success' });
      setShowRejectModal(false);
      await loadData();
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to reject banner', type: 'error' });
    }
  };

  // Pause Banner
  const handlePause = async (banner: Banner) => {
    try {
      await BannerService.pauseBanner(banner.id, currentUser?.email || 'admin');
      setMessage({ text: `Campaign "${banner.title}" paused.`, type: 'success' });
      await loadData();
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to pause banner', type: 'error' });
    }
  };

  // Resume Banner
  const handleResume = async (banner: Banner) => {
    try {
      const updated = await BannerService.resumeBanner(banner.id, currentUser?.email || 'admin');
      setMessage({ text: `Campaign "${banner.title}" resumed as ${updated.status}.`, type: 'success' });
      await loadData();
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to resume banner', type: 'error' });
    }
  };

  // Delete Banner
  const handleDelete = async (banner: Banner) => {
    if (!window.confirm(`Are you sure you want to permanently delete campaign "${banner.title}"?`)) return;

    try {
      await BannerService.deleteBanner(banner.id);
      setMessage({ text: `Campaign "${banner.title}" deleted.`, type: 'success' });
      await loadData();
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to delete banner', type: 'error' });
    }
  };

  // Save Configured Packages
  const handleSavePackages = async () => {
    try {
      setPackageSaving(true);
      for (const pkg of editablePackages) {
        await BannerService.savePackage(pkg);
      }
      setPackages(JSON.parse(JSON.stringify(editablePackages)));
      setMessage({ text: 'Banner packages pricing and durations updated successfully!', type: 'success' });
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to update packages', type: 'error' });
    } finally {
      setPackageSaving(false);
    }
  };

  // Download Receipt Popup
  const handleDownloadReceipt = (banner: Banner) => {
    const pkg = packages.find((p) => p.id === banner.packageId);
    const receiptHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payment Receipt - ${banner.id}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; background: #fff; }
          .receipt-box { max-width: 650px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #2563eb; padding-bottom: 16px; margin-bottom: 24px; }
          .brand { font-size: 24px; font-weight: 900; color: #1e3a8a; }
          .receipt-title { font-size: 14px; font-weight: bold; color: #64748b; text-transform: uppercase; }
          .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
          .label { color: #64748b; font-weight: 500; }
          .val { font-weight: 700; color: #0f172a; }
          .amount-box { background: #f8fafc; border-radius: 8px; padding: 16px; margin-top: 24px; display: flex; justify-content: space-between; align-items: center; }
          .amount-val { font-size: 22px; font-weight: 900; color: #059669; }
          .footer { margin-top: 32px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px dashed #cbd5e1; padding-top: 16px; }
          @media print { body { padding: 0; } .receipt-box { border: none; box-shadow: none; } }
        </style>
      </head>
      <body>
        <div class="receipt-box">
          <div class="header">
            <div>
              <div class="brand">Vidisha City</div>
              <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Local Business Directory & Advertising</div>
            </div>
            <div style="text-align: right;">
              <div class="receipt-title">Payment Receipt</div>
              <div style="font-size: 12px; font-weight: bold; font-family: monospace; color: #2563eb;">#${banner.id}</div>
            </div>
          </div>

          <div class="row">
            <span class="label">Advertiser / Business:</span>
            <span class="val">${banner.businessName}</span>
          </div>
          <div class="row">
            <span class="label">Campaign Title:</span>
            <span class="val">${banner.title}</span>
          </div>
          <div class="row">
            <span class="label">Package:</span>
            <span class="val">${pkg ? pkg.name : banner.packageId}</span>
          </div>
          <div class="row">
            <span class="label">Placement Slot:</span>
            <span class="val">${banner.placement}</span>
          </div>
          <div class="row">
            <span class="label">Campaign Schedule:</span>
            <span class="val">${banner.startDate} to ${banner.expiryDate}</span>
          </div>
          <div class="row">
            <span class="label">Payment Method:</span>
            <span class="val" style="text-transform: uppercase;">${banner.paymentMethod || 'UPI'}</span>
          </div>
          <div class="row">
            <span class="label">Transaction Reference:</span>
            <span class="val" style="font-family: monospace;">${banner.paymentReference || 'N/A'}</span>
          </div>
          <div class="row">
            <span class="label">Verification Date:</span>
            <span class="val">${new Date(banner.updatedAt).toLocaleDateString('en-IN')}</span>
          </div>

          <div class="amount-box">
            <span style="font-weight: bold; font-size: 15px; color: #334155;">Total Amount Received:</span>
            <span class="amount-val">₹${(banner.amountPaid || (pkg ? pkg.price : 0)).toLocaleString('en-IN')}</span>
          </div>

          <div class="footer">
            <p>Issued by Vidisha City Directory (Contact: 7000845940 • Vidisha, Madhya Pradesh – 464001)</p>
            <p style="margin-top: 4px;">This is an authentic verified manual payment receipt acknowledgement.</p>
          </div>
        </div>
        <script>
          window.print();
        </script>
      </body>
      </html>
    `;
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(receiptHtml);
      win.document.close();
    }
  };

  // Filtered Banners
  const filteredBanners = banners.filter((b) => {
    const matchesSearch =
      b.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesPlacement = placementFilter === 'all' || b.placement === placementFilter;
    return matchesSearch && matchesStatus && matchesPlacement;
  });

  // Summary Metrics
  const activeCount = banners.filter((b) => b.status === 'active').length;
  const pendingCount = banners.filter((b) => b.status === 'pending').length;
  const scheduledCount = banners.filter((b) => b.status === 'scheduled').length;
  const totalRevenue = banners
    .filter((b) => b.amountPaid && b.status !== 'rejected' && b.status !== 'refunded')
    .reduce((sum, b) => sum + (b.amountPaid || 0), 0);

  const getStatusBadge = (status: BannerStatus) => {
    switch (status) {
      case 'active':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800">Active</span>;
      case 'pending':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800">Pending Review</span>;
      case 'scheduled':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-indigo-100 text-indigo-800">Scheduled</span>;
      case 'paused':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-orange-100 text-orange-800">Paused</span>;
      case 'rejected':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-rose-100 text-rose-800">Rejected</span>;
      case 'expired':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-200 text-slate-700">Expired</span>;
      case 'refunded':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-purple-100 text-purple-800">Refunded</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Banner Advertising Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full control over banner campaigns, artwork approval, slot reservations, and manual payment verification.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 self-start sm:self-auto transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Banner Campaign</span>
        </button>
      </div>

      {/* Alert Notification */}
      {message && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between shadow-sm ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-700 ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Total Campaigns</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{banners.length}</p>
          <span className="text-[11px] text-slate-400">{scheduledCount} scheduled</span>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] text-emerald-600 font-semibold uppercase tracking-wider">Active Banners</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">{activeCount}</p>
          <span className="text-[11px] text-slate-400">Live on public pages</span>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] text-amber-600 font-semibold uppercase tracking-wider">Pending Action</span>
          <p className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</p>
          <span className="text-[11px] text-slate-400">Needs review/payment</span>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] text-blue-600 font-semibold uppercase tracking-wider">Verified Revenue</span>
          <p className="text-2xl font-black text-blue-700 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-slate-400">Paid advertising</span>
        </div>
      </div>

      {/* Filters Strip */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search campaigns by business or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <select
            value={placementFilter}
            onChange={(e) => setPlacementFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Placements</option>
            {PLACEMENT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Campaign & Advertiser</th>
                <th className="px-4 py-3.5">Placement Slot</th>
                <th className="px-4 py-3.5">Duration Schedule</th>
                <th className="px-4 py-3.5">Amount & Payment</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-center">Impressions / Clicks</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    Loading banner advertising campaigns...
                  </td>
                </tr>
              ) : filteredBanners.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    No banner campaigns match your filter criteria. Click "New Banner Campaign" to add one.
                  </td>
                </tr>
              ) : (
                filteredBanners.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center space-x-3">
                        {b.imageUrl ? (
                          <img
                            src={getSafeImageUrl(b.imageUrl)}
                            alt=""
                            className="w-12 h-8 rounded-lg object-cover border border-slate-200"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-12 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[10px]">
                            Text
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900 leading-snug">{b.title}</p>
                          <p className="text-[11px] text-slate-500">{b.businessName}</p>
                          <span className="font-mono text-[9px] text-slate-400">ID: {b.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                        {b.placement}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-[11px]">
                        <p className="font-semibold text-slate-700">{b.startDate}</p>
                        <p className="text-slate-400 text-[10px]">to {b.expiryDate}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-[11px]">
                        <p className="font-bold text-slate-900">₹{(b.amountPaid || 0).toLocaleString('en-IN')}</p>
                        {b.paymentReference ? (
                          <span className="text-[10px] text-emerald-600 font-mono">Ref: {b.paymentReference}</span>
                        ) : (
                          <span className="text-[10px] text-amber-600 font-semibold">Unpaid</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {getStatusBadge(b.status)}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="text-[11px] text-slate-600">
                        <span>{b.impressionCount || 0} views</span>
                        <span className="mx-1 text-slate-300">•</span>
                        <span className="font-semibold text-blue-600">{b.clickCount || 0} clicks</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        {/* Status Change Buttons */}
                        {b.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(b)}
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              title="Approve & Activate"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openRejectModal(b)}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100"
                              title="Reject Campaign"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {b.status === 'active' && (
                          <button
                            onClick={() => handlePause(b)}
                            className="p-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100"
                            title="Pause Campaign"
                          >
                            <Pause className="w-4 h-4" />
                          </button>
                        )}

                        {b.status === 'paused' && (
                          <button
                            onClick={() => handleResume(b)}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            title="Resume Campaign"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        )}

                        {/* Payment Verification Button */}
                        <button
                          onClick={() => openPaymentModal(b)}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                          title="Verify / Record Payment"
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>

                        {/* Receipt Download (if paid) */}
                        {b.paymentReference && (
                          <button
                            onClick={() => handleDownloadReceipt(b)}
                            className="p-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100"
                            title="Download Receipt"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        )}

                        {/* Edit Button */}
                        <button
                          onClick={() => openEditModal(b)}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                          title="Edit Campaign"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(b)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                          title="Delete Campaign"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Package Pricing & Duration Configuration Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <span>Configurable Banner Packages</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Admin-configurable introductory launch prices and campaign durations for advertisers.
            </p>
          </div>
          <button
            onClick={handleSavePackages}
            disabled={packageSaving}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition disabled:opacity-50 self-start sm:self-auto"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{packageSaving ? 'Saving...' : 'Save Package Config'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {editablePackages.map((pkg, idx) => (
            <div key={pkg.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div>
                <span className="font-bold text-xs text-slate-900">{pkg.name}</span>
                <p className="text-[10px] text-slate-400 font-mono">id: {pkg.id}</p>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase">Price (₹ INR)</label>
                <input
                  type="number"
                  value={pkg.price}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setEditablePackages((prev) => {
                      const copy = [...prev];
                      copy[idx] = { ...copy[idx], price: val };
                      return copy;
                    });
                  }}
                  className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase">Duration (Days)</label>
                <input
                  type="number"
                  value={pkg.durationDays}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setEditablePackages((prev) => {
                      const copy = [...prev];
                      copy[idx] = { ...copy[idx], durationDays: val };
                      return copy;
                    });
                  }}
                  className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase">Placements Allowed</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {pkg.allowedPlacements.map((p) => (
                    <span key={p} className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-blue-100 text-blue-800">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Create Campaign */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 admin-modal text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-black text-slate-900 text-lg">Create Banner Campaign</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              {/* Conflict warning */}
              {conflicts.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Potential Slot Overlap Detected!</span>
                  </div>
                  <p className="text-[11px]">
                    The following campaign(s) already occupy the <strong>{formData.placement}</strong> slot during this timeframe:
                  </p>
                  <ul className="list-disc list-inside text-[10px] font-medium pl-1">
                    {conflicts.map((c) => (
                      <li key={c.id}>
                        {c.title} ({c.businessName}) — {c.startDate} to {c.expiryDate} [{c.status}]
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Advertiser / Business Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="e.g. Govindam Sweets"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Banner Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Diwali Sweets 20% Off"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description / Tagline</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short engaging promotional text..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Package</label>
                  <select
                    value={formData.packageId}
                    onChange={(e) => setFormData({ ...formData, packageId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                  >
                    {packages.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (₹{p.price} / {p.durationDays}d)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Placement Slot</label>
                  <select
                    value={formData.placement}
                    onChange={(e) => setFormData({ ...formData, placement: e.target.value as BannerPlacement })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                  >
                    {PLACEMENT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 block">Banner Artwork / Image</label>
                  <label className="text-blue-600 hover:text-blue-700 cursor-pointer font-bold flex items-center space-x-1">
                    {uploadingImage ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading to Cloudinary...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload from device (Cloudinary)</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingImage}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: getSafeImageUrl(e.target.value.trim()) })}
                  placeholder="Or paste direct image URL / Google Drive share link..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />

                {/* Live Preview */}
                {formData.imageUrl && (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-2">
                    <div className="flex items-center justify-between mb-1 text-[10px] text-slate-500 font-bold uppercase">
                      <span>Artwork Preview</span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: '' })}
                        className="text-rose-600 hover:text-rose-700"
                      >
                        Remove
                      </button>
                    </div>
                    <img
                      src={getSafeImageUrl(formData.imageUrl)}
                      alt="Banner Preview"
                      className="w-full h-24 object-cover rounded-lg border border-slate-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '';
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Destination URL *</label>
                <input
                  type="url"
                  required
                  value={formData.destinationUrl}
                  onChange={(e) => setFormData({ ...formData, destinationUrl: e.target.value })}
                  placeholder="https://vidishacity.in/business/..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Expiry Date (Auto-calculated)</label>
                  <input
                    type="date"
                    required
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md"
                >
                  Create Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Campaign */}
      {showEditModal && selectedBanner && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 admin-modal text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-black text-slate-900 text-lg">Edit Banner Campaign</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              {conflicts.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Slot Overlap Warning!</span>
                  </div>
                  <ul className="list-disc list-inside text-[10px] font-medium pl-1">
                    {conflicts.map((c) => (
                      <li key={c.id}>{c.title} ({c.businessName}) — {c.startDate} to {c.expiryDate}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Advertiser / Business *</label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Banner Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Placement Slot</label>
                  <select
                    value={formData.placement}
                    onChange={(e) => setFormData({ ...formData, placement: e.target.value as BannerPlacement })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    {PLACEMENT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Destination URL</label>
                  <input
                    type="url"
                    required
                    value={formData.destinationUrl}
                    onChange={(e) => setFormData({ ...formData, destinationUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 block">Banner Artwork / Image</label>
                  <label className="text-blue-600 hover:text-blue-700 cursor-pointer font-bold flex items-center space-x-1">
                    {uploadingImage ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading to Cloudinary...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload from device (Cloudinary)</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingImage}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: getSafeImageUrl(e.target.value.trim()) })}
                  placeholder="Or paste direct image URL / Google Drive share link..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />

                {formData.imageUrl && (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-2">
                    <div className="flex items-center justify-between mb-1 text-[10px] text-slate-500 font-bold uppercase">
                      <span>Artwork Preview</span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: '' })}
                        className="text-rose-600 hover:text-rose-700"
                      >
                        Remove
                      </button>
                    </div>
                    <img
                      src={getSafeImageUrl(formData.imageUrl)}
                      alt="Banner Preview"
                      className="w-full h-24 object-cover rounded-lg border border-slate-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Verify Payment */}
      {showPaymentModal && selectedBanner && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 admin-modal text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-black text-slate-900 text-base">Verify Payment — {selectedBanner.businessName}</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Payment Method</label>
                <select
                  value={paymentForm.paymentMethod}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="upi">UPI (GPay / PhonePe / Paytm)</option>
                  <option value="bank_transfer">Direct Bank Transfer (NEFT/IMPS)</option>
                  <option value="cash">Cash In-Hand</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">UPI Ref / Transaction Reference ID *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 429302194829 or UTR ID"
                  value={paymentForm.referenceNumber}
                  onChange={(e) => setPaymentForm({ ...paymentForm, referenceNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Amount Paid (₹ INR)</label>
                <input
                  type="number"
                  required
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md"
                >
                  Verify & Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Rejection Reason */}
      {showRejectModal && selectedBanner && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 admin-modal text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-black text-rose-700 text-base">Reject Campaign</h3>
              <button onClick={() => setShowRejectModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRejectSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Reason for Rejection *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Inappropriate artwork, unverified business details, or unconfirmed payment..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
