// frontend/src/admin/services/adminService.jsx
import API from '../../services/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Dashboard APIs
export const getDashboardStats = async () => {
  try {
    const response = await API.get('/admin/dashboard', {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

export const getRecentBookings = async (limit = 10) => {
  try {
    const response = await API.get(`/admin/recent-bookings?limit=${limit}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recent bookings:', error);
    throw error;
  }
};

// Booking Management APIs
export const getAllBookings = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await API.get(`/admin/bookings?${queryString}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
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

// User Management APIs
export const getAllUsers = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await API.get(`/admin/users?${queryString}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Field Management APIs
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

export const createField = async (fieldData) => {
  try {
    const response = await API.post('/admin/fields', fieldData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error creating field:', error);
    throw error;
  }
};

export const updateField = async (fieldId, fieldData) => {
  try {
    const response = await API.put(`/admin/fields/${fieldId}`, fieldData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error updating field:', error);
    throw error;
  }
};

// Revenue Reports
export const getRevenue = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await API.get(`/admin/revenue?${queryString}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching revenue:', error);
    throw error;
  }
};

// Admin Management APIs
export const getAllAdmins = async () => {
  try {
    const response = await API.get('/admin/admins', {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching admins:', error);
    throw error;
  }
};

export const createAdmin = async (adminData) => {
  try {
    const response = await API.post('/admin/admins', adminData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error creating admin:', error);
    throw error;
  }
};