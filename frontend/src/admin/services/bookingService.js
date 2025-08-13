// ====== frontend/src/admin/services/bookingService.js ======
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
}

export default new BookingService();

// Named exports for compatibility
export const getAllBookings = (params) => new BookingService().getAllBookings(params);
export const updateBookingStatus = (bookingId, status, notes) => new BookingService().updateBookingStatus(bookingId, status, notes);
export const updateBooking = (bookingId, data) => new BookingService().updateBooking(bookingId, data);
export const deleteBooking = (bookingId) => new BookingService().deleteBooking(bookingId);
export const createManualBooking = (data) => new BookingService().createManualBooking(data);
