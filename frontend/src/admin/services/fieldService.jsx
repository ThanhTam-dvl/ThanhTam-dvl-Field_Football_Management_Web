// frontend/src/admin/services/fieldService.jsx
import API from '../../services/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Field Management APIs
export const getFieldsWithBookings = async (date) => {
  try {
    const response = await API.get('/admin/fields-with-bookings', {
      params: { date },
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching fields with bookings:', error);
    throw error;
  }
};

export const createManualBooking = async (bookingData) => {
  try {
    const response = await API.post('/admin/manual-booking', bookingData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error creating manual booking:', error);
    throw error;
  }
};

export const updateBookingStatus = async (bookingId, status, notes = '') => {
  try {
    const response = await API.put(`/admin/bookings/${bookingId}/status`, {
      status,
      notes
    }, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};

export const deleteBooking = async (bookingId) => {
  try {
    const response = await API.delete(`/admin/bookings/${bookingId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
};

export const getAllFields = async () => {
  try {
    const response = await API.get('/admin/fields', {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching fields:', error);
    throw error;
  }
};