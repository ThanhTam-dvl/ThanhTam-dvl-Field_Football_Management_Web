// backend/models/TeamJoin.js (UPDATED)
const db = require('../config/db');

const TeamJoin = {
  // Existing methods (giữ nguyên)
  create: (data, callback) => {
    const sql = `
      INSERT INTO team_join_posts 
      (match_date, start_time, field_type, level, players_needed, position_needed, description, contact_name, contact_phone, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'open')
    `;
    const values = [
      data.match_date,
      data.start_time,
      data.field_type,
      data.level,
      data.players_needed,
      data.position_needed,
      data.description,
      data.contact_name,
      data.contact_phone
    ];
    db.query(sql, values, callback);
  },

  list: (filter = {}, callback) => {
    let sql = `SELECT * FROM team_join_posts WHERE status = 'open' AND match_date >= CURDATE()`;
    const values = [];

    if (filter.date) {
      sql += ' AND match_date = ?';
      values.push(filter.date);
    }
    if (filter.time) {
      sql += ' AND start_time = ?';
      values.push(filter.time);
    }
    if (filter.field_type) {
      sql += ' AND field_type = ?';
      values.push(filter.field_type);
    }
    if (filter.level) {
      sql += ' AND level = ?';
      values.push(filter.level);
    }
    if (filter.position_needed) {
      sql += ' AND position_needed = ?';
      values.push(filter.position_needed);
    }

    sql += ' ORDER BY match_date ASC, start_time ASC';
    db.query(sql, values, callback);
  },

  // =================== ADMIN METHODS ===================
  
  // Lấy tất cả posts cho admin với filter và pagination
  getAllForAdmin: async (options) => {
    const { page, limit, status, field_type, date_from, date_to, search } = options;
    const offset = (page - 1) * limit;
    
    let sql = `
      SELECT * FROM team_join_posts
      WHERE 1=1
    `;
    const params = [];

    // Filters
    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }
    if (field_type) {
      sql += ' AND field_type = ?';
      params.push(field_type);
    }
    if (date_from) {
      sql += ' AND match_date >= ?';
      params.push(date_from);
    }
    if (date_to) {
      sql += ' AND match_date <= ?';
      params.push(date_to);
    }
    if (search) {
      sql += ' AND (contact_name LIKE ? OR contact_phone LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Count total
    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total');
    const [countResult] = await db.promise().query(countSql, params);
    const total = countResult[0].total;

    // Get data with pagination
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const [posts] = await db.promise().query(sql, params);

    return {
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  // Lấy post theo ID cho admin
  getByIdForAdmin: async (id) => {
    const sql = 'SELECT * FROM team_join_posts WHERE id = ?';
    const [posts] = await db.promise().query(sql, [id]);
    return posts[0] || null;
  },

  // Tạo post bởi admin
  createByAdmin: async (data) => {
    const sql = `
      INSERT INTO team_join_posts 
      (match_date, start_time, field_type, level, players_needed, position_needed, 
       description, contact_name, contact_phone, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      data.match_date,
      data.start_time,
      data.field_type,
      data.level || 'intermediate',
      data.players_needed,
      data.position_needed || 'any',
      data.description || '',
      data.contact_name,
      data.contact_phone,
      data.status || 'open'
    ];
    
    const [result] = await db.promise().query(sql, values);
    return result;
  },

  // Cập nhật post bởi admin
  updateByAdmin: async (id, data) => {
    const fields = [];
    const values = [];

    Object.keys(data).forEach(key => {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    });

    if (fields.length === 0) return;

    values.push(id);
    const sql = `UPDATE team_join_posts SET ${fields.join(', ')} WHERE id = ?`;
    
    await db.promise().query(sql, values);
  },

  // Xóa post bởi admin
  deleteByAdmin: async (id) => {
    await db.promise().query('DELETE FROM team_join_posts WHERE id = ?', [id]);
  },

  // Cập nhật trạng thái hàng loạt
  bulkUpdateStatus: async (postIds, status) => {
    if (!postIds || postIds.length === 0) return;
    
    const placeholders = postIds.map(() => '?').join(',');
    const sql = `UPDATE team_join_posts SET status = ? WHERE id IN (${placeholders})`;
    
    await db.promise().query(sql, [status, ...postIds]);
  },

  // Thống kê cho admin
  getAdminStats: async () => {
    const queries = [
      'SELECT COUNT(*) as total FROM team_join_posts',
      'SELECT COUNT(*) as open FROM team_join_posts WHERE status = "open"',
      'SELECT COUNT(*) as closed FROM team_join_posts WHERE status = "closed"',
      'SELECT COUNT(*) as today FROM team_join_posts WHERE match_date = CURDATE()',
      'SELECT COUNT(*) as this_week FROM team_join_posts WHERE YEARWEEK(match_date) = YEARWEEK(NOW())',
      'SELECT field_type, COUNT(*) as count FROM team_join_posts GROUP BY field_type',
      'SELECT position_needed, COUNT(*) as count FROM team_join_posts GROUP BY position_needed'
    ];

    const results = await Promise.all(
      queries.map(query => db.promise().query(query))
    );

    return {
      total: results[0][0][0].total,
      open: results[1][0][0].open,
      closed: results[2][0][0].closed,
      today: results[3][0][0].today,
      thisWeek: results[4][0][0].this_week,
      byFieldType: results[5][0],
      byPosition: results[6][0]
    };
  }
};

module.exports = TeamJoin;