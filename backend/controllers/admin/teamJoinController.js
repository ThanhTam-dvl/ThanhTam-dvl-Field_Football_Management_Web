// backend/controllers/admin/teamJoinController.js
const TeamJoin = require('../../models/TeamJoin');

const AdminTeamJoinController = {
  // Lấy tất cả team join posts với filter và pagination
  getAllPosts: async (req, res) => {
    try {
      const { page = 1, limit = 10, status, field_type, date_from, date_to, search } = req.query;
      
      const posts = await TeamJoin.getAllForAdmin({
        page: parseInt(page),
        limit: parseInt(limit),
        status,
        field_type,
        date_from,
        date_to,
        search
      });
      
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Lỗi lấy danh sách posts', details: error.message });
    }
  },

  // Lấy chi tiết post
  getPostById: async (req, res) => {
    try {
      const { id } = req.params;
      const post = await TeamJoin.getByIdForAdmin(id);
      
      if (!post) {
        return res.status(404).json({ error: 'Không tìm thấy post' });
      }
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: 'Lỗi lấy thông tin post', details: error.message });
    }
  },

  // Tạo post mới (admin)
  createPost: async (req, res) => {
    try {
      const postData = req.body;
      const result = await TeamJoin.createByAdmin(postData);
      
      res.status(201).json({ 
        message: 'Tạo post thành công', 
        postId: result.insertId 
      });
    } catch (error) {
      res.status(500).json({ error: 'Lỗi tạo post', details: error.message });
    }
  },

  // Cập nhật post
  updatePost: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      await TeamJoin.updateByAdmin(id, updateData);
      
      res.json({ message: 'Cập nhật post thành công' });
    } catch (error) {
      res.status(500).json({ error: 'Lỗi cập nhật post', details: error.message });
    }
  },

  // Xóa post
  deletePost: async (req, res) => {
    try {
      const { id } = req.params;
      
      await TeamJoin.deleteByAdmin(id);
      
      res.json({ message: 'Xóa post thành công' });
    } catch (error) {
      res.status(500).json({ error: 'Lỗi xóa post', details: error.message });
    }
  },

  // Cập nhật trạng thái nhiều posts
  bulkUpdateStatus: async (req, res) => {
    try {
      const { postIds, status } = req.body;
      
      await TeamJoin.bulkUpdateStatus(postIds, status);
      
      res.json({ message: `Cập nhật trạng thái thành công cho ${postIds.length} posts` });
    } catch (error) {
      res.status(500).json({ error: 'Lỗi cập nhật hàng loạt', details: error.message });
    }
  },

  // Thống kê team join posts
  getPostStats: async (req, res) => {
    try {
      const stats = await TeamJoin.getAdminStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Lỗi lấy thống kê', details: error.message });
    }
  }
};

module.exports = AdminTeamJoinController;