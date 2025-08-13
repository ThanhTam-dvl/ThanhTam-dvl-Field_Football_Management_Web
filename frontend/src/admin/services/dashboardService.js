// ====== frontend/src/admin/services/dashboardService.js ======
import BaseService from './baseService';

class DashboardService extends BaseService {
  constructor() {
    super('/admin/dashboard');
  }

  async getDashboardStats() {
    return this.get('/');
  }

  async getRecentBookings(limit = 10) {
    return this.get('/recent-bookings', { limit });
  }
}

export default new DashboardService();

// Named exports for compatibility
export const getDashboardStats = () => new DashboardService().getDashboardStats();
export const getRecentBookings = (limit) => new DashboardService().getRecentBookings(limit);
