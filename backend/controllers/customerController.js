// backend/controllers/customerController.js - Customer Management
const db = require('../config/db');
const User = require('../models/User'); // [NOTE] Cần models

exports.getCustomers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    const filters = {
      search: req.query.search,
      status: req.query.status,
      sort: req.query.sort || 'created_at',
      order: req.query.order || 'DESC'
    };

    let whereClause = ' WHERE role = "customer"';
    let params = [];

    if (filters.search) {
      whereClause += ' AND (name LIKE ? OR phone_number LIKE ? OR email LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
    }

    if (filters.status) {
      whereClause += ' AND is_active = ?';
      params.push(filters.status === 'active' ? 1 : 0);
    }

    const [results] = await db.promise().query(`
      SELECT 
        u.id, u.phone_number, u.name, u.email, u.is_active, 
        u.total_bookings, u.cancelled_bookings, u.created_at,
        COALESCE(booking_stats.completed_bookings, 0) as completed_bookings,
        COALESCE(booking_stats.total_spent, 0) as total_spent,
        booking_stats.last_booking_date
      FROM users u
      LEFT JOIN (
        SELECT 
          user_id,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_bookings,
          SUM(CASE WHEN status = 'completed' THEN total_amount ELSE 0 END) as total_spent,
          MAX(CASE WHEN status = 'completed' THEN booking_date ELSE NULL END) as last_booking_date
        FROM bookings 
        GROUP BY user_id
      ) booking_stats ON u.id = booking_stats.user_id
      ${whereClause}
      ORDER BY ${filters.sort} ${filters.order}
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);

    const [countResult] = await db.promise().query(`
      SELECT COUNT(*) as total FROM users ${whereClause}
    `, params);

    res.json({
      customers: results,
      pagination: {
        page, limit,
        total: countResult[0].total,
        totalPages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ error: 'Lỗi lấy danh sách khách hàng' });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const { customerId } = req.params;
    const customer = await User.getCustomerDetail(customerId);
    
    if (!customer) {
      return res.status(404).json({ error: 'Không tìm thấy khách hàng' });
    }
    
    res.json(customer);
  } catch (error) {
    console.error('Get customer by id error:', error);
    res.status(500).json({ error: 'Lỗi lấy thông tin khách hàng' });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const { name, phone_number, email } = req.body;

    if (!name || !phone_number) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    const customerId = await User.create({ 
      name, 
      phone_number, 
      email, 
      role: 'customer' 
    });
    
    res.status(201).json({ 
      message: 'Tạo khách hàng thành công', 
      customerId 
    });
  } catch (error) {
    console.error('Create customer error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Số điện thoại đã tồn tại' });
    }
    res.status(500).json({ error: 'Lỗi tạo khách hàng' });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const updateData = req.body;

    const result = await User.update(customerId, updateData);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy khách hàng' });
    }

    res.json({ message: 'Cập nhật khách hàng thành công' });
  } catch (error) {
    console.error('Update customer error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Số điện thoại đã tồn tại' });
    }
    res.status(500).json({ error: 'Lỗi cập nhật khách hàng' });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    const result = await User.softDelete(customerId);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy khách hàng' });
    }

    res.json({ message: 'Xóa khách hàng thành công' });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ error: 'Lỗi xóa khách hàng' });
  }
};

exports.bulkUpdateCustomers = async (req, res) => {
  try {
    const { customerIds, action } = req.body;

    if (!customerIds || !Array.isArray(customerIds) || customerIds.length === 0) {
      return res.status(400).json({ error: 'Danh sách khách hàng không hợp lệ' });
    }

    const result = await User.bulkUpdate(customerIds, action);
    res.json({ 
      message: `Cập nhật thành công ${result.affectedRows} khách hàng`,
      affectedRows: result.affectedRows
    });
  } catch (error) {
    console.error('Bulk update customers error:', error);
    res.status(500).json({ error: 'Lỗi cập nhật hàng loạt' });
  }
};

exports.getCustomerStats = async (req, res) => {
  try {
    const [stats] = await db.promise().query(`
      SELECT 
        COUNT(*) as total_customers,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_customers,
        SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) as inactive_customers,
        SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as new_customers_30d,
        SUM(CASE WHEN total_bookings >= 10 THEN 1 ELSE 0 END) as vip_customers
      FROM users 
      WHERE role = 'customer'
    `);

    res.json(stats[0]);
  } catch (error) {
    console.error('Get customer stats error:', error);
    res.status(500).json({ error: 'Lỗi lấy thống kê khách hàng' });
  }
};