// ====== backend/controllers/admin/bookingController.js ======
const db = require('../../config/db');

exports.getAllBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    // Filters
    const search = req.query.search;
    const status = req.query.status;
    const fieldId = req.query.field_id;
    const dateFilter = req.query.date_filter;

    let whereClause = '';
    let params = [];

    // Build where conditions
    const conditions = [];
    
    if (search) {
      conditions.push('(u.name LIKE ? OR u.phone_number LIKE ? OR f.name LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    if (status) {
      conditions.push('b.status = ?');
      params.push(status);
    }
    
    if (fieldId) {
      conditions.push('b.field_id = ?');
      params.push(fieldId);
    }
    
    if (dateFilter) {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      
      switch (dateFilter) {
        case 'today':
          conditions.push('b.booking_date = ?');
          params.push(todayStr);
          break;
        case 'tomorrow':
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          conditions.push('b.booking_date = ?');
          params.push(tomorrow.toISOString().split('T')[0]);
          break;
        case 'week':
          const weekEnd = new Date(today);
          weekEnd.setDate(weekEnd.getDate() + 7);
          conditions.push('b.booking_date BETWEEN ? AND ?');
          params.push(todayStr, weekEnd.toISOString().split('T')[0]);
          break;
        case 'month':
          const monthEnd = new Date(today);
          monthEnd.setMonth(monthEnd.getMonth() + 1);
          conditions.push('b.booking_date BETWEEN ? AND ?');
          params.push(todayStr, monthEnd.toISOString().split('T')[0]);
          break;
      }
    }

    if (conditions.length > 0) {
      whereClause = 'WHERE ' + conditions.join(' AND ');
    }

    // Main query
    const [results] = await db.promise().query(`
      SELECT 
        b.id, b.booking_date, b.start_time, b.end_time, 
        b.total_amount, b.status, b.payment_status, b.notes, b.created_at,
        u.name as customer_name, u.phone_number, u.email,
        f.id as field_id, f.name as field_name, f.type as field_type
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN fields f ON b.field_id = f.id
      ${whereClause}
      ORDER BY b.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);

    // Count query
    const [countResult] = await db.promise().query(`
      SELECT COUNT(*) as total
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN fields f ON b.field_id = f.id
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
    console.error('Error getting all bookings:', error);
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

exports.updateBooking = async (req, res) => {
  const { bookingId } = req.params;
  const { 
    customer_name, 
    phone_number, 
    field_id, 
    booking_date, 
    start_time, 
    end_time, 
    total_amount, 
    status, 
    notes 
  } = req.body;

  try {
    // Check if booking exists
    const [existing] = await db.promise().query(
      'SELECT * FROM bookings WHERE id = ?', 
      [bookingId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy booking' });
    }

    // Update user info if provided
    if (customer_name || phone_number) {
      await db.promise().query(`
        UPDATE users SET name = ?, phone_number = ? 
        WHERE id = ?
      `, [
        customer_name || existing[0].customer_name,
        phone_number || existing[0].phone_number,
        existing[0].user_id
      ]);
    }

    // Update booking
    const [result] = await db.promise().query(`
      UPDATE bookings 
      SET field_id = ?, booking_date = ?, start_time = ?, end_time = ?, 
          total_amount = ?, status = ?, notes = ?, updated_at = NOW()
      WHERE id = ?
    `, [
      field_id || existing[0].field_id,
      booking_date || existing[0].booking_date,
      start_time || existing[0].start_time,
      end_time || existing[0].end_time,
      total_amount || existing[0].total_amount,
      status || existing[0].status,
      notes !== undefined ? notes : existing[0].notes,
      bookingId
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không thể cập nhật booking' });
    }

    res.json({ message: 'Cập nhật booking thành công' });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Lỗi cập nhật booking' });
  }
};

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