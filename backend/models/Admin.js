// backend/models/Admin.js - Fixed without bcrypt
const db = require('../config/db');

const Admin = {
  // Tìm admin theo email
  findByEmail: (email, callback) => {
    const sql = `SELECT * FROM admins WHERE email = ? AND is_active = 1`;
    db.query(sql, [email], callback);
  },

  // Tạo admin mới (với plain text password)
  create: async (data, callback) => {
    try {
      // Không hash password, lưu trực tiếp
      const sql = `
        INSERT INTO admins (email, password, name, role, permissions) 
        VALUES (?, ?, ?, ?, ?)
      `;
      const values = [
        data.email,
        data.password, // Plain text password
        data.name,
        data.role || 'admin',
        JSON.stringify(data.permissions || ['bookings', 'fields', 'users'])
      ];
      db.query(sql, values, callback);
    } catch (error) {
      callback(error);
    }
  },

  // Lấy tất cả admin
  findAll: (callback) => {
    const sql = `
      SELECT id, email, name, role, permissions, is_active, last_login, created_at 
      FROM admins 
      ORDER BY created_at DESC
    `;
    db.query(sql, callback);
  },

  // Cập nhật thông tin admin
  updateInfo: (id, data, callback) => {
    const sql = `
      UPDATE admins 
      SET name = ?, role = ?, permissions = ?, updated_at = NOW() 
      WHERE id = ?
    `;
    const values = [
      data.name,
      data.role,
      JSON.stringify(data.permissions),
      id
    ];
    db.query(sql, values, callback);
  },

  // Cập nhật last_login
  updateLastLogin: (id, callback) => {
    const sql = `UPDATE admins SET last_login = NOW() WHERE id = ?`;
    db.query(sql, [id], callback);
  },

  // Vô hiệu hóa admin
  softDelete: (id, callback) => {
    const sql = `UPDATE admins SET is_active = 0 WHERE id = ?`;
    db.query(sql, [id], callback);
  },

  // Lưu session
  saveSession: (adminId, sessionToken, expiresAt, callback) => {
    const sql = `
      INSERT INTO admin_sessions (admin_id, session_token, expires_at) 
      VALUES (?, ?, ?)
    `;
    db.query(sql, [adminId, sessionToken, expiresAt], callback);
  },

  // Tìm session
  findSession: (sessionToken, callback) => {
    const sql = `
      SELECT s.*, a.id as admin_id, a.email, a.name, a.role, a.permissions
      FROM admin_sessions s
      JOIN admins a ON s.admin_id = a.id
      WHERE s.session_token = ? AND s.expires_at > NOW() AND s.is_active = 1 AND a.is_active = 1
    `;
    db.query(sql, [sessionToken], callback);
  },

  // Xóa session (logout)
  removeSession: (sessionToken, callback) => {
    const sql = `UPDATE admin_sessions SET is_active = 0 WHERE session_token = ?`;
    db.query(sql, [sessionToken], callback);
  },

  // Thống kê dashboard
  getDashboardStats: async (callback) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Doanh thu hôm nay
      const [revenueResult] = await db.promise().query(`
        SELECT COALESCE(SUM(total_amount), 0) as today_revenue
        FROM bookings 
        WHERE booking_date = ? AND status != 'cancelled'
      `, [today]);

      // Đặt sân hôm nay
      const [bookingsResult] = await db.promise().query(`
        SELECT COUNT(*) as today_bookings
        FROM bookings 
        WHERE booking_date = ?
      `, [today]);

      // Chờ duyệt
      const [pendingResult] = await db.promise().query(`
        SELECT COUNT(*) as pending_bookings
        FROM bookings 
        WHERE status = 'pending'
      `);

      // Tổng số sân
      const [fieldsResult] = await db.promise().query(`
        SELECT COUNT(*) as total_fields
        FROM fields 
        WHERE is_active = 1
      `);

      // Tổng khách hàng
      const [usersResult] = await db.promise().query(`
        SELECT COUNT(*) as total_users
        FROM users 
        WHERE is_active = 1 AND role = 'customer'
      `);

      const stats = {
        today_revenue: revenueResult[0].today_revenue,
        today_bookings: bookingsResult[0].today_bookings,
        pending_bookings: pendingResult[0].pending_bookings,
        total_fields: fieldsResult[0].total_fields,
        total_users: usersResult[0].total_users
      };

      callback(null, stats);
    } catch (error) {
      callback(error);
    }
  }
};

module.exports = Admin;