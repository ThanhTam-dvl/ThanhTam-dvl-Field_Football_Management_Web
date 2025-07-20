// backend/controllers/bookingController.js
const Booking = require('../models/Booking');

exports.createBooking = (req, res) => {
  const data = req.body;
  if (!data.user_id || !data.field_id || !data.booking_date || !data.time_slot_id || !data.total_amount) {
    return res.status(400).json({ error: 'Thiếu thông tin cần thiết' });
  }

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
