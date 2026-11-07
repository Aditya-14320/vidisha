import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Building2,
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Tag,
  Search,
  Info,
  ExternalLink,
  Plus,
  X
} from 'lucide-react';
import { Category, ListingPackageId, ListingApplication } from '../types';
import { CategoryService } from '../services/categoryService';
import { ApplicationService } from '../services/applicationService';
import { StorageService, DEFAULT_VIDISHA_LOCALITIES } from '../services/storageService';
import { ImageUploadInput } from '../components/common/ImageUploadInput';
import { SEOHead } from '../components/seo/SEOHead';

export const ListBusinessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedCategory = searchParams.get('category') || '';
  const rawPackage = searchParams.get('package');
  const preselectedPackage: ListingPackageId =
    rawPackage === 'priority' ? 'priority' : 'complete';

  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    phone: '',
    whatsapp: '',
    email: '',
    categoryId: preselectedCategory,
    address: '',
    locality: 'Station Road',
    mapUrl: '',
    description: '',
    servicesInput: '',
    openingHours: '09:00 AM - 08:30 PM',
    weeklyOff: 'None',
    websiteUrl: '',
    requestedPackage: preselectedPackage,
    logoUrl: '',
    photo1: '',
    photo2: '',
    photo3: '',
    consentTerms: false,
  });

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submittedApplication, setSubmittedApplication] = useState<ListingApplication | null>(null);

  // Application Tracking state
  const [activeTab, setActiveTab] = useState<'apply' | 'track'>('apply');
  const [trackingQuery, setTrackingQuery] = useState('');
  const [trackingResults, setTrackingResults] = useState<ListingApplication[] | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingQuery.trim()) return;
    setTrackingLoading(true);
    try {
      const results = await ApplicationService.trackApplication(trackingQuery.trim());
      setTrackingResults(results);
    } catch (err) {
      console.error('Failed to track application', err);
      setTrackingResults([]);
    } finally {
      setTrackingLoading(false);
    }
  };

  const [localities, setLocalities] = useState<string[]>(DEFAULT_VIDISHA_LOCALITIES);
  const [isAddingLocality, setIsAddingLocality] = useState(false);
  const [newLocalityInput, setNewLocalityInput] = useState('');

  useEffect(() => {
    StorageService.getLocalities()
      .then(setLocalities)
      .catch(console.warn);
  }, []);

  const handleAddNewLocality = async () => {
    const trimmed = newLocalityInput.trim();
    if (!trimmed) return;
    const res = await StorageService.addCustomLocality(trimmed);
    const canonicalName = res.name;
    setLocalities(prev => {
      if (prev.some(l => l.toLowerCase() === canonicalName.toLowerCase())) {
        return prev;
      }
      const withoutOther = prev.filter(l => l !== 'Other / Outskirts');
      const updated = [...withoutOther, canonicalName].sort((a, b) => a.localeCompare(b));
      return [...updated, 'Other / Outskirts'];
    });
    setFormData(prev => ({ ...prev, locality: canonicalName }));
    setIsAddingLocality(false);
    setNewLocalityInput('');
  };

  useEffect(() => {
    CategoryService.getPublicCategories()
      .then((data) => {
        setCategories(data);
        if (!formData.categoryId && data.length > 0) {
          setFormData((prev) => ({ ...prev, categoryId: preselectedCategory || data[0].id }));
        }
      })
      .finally(() => setLoadingCategories(false));
  }, [preselectedCategory]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.businessName.trim() || formData.businessName.length < 2) {
      setError('Business name is required.');
      return;
    }
    if (!formData.ownerName.trim()) {
      setError('Authorized contact / owner name is required.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setError('Please provide a valid 10-digit mobile phone number.');
      return;
    }
    if (!formData.address.trim()) {
      setError('Full physical address in Vidisha is required.');
      return;
    }

    const selectedCat = categories.find((c) => c.id === formData.categoryId);
    const occupiedSlots = Math.min(10, selectedCat?.businessCount || 0);
    if (occupiedSlots >= 10) {
      setError(`The category "${selectedCat?.name || 'Selected'}" has reached its maximum capacity of 10 businesses. No further registrations can be accepted.`);
      return;
    }

    if (formData.requestedPackage !== 'complete' && formData.requestedPackage !== 'priority') {
      setError('Please select a valid paid listing package (Complete Listing or Priority Listing).');
      return;
    }

    if (!formData.consentTerms) {
      setError('You must agree to the Vidisha City Listing & Verification Policy.');
      return;
    }

    setSubmitting(true);

    try {
      const services = formData.servicesInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const gallery = [formData.photo1, formData.photo2, formData.photo3]
        .map((p) => p.trim())
        .filter(Boolean);

      let formattedMapUrl = formData.mapUrl.trim();
      if (formattedMapUrl && !formattedMapUrl.startsWith('http://') && !formattedMapUrl.startsWith('https://')) {
        formattedMapUrl = 'https://' + formattedMapUrl;
      }

      const res = await ApplicationService.submitApplication({
        businessName: formData.businessName.trim(),
        ownerName: formData.ownerName.trim(),
        phone: formData.phone.trim(),
        whatsapp: formData.whatsapp.trim() || formData.phone.trim(),
        email: formData.email.trim() || undefined,
        categoryId: formData.categoryId,
        locality: formData.locality,
        address: formData.address.trim(),
        mapUrl: formattedMapUrl || undefined,
        description: formData.description.trim(),
        services,
        openingHours: formData.openingHours.trim(),
        weeklyOff: formData.weeklyOff.trim(),
        websiteUrl: formData.websiteUrl.trim() || undefined,
        requestedPackage: formData.requestedPackage,
        logoUrl: formData.logoUrl.trim() || undefined,
        gallery,
        consentTerms: true,
      });

      if (res.success && res.application) {
        setSubmittedApplication(res.application);
      } else {
        setError(res.error || 'Failed to submit application. Please check your inputs.');
      }
    } catch (err: any) {
      setError(err.message || 'Error submitting application');
    } finally {
      setSubmitting(false);
    }
  };

  // SUCCESS SCREEN
  if (submittedApplication) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-white pb-28">
        <div className="bg-[#141418] rounded-3xl p-8 sm:p-10 border border-[#26262e] shadow-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-gold-500 to-gold-600 text-dark-950 flex items-center justify-center mx-auto mb-4 font-bold shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="font-serif text-2xl font-bold text-white mb-2">
            Application Submitted Successfully!
          </h2>
          <p className="text-sm text-[#a1a1aa] mb-6 leading-relaxed font-light">
            Thank you, <span className="font-bold text-white">{submittedApplication.ownerName}</span>. Your listing application for <span className="font-bold text-gold-400">{submittedApplication.businessName}</span> has been received with status <span className="font-bold uppercase text-gold-400 bg-gold-400/10 border border-gold-500/30 px-2 py-0.5 rounded-full text-xs">Pending Approval</span>.
          </p>

          <div className="bg-[#191922] border border-dashed border-[#333342] rounded-2xl p-4 text-left text-xs space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-[#a1a1aa]">Application Reference ID:</span>
              <span className="font-mono font-bold text-gold-400">{submittedApplication.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#a1a1aa]">Requested Package:</span>
              <span className="font-bold text-white capitalize">{submittedApplication.requestedPackage}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#a1a1aa]">Date Submitted:</span>
              <span className="text-[#d4d4d8]">{new Date(submittedApplication.submittedAt).toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-[#1a1a24] border border-gold-500/30 rounded-2xl p-5 text-left text-xs text-[#d4d4d8] mb-8 space-y-2.5 font-light">
            <h4 className="font-bold text-gold-400 text-sm flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span>Next Steps for Verification & Activation</span>
            </h4>
            <p>1. <strong>Application Review:</strong> Our administrative team will review your business details and storefront credentials.</p>
            <p>2. <strong>Payment Instructions:</strong> Our concierge will reach you on WhatsApp or phone at <strong>7000845940</strong> with official payment instructions for your selected package.</p>
            <p>3. <strong>Verification & Activation:</strong> Once verified, your business profile and priority benefits will immediately go live in its category slot.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 text-dark-950 font-bold text-sm shadow-md"
            >
              Back to Home
            </Link>
            <button
              onClick={() => {
                setSubmittedApplication(null);
                setFormData({
                  businessName: '',
                  ownerName: '',
                  phone: '',
                  whatsapp: '',
                  email: '',
                  categoryId: categories[0]?.id || '',
                  address: '',
                  locality: 'Station Road',
                  mapUrl: '',
                  description: '',
                  servicesInput: '',
                  openingHours: '09:00 AM - 08:30 PM',
                  weeklyOff: 'None',
                  websiteUrl: '',
                  requestedPackage: 'complete',
                  logoUrl: '',
                  photo1: '',
                  photo2: '',
                  photo3: '',
                  consentTerms: false,
                });
              }}
              className="px-6 py-3 rounded-full bg-[#1e1e28] text-[#d4d4d8] hover:text-white border border-[#2e2e38] font-semibold text-sm"
            >
              Submit Another Business
            </button>
          </div>
        </div>
      </div>
    );
  }

  // APPLICATION FORM
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 text-white">
      <SEOHead
        title="List Your Business in Vidisha – Free & Priority Vendor Registration | Vidisha City"
        description="Register your shop, clinic, restaurant, or service on Vidisha's official local business discovery portal. Reach local customers with verified listings."
        canonical="/list-your-business"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'List Business', url: '/list-your-business' },
        ]}
      />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-xs font-bold text-gold-400 uppercase tracking-wider">
          Official Merchant Onboarding
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight mt-1 mb-2">
          List Your Business on Vidisha City
        </h1>
        <p className="text-sm text-[#a1a1aa] font-light">
          Connect with local customers across Vidisha. Fill out the application form below for administrative review and activation.
        </p>

        {/* Tab Selection */}
        <div className="flex rounded-full bg-[#141418] border border-[#2a2a34] p-1.5 max-w-md mx-auto mt-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('apply')}
            className={`flex-1 py-2.5 rounded-full transition-all ${
              activeTab === 'apply'
                ? 'bg-gradient-to-r from-gold-400 to-gold-500 text-dark-950 shadow-md'
                : 'text-[#a1a1aa] hover:text-white'
            }`}
          >
            Submit New Listing
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('track')}
            className={`flex-1 py-2.5 rounded-full transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'track'
                ? 'bg-gradient-to-r from-gold-400 to-gold-500 text-dark-950 shadow-md'
                : 'text-[#a1a1aa] hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Track Application Status</span>
          </button>
        </div>
      </div>

      {activeTab === 'track' ? (
        /* APPLICATION TRACKER VIEW */
        <div className="bg-[#141418] rounded-3xl p-6 sm:p-10 border border-[#26262e] shadow-xl space-y-6">
          <div className="max-w-xl mx-auto text-center space-y-2">
            <h2 className="font-serif text-xl font-bold text-white">Track Your Listing Application</h2>
            <p className="text-xs text-[#a1a1aa] font-light">
              Enter the mobile phone number or Application Reference ID you used when submitting your business.
            </p>
          </div>

          <form onSubmit={handleTrackSubmit} className="max-w-md mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#71717a] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={trackingQuery}
                onChange={(e) => setTrackingQuery(e.target.value)}
                placeholder="Phone number or App ID (e.g. 94250... or app-)"
                className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-full border border-[#2e2e38] focus:outline-none focus:border-gold-500 bg-[#1c1c22] text-white placeholder-[#71717a]"
              />
            </div>
            <button
              type="submit"
              disabled={trackingLoading}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-dark-950 font-bold text-xs sm:text-sm shadow-md disabled:opacity-50"
            >
              {trackingLoading ? 'Searching...' : 'Check Status'}
            </button>
          </form>

          {trackingResults !== null && (
            <div className="mt-8 border-t border-[#24242c] pt-6">
              {trackingResults.length === 0 ? (
                <div className="text-center p-8 bg-[#181820] rounded-2xl border border-dashed border-[#333342] text-xs text-[#a1a1aa]">
                  No applications found matching "{trackingQuery}". Please check the phone number or Application ID.
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white">
                    Found {trackingResults.length} Application(s):
                  </h3>

                  {trackingResults.map((app) => (
                    <div
                      key={app.id}
                      className="p-5 rounded-2xl border border-[#26262e] bg-[#181820] text-xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#24242c] pb-3">
                        <div>
                          <h4 className="text-base font-bold text-white">{app.businessName}</h4>
                          <p className="text-[11px] text-[#a1a1aa]">Applicant: {app.ownerName} • {app.locality}, Vidisha</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[#a1a1aa] font-mono text-[11px]">{app.id}</span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                              app.status === 'approved'
                                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                                : app.status === 'pending'
                                ? 'bg-gold-500/20 text-gold-400 border border-gold-500/40'
                                : 'bg-rose-950/60 text-rose-400 border border-rose-500/40'
                            }`}
                          >
                            Status: {app.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[#d4d4d8]">
                        <div><strong className="text-[#a1a1aa]">Phone:</strong> {app.phone}</div>
                        <div><strong className="text-[#a1a1aa]">Requested Package:</strong> <span className="capitalize font-semibold text-gold-400">{app.requestedPackage}</span></div>
                        <div><strong className="text-[#a1a1aa]">Submitted Date:</strong> {new Date(app.submittedAt).toLocaleDateString()}</div>
                        <div><strong className="text-[#a1a1aa]">Address:</strong> {app.address}</div>
                        {app.mapUrl && (
                          <div className="sm:col-span-2 flex items-center space-x-1.5 text-gold-400">
                            <strong className="text-[#a1a1aa]">Google Maps:</strong>
                            <a
                              href={app.mapUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-gold-400 hover:underline inline-flex items-center space-x-1 text-xs truncate max-w-xs sm:max-w-md"
                            >
                              <span className="truncate">{app.mapUrl}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="mt-2 p-3 rounded-xl bg-[#141418] border border-[#2a2a34] text-xs leading-relaxed">
                        {app.status === 'pending' && (
                          <div className="flex items-start space-x-2">
                            <Clock className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-gold-400">Under Administrative Review</p>
                              <p className="text-[#a1a1aa] text-[11px] mt-0.5 font-light">
                                Your application is currently awaiting admin verification. To protect directory authenticity, it will not appear publicly on the website until an administrator verifies the details and confirms payment.
                              </p>
                            </div>
                          </div>
                        )}

                        {app.status === 'approved' && (
                          <div className="flex items-start space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-emerald-400">Application Approved!</p>
                              <p className="text-[#a1a1aa] text-[11px] mt-0.5 font-light">
                                Your business profile has been approved by the administration.
                                {app.adminNotes && ` Note: ${app.adminNotes}`}
                              </p>
                            </div>
                          </div>
                        )}

                        {app.status === 'rejected' && (
                          <div className="flex items-start space-x-2">
                            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-rose-400">Application Not Approved</p>
                              <p className="text-[#a1a1aa] text-[11px] mt-0.5 font-light">
                                Reason: {app.adminNotes || app.rejectionReason || 'Please contact Vidisha City support for details.'}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* APPLICATION SUBMISSION FORM */
        <>
          <div className="mb-6 p-4 bg-[#141418] rounded-2xl border border-gold-500/30 text-xs text-[#d4d4d8] flex items-start space-x-3">
            <Info className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed font-light">
              <p className="font-bold text-gold-400 mb-0.5">How Verification Works on Vidisha City:</p>
              <p>
                To maintain authentic local directory standards and eliminate spam, submissions are recorded with <strong>"Pending"</strong> status and do not appear on the public website immediately. Our admin reviews each application and activates verified profiles upon payment verification. You can track your status anytime under the <strong>"Track Application Status"</strong> tab.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-950/40 text-rose-300 text-sm rounded-2xl border border-rose-500/30 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-[#141418] rounded-3xl p-6 sm:p-10 border border-[#26262e] shadow-xl space-y-8">
            {/* Section 1: Business Identity */}
            <div>
              <h2 className="font-serif text-base font-bold text-white mb-4 pb-2 border-b border-[#24242c] flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-gold-400" />
                <span>1. Business Details</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#d4d4d8] mb-1">
                    Official Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="e.g. Mahavir Cloth Stores, Dr. Sharma Clinic"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#2e2e38] focus:outline-none focus:border-gold-500 bg-[#1c1c22] text-white placeholder-[#71717a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#d4d4d8] mb-1">
                    Owner / Authorized Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    placeholder="e.g. Rakesh Jain"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#2e2e38] focus:outline-none focus:border-gold-500 bg-[#1c1c22] text-white placeholder-[#71717a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#d4d4d8] mb-1">
                    Primary Business Category *
                  </label>
                  <select
                    required
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#2e2e38] focus:outline-none focus:border-gold-500 bg-[#1c1c22] text-white cursor-pointer"
                  >
                    {categories.map((c) => {
                      const occupied = Math.min(10, c.businessCount || 0);
                      const available = Math.max(0, 10 - occupied);
                      const isFull = available === 0;
                      return (
                        <option key={c.id} value={c.id} disabled={isFull} className="bg-[#18181c]">
                          {c.name} {isFull ? '(FULL — 0 of 10 slots left)' : `(${available} of 10 slots available)`}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Contact Information */}
            <div>
              <h2 className="font-serif text-base font-bold text-white mb-4 pb-2 border-b border-[#24242c] flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gold-400" />
                <span>2. Contact Details</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#d4d4d8] mb-1">
                    Calling Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 94250 XXXXX"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#2e2e38] focus:outline-none focus:border-gold-500 bg-[#1c1c22] text-white placeholder-[#71717a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#d4d4d8] mb-1">
                    WhatsApp Business Number
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="For direct customer messages"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#2e2e38] focus:outline-none focus:border-gold-500 bg-[#1c1c22] text-white placeholder-[#71717a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#d4d4d8] mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contact@example.com"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#2e2e38] focus:outline-none focus:border-gold-500 bg-[#1c1c22] text-white placeholder-[#71717a]"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Physical Location in Vidisha */}
            <div>
              <h2 className="font-serif text-base font-bold text-white mb-4 pb-2 border-b border-[#24242c] flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gold-400" />
                <span>3. Vidisha Location & Address</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-[#d4d4d8]">
                      Locality / Area in Vidisha *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingLocality(!isAddingLocality);
                        setNewLocalityInput('');
                      }}
                      className="text-[11px] font-bold text-gold-400 hover:text-gold-300 flex items-center space-x-1 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{isAddingLocality ? 'Select List' : 'Add New Location'}</span>
                    </button>
                  </div>

                  {!isAddingLocality ? (
                    <select
                      name="locality"
                      value={formData.locality}
                      onChange={(e) => {
                        if (e.target.value === '__add_new__') {
                          setIsAddingLocality(true);
                          setNewLocalityInput('');
                        } else {
                          handleChange(e);
                        }
                      }}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#2e2e38] focus:outline-none focus:border-gold-500 bg-[#1c1c22] text-white cursor-pointer"
                    >
                      {localities.map((loc) => (
                        <option key={loc} value={loc} className="bg-[#18181c]">
                          {loc}
                        </option>
                      ))}
                      <option value="__add_new__" className="bg-[#24242e] text-gold-400 font-bold">
                        + Add New Location...
                      </option>
                    </select>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-1.5">
                        <input
                          type="text"
                          autoFocus
                          value={newLocalityInput}
                          onChange={(e) => setNewLocalityInput(e.target.value)}
                          placeholder="Type new locality name..."
                          className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gold-500/60 focus:outline-none focus:border-gold-400 bg-[#1c1c22] text-white placeholder-[#71717a]"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddNewLocality();
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleAddNewLocality}
                          className="px-3.5 py-2.5 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 text-dark-950 font-bold text-xs rounded-xl shadow-md shrink-0"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingLocality(false);
                            setNewLocalityInput('');
                          }}
                          className="p-2.5 text-[#a1a1aa] hover:text-white rounded-xl hover:bg-[#26262e] shrink-0"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[10px] text-[#71717a] font-light">
                        Click "Add" or press Enter to add and select this new locality.
                      </p>
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#d4d4d8] mb-1">
                    Complete Shop / Office Address *
                  </label>
                  <input
                    type="text"
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Shop No., Market Complex, Street landmark, Vidisha"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#2e2e38] focus:outline-none focus:border-gold-500 bg-[#1c1c22] text-white placeholder-[#71717a]"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-[#d4d4d8] mb-1 flex items-center justify-between">
                    <span>Google Maps Location Link</span>
                    <span className="text-[10px] font-normal text-gold-400">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    name="mapUrl"
                    value={formData.mapUrl}
                    onChange={handleChange}
                    placeholder="Paste Google Maps share link here"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#2e2e38] focus:outline-none focus:border-gold-500 bg-[#1c1c22] text-white placeholder-[#71717a]"
                  />
                  <p className="text-[11px] text-[#71717a] mt-1 font-light">
                    Open Google Maps → Select your business location → Share → Copy link.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4: Profile Details & Timings */}
            <div>
              <h2 className="font-serif text-base font-bold text-white mb-4 pb-2 border-b border-[#24242c] flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gold-400" />
                <span>4. Profile & Timings</span>
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#d4d4d8] mb-1">
                    Business Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your business offerings, experience, specialties, and why customers in Vidisha should visit you..."
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#2e2e38] focus:outline-none focus:border-gold-500 bg-[#1c1c22] text-white placeholder-[#71717a]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#d4d4d8] mb-1">
                      Services / Products
                    </label>
                    <input
                      type="text"
                      name="servicesInput"
                      value={formData.servicesInput}
                      onChange={handleChange}
                      placeholder="e.g. Sweets, Thali, Catering"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#2e2e38] focus:outline-none focus:border-gold-500 bg-[#1c1c22] text-white placeholder-[#71717a]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#d4d4d8] mb-1">
                      Working Hours
                    </label>
                    <input
                      type="text"
                      name="openingHours"
                      value={formData.openingHours}
                      onChange={handleChange}
                      placeholder="e.g. 09:00 AM - 08:30 PM"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#2e2e38] focus:outline-none focus:border-gold-500 bg-[#1c1c22] text-white placeholder-[#71717a]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#d4d4d8] mb-1">
                      Weekly Closing Day
                    </label>
                    <input
                      type="text"
                      name="weeklyOff"
                      value={formData.weeklyOff}
                      onChange={handleChange}
                      placeholder="e.g. Sunday or None"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#2e2e38] focus:outline-none focus:border-gold-500 bg-[#1c1c22] text-white placeholder-[#71717a]"
                    />
                  </div>
                </div>

                {/* Photograph Fields conditioned on Selected Package */}
                <div className="space-y-4 p-4 bg-[#181820] rounded-2xl border border-[#2a2a34]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gold-400">
                      Business Photographs & Logo ({formData.requestedPackage === 'complete' ? 'Complete Listing: Up to 2 Photos' : 'Priority Plan: Up to 3 Photos'})
                    </span>
                    <span className="text-[10px] text-[#71717a]">Cloudinary High-Speed Storage</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <ImageUploadInput
                      label="Photograph 1 (Storefront)"
                      value={formData.photo1}
                      onChange={(url) => setFormData((prev) => ({ ...prev, photo1: url }))}
                      folder="vidisha-applications/storefronts"
                      placeholder="Upload storefront image..."
                      recommendedSize="Main photo"
                      darkTheme={true}
                    />

                    <ImageUploadInput
                      label="Photograph 2 (Showroom/Interior)"
                      value={formData.photo2}
                      onChange={(url) => setFormData((prev) => ({ ...prev, photo2: url }))}
                      folder="vidisha-applications/interiors"
                      placeholder="Upload interior display..."
                      recommendedSize="Interior view"
                      darkTheme={true}
                    />

                    {formData.requestedPackage === 'priority' && (
                      <ImageUploadInput
                        label="Photograph 3 (Specialty/Products)"
                        value={formData.photo3}
                        onChange={(url) => setFormData((prev) => ({ ...prev, photo3: url }))}
                        folder="vidisha-applications/specialties"
                        placeholder="Upload featured product..."
                        recommendedSize="Product showcase"
                        darkTheme={true}
                      />
                    )}

                    <ImageUploadInput
                      label="Business Logo (Optional)"
                      value={formData.logoUrl}
                      onChange={(url) => setFormData((prev) => ({ ...prev, logoUrl: url }))}
                      folder="vidisha-applications/logos"
                      placeholder="Upload shop logo..."
                      recommendedSize="Square format"
                      darkTheme={true}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: Requested Package & Commercial Agreement */}
            <div>
              <h2 className="font-serif text-base font-bold text-white mb-4 pb-2 border-b border-[#24242c] flex items-center space-x-2">
                <Tag className="w-4 h-4 text-gold-400" />
                <span>5. Select Listing Package</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* Complete Business Listing */}
                <label
                  className={`p-5 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between ${
                    formData.requestedPackage === 'complete'
                      ? 'border-gold-500 bg-[#1c1c24] shadow-md'
                      : 'border-[#26262e] bg-[#141418] hover:border-[#383844]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-sm">Complete Listing</span>
                      </div>
                      <span className="text-sm font-bold text-white">₹4,000 / year</span>
                    </div>
                    <p className="text-xs text-[#a1a1aa] mb-4 font-light">
                      Full details: phone, WhatsApp, address, maps, hours, description, 2 business photographs & dedicated page.
                    </p>
                  </div>
                  <input
                    type="radio"
                    name="requestedPackage"
                    value="complete"
                    checked={formData.requestedPackage === 'complete'}
                    onChange={handleChange}
                    className="self-start accent-gold-500"
                  />
                </label>

                {/* Priority Business Listing */}
                <label
                  className={`p-5 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    formData.requestedPackage === 'priority'
                      ? 'border-gold-500 bg-[#1f1a10] shadow-[0_0_20px_rgba(212,168,49,0.2)]'
                      : 'border-[#26262e] bg-[#141418] hover:border-[#383844]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-sm">Priority Listing</span>
                        <span className="text-[10px] font-bold bg-gold-500/20 text-gold-400 border border-gold-500/30 px-2 py-0.5 rounded-full uppercase">
                          Max Visibility
                        </span>
                      </div>
                      <span className="text-sm font-bold text-gold-400">₹6,000 / year</span>
                    </div>
                    <p className="text-xs text-[#a1a1aa] mb-4 font-light">
                      Everything in Complete + 3 business photographs, priority category visibility, premium highlighting & one month free offer promotion.
                    </p>
                  </div>
                  <input
                    type="radio"
                    name="requestedPackage"
                    value="priority"
                    checked={formData.requestedPackage === 'priority'}
                    onChange={handleChange}
                    className="self-start accent-gold-500"
                  />
                </label>
              </div>

              {/* Consent Checkbox */}
              <div className="p-4 bg-[#181820] rounded-2xl border border-[#2a2a34] mb-6">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    name="consentTerms"
                    checked={formData.consentTerms}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 accent-gold-500 rounded"
                  />
                  <span className="text-xs text-[#a1a1aa] leading-relaxed font-light">
                    I hereby declare that I am the authorized owner or representative of this business in Vidisha. I understand that submitting this form creates a <span className="font-semibold text-white">pending application</span> that will be displayed publicly only after administrative review and payment verification. I agree to the{' '}
                    <Link to="/listing-policy" target="_blank" className="text-gold-400 underline font-semibold">
                      Listing Policy
                    </Link>{' '}
                    and understand that paid placement is directory advertising and does not guarantee sales.
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-full bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 hover:from-gold-300 hover:to-gold-500 text-dark-950 font-bold text-sm shadow-[0_0_20px_rgba(212,168,49,0.35)] transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <span>{submitting ? 'Submitting Application...' : 'Submit Listing Application'}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ListBusinessPage;
