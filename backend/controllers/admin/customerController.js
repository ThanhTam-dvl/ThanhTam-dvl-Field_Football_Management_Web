// ====== backend/controllers/admin/customerController.js ======
const db = require('../../config/db');

// Lấy danh sách khách hàng với phân trang và filter
exports.getCustomers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    // Filters
    const search = req.query.search;
    const status = req.query.status; // active, inactive
    const sortBy = req.query.sort || 'created_at';
    const sortOrder = req.query.order || 'DESC';

    let whereClause = ' WHERE role = "customer"';
    let params = [];

    // Search filter
    if (search) {
      whereClause += ' AND (name LIKE ? OR phone_number LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Status filter
    if (status) {
      whereClause += ' AND is_active = ?';
      params.push(status === 'active' ? 1 : 0);
    }

    // Get customers with booking statistics
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
          COUNT(*) as total_bookings_calc,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_bookings,
          SUM(CASE WHEN status = 'completed' THEN total_amount ELSE 0 END) as total_spent,
          MAX(CASE WHEN status = 'completed' THEN booking_date ELSE NULL END) as last_booking_date
        FROM bookings 
        GROUP BY user_id
      ) booking_stats ON u.id = booking_stats.user_id
      ${whereClause}
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);

    // Count total
    const [countResult] = await db.promise().query(`
      SELECT COUNT(*) as total FROM users ${whereClause}
    `, params);

    res.json({
      customers: results,
      pagination: {
        page,
        limit,
        total: countResult[0].total,
        totalPages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Error getting customers:', error);
    res.status(500).json({ error: 'Lỗi lấy danh sách khách hàng' });
  }
};

// Lấy thông tin chi tiết một khách hàng
exports.getCustomerById = async (req, res) => {
  try {
    const { customerId } = req.params;

    const [customerResult] = await db.promise().query(`
      SELECT 
        u.*,
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
        WHERE user_id = ?
        GROUP BY user_id
      ) booking_stats ON u.id = booking_stats.user_id
      WHERE u.id = ?
    `, [customerId, customerId]);

    if (customerResult.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy khách hàng' });
    }

    res.json(customerResult[0]);
  } catch (error) {
    console.error('Error getting customer by id:', error);
    res.status(500).json({ error: 'Lỗi lấy thông tin khách hàng' });
  }
};

// Tạo khách hàng mới
exports.createCustomer = async (req, res) => {
  try {
    const { name, phone_number, email } = req.body;

    if (!name || !phone_number) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    // Check phone duplicate
    const [existing] = await db.promise().query(
      'SELECT id FROM users WHERE phone_number = ?',
      [phone_number]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Số điện thoại đã tồn tại' });
    }

    const [result] = await db.promise().query(`
      INSERT INTO users (name, phone_number, email, role, created_at) 
      VALUES (?, ?, ?, 'customer', NOW())
    `, [name, phone_number, email || null]);

    res.status(201).json({ 
      message: 'Tạo khách hàng thành công', 
      customerId: result.insertId 
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Lỗi tạo khách hàng' });
  }
};

// Cập nhật thông tin khách hàng
exports.updateCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { name, phone_number, email, is_active } = req.body;

    // Check if customer exists
    const [existing] = await db.promise().query(
      'SELECT id FROM users WHERE id = ?',
      [customerId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy khách hàng' });
    }

    // Check phone duplicate (exclude current customer)
    if (phone_number) {
      const [duplicate] = await db.promise().query(
        'SELECT id FROM users WHERE phone_number = ? AND id != ?',
        [phone_number, customerId]
      );

      if (duplicate.length > 0) {
        return res.status(400).json({ error: 'Số điện thoại đã tồn tại' });
      }
    }

    const [result] = await db.promise().query(`
      UPDATE users 
      SET name = ?, phone_number = ?, email = ?, is_active = ?, updated_at = NOW()
      WHERE id = ?
    `, [name, phone_number, email || null, is_active, customerId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không thể cập nhật khách hàng' });
    }

    res.json({ message: 'Cập nhật khách hàng thành công' });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Lỗi cập nhật khách hàng' });
  }
};

// Xóa khách hàng (soft delete)
exports.deleteCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    const [result] = await db.promise().query(`
      UPDATE users SET is_active = 0, updated_at = NOW() WHERE id = ?
    `, [customerId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy khách hàng' });
    }

    res.json({ message: 'Xóa khách hàng thành công' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: 'Lỗi xóa khách hàng' });
  }
};

// Cập nhật trạng thái nhiều khách hàng
exports.bulkUpdateCustomers = async (req, res) => {
  try {
    const { customerIds, action } = req.body; // action: 'activate' | 'deactivate' | 'delete'

    if (!customerIds || !Array.isArray(customerIds) || customerIds.length === 0) {
      return res.status(400).json({ error: 'Danh sách khách hàng không hợp lệ' });
    }

    let query = '';
    let newStatus = null;

    switch (action) {
      case 'activate':
        newStatus = 1;
        query = 'UPDATE users SET is_active = 1, updated_at = NOW() WHERE id IN (?)';
        break;
      case 'deactivate':
        newStatus = 0;
        query = 'UPDATE users SET is_active = 0, updated_at = NOW() WHERE id IN (?)';
        break;
      case 'delete':
        newStatus = 0;
        query = 'UPDATE users SET is_active = 0, updated_at = NOW() WHERE id IN (?)';
        break;
      default:
        return res.status(400).json({ error: 'Hành động không hợp lệ' });
    }

    const [result] = await db.promise().query(query, [customerIds]);

    res.json({ 
      message: `Cập nhật thành công ${result.affectedRows} khách hàng`,
      affectedRows: result.affectedRows
    });
  } catch (error) {
    console.error('Error bulk updating customers:', error);
    res.status(500).json({ error: 'Lỗi cập nhật hàng loạt' });
  }
};

// Lấy thống kê khách hàng
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
    console.error('Error getting customer stats:', error);
    res.status(500).json({ error: 'Lỗi lấy thống kê khách hàng' });
  }
};
