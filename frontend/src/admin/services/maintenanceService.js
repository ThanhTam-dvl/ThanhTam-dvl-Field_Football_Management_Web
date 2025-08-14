// frontend/src/admin/services/maintenanceService.js
import API from '../../services/api';

const maintenanceService = {
  // Lấy danh sách bảo trì với filter và phân trang
  getAllMaintenances: async (params = {}) => {
    try {
      const response = await API.get('/admin/maintenance', { 
        params,
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi lấy danh sách bảo trì' };
    }
  },

  // Lấy thống kê bảo trì
  getMaintenanceStats: async () => {
    try {
      const response = await API.get('/admin/maintenance/stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi lấy thống kê bảo trì' };
    }
  },

  // Lấy chi tiết bảo trì
  getMaintenanceById: async (id) => {
    try {
      const response = await API.get(`/admin/maintenance/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi lấy chi tiết bảo trì' };
    }
  },

  // Tạo lịch bảo trì mới
  createMaintenance: async (data) => {
    try {
      const response = await API.post('/admin/maintenance', data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi tạo lịch bảo trì' };
    }
  },

  // Cập nhật lịch bảo trì
  updateMaintenance: async (id, data) => {
    try {
      const response = await API.put(`/admin/maintenance/${id}`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi cập nhật lịch bảo trì' };
    }
  },

  // Xóa lịch bảo trì
  deleteMaintenance: async (id) => {
    try {
      const response = await API.delete(`/admin/maintenance/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi xóa lịch bảo trì' };
    }
  },

  // Tạo lịch nghỉ lễ cho nhiều sân
  createHolidayMaintenance: async (data) => {
    try {
      const response = await API.post('/admin/maintenance', {
        ...data,
        type: 'holiday',
        field_id: 'all-fields'
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi tạo lịch nghỉ lễ' };
    }
  }
};

export default maintenanceService;

// Named exports cho compatibility
export const {
  getAllMaintenances,
  getMaintenanceStats,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
  createHolidayMaintenance
} = maintenanceService;