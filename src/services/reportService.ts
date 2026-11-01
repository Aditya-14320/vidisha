import { StorageService } from './storageService';
import { ReportItem } from '../types';

export const ReportService = {
  async submitReport(data: Omit<ReportItem, 'id' | 'createdAt' | 'status'>): Promise<ReportItem> {
    return StorageService.submitReport(data);
  },

  async getAllReports(): Promise<ReportItem[]> {
    return StorageService.getReports();
  },

  async updateReportStatus(reportId: string, status: ReportItem['status'], adminNotes?: string): Promise<void> {
    return StorageService.updateReportStatus(reportId, status, adminNotes);
  }
};
