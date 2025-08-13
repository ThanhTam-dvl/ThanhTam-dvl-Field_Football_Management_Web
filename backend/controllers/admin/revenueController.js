// ====== backend/controllers/admin/revenueController.js ======
const db = require('../../config/db');

exports.getRevenue = async (req, res) => {
  try {
    const { period = '7', start_date, end_date } = req.query;
    
    let dateCondition = '';
    let params = [];

    if (start_date && end_date) {
      dateCondition = 'WHERE booking_date BETWEEN ? AND ?';
      params = [start_date, end_date];
    } else {
      dateCondition = 'WHERE booking_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)';
      params = [parseInt(period)];
    }

    const [results] = await db.promise().query(`
      SELECT 
        booking_date,
        SUM(total_amount) as daily_revenue,
        COUNT(*) as daily_bookings
      FROM bookings 
      ${dateCondition} AND status != 'cancelled'
      GROUP BY booking_date
      ORDER BY booking_date DESC
    `, params);

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi lấy báo cáo doanh thu' });
  }
};