// backend/controllers/adminController.js
const Admin = require('../models/Admin');
const db = require('../config/db');

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

exports.getAllBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const status = req.query.status;
    const date = req.query.date;

    let whereClause = '';
    let params = [];

    if (status) {
      whereClause += ' WHERE b.status = ?';
      params.push(status);
    }

    if (date) {
      whereClause += status ? ' AND' : ' WHERE';
      whereClause += ' b.booking_date = ?';
      params.push(date);
    }

    const [results] = await db.promise().query(`
      SELECT 
        b.id, b.booking_date, b.start_time, b.end_time, 
        b.total_amount, b.status, b.payment_status, b.notes, b.created_at,
        u.name as customer_name, u.phone_number, u.email,
        f.name as field_name, f.type as field_type
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN fields f ON b.field_id = f.id
      ${whereClause}
      ORDER BY b.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);

    // Đếm tổng số
    const [countResult] = await db.promise().query(`
      SELECT COUNT(*) as total
      FROM bookings b
      ${whereClause}
    `, params);

    res.json({
      bookings: results,
      pagination: {
        page,
        limit,
        total: countResult[0].total,
        totalPages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi lấy danh sách đặt sân' });
  }
};

exports.updateBookingStatus = async (req, res) => {
  const { bookingId } = req.params;
  const { status, notes } = req.body;

  if (!['pending', 'approved', 'cancelled', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
  }

  try {
    const [result] = await db.promise().query(`
      UPDATE bookings 
      SET status = ?, notes = ?, updated_at = NOW() 
      WHERE id = ?
    `, [status, notes || null, bookingId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy booking' });
    }

    res.json({ message: 'Cập nhật trạng thái thành công' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi cập nhật trạng thái' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const search = req.query.search;

    let whereClause = ' WHERE role = "customer"';
    let params = [];

    if (search) {
      whereClause += ' AND (name LIKE ? OR phone_number LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const [results] = await db.promise().query(`
      SELECT 
        id, phone_number, name, email, is_active, 
        total_bookings, cancelled_bookings, created_at
      FROM users
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);

    const [countResult] = await db.promise().query(`
      SELECT COUNT(*) as total FROM users ${whereClause}
    `, params);

    res.json({
      users: results,
      pagination: {
        page,
        limit,
        total: countResult[0].total,
        totalPages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi lấy danh sách khách hàng' });
  }
};

exports.getFields = async (req, res) => {
  try {
    const [results] = await db.promise().query(`
      SELECT 
        f.*,
        COUNT(b.id) as total_bookings,
        SUM(CASE WHEN b.booking_date = CURDATE() THEN 1 ELSE 0 END) as today_bookings
      FROM fields f
      LEFT JOIN bookings b ON f.id = b.field_id AND b.status != 'cancelled'
      WHERE f.is_active = 1
      GROUP BY f.id
      ORDER BY f.name
    `);

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi lấy danh sách sân' });
  }
};

exports.createField = async (req, res) => {
  const { name, type, price_per_hour, description, facilities } = req.body;

  if (!name || !type || !price_per_hour) {
    return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
  }

  try {
    const [result] = await db.promise().query(`
      INSERT INTO fields (name, type, price_per_hour, description, facilities)
      VALUES (?, ?, ?, ?, ?)
    `, [name, type, price_per_hour, description, JSON.stringify(facilities || [])]);

    res.status(201).json({ 
      message: 'Tạo sân thành công', 
      fieldId: result.insertId 
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Tên sân đã tồn tại' });
    }
    res.status(500).json({ error: 'Lỗi tạo sân' });
  }
};

exports.updateField = async (req, res) => {
  const { fieldId } = req.params;
  const { name, type, price_per_hour, description, facilities, is_active } = req.body;

  try {
    const [result] = await db.promise().query(`
      UPDATE fields 
      SET name = ?, type = ?, price_per_hour = ?, description = ?, 
          facilities = ?, is_active = ?, updated_at = NOW()
      WHERE id = ?
    `, [
      name, type, price_per_hour, description, 
      JSON.stringify(facilities || []), is_active, fieldId
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy sân' });
    }

    res.json({ message: 'Cập nhật sân thành công' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi cập nhật sân' });
  }
};

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

// Thêm các function này vào cuối file adminController.js (trước module.exports)

// Lấy danh sách sân kèm lịch đặt
exports.getFieldsWithBookings = async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];
    
    const [results] = await db.promise().query(`
      SELECT 
        f.id, f.name, f.type, f.price_per_hour,
        b.id as booking_id, b.start_time, b.end_time, 
        b.status, u.name as customer_name, u.phone_number
      FROM fields f
      LEFT JOIN bookings b ON f.id = b.field_id AND b.booking_date = ? AND b.status != 'cancelled'
      LEFT JOIN users u ON b.user_id = u.id
      WHERE f.is_active = 1
      ORDER BY f.name, b.start_time
    `, [date]);

    // Group bookings by field
    const fieldsMap = new Map();
    results.forEach(row => {
      if (!fieldsMap.has(row.id)) {
        fieldsMap.set(row.id, {
          id: row.id,
          name: row.name,
          type: row.type,
          price_per_hour: row.price_per_hour,
          bookings: []
        });
      }
      
      if (row.booking_id) {
        fieldsMap.get(row.id).bookings.push({
          id: row.booking_id,
          start_time: row.start_time,
          end_time: row.end_time,
          status: row.status,
          customer_name: row.customer_name,
          phone_number: row.phone_number
        });
      }
    });

    res.json(Array.from(fieldsMap.values()));
  } catch (error) {
    console.error('Error getting fields with bookings:', error);
    res.status(500).json({ error: 'Lỗi lấy danh sách sân với lịch đặt' });
  }
};

// Tạo booking thủ công bởi admin
exports.createManualBooking = async (req, res) => {
  const { 
    field_id, booking_date, start_time, end_time, 
    customer_name, phone_number, notes, total_amount 
  } = req.body;

  if (!field_id || !booking_date || !start_time || !end_time || !customer_name || !phone_number) {
    return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
  }

  try {
    // Kiểm tra xem khung giờ có bị trùng không
    const [existingBookings] = await db.promise().query(`
      SELECT id FROM bookings 
      WHERE field_id = ? AND booking_date = ? 
      AND status != 'cancelled'
      AND (
        (start_time <= ? AND end_time > ?) OR
        (start_time < ? AND end_time >= ?) OR
        (start_time >= ? AND end_time <= ?)
      )
    `, [field_id, booking_date, start_time, start_time, end_time, end_time, start_time, end_time]);

    if (existingBookings.length > 0) {
      return res.status(400).json({ error: 'Khung giờ này đã có người đặt' });
    }

    // Tìm hoặc tạo user với số điện thoại
    let userId;
    const [existingUser] = await db.promise().query(`
      SELECT id FROM users WHERE phone_number = ?
    `, [phone_number]);

    if (existingUser.length > 0) {
      userId = existingUser[0].id;
      // Cập nhật tên nếu khác
      await db.promise().query(`
        UPDATE users SET name = ? WHERE id = ?
      `, [customer_name, userId]);
    } else {
      // Tạo user mới
      const [newUser] = await db.promise().query(`
        INSERT INTO users (phone_number, name, role, created_at) 
        VALUES (?, ?, 'customer', NOW())
      `, [phone_number, customer_name]);
      userId = newUser.insertId;
    }

    // Tạo booking
    const [result] = await db.promise().query(`
      INSERT INTO bookings (
        user_id, field_id, booking_date, start_time, end_time, 
        total_amount, status, payment_status, notes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, 'approved', 'pending', ?, NOW())
    `, [userId, field_id, booking_date, start_time, end_time, total_amount, notes]);

    res.status(201).json({ 
      message: 'Tạo booking thành công', 
      bookingId: result.insertId 
    });
  } catch (error) {
    console.error('Error creating manual booking:', error);
    res.status(500).json({ error: 'Lỗi tạo booking' });
  }
};

// Xóa booking
exports.deleteBooking = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const [result] = await db.promise().query(`
      DELETE FROM bookings WHERE id = ?
    `, [bookingId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy booking' });
    }

    res.json({ message: 'Xóa booking thành công' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Lỗi xóa booking' });
  }
};