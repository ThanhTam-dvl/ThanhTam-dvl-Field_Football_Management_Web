// frontend/src/admin/services/matchService.js
import API from '../../services/api';

const MatchService = {
  // Lấy danh sách matches với filter và pagination
  getMatches: async (params = {}) => {
    try {
      const response = await API.get('/admin/matches', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi lấy danh sách matches' };
    }
  },

  // Lấy chi tiết match
  getMatchById: async (id) => {
    try {
      const response = await API.get(`/admin/matches/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi lấy thông tin match' };
    }
  },

  // Tạo match mới
  createMatch: async (matchData) => {
    try {
      const response = await API.post('/admin/matches', matchData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi tạo match' };
    }
  },

  // Cập nhật match
  updateMatch: async (id, matchData) => {
    try {
      const response = await API.put(`/admin/matches/${id}`, matchData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi cập nhật match' };
    }
  },

  // Xóa match
  deleteMatch: async (id) => {
    try {
      const response = await API.delete(`/admin/matches/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi xóa match' };
    }
  },

  // Cập nhật trạng thái hàng loạt
  bulkUpdateStatus: async (matchIds, status) => {
    try {
      const response = await API.post('/admin/matches/bulk-update', {
        matchIds,
        status
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi cập nhật hàng loạt' };
    }
  },

  // Lấy thống kê
  getStats: async () => {
    try {
      const response = await API.get('/admin/matches/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi lấy thống kê' };
    }
  }
};

export default MatchService;