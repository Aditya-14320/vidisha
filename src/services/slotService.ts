import { StorageService } from './storageService';
import { Top10Slot, Business } from '../types';

export const SlotService = {
  /**
   * Get all 10 slots for a category.
   * Automatically refreshes expired slots.
   */
  async getCategorySlots(categoryId: string): Promise<Top10Slot[]> {
    const slots = await StorageService.getSlotsForCategory(categoryId);
    const now = new Date();

    // Check for expiration
    for (const slot of slots) {
      if (slot.status === 'active' && slot.expiresAt && new Date(slot.expiresAt) < now) {
        slot.status = 'expired';
        // Demote business from top 10
        if (slot.businessId) {
          const biz = await StorageService.getBusinessByIdOrSlug(slot.businessId);
          if (biz) {
            await StorageService.saveBusiness({
              ...biz,
              isTop10: false,
              top10Position: undefined,
              paymentStatus: 'expired'
            });
          }
        }
      }
    }

    return slots;
  },

  /**
   * Assign a business to one of the 10 slots.
   * Concurrency-safe limit check: Max 10 slots enforced.
   */
  async assignSlot(
    categoryId: string,
    slotNumber: number,
    business: Business,
    expiresAt: string,
    performedBy: string
  ): Promise<{ success: boolean; message: string }> {
    return StorageService.assignTop10Slot(categoryId, slotNumber, business, expiresAt, performedBy);
  },

  /**
   * Vacate a slot
   */
  async vacateSlot(categoryId: string, slotNumber: number, performedBy: string): Promise<void> {
    return StorageService.vacateSlot(categoryId, slotNumber, performedBy);
  },

  /**
   * Get waitlisted businesses for a category (approved businesses without a current slot)
   */
  async getWaitlistedBusinesses(categoryId: string): Promise<Business[]> {
    const all = await StorageService.getBusinesses();
    const slots = await this.getCategorySlots(categoryId);
    const occupiedIds = new Set(slots.filter(s => s.status === 'active' && s.businessId).map(s => s.businessId));

    return all.filter(b =>
      b.categoryId === categoryId &&
      b.approvalStatus === 'approved' &&
      !occupiedIds.has(b.id)
    );
  }
};
