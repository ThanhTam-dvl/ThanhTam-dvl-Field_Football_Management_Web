// ========================
// 🔧 BACKEND REFACTORING PLAN
// ========================

// 📁 backend/controllers/
// Tách adminController.js thành các controller riêng biệt

// ====== backend/controllers/admin/dashboardController.js ======
const Admin = require('../../models/Admin');
const db = require('../../config/db');

exports.getDashboard = (req, res) => {
  Admin.getDashboardStats((err, stats) => {
    if (err) {
      return res.status(500).json({ error: 'Lỗi lấy thống kê dashboard' });
    }
    res.json(stats);
  });
};

exports.getRecentBookings = async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const [results] = await db.promise().query(`
      SELECT 
        b.id, b.booking_date, b.start_time, b.end_time, 
        b.total_amount, b.status, b.payment_status, b.created_at,
        u.name as customer_name, u.phone_number,
        f.name as field_name, f.type as field_type
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN fields f ON b.field_id = f.id
      ORDER BY b.created_at DESC
      LIMIT ?
    `, [parseInt(limit)]);

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi lấy danh sách đặt sân' });
  }
};





