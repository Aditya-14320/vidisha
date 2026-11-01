import { StorageService } from './storageService';
import { AuditLog } from '../types';

export const AuditService = {
  async getAuditLogs(): Promise<AuditLog[]> {
    return StorageService.getAuditLogs();
  },

  async recordLog(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> {
    return StorageService.recordAuditLog(log);
  }
};
