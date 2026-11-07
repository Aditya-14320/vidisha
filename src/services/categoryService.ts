import { StorageService } from './storageService';
import { Category } from '../types';

export const CategoryService = {
  /**
   * Get active categories for public display with dynamically calculated real business counts
   */
  async getPublicCategories(): Promise<Category[]> {
    const [all, businesses] = await Promise.all([
      StorageService.getCategories({ onlyActive: true }),
      StorageService.getBusinesses({ onlyApproved: true }),
    ]);
    const approvedAndPaid = businesses.filter(b => b.approvalStatus === 'approved' && b.paymentStatus === 'paid');
    return all
      .filter(c => c.isActive !== false)
      .map(c => ({
        ...c,
        businessCount: approvedAndPaid.filter(b => b.categoryId === c.id).length
      }));
  },

  /**
   * Get all categories for Admin
   */
  async getAllForAdmin(): Promise<Category[]> {
    return StorageService.getCategories();
  },

  /**
   * Get Category by slug
   */
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const all = await StorageService.getCategories();
    return all.find(c => c.slug === slug || c.id === slug) || null;
  },

  /**
   * Admin: Save or edit category
   */
  async saveCategory(category: Category): Promise<Category> {
    return StorageService.saveCategory(category);
  },

  /**
   * Admin: Delete category
   */
  async deleteCategory(categoryId: string): Promise<{ success: boolean; message?: string }> {
    const businesses = await StorageService.getBusinesses();
    const count = businesses.filter(b => b.categoryId === categoryId).length;
    if (count > 0) {
      return {
        success: false,
        message: `Cannot delete category: ${count} businesses are linked to it. Please reassign them first.`
      };
    }
    await StorageService.deleteCategory(categoryId);
    return { success: true };
  },

  /**
   * Admin: Reorder categories
   */
  async reorderCategories(orderedCategoryIds: string[]): Promise<void> {
    const all = await StorageService.getCategories();
    for (let index = 0; index < orderedCategoryIds.length; index++) {
      const cat = all.find(c => c.id === orderedCategoryIds[index]);
      if (cat) {
        cat.order = index + 1;
        await StorageService.saveCategory(cat);
      }
    }
  }
};
