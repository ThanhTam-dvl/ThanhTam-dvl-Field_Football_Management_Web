// frontend/src/admin/services/teamJoinService.js
import API from '../../services/api';

const TeamJoinService = {
  // Lấy danh sách team join posts với filter và pagination
  getPosts: async (params = {}) => {
    try {
      const response = await API.get('/admin/team-joins', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi lấy danh sách posts' };
    }
  },

  // Lấy chi tiết post
  getPostById: async (id) => {
    try {
      const response = await API.get(`/admin/team-joins/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi lấy thông tin post' };
    }
  },

  // Tạo post mới
  createPost: async (postData) => {
    try {
      const response = await API.post('/admin/team-joins', postData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi tạo post' };
    }
  },

  // Cập nhật post
  updatePost: async (id, postData) => {
    try {
      const response = await API.put(`/admin/team-joins/${id}`, postData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi cập nhật post' };
    }
  },

  // Xóa post
  deletePost: async (id) => {
    try {
      const response = await API.delete(`/admin/team-joins/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi xóa post' };
    }
  },

  // Cập nhật trạng thái hàng loạt
  bulkUpdateStatus: async (postIds, status) => {
    try {
      const response = await API.post('/admin/team-joins/bulk-update', {
        postIds,
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
      const response = await API.get('/admin/team-joins/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Lỗi lấy thống kê' };
    }
  }
};

export default TeamJoinService;