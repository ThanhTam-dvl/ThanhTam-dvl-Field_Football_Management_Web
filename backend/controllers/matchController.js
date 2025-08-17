// backend/controllers/matchController.js - FIXED VERSION
const Match = require('../models/Match');
const MatchParticipant = require('../models/MatchParticipant');

// =============== CUSTOMER MATCH APIs ===============
exports.createMatch = async (req, res) => {
  try {
    const data = req.body;
    
    console.log('Create match request:', data);
    
    if (!data.creator_id || !data.field_id || !data.match_date || !data.start_time || 
        !data.end_time || !data.contact_name || !data.contact_phone || !data.field_type) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    // Use async method instead of callback
    const result = await Match.createAsync(data);
    
    console.log('Match created successfully:', result.insertId);
    
    res.status(201).json({ 
      message: 'Tạo trận thành công', 
      matchId: result.insertId 
    });
  } catch (error) {
    console.error('Create match error:', error);
    res.status(500).json({ 
      error: 'Lỗi tạo trận đấu',
      details: error.message 
    });
  }
};

exports.listMatches = async (req, res) => {
  try {
    const filter = req.query || {};
    
    console.log('List matches with filter:', filter);
    
    // Use async method instead of callback
    const results = await Match.listOpenMatchesAsync(filter);
    
    console.log(`Found ${results.length} matches`);
    
    res.json(results);
  } catch (error) {
    console.error('List matches error:', error);
    res.status(500).json({ 
      error: 'Không lấy được danh sách trận',
      details: error.message 
    });
  }
};

exports.joinMatch = async (req, res) => {
  try {
    const data = req.body;
    
    console.log('Join match request:', data);
    
    if (!data.match_id || !data.user_id) {
      return res.status(400).json({ error: 'Thiếu match_id hoặc user_id' });
    }

    // Assuming MatchParticipant has async methods too
    if (MatchParticipant.joinAsync) {
      await MatchParticipant.joinAsync(data);
    } else {
      // Fallback to callback if async method doesn't exist
      await new Promise((resolve, reject) => {
        MatchParticipant.join(data, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
    }
    
    console.log('Join match successful');
    
    res.json({ message: 'Tham gia thành công' });
  } catch (error) {
    console.error('Join match error:', error);
    res.status(500).json({ 
      error: 'Không thể tham gia trận',
      details: error.message 
    });
  }
};

exports.leaveMatch = async (req, res) => {
  try {
    const { matchId, userId } = req.params;
    
    console.log('Leave match request:', { matchId, userId });
    
    // Assuming MatchParticipant has async methods too
    if (MatchParticipant.leaveAsync) {
      await MatchParticipant.leaveAsync(matchId, userId);
    } else {
      // Fallback to callback if async method doesn't exist
      await new Promise((resolve, reject) => {
        MatchParticipant.leave(matchId, userId, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
    }
    
    console.log('Leave match successful');
    
    res.json({ message: 'Rời trận thành công' });
  } catch (error) {
    console.error('Leave match error:', error);
    res.status(500).json({ 
      error: 'Không thể rời trận',
      details: error.message 
    });
  }
};

exports.listParticipants = async (req, res) => {
  try {
    const { matchId } = req.params;
    
    console.log('List participants for match:', matchId);
    
    // Assuming MatchParticipant has async methods too
    let results;
    if (MatchParticipant.listByMatchAsync) {
      results = await MatchParticipant.listByMatchAsync(matchId);
    } else {
      // Fallback to callback if async method doesn't exist
      results = await new Promise((resolve, reject) => {
        MatchParticipant.listByMatch(matchId, (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      });
    }
    
    console.log(`Found ${results.length} participants`);
    
    res.json(results);
  } catch (error) {
    console.error('List participants error:', error);
    res.status(500).json({ 
      error: 'Không lấy được danh sách người tham gia',
      details: error.message 
    });
  }
};

// =============== ADMIN MATCH MANAGEMENT ===============
exports.getAllMatches = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, field_type, date_from, date_to, search } = req.query;
    
    console.log('Get all matches for admin:', { page, limit, status, field_type, date_from, date_to, search });
    
    const matches = await Match.getAllForAdmin({
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      field_type,
      date_from,
      date_to,
      search
    });
    
    console.log(`Found ${matches.data.length} matches for admin`);
    
    res.json(matches);
  } catch (error) {
    console.error('Get all matches error:', error);
    res.status(500).json({ 
      error: 'Lỗi lấy danh sách matches',
      details: error.message 
    });
  }
};

exports.getMatchById = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Get match by ID:', id);
    
    const match = await Match.getByIdForAdmin(id);
    
    if (!match) {
      return res.status(404).json({ error: 'Không tìm thấy match' });
    }
    
    res.json(match);
  } catch (error) {
    console.error('Get match by id error:', error);
    res.status(500).json({ 
      error: 'Lỗi lấy thông tin match',
      details: error.message 
    });
  }
};

exports.updateMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    console.log(`Update match ${id}:`, updateData);
    
    await Match.updateByAdmin(id, updateData);
    
    console.log('Match updated successfully');
    
    res.json({ message: 'Cập nhật match thành công' });
  } catch (error) {
    console.error('Update match error:', error);
    res.status(500).json({ 
      error: 'Lỗi cập nhật match',
      details: error.message 
    });
  }
};

exports.deleteMatch = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Delete match:', id);
    
    await Match.deleteByAdmin(id);
    
    console.log('Match deleted successfully');
    
    res.json({ message: 'Xóa match thành công' });
  } catch (error) {
    console.error('Delete match error:', error);
    res.status(500).json({ 
      error: 'Lỗi xóa match',
      details: error.message 
    });
  }
};

exports.bulkUpdateMatchStatus = async (req, res) => {
  try {
    const { matchIds, status } = req.body;
    
    if (!matchIds || !Array.isArray(matchIds) || matchIds.length === 0) {
      return res.status(400).json({ error: 'Danh sách match không hợp lệ' });
    }

    console.log('Bulk update match status:', { matchIds, status });

    await Match.bulkUpdateStatus(matchIds, status);
    
    console.log('Bulk update successful');
    
    res.json({ 
      message: `Cập nhật trạng thái thành công cho ${matchIds.length} matches` 
    });
  } catch (error) {
    console.error('Bulk update match status error:', error);
    res.status(500).json({ 
      error: 'Lỗi cập nhật hàng loạt',
      details: error.message 
    });
  }
};

exports.getMatchStats = async (req, res) => {
  try {
    console.log('Get match stats for admin');
    
    const stats = await Match.getAdminStats();
    
    console.log('Match stats retrieved:', stats);
    
    res.json(stats);
  } catch (error) {
    console.error('Get match stats error:', error);
    res.status(500).json({ 
      error: 'Lỗi lấy thống kê match',
      details: error.message 
    });
  }
};