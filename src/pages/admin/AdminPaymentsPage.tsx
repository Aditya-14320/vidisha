import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Plus,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  Calendar,
  Building2
} from 'lucide-react';
import { PaymentRecord, Business, ListingPackageId } from '../../types';
import { PaymentService } from '../../services/paymentService';
import { StorageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';

export const AdminPaymentsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Form states
  const [businessId, setBusinessId] = useState('');
  const [amount, setAmount] = useState(4000);
  const [packageId, setPackageId] = useState<ListingPackageId>('complete');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'bank_transfer' | 'cash' | 'cheque'>('upi');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [periodMonths, setPeriodMonths] = useState(12);
  const [periodStart, setPeriodStart] = useState(new Date().toISOString().split('T')[0]);
  const [receiptNotes, setReceiptNotes] = useState('');

  const calculatePeriodEnd = (start: string, months: number) => {
    const d = new Date(start);
    d.setMonth(d.getMonth() + months);
    return d.toISOString().split('T')[0];
  };

  const loadData = async () => {
    setLoading(true);
    const [pays, bizList] = await Promise.all([
      PaymentService.getPayments(),
      StorageService.getBusinesses(),
    ]);
    setPayments(pays);
    setBusinesses(bizList);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePackageChange = (pkg: ListingPackageId) => {
    setPackageId(pkg);
    if (pkg === 'complete') {
      setAmount(periodMonths === 12 ? 4000 : Math.round((4000 / 12) * periodMonths));
    }
    if (pkg === 'priority') {
      setAmount(periodMonths === 12 ? 6000 : Math.round((6000 / 12) * periodMonths));
    }
    if (pkg === 'offer_campaign') setAmount(299);
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessId || !referenceNumber.trim()) {
      setMessage('Please select a business and provide a valid reference number.');
      return;
    }

    const biz = businesses.find(b => b.id === businessId);
    if (!biz) return;

    const periodEnd = calculatePeriodEnd(periodStart, Number(periodMonths));

    await PaymentService.recordPayment({
      businessId: biz.id,
      businessName: biz.name,
      amount: Number(amount),
      currency: 'INR',
      packageId,
      packageName:
        packageId === 'complete'
          ? 'Complete Business Listing'
          : packageId === 'priority'
          ? 'Priority Listing'
          : 'Deal Campaign',
      paymentMethod,
      referenceNumber: referenceNumber.trim(),
      paymentDate: new Date().toISOString().split('T')[0],
      periodMonths: Number(periodMonths),
      periodStart,
      periodEnd,
      status: 'verified',
      recordedBy: currentUser?.email || 'admin',
      receiptNotes: receiptNotes.trim() || undefined
    });

    setMessage(`Payment of ₹${amount} recorded and verified for "${biz.name}".`);
    setShowModal(false);
    setReferenceNumber('');
    setReceiptNotes('');
    loadData();
  };

  const handleExportCSV = () => {
    const csvData = PaymentService.exportToCSV(payments);
    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvData);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vidisha_payments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalCollected = payments
    .filter(p => p.status === 'verified')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Payments Ledger & Revenue
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manual UPI & bank transfer verification, receipt auditing, and period validation.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm flex items-center space-x-1"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Record Verified Payment</span>
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

      {/* Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold">Total Revenue Verified</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">₹{totalCollected.toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold">Verified Receipts</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{payments.filter(p => p.status === 'verified').length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold">Pending Verification</span>
          <p className="text-2xl font-black text-amber-600 mt-1">{payments.filter(p => p.status === 'pending').length}</p>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Payment ID</th>
                <th className="px-4 py-3.5">Business</th>
                <th className="px-4 py-3.5">Package</th>
                <th className="px-4 py-3.5">Amount</th>
                <th className="px-4 py-3.5">Method & Reference</th>
                <th className="px-4 py-3.5">Period Covered</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5">Recorded By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                    No payment records entered yet. Use "Record Verified Payment" to log UPI or bank transactions.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-400">{p.id}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{p.businessName}</td>
                    <td className="px-4 py-3 font-semibold text-blue-700">{p.packageName}</td>
                    <td className="px-4 py-3 font-black text-slate-900 text-sm">₹{p.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold uppercase text-slate-700">{p.paymentMethod}</span>
                      <p className="text-[11px] font-mono text-slate-500">{p.referenceNumber}</p>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-slate-600">
                      {p.periodStart} to {p.periodEnd}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-slate-500">{p.recordedBy}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Payment Recorder Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-200 admin-modal text-slate-900">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Record Verified Business Payment
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter bank transaction reference to verify and activate listing validity.
            </p>

            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Business *</label>
                <select
                  required
                  value={businessId}
                  onChange={(e) => setBusinessId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus-ring bg-white"
                >
                  <option value="">-- Choose Business --</option>
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.locality})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Listing Package</label>
                  <select
                    value={packageId}
                    onChange={(e) => handlePackageChange(e.target.value as ListingPackageId)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus-ring bg-white font-semibold"
                  >
                    <option value="complete">Complete Listing (₹4,000 / Year)</option>
                    <option value="priority">Priority Listing (₹6,000 / Year)</option>
                    <option value="offer_campaign">Offer Campaign (₹299)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Period Duration</label>
                  <select
                    value={periodMonths}
                    onChange={(e) => {
                      const m = Number(e.target.value);
                      setPeriodMonths(m);
                      if (packageId === 'complete') {
                        setAmount(m === 12 ? 4000 : Math.round((4000 / 12) * m));
                      }
                      if (packageId === 'priority') {
                        setAmount(m === 12 ? 6000 : Math.round((6000 / 12) * m));
                      }
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus-ring bg-white"
                  >
                    <option value={12}>12 Months (Full Annual Subscription)</option>
                    <option value={6}>6 Months (Half-Year)</option>
                    <option value={3}>3 Months (Quarterly)</option>
                    <option value={1}>1 Month (Monthly Trial)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Verified Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus-ring font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus-ring bg-white font-semibold"
                  >
                    <option value="upi">UPI (PhonePe, GPay, Paytm)</option>
                    <option value="bank_transfer">NEFT / IMPS Bank Transfer</option>
                    <option value="cash">Direct Cash</option>
                    <option value="cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Bank Reference / UTR Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    placeholder="e.g. UPI/1234567890/SBI"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus-ring font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Period Start Date</label>
                  <input
                    type="date"
                    required
                    value={periodStart}
                    onChange={(e) => setPeriodStart(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus-ring"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Receipt Notes / Verification Remarks</label>
                <textarea
                  rows={2}
                  value={receiptNotes}
                  onChange={(e) => setReceiptNotes(e.target.value)}
                  placeholder="e.g. Verified on SBI statement 25-Oct"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus-ring"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
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
                  Record & Activate Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
