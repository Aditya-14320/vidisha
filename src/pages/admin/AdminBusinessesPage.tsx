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
import { StorageService } from '../../services/storageService';
import { CategoryService } from '../../services/categoryService';

const VIDISHA_LOCALITIES = [
  'Station Road',
  'Civil Lines',
  'Bada Bazar',
  'Madhavganj',
  'Durga Nagar',
  'Khariphatak',
  'Sherpura',
  'Tilak Chowk',
  'Ahmedpur Road',
  'Venkatesh Market',
  'Neem Tal',
  'Sanchi Road',
  'Collectorate Circle',
  'Other / Outskirts'
];

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
  const [message, setMessage] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const [bizList, catList] = await Promise.all([
      StorageService.getBusinesses(),
      CategoryService.getAllForAdmin(),
    ]);
    setBusinesses(bizList);
    setCategories(catList);
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
    await StorageService.deleteBusiness(biz.id);
    setMessage(`Deleted business "${biz.name}"`);
    loadData();
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
  };

  const handleOpenEdit = (biz: Business) => {
    setEditingBiz({ ...biz });
    setIsNew(false);
    setServicesInput((biz.services || []).join(', '));
    setPhoto1(biz.gallery?.[0] || '');
    setPhoto2(biz.gallery?.[1] || '');
    setPhoto3(biz.gallery?.[2] || '');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBiz) return;

    const slug = editingBiz.slug || editingBiz.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const services = servicesInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    const gallery = [photo1, photo2, photo3].map(p => p.trim()).filter(Boolean);

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
      updatedAt: new Date().toISOString(),
    };

    await StorageService.saveBusiness(toSave);
    setMessage(`${isNew ? 'Added' : 'Updated'} business "${toSave.name}" successfully.`);
    setEditingBiz(null);
    setIsNew(false);
    loadData();
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
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center justify-between">
          <span>{message}</span>
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
                      <div className="text-[11px] text-slate-400">{biz.locality}</div>
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
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 max-h-[92vh] overflow-y-auto">
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
                    <label className="block font-bold text-slate-700 mb-1">Locality in Vidisha *</label>
                    <select
                      value={editingBiz.locality}
                      onChange={(e) => setEditingBiz({ ...editingBiz, locality: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus-ring bg-white"
                    >
                      {VIDISHA_LOCALITIES.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
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

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Price Range</label>
                    <select
                      value={editingBiz.priceRange || '₹₹'}
                      onChange={(e) => setEditingBiz({ ...editingBiz, priceRange: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus-ring bg-white"
                    >
                      <option value="₹">₹ - Budget / Affordable</option>
                      <option value="₹₹">₹₹ - Moderate / Family</option>
                      <option value="₹₹₹">₹₹₹ - Premium</option>
                      <option value="₹₹₹₹">₹₹₹₹ - Luxury</option>
                    </select>
                  </div>

                  <div>
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
                  <span>4. Photographs & Media URLs</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Cover / Main Image URL</label>
                    <input
                      type="url"
                      value={editingBiz.coverImageUrl || ''}
                      onChange={(e) => setEditingBiz({ ...editingBiz, coverImageUrl: e.target.value })}
                      placeholder="https://... (main photo)"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus-ring"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Logo URL (Optional)</label>
                    <input
                      type="url"
                      value={editingBiz.logoUrl || ''}
                      onChange={(e) => setEditingBiz({ ...editingBiz, logoUrl: e.target.value })}
                      placeholder="https://... (logo)"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus-ring"
                    />
                  </div>

                  <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Gallery Photo 1</label>
                      <input
                        type="url"
                        value={photo1}
                        onChange={(e) => setPhoto1(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Gallery Photo 2</label>
                      <input
                        type="url"
                        value={photo2}
                        onChange={(e) => setPhoto2(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Gallery Photo 3</label>
                      <input
                        type="url"
                        value={photo3}
                        onChange={(e) => setPhoto3(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 focus-ring"
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
                  className="px-6 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{isNew ? 'Create Business' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
