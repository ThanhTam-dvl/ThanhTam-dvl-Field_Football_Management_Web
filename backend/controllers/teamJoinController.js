// backend/controllers/teamJoinController.js - FIXED VERSION
const TeamJoin = require('../models/TeamJoin');

// =============== CUSTOMER TEAM JOIN APIs ===============
exports.createPost = async (req, res) => {
  try {
    const data = req.body;
    
    console.log('Create team join post request:', data);
    
    // Validation
    if (!data.match_date || !data.start_time || !data.field_type || !data.level || 
        !data.players_needed || !data.position_needed || !data.contact_name || !data.contact_phone) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    // Use async method
    const result = await TeamJoin.createAsync(data);
    
    console.log('Team join post created successfully:', result.insertId);
    
    res.status(201).json({ 
      message: 'Đăng tin thành công', 
      id: result.insertId 
    });
  } catch (error) {
    console.error('Create team join post error:', error);
    res.status(500).json({ 
      error: 'Không thể đăng tin',
      details: error.message 
    });
  }
};

exports.listPosts = async (req, res) => {
  try {
    const filter = req.query || {};
    
    console.log('List team join posts with filter:', filter);
    
    const results = await TeamJoin.listAsync(filter);
    
    console.log(`Found ${results.length} team join posts`);
    
    res.json(results);
  } catch (error) {
    console.error('List team join posts error:', error);
    res.status(500).json({ 
      error: 'Không thể lấy danh sách',
      details: error.message 
    });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Get team join post by ID:', id);
    
    const post = await TeamJoin.getByIdAsync(id);
    
    if (!post) {
      return res.status(404).json({ error: 'Không tìm thấy bài đăng' });
    }
    
    res.json(post);
  } catch (error) {
    console.error('Get team join post by id error:', error);
    res.status(500).json({ 
      error: 'Lỗi lấy thông tin bài đăng',
      details: error.message 
    });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    console.log(`Update team join post ${id}:`, updateData);
    
    await TeamJoin.updateAsync(id, updateData);
    
    console.log('Team join post updated successfully');
    
    res.json({ message: 'Cập nhật bài đăng thành công' });
  } catch (error) {
    console.error('Update team join post error:', error);
    res.status(500).json({ 
      error: 'Lỗi cập nhật bài đăng',
      details: error.message 
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Delete team join post:', id);
    
    await TeamJoin.softDeleteAsync(id);
    
    console.log('Team join post deleted successfully');
    
    res.json({ message: 'Xóa bài đăng thành công' });
  } catch (error) {
    console.error('Delete team join post error:', error);
    res.status(500).json({ 
      error: 'Lỗi xóa bài đăng',
      details: error.message 
    });
  }
};

// =============== ADMIN TEAM JOIN MANAGEMENT ===============
exports.getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, field_type, date_from, date_to, search } = req.query;
    
    console.log('Get all team join posts for admin:', { page, limit, status, field_type, date_from, date_to, search });
    
    const posts = await TeamJoin.getAllForAdmin({
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      field_type,
      date_from,
      date_to,
      search
    });
    
    console.log(`Found ${posts.data.length} team join posts for admin`);
    
    res.json(posts);
  } catch (error) {
    console.error('Get all team join posts error:', error);
    res.status(500).json({ 
      error: 'Lỗi lấy danh sách posts',
      details: error.message 
    });
  }
};

exports.updatePostByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    console.log(`Update team join post by admin ${id}:`, updateData);
    
    await TeamJoin.updateByAdmin(id, updateData);
    
    console.log('Team join post updated by admin successfully');
    
    res.json({ message: 'Cập nhật post thành công' });
  } catch (error) {
    console.error('Update team join post by admin error:', error);
    res.status(500).json({ 
      error: 'Lỗi cập nhật post',
      details: error.message 
    });
  }
};

exports.deletePostByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Delete team join post by admin:', id);
    
    await TeamJoin.deleteByAdmin(id);
    
    console.log('Team join post deleted by admin successfully');
    
    res.json({ message: 'Xóa post thành công' });
  } catch (error) {
    console.error('Delete team join post by admin error:', error);
    res.status(500).json({ 
      error: 'Lỗi xóa post',
      details: error.message 
    });
  }
};

exports.bulkUpdatePostStatus = async (req, res) => {
  try {
    const { postIds, status } = req.body;
    
    if (!postIds || !Array.isArray(postIds) || postIds.length === 0) {
      return res.status(400).json({ error: 'Danh sách post không hợp lệ' });
    }

    console.log('Bulk update team join post status:', { postIds, status });

    await TeamJoin.bulkUpdateStatus(postIds, status);
    
    console.log('Bulk update team join posts successful');
    
    res.json({ 
      message: `Cập nhật trạng thái thành công cho ${postIds.length} posts` 
    });
  } catch (error) {
    console.error('Bulk update team join post status error:', error);
    res.status(500).json({ 
      error: 'Lỗi cập nhật hàng loạt',
      details: error.message 
    });
  }
};

exports.getPostStats = async (req, res) => {
  try {
    console.log('Get team join post stats for admin');
    
    const stats = await TeamJoin.getAdminStats();
    
    console.log('Team join post stats retrieved:', stats);
    
    res.json(stats);
  } catch (error) {
    console.error('Get team join post stats error:', error);
    res.status(500).json({ 
      error: 'Lỗi lấy thống kê',
      details: error.message 
    });
  }
};