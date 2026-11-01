import React, { useState, useEffect } from 'react';
import {
  Tag,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  X,
  Pause,
  Play,
  Sparkles,
  Building2,
  ShieldCheck,
  QrCode,
  Search,
  AlertCircle
} from 'lucide-react';
import { Offer, Business, OfferClaim } from '../../types';
import { OfferService } from '../../services/offerService';
import { StorageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';

export const AdminOffersPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [claims, setClaims] = useState<OfferClaim[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'offers' | 'claims'>('offers');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'paused' | 'expired'>('all');
  const [claimSearch, setClaimSearch] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [offerList, bizList, claimList] = await Promise.all([
        OfferService.getAllForAdmin(),
        StorageService.getBusinesses(),
        OfferService.getOfferClaims(),
      ]);
      setOffers(offerList);
      setBusinesses(bizList);
      setClaims(claimList);
    } catch (err: any) {
      console.error('Failed to load admin offer data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (offer: Offer) => {
    if (!window.confirm(`Delete promotion "${offer.title}"?`)) return;
    await OfferService.deleteOffer(offer.id, currentUser?.email || 'admin');
    setMessage(`Offer "${offer.title}" deleted.`);
    loadData();
  };

  const handleTogglePause = async (offer: Offer) => {
    await OfferService.togglePause(offer.id, currentUser?.email || 'admin');
    setMessage(`Offer status updated for "${offer.title}".`);
    loadData();
  };

  const handleConfirmClaim = async (claimRef: string) => {
    const res = await OfferService.confirmRedemption(claimRef, currentUser?.email || 'admin');
    if (res.success) {
      setMessage(`Pass ${claimRef} confirmed as redeemed in-store.`);
      loadData();
    } else {
      setMessage(res.error || 'Failed to confirm pass.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffer) return;

    if (!editingOffer.businessConfirmed) {
      alert('You must confirm that the business has authorized and verified these offer details before publishing.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    let computedStatus: Offer['status'] = editingOffer.status || 'active';
    if (editingOffer.expiryDate < today) {
      computedStatus = 'expired';
    } else if (editingOffer.startDate > today) {
      computedStatus = 'scheduled';
    }

    const offerToSave: Offer = {
      ...editingOffer,
      status: computedStatus,
      approvalStatus: 'approved',
    };

    await OfferService.saveOffer(offerToSave, currentUser?.email || 'admin');
    setMessage(`Offer "${editingOffer.title}" saved successfully.`);
    setEditingOffer(null);
    setShowModal(false);
    loadData();
  };

  const filteredOffers = offers.filter(o => {
    if (filterStatus === 'all') return true;
    return o.status === filterStatus;
  });

  const filteredClaims = claims.filter(c => {
    if (!claimSearch.trim()) return true;
    const q = claimSearch.toLowerCase().trim();
    return (
      c.claimReference.toLowerCase().includes(q) ||
      c.businessName.toLowerCase().includes(q) ||
      c.offerTitle.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Offers & In-Store Promotions
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Administer verified merchant promotional discounts, in-store passes, and redemption records.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={() => {
              const biz = businesses[0];
              const today = new Date().toISOString().split('T')[0];
              const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
              setEditingOffer({
                id: 'off-' + Date.now().toString(36),
                businessId: biz?.id || '',
                businessName: biz?.name || '',
                businessSlug: biz?.slug,
                businessPhone: biz?.phone,
                businessWhatsapp: biz?.whatsapp,
                businessAddress: biz?.address,
                businessLocality: biz?.locality,
                businessMapUrl: biz?.mapUrl,
                isBusinessVerified: biz?.approvalStatus === 'approved',
                categoryId: biz?.categoryId || 'cat-restaurants',
                categoryName: biz?.categoryName || 'Restaurants',
                title: '',
                description: '',
                discountBadge: '10% OFF',
                couponCode: '',
                termsAndConditions: 'Present this offer screen to staff before bill generation. Cannot be combined with other offers.',
                eligibilityConditions: 'Valid on in-store purchases above ₹500',
                minimumSpend: 500,
                eligibleProducts: 'All regular menu items / products',
                startDate: today,
                expiryDate: nextMonth,
                approvalStatus: 'approved',
                status: 'active',
                isSponsored: false,
                businessConfirmed: true,
                redemptionMethod: 'Show this offer pass at the store counter before billing.',
                createdAt: new Date().toISOString()
              });
              setShowModal(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Publish New Offer</span>
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

      {/* Main Tabs: Offers List vs Claim Passes Ledger */}
      <div className="flex border-b border-slate-200 text-xs font-bold space-x-4">
        <button
          onClick={() => setActiveTab('offers')}
          className={`pb-2.5 flex items-center space-x-1.5 border-b-2 transition-colors ${
            activeTab === 'offers'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Active Offer Campaigns ({offers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('claims')}
          className={`pb-2.5 flex items-center space-x-1.5 border-b-2 transition-colors ${
            activeTab === 'claims'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>In-Store Issued Passes ({claims.length})</span>
        </button>
      </div>

      {activeTab === 'offers' ? (
        <>
          {/* Status Filter Tabs */}
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            {(['all', 'active', 'paused', 'expired'] as const).map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl capitalize transition-colors ${
                  filterStatus === st
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {st} ({st === 'all' ? offers.length : offers.filter(o => o.status === st).length})
              </button>
            ))}
          </div>

          {/* Offers Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3.5">Deal & Business</th>
                    <th className="px-4 py-3.5">Discount Badge</th>
                    <th className="px-4 py-3.5">Min. Spend</th>
                    <th className="px-4 py-3.5">Validity Dates</th>
                    <th className="px-4 py-3.5 text-center">Status</th>
                    <th className="px-4 py-3.5 text-center">Merchant Confirmed</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredOffers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                        No promotional offers in this filter.
                      </td>
                    </tr>
                  ) : (
                    filteredOffers.map((offer) => (
                      <tr key={offer.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900">{offer.title}</div>
                          <div className="text-[11px] text-slate-500 flex items-center space-x-1">
                            <Building2 className="w-3 h-3 text-slate-400" />
                            <span>{offer.businessName}</span>
                            {offer.businessLocality && <span>• {offer.businessLocality}</span>}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <span className="font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[11px]">
                            {offer.discountBadge || 'Offer'}
                          </span>
                          {offer.couponCode && (
                            <span className="block text-[10px] text-blue-700 font-mono mt-0.5 font-bold">
                              Code: {offer.couponCode}
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3 font-semibold text-slate-700">
                          {offer.minimumSpend ? `₹${offer.minimumSpend}` : 'None'}
                        </td>

                        <td className="px-4 py-3 text-[11px] text-slate-600">
                          {offer.startDate} to {offer.expiryDate}
                        </td>

                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              offer.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : offer.status === 'paused'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {offer.status}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-center">
                          {offer.businessConfirmed !== false ? (
                            <span className="inline-flex items-center space-x-0.5 text-emerald-700 font-bold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Confirmed</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-0.5 text-amber-700 font-bold text-[11px]">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>Unconfirmed</span>
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              onClick={() => handleTogglePause(offer)}
                              className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-slate-100"
                              title={offer.status === 'paused' ? 'Resume Offer' : 'Pause Offer'}
                            >
                              {offer.status === 'paused' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                            </button>

                            <button
                              onClick={() => {
                                setEditingOffer({ ...offer });
                                setShowModal(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100"
                              title="Edit Offer"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDelete(offer)}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100"
                              title="Delete Offer"
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
        </>
      ) : (
        /* In-Store Passes Ledger */
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={claimSearch}
                onChange={(e) => setClaimSearch(e.target.value)}
                placeholder="Search by pass reference (VC-...), store, or deal..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3.5">Reference Code</th>
                    <th className="px-4 py-3.5">Offer & Store</th>
                    <th className="px-4 py-3.5">Issued At</th>
                    <th className="px-4 py-3.5 text-center">In-Store Status</th>
                    <th className="px-4 py-3.5 text-right">Verification Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredClaims.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                        No in-store passes issued yet.
                      </td>
                    </tr>
                  ) : (
                    filteredClaims.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3">
                          <span className="font-mono font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {c.claimReference}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900">{c.offerTitle}</div>
                          <div className="text-[11px] text-slate-500">{c.businessName}</div>
                        </td>

                        <td className="px-4 py-3 text-slate-600 text-[11px]">
                          {new Date(c.issuedAt).toLocaleString()}
                        </td>

                        <td className="px-4 py-3 text-center">
                          {c.status === 'confirmed_at_store' ? (
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                              Verified at Store
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                              Issued (Awaiting Shop Visit)
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3 text-right">
                          {c.status !== 'confirmed_at_store' ? (
                            <button
                              onClick={() => handleConfirmClaim(c.claimReference)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px]"
                            >
                              Confirm Redemption
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-medium">
                              Confirmed by {c.confirmedBy || 'staff'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Offer Edit/Create Modal */}
      {showModal && editingOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl relative border border-slate-200 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-slate-900 mb-1">
              {editingOffer.id.startsWith('off-') && !offers.some(o => o.id === editingOffer.id)
                ? 'Publish In-Store Promotional Offer'
                : 'Edit Promotional Offer'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              All offers must be confirmed with the merchant prior to publishing.
            </p>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Business Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Associated Business *</label>
                <select
                  required
                  value={editingOffer.businessId}
                  onChange={(e) => {
                    const b = businesses.find(item => item.id === e.target.value);
                    setEditingOffer({
                      ...editingOffer,
                      businessId: e.target.value,
                      businessName: b ? b.name : '',
                      businessSlug: b?.slug,
                      businessPhone: b?.phone,
                      businessWhatsapp: b?.whatsapp,
                      businessAddress: b?.address,
                      businessLocality: b?.locality,
                      businessMapUrl: b?.mapUrl,
                      isBusinessVerified: b?.approvalStatus === 'approved',
                      categoryId: b ? b.categoryId : '',
                      categoryName: b ? b.categoryName : ''
                    });
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.locality})
                    </option>
                  ))}
                </select>
              </div>

              {/* Offer Title */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Offer Title *</label>
                <input
                  type="text"
                  required
                  value={editingOffer.title}
                  onChange={(e) => setEditingOffer({ ...editingOffer, title: e.target.value })}
                  placeholder="e.g. Flat 15% OFF on Family Dinners"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
                />
              </div>

              {/* Discount Badge & Coupon Code */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount Badge (e.g. 15% OFF, FREE GIFT)</label>
                  <input
                    type="text"
                    value={editingOffer.discountBadge || ''}
                    onChange={(e) => setEditingOffer({ ...editingOffer, discountBadge: e.target.value })}
                    placeholder="e.g. 15% OFF"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">In-Store Promo Code (Optional)</label>
                  <input
                    type="text"
                    value={editingOffer.couponCode || ''}
                    onChange={(e) => setEditingOffer({ ...editingOffer, couponCode: e.target.value.toUpperCase() })}
                    placeholder="e.g. FESTIVE15"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Offer Description *</label>
                <textarea
                  rows={2}
                  required
                  value={editingOffer.description}
                  onChange={(e) => setEditingOffer({ ...editingOffer, description: e.target.value })}
                  placeholder="Clear description of the discount or free benefit..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Minimum Spend & Eligible Products */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Minimum Bill Amount (₹)</label>
                  <input
                    type="number"
                    value={editingOffer.minimumSpend || ''}
                    onChange={(e) => setEditingOffer({ ...editingOffer, minimumSpend: Number(e.target.value) || undefined })}
                    placeholder="e.g. 999"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Eligible Products / Services</label>
                  <input
                    type="text"
                    value={editingOffer.eligibleProducts || ''}
                    onChange={(e) => setEditingOffer({ ...editingOffer, eligibleProducts: e.target.value })}
                    placeholder="e.g. All family dine-in meals"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Eligibility Conditions */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Eligibility Conditions</label>
                <input
                  type="text"
                  value={editingOffer.eligibilityConditions || ''}
                  onChange={(e) => setEditingOffer({ ...editingOffer, eligibilityConditions: e.target.value })}
                  placeholder="e.g. Dine-in only (Monday to Thursday)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Validity Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={editingOffer.startDate}
                    onChange={(e) => setEditingOffer({ ...editingOffer, startDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expiry Date *</label>
                  <input
                    type="date"
                    required
                    value={editingOffer.expiryDate}
                    onChange={(e) => setEditingOffer({ ...editingOffer, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Terms and Conditions */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Terms & Conditions *</label>
                <textarea
                  rows={2}
                  required
                  value={editingOffer.termsAndConditions}
                  onChange={(e) => setEditingOffer({ ...editingOffer, termsAndConditions: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingOffer.isSponsored || false}
                    onChange={(e) => setEditingOffer({ ...editingOffer, isSponsored: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300"
                  />
                  <span className="font-bold text-slate-700">Mark as Featured / Sponsored Offer</span>
                </label>

                {/* Mandatory Business Confirmation */}
                <label className="flex items-start space-x-2 cursor-pointer bg-blue-50/60 p-2.5 rounded-xl border border-blue-200">
                  <input
                    type="checkbox"
                    required
                    checked={editingOffer.businessConfirmed || false}
                    onChange={(e) => setEditingOffer({ ...editingOffer, businessConfirmed: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 mt-0.5"
                  />
                  <span className="text-slate-800 text-[11px] leading-relaxed">
                    <strong>Merchant Confirmation:</strong> I verify that the business owner has explicitly approved and confirmed the validity and terms of this in-store offer.
                  </span>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md"
                >
                  Save & Publish Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
