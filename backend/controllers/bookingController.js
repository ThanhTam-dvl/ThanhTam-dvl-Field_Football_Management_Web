// backend/controllers/bookingController.js - ADD getRecentBookings method
const db = require('../config/db');
const Booking = require('../models/Booking');
const Field = require('../models/Field');

// =============== CUSTOMER BOOKING APIs ===============
exports.createBooking = async (req, res) => {
  try {
    const data = req.body;
    
    if (!data.user_id || !data.field_id || !data.booking_date || !data.start_time || !data.end_time) {
      return res.status(400).json({ error: 'Thiếu thông tin đặt sân' });
    }

    const field = await Field.findById(data.field_id);
    if (!field) {
      return res.status(400).json({ error: 'Không tìm thấy sân' });
    }

    const totalAmount = await Booking.calculatePrice(field.type, data.start_time, data.end_time);
    data.total_amount = totalAmount;

    const result = await Booking.create(data);
    res.status(201).json({ 
      message: 'Đặt sân thành công', 
      bookingId: result.insertId 
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Lỗi tạo booking' });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.getByUserId(userId);
    res.json(bookings);
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ error: 'Không thể lấy lịch sử đặt sân' });
  }
};

exports.getBookingsByDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Thiếu ngày' });
    }

    const bookings = await Booking.getByDate(date);
    res.json(bookings);
  } catch (error) {
    console.error('Get bookings by date error:', error);
    res.status(500).json({ error: 'Lỗi truy vấn' });
  }
};

// =============== ADMIN BOOKING MANAGEMENT ===============
exports.getAllBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    const filters = {
      search: req.query.search,
      status: req.query.status,
      field_id: req.query.field_id,
      date_filter: req.query.date_filter
    };

    let whereClause = '';
    let params = [];
    const conditions = [];
    
    if (filters.search) {
      conditions.push('(u.name LIKE ? OR u.phone_number LIKE ? OR f.name LIKE ?)');
      params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
    }
    
    if (filters.status) {
      conditions.push('b.status = ?');
      params.push(filters.status);
    }
    
    if (filters.field_id) {
      conditions.push('b.field_id = ?');
      params.push(filters.field_id);
    }
    
    if (filters.date_filter) {
      const today = new Date().toISOString().split('T')[0];
      switch (filters.date_filter) {
        case 'today':
          conditions.push('b.booking_date = ?');
          params.push(today);
          break;
        case 'tomorrow':
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          conditions.push('b.booking_date = ?');
          params.push(tomorrow.toISOString().split('T')[0]);
          break;
        case 'week':
          const weekEnd = new Date();
          weekEnd.setDate(weekEnd.getDate() + 7);
          conditions.push('b.booking_date BETWEEN ? AND ?');
          params.push(today, weekEnd.toISOString().split('T')[0]);
          break;
        case 'month':
          const monthEnd = new Date();
          monthEnd.setMonth(monthEnd.getMonth() + 1);
          conditions.push('b.booking_date BETWEEN ? AND ?');
          params.push(today, monthEnd.toISOString().split('T')[0]);
          break;
      }
    }

    if (conditions.length > 0) {
      whereClause = 'WHERE ' + conditions.join(' AND ');
    }

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
    console.error('Get all bookings error:', error);
    res.status(500).json({ error: 'Lỗi lấy danh sách đặt sân' });
  }
};

// ADD THIS METHOD FOR RECENT BOOKINGS
exports.getRecentBookings = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    console.log('Getting recent bookings with limit:', limit);
    
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
    `, [limit]);
    
    console.log('Recent bookings found:', results.length);
    res.json(results);
  } catch (error) {
    console.error('Get recent bookings error:', error);
    res.status(500).json({ error: 'Lỗi lấy danh sách đặt sân' });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, notes } = req.body;

    if (!['pending', 'approved', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
    }

    const result = await Booking.updateStatus(bookingId, status, notes);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy booking' });
    }

    res.json({ message: 'Cập nhật trạng thái thành công' });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ error: 'Lỗi cập nhật trạng thái' });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const updateData = req.body;

    const result = await Booking.update(bookingId, updateData);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không thể cập nhật booking' });
    }

    res.json({ message: 'Cập nhật booking thành công' });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ error: 'Lỗi cập nhật booking' });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const result = await Booking.delete(bookingId);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy booking' });
    }

    res.json({ message: 'Xóa booking thành công' });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ error: 'Lỗi xóa booking' });
  }
};

exports.createManualBooking = async (req, res) => {
  try {
    const { 
      field_id, booking_date, start_time, end_time, 
      customer_name, phone_number, notes, total_amount 
    } = req.body;

    if (!field_id || !booking_date || !start_time || !end_time || !customer_name || !phone_number) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    const hasConflict = await Booking.checkTimeConflict(field_id, booking_date, start_time, end_time);
    if (hasConflict) {
      return res.status(400).json({ error: 'Khung giờ này đã có người đặt' });
    }

    const user = await User.findOrCreateByPhone(phone_number, customer_name);
    
    const result = await Booking.createManual({
      user_id: user.id,
      field_id,
      booking_date,
      start_time,
      end_time,
      total_amount,
      notes
    });

    res.status(201).json({ 
      message: 'Tạo booking thành công', 
      bookingId: result.insertId 
    });
  } catch (error) {
    console.error('Create manual booking error:', error);
    res.status(500).json({ error: 'Lỗi tạo booking' });
  }
};