// backend/models/Booking.js - Model hoàn chỉnh
const db = require('../config/db');

const Booking = {
  // =============== PROMISE METHODS (mới) ===============
  create: async (data) => {
    const [result] = await db.promise().query(`
      INSERT INTO bookings 
      (user_id, field_id, booking_date, start_time, end_time, total_amount, payment_method, payment_status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      data.user_id,
      data.field_id,
      data.booking_date,
      data.start_time,
      data.end_time,
      data.total_amount,
      data.payment_method || 'cash',
      data.payment_status || 'pending',
      data.notes || null
    ]);
    return result;
  },

  createManual: async (data) => {
    const [result] = await db.promise().query(`
      INSERT INTO bookings (
        user_id, field_id, booking_date, start_time, end_time, 
        total_amount, status, payment_status, notes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, 'approved', 'pending', ?, NOW())
    `, [
      data.user_id,
      data.field_id,
      data.booking_date,
      data.start_time,
      data.end_time,
      data.total_amount,
      data.notes
    ]);
    return result;
  },

  getByUserId: async (userId) => {
    const [results] = await db.promise().query(
      `SELECT b.*, f.name as field_name, f.type as field_type 
       FROM bookings b 
       JOIN fields f ON b.field_id = f.id 
       WHERE b.user_id = ? 
       ORDER BY b.booking_date DESC`,
      [userId]
    );
    return results;
  },

  getByDate: async (date) => {
    const [results] = await db.promise().query(
      `SELECT field_id, start_time, end_time FROM bookings WHERE booking_date = ? AND status != 'cancelled'`,
      [date]
    );
    return results;
  },

  updateStatus: async (bookingId, status, notes = null) => {
    const [result] = await db.promise().query(
      `UPDATE bookings SET status = ?, notes = ?, updated_at = NOW() WHERE id = ?`,
      [status, notes, bookingId]
    );
    return result;
  },

  update: async (bookingId, updateData) => {
    // Lấy booking hiện tại
    const [existing] = await db.promise().query(
      'SELECT * FROM bookings WHERE id = ?', 
      [bookingId]
    );

    if (existing.length === 0) {
      return { affectedRows: 0 };
    }

    // Cập nhật thông tin user nếu có
    if (updateData.customer_name || updateData.phone_number) {
      await db.promise().query(`
        UPDATE users SET name = ?, phone_number = ? WHERE id = ?
      `, [
        updateData.customer_name || existing[0].customer_name,
        updateData.phone_number || existing[0].phone_number,
        existing[0].user_id
      ]);
    }

    // Cập nhật booking
    const [result] = await db.promise().query(`
      UPDATE bookings 
      SET field_id = ?, booking_date = ?, start_time = ?, end_time = ?, 
          total_amount = ?, status = ?, notes = ?, updated_at = NOW()
      WHERE id = ?
    `, [
      updateData.field_id || existing[0].field_id,
      updateData.booking_date || existing[0].booking_date,
      updateData.start_time || existing[0].start_time,
      updateData.end_time || existing[0].end_time,
      updateData.total_amount || existing[0].total_amount,
      updateData.status || existing[0].status,
      updateData.notes !== undefined ? updateData.notes : existing[0].notes,
      bookingId
    ]);

    return result;
  },

  delete: async (bookingId) => {
    const [result] = await db.promise().query(
      `DELETE FROM bookings WHERE id = ?`,
      [bookingId]
    );
    return result;
  },

  checkTimeConflict: async (fieldId, bookingDate, startTime, endTime) => {
    const [existingBookings] = await db.promise().query(`
      SELECT id FROM bookings 
      WHERE field_id = ? AND booking_date = ? 
      AND status != 'cancelled'
      AND (
        (start_time <= ? AND end_time > ?) OR
        (start_time < ? AND end_time >= ?) OR
        (start_time >= ? AND end_time <= ?)
      )
    `, [fieldId, bookingDate, startTime, startTime, endTime, endTime, startTime, endTime]);

    return existingBookings.length > 0;
  },

  calculatePrice: async (fieldType, startTime, endTime) => {
    let total = 0;
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);
    
    for (let hour = startHour; hour < endHour; hour++) {
      const [rows] = await db.promise().query(
        `SELECT price_per_hour FROM pricing_rules WHERE field_type = ? AND start_hour <= ? AND end_hour > ? LIMIT 1`,
        [fieldType, hour, hour]
      );
      total += rows.length > 0 ? Number(rows[0].price_per_hour) : 0;
    }
    
    return total;
  },

  getRecent: async (limit = 10) => {
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

    return results;
  },

  // =============== CALLBACK METHODS (legacy) ===============
  create: (data, callback) => {
    if (callback) {
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
      return;
    }
    
    // Promise version
    return Booking.create(data);
  },

  getByUserId: (user_id, callback) => {
    if (callback) {
      const sql = `SELECT * FROM bookings WHERE user_id = ? ORDER BY booking_date DESC`;
      db.query(sql, [user_id], callback);
      return;
    }
    
    // Promise version
    return Booking.getByUserId(user_id);
  },

  // =============== UTILITY METHODS ===============
  getBookingsByFieldAndDate: async (fieldId, date) => {
    const [results] = await db.promise().query(
      `SELECT * FROM bookings WHERE field_id = ? AND booking_date = ? AND status != 'cancelled' ORDER BY start_time`,
      [fieldId, date]
    );
    return results;
  },

  getBookingConflicts: async (fieldId, date, startTime, endTime, excludeId = null) => {
    let sql = `
      SELECT * FROM bookings 
      WHERE field_id = ? AND booking_date = ? AND status != 'cancelled'
      AND (
        (start_time <= ? AND end_time > ?) OR
        (start_time < ? AND end_time >= ?) OR
        (start_time >= ? AND end_time <= ?)
      )
    `;
    let params = [fieldId, date, startTime, startTime, endTime, endTime, startTime, endTime];

    if (excludeId) {
      sql += ' AND id != ?';
      params.push(excludeId);
    }

    const [results] = await db.promise().query(sql, params);
    return results;
  }
};

module.exports = Booking;