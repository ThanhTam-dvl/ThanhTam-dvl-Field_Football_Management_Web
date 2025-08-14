// backend/controllers/admin/matchController.js
const Match = require('../../models/Match');
const User = require('../../models/User');

const AdminMatchController = {
  // Lấy tất cả matches với filter và pagination
  getAllMatches: async (req, res) => {
    try {
      const { page = 1, limit = 10, status, field_type, date_from, date_to, search } = req.query;
      
      const matches = await Match.getAllForAdmin({
        page: parseInt(page),
        limit: parseInt(limit),
        status,
        field_type,
        date_from,
        date_to,
        search
      });
      
      res.json(matches);
    } catch (error) {
      res.status(500).json({ error: 'Lỗi lấy danh sách matches', details: error.message });
    }
  },

  // Lấy chi tiết match
  getMatchById: async (req, res) => {
    try {
      const { id } = req.params;
      const match = await Match.getByIdForAdmin(id);
      
      if (!match) {
        return res.status(404).json({ error: 'Không tìm thấy match' });
      }
      
      res.json(match);
    } catch (error) {
      res.status(500).json({ error: 'Lỗi lấy thông tin match', details: error.message });
    }
  },

  // Tạo match mới (admin)
  createMatch: async (req, res) => {
    try {
      const matchData = req.body;
      const result = await Match.createByAdmin(matchData);
      
      res.status(201).json({ 
        message: 'Tạo match thành công', 
        matchId: result.insertId 
      });
    } catch (error) {
      res.status(500).json({ error: 'Lỗi tạo match', details: error.message });
    }
  },

  // Cập nhật match
  updateMatch: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      await Match.updateByAdmin(id, updateData);
      
      res.json({ message: 'Cập nhật match thành công' });
    } catch (error) {
      res.status(500).json({ error: 'Lỗi cập nhật match', details: error.message });
    }
  },

  // Xóa match
  deleteMatch: async (req, res) => {
    try {
      const { id } = req.params;
      
      await Match.deleteByAdmin(id);
      
      res.json({ message: 'Xóa match thành công' });
    } catch (error) {
      res.status(500).json({ error: 'Lỗi xóa match', details: error.message });
    }
  },

  // Cập nhật trạng thái nhiều matches
  bulkUpdateStatus: async (req, res) => {
    try {
      const { matchIds, status } = req.body;
      
      await Match.bulkUpdateStatus(matchIds, status);
      
      res.json({ message: `Cập nhật trạng thái thành công cho ${matchIds.length} matches` });
    } catch (error) {
      res.status(500).json({ error: 'Lỗi cập nhật hàng loạt', details: error.message });
    }
  },

  // Thống kê matches
  getMatchStats: async (req, res) => {
    try {
      const stats = await Match.getAdminStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Lỗi lấy thống kê', details: error.message });
    }
  }
};

module.exports = AdminMatchController;