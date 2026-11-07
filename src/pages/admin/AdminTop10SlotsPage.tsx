import React, { useState, useEffect } from 'react';
import {
  Award,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  Trash2,
  Plus,
  Clock,
  AlertCircle,
  Users,
  X,
  ExternalLink
} from 'lucide-react';
import { Category, Business, Top10Slot } from '../../types';
import { CategoryService } from '../../services/categoryService';
import { SlotService } from '../../services/slotService';
import { StorageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';

export const AdminTop10SlotsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [slots, setSlots] = useState<Top10Slot[]>([]);
  const [waitlist, setWaitlist] = useState<Business[]>([]);
  const [eligibleBusinesses, setEligibleBusinesses] = useState<Business[]>([]);
  const [assigningSlot, setAssigningSlot] = useState<number | null>(null);
  const [selectedBizId, setSelectedBizId] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(true);

  // Default expiry date: 1 year from now
  const defaultNextYear = () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
  };

  useEffect(() => {
    CategoryService.getAllForAdmin().then((cats) => {
      setCategories(cats);
      if (cats.length > 0) {
        setSelectedCategory(cats[0].id);
      }
    });
  }, []);

  const loadSlotData = async (catId: string) => {
    if (!catId) return;
    setLoading(true);
    try {
      const [catSlots, waitlisted, allBiz] = await Promise.all([
        SlotService.getCategorySlots(catId),
        SlotService.getWaitlistedBusinesses(catId),
        StorageService.getBusinesses()
      ]);

      setSlots(catSlots);
      setWaitlist(waitlisted);

      // Eligible businesses: approved and paid in this category
      const eligible = allBiz.filter(b =>
        b.categoryId === catId &&
        b.approvalStatus === 'approved' &&
        b.paymentStatus === 'paid'
      );
      setEligibleBusinesses(eligible);
    } catch (err) {
      console.error('Failed to load slots', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      loadSlotData(selectedCategory);
    }
  }, [selectedCategory]);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningSlot || !selectedBizId || !selectedCategory) return;

    const biz = eligibleBusinesses.find(b => b.id === selectedBizId);
    if (!biz) {
      setMessage({ text: 'Selected business was not found in eligible list.', type: 'error' });
      return;
    }

    const exp = expiryDate || defaultNextYear();
    const res = await SlotService.assignSlot(
      selectedCategory,
      assigningSlot,
      biz,
      exp,
      currentUser?.email || 'admin'
    );

    if (res.success) {
      setMessage({ text: res.message, type: 'success' });
      setAssigningSlot(null);
      setSelectedBizId('');
      loadSlotData(selectedCategory);
    } else {
      setMessage({ text: res.message, type: 'error' });
    }
  };

  const handleVacate = async (slotNumber: number) => {
    if (!window.confirm(`Are you sure you want to vacate slot #${slotNumber}? The business will lose Top 10 placement.`)) return;

    await SlotService.vacateSlot(selectedCategory, slotNumber, currentUser?.email || 'admin');
    setMessage({ text: `Slot #${slotNumber} vacated.`, type: 'success' });
    loadSlotData(selectedCategory);
  };

  const activeCount = slots.filter(s => s.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Category Top 10 Slot Manager</span>
            <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
              Strict Max 10 Slots
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Concurrency-safe slot assignment, expiry management, and waitlists.
          </p>
        </div>

        {/* Category Selector */}
        <div className="w-full sm:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus-ring bg-white"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Slots Status Metric Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">
            <Award className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Slot Occupancy: <span className="text-blue-600">{activeCount} / 10 Occupied</span>
            </h3>
            <p className="text-slate-500 text-[11px]">
              {10 - activeCount} vacant positions available for monetization in this category.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-[11px] text-slate-500">
          <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Server policy strictly forbids exceeding 10 active slots.</span>
        </div>
      </div>

      {/* 10 SLOTS VISUAL GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {slots.map((slot) => {
          const isActive = slot.status === 'active' && slot.businessId;
          const isExpired = slot.status === 'expired';

          return (
            <div
              key={slot.slotNumber}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                isActive
                  ? 'bg-white border-blue-200 shadow-sm'
                  : isExpired
                  ? 'bg-rose-50/50 border-rose-200'
                  : 'bg-slate-50/60 border-dashed border-slate-300'
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : isExpired
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  #{slot.slotNumber}
                </div>

                <div className="text-xs">
                  {isActive ? (
                    <div>
                      <div className="font-bold text-slate-900 text-sm line-clamp-1">
                        {slot.businessName}
                      </div>
                      <div className="text-slate-500 flex items-center space-x-2 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Expires: {slot.expiresAt || 'No Date'}</span>
                      </div>
                    </div>
                  ) : isExpired ? (
                    <div>
                      <span className="font-bold text-rose-700">Expired Listing ({slot.businessName})</span>
                      <p className="text-[11px] text-rose-500">Slot needs renewal or reallocation.</p>
                    </div>
                  ) : (
                    <div>
                      <span className="font-bold text-slate-500">Vacant Slot</span>
                      <p className="text-[11px] text-slate-400">Ready for assignment</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Slot Actions */}
              <div className="flex items-center space-x-2 shrink-0">
                {isActive ? (
                  <button
                    onClick={() => handleVacate(slot.slotNumber)}
                    className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors flex items-center space-x-1"
                    title="Vacate this slot"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Vacate</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setAssigningSlot(slot.slotNumber);
                      setExpiryDate(defaultNextYear());
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Assign</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Waitlisted Businesses Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2 mb-3">
          <Users className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-sm">
            Waitlisted / Unassigned Approved Businesses in this Category ({waitlist.length})
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Approved businesses awaiting Top 10 slot availability or payment verification.
        </p>

        {waitlist.length === 0 ? (
          <div className="text-xs text-slate-400 p-4 bg-slate-50 rounded-xl text-center">
            No businesses currently waiting in this category queue.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {waitlist.map((biz) => (
              <div key={biz.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900">{biz.name}</span>
                  <span className="text-slate-500 ml-2">({biz.locality} • Package: {biz.packageId})</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  biz.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {biz.paymentStatus}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assignment Modal */}
      {assigningSlot !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200 admin-modal text-slate-900">
            <button
              onClick={() => setAssigningSlot(null)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Assign Business to Slot #{assigningSlot}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Select an approved business with verified payment in this category.
            </p>

            <form onSubmit={handleAssign} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Select Approved & Paid Business *
                </label>
                {eligibleBusinesses.length === 0 ? (
                  <div className="p-3 bg-amber-50 text-amber-800 rounded-xl border border-amber-200">
                    No approved, paid businesses found in this category. Please record payment or approve applications first.
                  </div>
                ) : (
                  <select
                    required
                    value={selectedBizId}
                    onChange={(e) => setSelectedBizId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus-ring bg-white"
                  >
                    <option value="">-- Choose Business --</option>
                    {eligibleBusinesses.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.locality})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Slot Expiration Date *
                </label>
                <input
                  type="date"
                  required
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus-ring"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssigningSlot(null)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={eligibleBusinesses.length === 0}
                  className="px-5 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md disabled:opacity-50"
                >
                  Confirm Slot Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
