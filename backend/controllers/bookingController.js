// backend/controllers/bookingController.js
const Booking = require('../models/Booking');
const db = require('../config/db');

exports.createBooking = async (req, res) => {
  const data = req.body;
  if (!data.user_id || !data.field_id || !data.booking_date || !data.start_time || !data.end_time) {
    return res.status(400).json({ error: 'Thiếu thông tin cần thiết' });
  }

  // Lấy loại sân
  const [[field]] = await db.promise().query('SELECT type FROM fields WHERE id = ?', [data.field_id]);
  if (!field) return res.status(400).json({ error: 'Không tìm thấy sân' });

  // Tính tổng tiền theo pricing_rules
  let total = 0;
  const startHour = parseInt(data.start_time.split(':')[0]);
  const endHour = parseInt(data.end_time.split(':')[0]);
  for (let hour = startHour; hour < endHour; hour++) {
    const [rows] = await db.promise().query(
      `SELECT price_per_hour FROM pricing_rules WHERE field_type = ? AND start_hour <= ? AND end_hour > ? LIMIT 1`,
      [field.type, hour, hour]
    );
    total += rows.length > 0 ? Number(rows[0].price_per_hour) : 0;
  }
  data.total_amount = total;

  Booking.create(data, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Lỗi tạo booking' });
    }
    res.status(201).json({ message: 'Đặt sân thành công', bookingId: result.insertId });
  });
};

exports.getUserBookings = (req, res) => {
  const userId = req.params.userId;
  Booking.getByUserId(userId, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Không thể lấy lịch sử đặt sân' });
    }
    res.json(results);
  });
};

exports.getBookingsByDate = (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: 'Thiếu ngày' });

  const sql = `SELECT field_id, start_time, end_time FROM bookings WHERE booking_date = ?`;
  db.query(sql, [date], (err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi truy vấn' });
    res.json(results);
  });
};

