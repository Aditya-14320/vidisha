import React, { useState, useEffect } from 'react';
import {
  Building2,
  Search,
  Filter,
  Download,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  AlertCircle,
  X,
  ExternalLink,
  Plus,
  Save,
  Phone,
  MapPin,
  Tag,
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { Business, Category, ApprovalStatus, PaymentStatus, ListingPackageId } from '../../types';
import { StorageService, DEFAULT_VIDISHA_LOCALITIES } from '../../services/storageService';
import { CategoryService } from '../../services/categoryService';
import { ImageUploadInput } from '../../components/common/ImageUploadInput';

export const AdminBusinessesPage: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editingBiz, setEditingBiz] = useState<Business | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [servicesInput, setServicesInput] = useState('');
  const [photo1, setPhoto1] = useState('');
  const [photo2, setPhoto2] = useState('');
  const [photo3, setPhoto3] = useState('');
  const [photo4, setPhoto4] = useState('');
  const [photo5, setPhoto5] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [saving, setSaving] = useState(false);
  const [localities, setLocalities] = useState<string[]>(DEFAULT_VIDISHA_LOCALITIES);
  const [isAddingLocality, setIsAddingLocality] = useState(false);
  const [showAddLocalityModal, setShowAddLocalityModal] = useState(false);
  const [savingLocality, setSavingLocality] = useState(false);
  const [localityError, setLocalityError] = useState('');
  const [newLocalityInput, setNewLocalityInput] = useState('');

  const loadData = async () => {
    setLoading(true);
    const [bizList, catList, locList] = await Promise.all([
      StorageService.getBusinesses(),
      CategoryService.getAllForAdmin(),
      StorageService.getLocalities(),
    ]);
    setBusinesses(bizList);
    setCategories(catList);
    setLocalities(locList);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredBusinesses = businesses.filter((b) => {
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchName = b.name.toLowerCase().includes(q);
      const matchLoc = b.locality.toLowerCase().includes(q) || b.phone.includes(q);
      if (!matchName && !matchLoc) return false;
    }
    if (categoryFilter && b.categoryId !== categoryFilter) return false;
    if (statusFilter && b.approvalStatus !== statusFilter) return false;
    return true;
  });

  const handleDelete = async (biz: Business) => {
    if (!window.confirm(`Are you sure you want to delete "${biz.name}"? This action cannot be undone.`)) return;
    try {
      await StorageService.deleteBusiness(biz.id);
      setMessage({ text: `Deleted business "${biz.name}" successfully.`, type: 'success' });
      await loadData();
    } catch (err: any) {
      setMessage({ text: `Failed to delete business: ${err.message || 'Database error'}`, type: 'error' });
    }
  };

  const handleOpenAdd = () => {
    const firstCat = categories[0] || { id: 'cat-restaurants', name: 'Restaurants and Cafes', slug: 'restaurants-and-cafes' };
    const newBiz: Business = {
      id: 'biz-' + Date.now().toString(36),
      name: '',
      slug: '',
      categoryId: firstCat.id,
      categoryName: firstCat.name,
      categorySlug: firstCat.slug,
      description: '',
      phone: '',
      whatsapp: '',
      email: '',
      address: '',
      locality: 'Station Road',
      mapUrl: '',
      coverImageUrl: '',
      logoUrl: '',
      gallery: [],
      openingHours: '09:00 AM - 08:30 PM',
      weeklyOff: 'None',
      services: [],
      priceRange: '₹₹',
      approvalStatus: 'approved',
      paymentStatus: 'paid',
      packageId: 'complete',
      listingStartAt: new Date().toISOString(),
      listingExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isTop10: false,
      isSponsored: false,
      viewCount: 0,
      clickCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEditingBiz(newBiz);
    setIsNew(true);
    setServicesInput('');
    setPhoto1('');
    setPhoto2('');
    setPhoto3('');
    setPhoto4('');
    setPhoto5('');
    setIsAddingLocality(false);
    setNewLocalityInput('');
  };

  const handleOpenEdit = (biz: Business) => {
    setEditingBiz({ ...biz });
    setIsNew(false);
    setServicesInput((biz.services || []).join(', '));
    setPhoto1(biz.gallery?.[0] || '');
    setPhoto2(biz.gallery?.[1] || '');
    setPhoto3(biz.gallery?.[2] || '');
    setPhoto4(biz.gallery?.[3] || '');
    setPhoto5(biz.gallery?.[4] || '');
    setIsAddingLocality(false);
    setNewLocalityInput('');
  };

  const handleAddNewLocality = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newLocalityInput.trim();
    if (!trimmed) {
      setLocalityError('Please enter a locality name.');
      return;
    }

    // Check duplicate case-insensitively
    const existing = localities.find(l => l.toLowerCase() === trimmed.toLowerCase());
    if (existing) {
      setLocalityError(`"${existing}" already exists. It has been selected for this listing.`);
      if (editingBiz) {
        setEditingBiz({ ...editingBiz, locality: existing });
      }
      setTimeout(() => {
        setShowAddLocalityModal(false);
        setIsAddingLocality(false);
        setNewLocalityInput('');
        setLocalityError('');
      }, 1200);
      return;
    }

    setSavingLocality(true);
    setLocalityError('');
    try {
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

      if (editingBiz) {
        setEditingBiz(prev => prev ? { ...prev, locality: canonicalName } : null);
      }
      setMessage({ text: `Locality "${canonicalName}" saved permanently in Firebase database.`, type: 'success' });
      setShowAddLocalityModal(false);
      setIsAddingLocality(false);
      setNewLocalityInput('');
    } catch (err: any) {
      setLocalityError(err?.message || 'Failed to save locality.');
    } finally {
      setSavingLocality(false);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBiz) return;

    setSaving(true);
    try {
      const slug = editingBiz.slug || editingBiz.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const services = servicesInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      const gallery = [photo1, photo2, photo3, photo4, photo5].map(p => p.trim()).filter(Boolean);

      let formattedMapUrl = (editingBiz.mapUrl || '').trim();
      if (formattedMapUrl && !formattedMapUrl.startsWith('http://') && !formattedMapUrl.startsWith('https://')) {
        formattedMapUrl = 'https://' + formattedMapUrl;
      }

      // Synchronize category details
      const cat = categories.find(c => c.id === editingBiz.categoryId);

      const toSave: Business = {
        ...editingBiz,
        slug,
        categoryName: cat?.name || editingBiz.categoryName,
        categorySlug: cat?.slug || editingBiz.categorySlug,
        services,
        gallery,
        coverImageUrl: editingBiz.coverImageUrl || gallery[0] || '',
        mapUrl: formattedMapUrl || undefined,
        updatedAt: new Date().toISOString(),
      };

      await StorageService.saveBusiness(toSave);
      setMessage({ text: `${isNew ? 'Added' : 'Updated'} business "${toSave.name}" successfully.`, type: 'success' });
      setEditingBiz(null);
      setIsNew(false);
      await loadData();
    } catch (err: any) {
      setMessage({ text: `Failed to save business: ${err.message || 'Database error'}`, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Name',
      'Category',
      'Locality',
      'Phone',
      'Approval Status',
      'Payment Status',
      'Package',
      'Expires At',
      'Views',
      'Clicks'
    ];

    const rows = filteredBusinesses.map((b) => [
      b.id,
      `"${b.name.replace(/"/g, '""')}"`,
      b.categoryName,
      `"${b.locality}"`,
      b.phone,
      b.approvalStatus,
      b.paymentStatus,
      b.packageId,
      b.listingExpiresAt || '',
      b.viewCount || 0,
      b.clickCount || 0
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vidisha_businesses_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Manage Businesses ({businesses.length})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full directory ledger: add, edit, approve, and manage all local business listings.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center space-x-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Business</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center justify-between ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          <div className="flex items-center space-x-2">
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Row */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, locality..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus-ring"
          />
        </div>

        <div className="w-full md:w-52">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 focus-ring bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-44">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 focus-ring bg-white"
          >
            <option value="">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Business Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Business</th>
                <th className="px-4 py-3.5">Category & Area</th>
                <th className="px-4 py-3.5">Approval</th>
                <th className="px-4 py-3.5">Payment</th>
                <th className="px-4 py-3.5">Package</th>
                <th className="px-4 py-3.5">Expiry</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredBusinesses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    No businesses found matching your criteria. Click "+ Add Business" to create one.
                  </td>
                </tr>
              ) : (
                filteredBusinesses.map((biz) => (
                  <tr key={biz.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                          {biz.name.charAt(0) || 'B'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center space-x-1">
                            <span>{biz.name}</span>
                            <a
                              href={`/business/${biz.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-blue-600"
                              title="Open public profile"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          <div className="text-[11px] text-slate-400">{biz.phone}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-700">{biz.categoryName}</div>
                      <div className="text-[11px] text-slate-400 flex items-center space-x-1.5">
                        <span>{biz.locality}</span>
                        {biz.mapUrl && (
                          <a
                            href={biz.mapUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-500 hover:text-blue-700 inline-flex items-center"
                            title="Open Google Maps location"
                          >
                            <MapPin className="w-3 h-3 text-red-500" />
                          </a>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          biz.approvalStatus === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : biz.approvalStatus === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {biz.approvalStatus}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          biz.paymentStatus === 'paid'
                            ? 'bg-blue-100 text-blue-800'
                            : biz.paymentStatus === 'pending_verification'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {biz.paymentStatus}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="capitalize font-bold text-slate-700">
                        {biz.packageId || 'basic'}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-[11px] text-slate-600">
                      {biz.listingExpiresAt ? (
                        <span className={new Date(biz.listingExpiresAt) < new Date() ? 'text-red-600 font-bold' : ''}>
                          {biz.listingExpiresAt}
                        </span>
                      ) : (
                        <span className="text-slate-400">Forever</span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => handleOpenEdit(biz)}
                          className="p-1.5 text-slate-600 hover:text-blue-600 rounded-lg hover:bg-slate-100"
                          title="Edit profile & status"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(biz)}
                          className="p-1.5 text-slate-600 hover:text-red-600 rounded-lg hover:bg-slate-100"
                          title="Delete listing"
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

      {/* Add / Edit Modal */}
      {editingBiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 max-h-[92vh] overflow-y-auto admin-modal text-slate-900">
            <button
              onClick={() => setEditingBiz(null)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5 pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {isNew ? 'Add New Business Listing' : `Edit Business: ${editingBiz.name}`}
              </h3>
              <p className="text-xs text-slate-500">
                All changes are saved directly to the database and reflected in the live directory.
              </p>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-5 text-xs">
              {/* Section 1: Business Details */}
              <div className="space-y-3">
                <h4 className="font-bold text-blue-900 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>1. General Information</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Business Name *</label>
                    <input
                      type="text"
                      required
                      value={editingBiz.name}
                      onChange={(e) => setEditingBiz({ ...editingBiz, name: e.target.value })}
                      placeholder="e.g. Govindam Pure Veg Restaurant"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus-ring"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Category *</label>
                    <select
                      value={editingBiz.categoryId}
                      onChange={(e) => {
                        const sel = categories.find(c => c.id === e.target.value);
                        setEditingBiz({
                          ...editingBiz,
                          categoryId: e.target.value,
                          categoryName: sel?.name || editingBiz.categoryName,
                          categorySlug: sel?.slug || editingBiz.categorySlug,
                        });
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus-ring bg-white"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold text-slate-700">Locality in Vidisha *</label>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddLocalityModal(true);
                          setNewLocalityInput('');
                          setLocalityError('');
                        }}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add New Location</span>
                      </button>
                    </div>

                    <select
                      value={editingBiz.locality}
                      onChange={(e) => {
                        if (e.target.value === '__add_new__') {
                          setShowAddLocalityModal(true);
                          setNewLocalityInput('');
                          setLocalityError('');
                        } else {
                          setEditingBiz({ ...editingBiz, locality: e.target.value });
                        }
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus-ring bg-white"
                    >
                      {localities.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                      <option value="__add_new__" className="font-bold text-blue-600 bg-blue-50">
                        + Add New Location
                      </option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Full Physical Address *</label>
                    <input
                      type="text"
                      required
                      value={editingBiz.address}
                      onChange={(e) => setEditingBiz({ ...editingBiz, address: e.target.value })}
                      placeholder="Shop No., Market, Landmark, Vidisha"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus-ring"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                      <span>Google Maps Location Link</span>
                      <span className="text-[11px] font-normal text-slate-400">(Optional)</span>
                    </label>
                    <input
                      type="url"
                      value={editingBiz.mapUrl || ''}
                      onChange={(e) => setEditingBiz({ ...editingBiz, mapUrl: e.target.value })}
                      placeholder="Paste Google Maps share link here"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus-ring"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Open Google Maps → Select your business location → Share → Copy link.
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Description *</label>
                    <textarea
                      rows={3}
                      required
                      value={editingBiz.description}
                      onChange={(e) => setEditingBiz({ ...editingBiz, description: e.target.value })}
                      placeholder="Describe the business offerings, experience, specialties..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus-ring"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Custom URL Slug (Optional)</label>
                    <input
                      type="text"
                      value={editingBiz.slug}
                      onChange={(e) => setEditingBiz({ ...editingBiz, slug: e.target.value })}
                      placeholder="e.g. govindam-sweets"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus-ring"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Contact Details */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="font-bold text-blue-900 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <span>2. Contact & Connectivity</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={editingBiz.phone}
                      onChange={(e) => setEditingBiz({ ...editingBiz, phone: e.target.value })}
                      placeholder="07592... or +91 94250..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus-ring"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">WhatsApp Number</label>
                    <input
                      type="text"
                      value={editingBiz.whatsapp}
                      onChange={(e) => setEditingBiz({ ...editingBiz, whatsapp: e.target.value })}
                      placeholder="919425012345"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus-ring"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={editingBiz.email || ''}
                      onChange={(e) => setEditingBiz({ ...editingBiz, email: e.target.value })}
                      placeholder="contact@business.in"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus-ring"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block font-bold text-slate-700 mb-1">Website URL (Optional)</label>
                    <input
                      type="url"
                      value={editingBiz.websiteUrl || ''}
                      onChange={(e) => setEditingBiz({ ...editingBiz, websiteUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus-ring"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Timings & Offerings */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="font-bold text-blue-900 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                  <Tag className="w-3.5 h-3.5 text-blue-600" />
                  <span>3. Timings & Services</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Working Hours</label>
                    <input
                      type="text"
                      value={typeof editingBiz.openingHours === 'string' ? editingBiz.openingHours : '09:00 AM - 08:30 PM'}
                      onChange={(e) => setEditingBiz({ ...editingBiz, openingHours: e.target.value })}
                      placeholder="e.g. 09:00 AM - 09:00 PM"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus-ring"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Weekly Off Day</label>
                    <input
                      type="text"
                      value={editingBiz.weeklyOff || 'None'}
                      onChange={(e) => setEditingBiz({ ...editingBiz, weeklyOff: e.target.value })}
                      placeholder="e.g. Sunday or Tuesday or None"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus-ring"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">
                      Services / Products (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={servicesInput}
                      onChange={(e) => setServicesInput(e.target.value)}
                      placeholder="e.g. Pure Veg Thali, Home Delivery, Banquet Hall, AC Dining"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus-ring"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Photographs & Media */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="font-bold text-blue-900 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span>4. Photographs & Media (Cloudinary Hosted)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <ImageUploadInput
                    label="Cover / Main Image"
                    value={editingBiz.coverImageUrl || ''}
                    onChange={(url) => setEditingBiz({ ...editingBiz, coverImageUrl: url })}
                    folder="vidisha-businesses/covers"
                    recommendedSize="Recommended: 1200x800 px"
                  />

                  <ImageUploadInput
                    label="Business Logo (Optional)"
                    value={editingBiz.logoUrl || ''}
                    onChange={(url) => setEditingBiz({ ...editingBiz, logoUrl: url })}
                    folder="vidisha-businesses/logos"
                    recommendedSize="Recommended: 400x400 px"
                  />

                  <div className="sm:col-span-2 space-y-2 pt-1">
                    <label className="block font-bold text-slate-700 text-xs">
                      Gallery Photos (Up to 5 Photos)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      <ImageUploadInput
                        label="Gallery Photo 1"
                        value={photo1}
                        onChange={(url) => setPhoto1(url)}
                        folder="vidisha-businesses/gallery"
                        recommendedSize="Storefront / Exterior"
                      />

                      <ImageUploadInput
                        label="Gallery Photo 2"
                        value={photo2}
                        onChange={(url) => setPhoto2(url)}
                        folder="vidisha-businesses/gallery"
                        recommendedSize="Interior / Ambience"
                      />

                      <ImageUploadInput
                        label="Gallery Photo 3"
                        value={photo3}
                        onChange={(url) => setPhoto3(url)}
                        folder="vidisha-businesses/gallery"
                        recommendedSize="Specialty / Products"
                      />

                      <ImageUploadInput
                        label="Gallery Photo 4"
                        value={photo4}
                        onChange={(url) => setPhoto4(url)}
                        folder="vidisha-businesses/gallery"
                        recommendedSize="Team / Menu / Offerings"
                      />

                      <ImageUploadInput
                        label="Gallery Photo 5"
                        value={photo5}
                        onChange={(url) => setPhoto5(url)}
                        folder="vidisha-businesses/gallery"
                        recommendedSize="Facility / Additional View"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 5: Admin & Commercial Status */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="font-bold text-blue-900 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                  <Award className="w-3.5 h-3.5 text-blue-600" />
                  <span>5. Admin & Package Status</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Approval Status</label>
                    <select
                      value={editingBiz.approvalStatus}
                      onChange={(e) => setEditingBiz({ ...editingBiz, approvalStatus: e.target.value as ApprovalStatus })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus-ring bg-white"
                    >
                      <option value="approved">Approved (Public)</option>
                      <option value="pending">Pending Review</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Payment Status</label>
                    <select
                      value={editingBiz.paymentStatus}
                      onChange={(e) => setEditingBiz({ ...editingBiz, paymentStatus: e.target.value as PaymentStatus })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus-ring bg-white"
                    >
                      <option value="paid">Paid</option>
                      <option value="unpaid">Unpaid</option>
                      <option value="pending_verification">Pending Verification</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Package</label>
                    <select
                      value={editingBiz.packageId}
                      onChange={(e) => setEditingBiz({ ...editingBiz, packageId: e.target.value as ListingPackageId })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus-ring bg-white font-semibold"
                    >
                      <option value="complete">Complete Listing (₹4,000 / Year)</option>
                      <option value="priority">Priority Listing (₹6,000 / Year)</option>
                      {editingBiz.packageId === 'basic' && (
                        <option value="basic" disabled>Basic (Legacy Discontinued)</option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Listing Expiry Date</label>
                    <input
                      type="date"
                      value={editingBiz.listingExpiresAt ? editingBiz.listingExpiresAt.split('T')[0] : ''}
                      onChange={(e) => setEditingBiz({ ...editingBiz, listingExpiresAt: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus-ring"
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-6">
                    <input
                      type="checkbox"
                      id="isTop10Check"
                      checked={editingBiz.isTop10 || false}
                      onChange={(e) => setEditingBiz({ ...editingBiz, isTop10: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                    <label htmlFor="isTop10Check" className="font-bold text-slate-700 cursor-pointer">
                      Top 10 Category Placement
                    </label>
                  </div>

                  <div className="flex items-center space-x-2 pt-6">
                    <input
                      type="checkbox"
                      id="isSponsoredCheck"
                      checked={editingBiz.isSponsored || false}
                      onChange={(e) => setEditingBiz({ ...editingBiz, isSponsored: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                    <label htmlFor="isSponsoredCheck" className="font-bold text-slate-700 cursor-pointer">
                      Sponsored Featured Flag
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingBiz(null)}
                  className="px-4 py-2.5 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-md transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : (isNew ? 'Create Business' : 'Save Changes')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Locality Modal */}
      {showAddLocalityModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-slate-200 admin-modal text-slate-900">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Add New Location in Vidisha</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowAddLocalityModal(false);
                  setNewLocalityInput('');
                  setLocalityError('');
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Enter the new locality or neighborhood name. It will be saved permanently in Firebase Firestore and automatically selected for this business.
            </p>

            {localityError && (
              <div className="mb-3.5 p-2.5 rounded-xl bg-red-50 text-red-700 text-xs flex items-center space-x-2 border border-red-200">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{localityError}</span>
              </div>
            )}

            <form onSubmit={handleAddNewLocality} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Locality Name *
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={newLocalityInput}
                  onChange={(e) => {
                    setNewLocalityInput(e.target.value);
                    setLocalityError('');
                  }}
                  placeholder="e.g. Mukharji Nagar, Shastri Nagar"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus-ring"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddLocalityModal(false);
                    setNewLocalityInput('');
                    setLocalityError('');
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingLocality || !newLocalityInput.trim()}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md disabled:opacity-50 flex items-center space-x-1"
                >
                  {savingLocality ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Location</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
