import { StorageService } from './storageService';
import { PaymentRecord, Business } from '../types';

export const PaymentService = {
  /**
   * Get all payment records
   */
  async getPayments(): Promise<PaymentRecord[]> {
    return StorageService.getPayments();
  },

  /**
   * Record manual payment by admin
   */
  async recordPayment(paymentData: Omit<PaymentRecord, 'id' | 'createdAt'>): Promise<PaymentRecord> {
    return StorageService.recordPayment(paymentData);
  },

  /**
   * Get businesses with listing expiring within the given threshold (in days)
   */
  async getExpiringBusinesses(thresholdDays = 15): Promise<Business[]> {
    const all = await StorageService.getBusinesses();
    const now = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(now.getDate() + thresholdDays);

    return all.filter(b => {
      if (!b.listingExpiresAt || b.paymentStatus !== 'paid') return false;
      const exp = new Date(b.listingExpiresAt);
      return exp >= now && exp <= thresholdDate;
    });
  },

  /**
   * Get expired businesses
   */
  async getExpiredBusinesses(): Promise<Business[]> {
    const all = await StorageService.getBusinesses();
    const now = new Date();

    return all.filter(b => {
      if (b.paymentStatus === 'expired') return true;
      if (b.listingExpiresAt && new Date(b.listingExpiresAt) < now) return true;
      return false;
    });
  },

  /**
   * Export payments to CSV format
   */
  exportToCSV(payments: PaymentRecord[]): string {
    const headers = [
      'Payment ID',
      'Business Name',
      'Package',
      'Amount (INR)',
      'Method',
      'Reference No',
      'Payment Date',
      'Period Start',
      'Period End',
      'Status',
      'Recorded By'
    ];

    const rows = payments.map(p => [
      p.id,
      `"${p.businessName.replace(/"/g, '""')}"`,
      p.packageName,
      p.amount,
      p.paymentMethod,
      p.referenceNumber,
      p.paymentDate,
      p.periodStart,
      p.periodEnd,
      p.status,
      `"${p.recordedBy.replace(/"/g, '""')}"`
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
};
