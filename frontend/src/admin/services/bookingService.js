// ====== 1. FIX: frontend/src/admin/services/bookingService.js ======
import BaseService from './baseService';

class BookingService extends BaseService {
  constructor() {
    super('/admin/bookings');
  }

  async getAllBookings(params = {}) {
    return this.get('/', params);
  }

  async updateBookingStatus(bookingId, status, notes = '') {
    return this.put(`/${bookingId}/status`, { status, notes });
  }

  async updateBooking(bookingId, bookingData) {
    return this.put(`/${bookingId}`, bookingData);
  }

  async deleteBooking(bookingId) {
    return this.delete(`/${bookingId}`);
  }

  async createManualBooking(bookingData) {
    return this.post('/manual', bookingData);
  }

  // FIX: Add getFields method properly
  async getFields() {
    try {
      // Use the admin/fields endpoint directly
      const response = await this.request('GET', '/admin/fields');
      return response;
    } catch (error) {
      console.error('Error getting fields:', error);
      return [];
    }
  }
}

export default new BookingService();

