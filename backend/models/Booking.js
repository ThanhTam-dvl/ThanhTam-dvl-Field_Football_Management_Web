// backend/models/Booking.js
const db = require('../config/db');

const Booking = {
  create: (data, callback) => {
    const sql = `
      INSERT INTO bookings 
      (user_id, field_id, booking_date, start_time, end_time, total_amount, payment_method, payment_status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      data.user_id,
      data.field_id,
      data.booking_date,
      data.start_time,
      data.end_time,
      data.total_amount,
      data.payment_method || 'cash',
      data.payment_status || 'pending',
      data.notes || null,
    ];
    db.query(sql, values, callback);
  },

  getByUserId: (user_id, callback) => {
    const sql = `SELECT * FROM bookings WHERE user_id = ? ORDER BY booking_date DESC`;
    db.query(sql, [user_id], callback);
  },
};

module.exports = Booking;
