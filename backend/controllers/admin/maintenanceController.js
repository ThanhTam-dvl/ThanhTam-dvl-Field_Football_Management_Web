// backend/controllers/admin/maintenanceController.js
const Maintenance = require('../../models/Maintenance');
const db = require('../../config/db');

// Lấy tất cả lịch bảo trì (có phân trang và filter)
exports.getAllMaintenances = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    // Filters
    const search = req.query.search;
    const fieldId = req.query.field_id;
    const status = req.query.status; // active, upcoming, completed, cancelled
    const type = req.query.type; // regular, holiday, emergency
    const dateFilter = req.query.date_filter; // today, tomorrow, week, month
    
    let whereClause = 'WHERE m.is_active = 1';
    let params = [];
    
    // Search filter
    if (search) {
      whereClause += ' AND (f.name LIKE ? OR m.reason LIKE ? OR m.description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    // Field filter
    if (fieldId && fieldId !== 'all') {
      if (fieldId === 'all-fields') {
        // Không filter gì - hiển thị tất cả để user thấy các maintenance của tất cả sân
        // (Vì chúng ta không dùng field_id = NULL nữa)
      } else {
        whereClause += ' AND m.field_id = ?';
        params.push(fieldId);
      }
    }
    
    // Type filter (từ file tĩnh có regular, holiday, emergency)
    if (type && type !== 'all') {
      whereClause += ' AND m.type = ?';
      params.push(type);
    }
    
    // Status filter - tính toán dựa trên thời gian
    if (status && status !== 'all') {
      const now = new Date();
      switch (status) {
        case 'active':
          whereClause += ' AND ? BETWEEN CONCAT(m.maintenance_date, " ", COALESCE(m.start_time, "00:00:00")) AND CONCAT(m.maintenance_date, " ", COALESCE(m.end_time, "23:59:59"))';
          params.push(now.toISOString().slice(0, 19).replace('T', ' '));
          break;
        case 'upcoming':
          whereClause += ' AND CONCAT(m.maintenance_date, " ", COALESCE(m.start_time, "00:00:00")) > ?';
          params.push(now.toISOString().slice(0, 19).replace('T', ' '));
          break;
        case 'completed':
          whereClause += ' AND CONCAT(m.maintenance_date, " ", COALESCE(m.end_time, "23:59:59")) < ?';
          params.push(now.toISOString().slice(0, 19).replace('T', ' '));
          break;
      }
    }
    
    // Date filter
    if (dateFilter && dateFilter !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      switch (dateFilter) {
        case 'today':
          whereClause += ' AND m.maintenance_date = ?';
          params.push(today.toISOString().split('T')[0]);
          break;
        case 'tomorrow':
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          whereClause += ' AND m.maintenance_date = ?';
          params.push(tomorrow.toISOString().split('T')[0]);
          break;
        case 'week':
          const weekEnd = new Date(today);
          weekEnd.setDate(weekEnd.getDate() + 7);
          whereClause += ' AND m.maintenance_date BETWEEN ? AND ?';
          params.push(today.toISOString().split('T')[0], weekEnd.toISOString().split('T')[0]);
          break;
        case 'month':
          const monthEnd = new Date(today);
          monthEnd.setMonth(monthEnd.getMonth() + 1);
          whereClause += ' AND m.maintenance_date BETWEEN ? AND ?';
          params.push(today.toISOString().split('T')[0], monthEnd.toISOString().split('T')[0]);
          break;
      }
    }
    
    // Main query
    const sql = `
      SELECT 
        m.*,
        f.name as field_name,
        f.type as field_type,
        CASE 
          WHEN NOW() BETWEEN CONCAT(m.maintenance_date, ' ', COALESCE(m.start_time, '00:00:00')) 
               AND CONCAT(m.maintenance_date, ' ', COALESCE(m.end_time, '23:59:59')) THEN 'active'
          WHEN NOW() < CONCAT(m.maintenance_date, ' ', COALESCE(m.start_time, '00:00:00')) THEN 'upcoming'
          ELSE 'completed'
        END as status
      FROM maintenance_schedules m
      LEFT JOIN fields f ON m.field_id = f.id
      ${whereClause}
      ORDER BY m.maintenance_date DESC, m.start_time DESC
      LIMIT ? OFFSET ?
    `;
    
    const countSql = `
      SELECT COUNT(*) as total
      FROM maintenance_schedules m
      LEFT JOIN fields f ON m.field_id = f.id
      ${whereClause}
    `;
    
    const [results] = await db.promise().query(sql, [...params, limit, offset]);
    const [countResult] = await db.promise().query(countSql, params);
    
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);
    
    res.json({
      data: results,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
    
  } catch (error) {
    console.error('Error getting maintenances:', error);
    res.status(500).json({ error: 'Lỗi lấy danh sách bảo trì' });
  }
};

// Tạo lịch bảo trì mới
exports.createMaintenance = async (req, res) => {
  try {
    const {
      field_id,
      maintenance_date,
      start_time,
      end_time,
      reason,
      description,
      type = 'regular'
    } = req.body;
    
    // Validation
    if (!maintenance_date || !reason) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }
    
    // Nếu field_id là 'all-fields', tạo bảo trì cho tất cả sân
    if (field_id === 'all-fields') {
      const [fields] = await db.promise().query('SELECT id FROM fields WHERE is_active = 1');
      
      const promises = fields.map(field => {
        return new Promise((resolve, reject) => {
          const data = {
            field_id: field.id,
            maintenance_date,
            start_time: start_time || '00:00:00',
            end_time: end_time || '23:59:59',
            reason,
            description,
            type
          };
          Maintenance.create(data, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          });
        });
      });
      
      await Promise.all(promises);
      res.status(201).json({ message: 'Đã tạo lịch bảo trì cho tất cả sân' });
      
    } else {
      // Tạo bảo trì cho sân cụ thể
      const data = {
        field_id: field_id || null,
        maintenance_date,
        start_time: start_time || '00:00:00',
        end_time: end_time || '23:59:59',
        reason,
        description,
        type
      };
      
      Maintenance.create(data, (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Không thể tạo lịch bảo trì' });
        }
        res.status(201).json({ 
          message: 'Đã tạo lịch bảo trì', 
          id: result.insertId 
        });
      });
    }
    
  } catch (error) {
    console.error('Error creating maintenance:', error);
    res.status(500).json({ error: 'Lỗi tạo lịch bảo trì' });
  }
};

// Cập nhật lịch bảo trì
exports.updateMaintenance = async (req, res) => {
  try {
    const maintenanceId = req.params.id;
    const updateData = req.body;
    
    const sql = `
      UPDATE maintenance_schedules 
      SET field_id = ?, maintenance_date = ?, start_time = ?, end_time = ?, 
          reason = ?, description = ?, type = ?, updated_at = NOW()
      WHERE id = ? AND is_active = 1
    `;
    
    const values = [
      updateData.field_id,
      updateData.maintenance_date,
      updateData.start_time || '00:00:00',
      updateData.end_time || '23:59:59',
      updateData.reason,
      updateData.description,
      updateData.type || 'regular',
      maintenanceId
    ];
    
    const [result] = await db.promise().query(sql, values);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy lịch bảo trì' });
    }
    
    res.json({ message: 'Cập nhật lịch bảo trì thành công' });
    
  } catch (error) {
    console.error('Error updating maintenance:', error);
    res.status(500).json({ error: 'Lỗi cập nhật lịch bảo trì' });
  }
};

// Xóa lịch bảo trì (soft delete)
exports.deleteMaintenance = async (req, res) => {
  try {
    const maintenanceId = req.params.id;
    
    const sql = 'UPDATE maintenance_schedules SET is_active = 0 WHERE id = ?';
    const [result] = await db.promise().query(sql, [maintenanceId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy lịch bảo trì' });
    }
    
    res.json({ message: 'Xóa lịch bảo trì thành công' });
    
  } catch (error) {
    console.error('Error deleting maintenance:', error);
    res.status(500).json({ error: 'Lỗi xóa lịch bảo trì' });
  }
};

// Lấy chi tiết lịch bảo trì
exports.getMaintenanceById = async (req, res) => {
  try {
    const maintenanceId = req.params.id;
    
    const sql = `
      SELECT 
        m.*,
        f.name as field_name,
        f.type as field_type,
        CASE 
          WHEN NOW() BETWEEN CONCAT(m.maintenance_date, ' ', COALESCE(m.start_time, '00:00:00')) 
               AND CONCAT(m.maintenance_date, ' ', COALESCE(m.end_time, '23:59:59')) THEN 'active'
          WHEN NOW() < CONCAT(m.maintenance_date, ' ', COALESCE(m.start_time, '00:00:00')) THEN 'upcoming'
          ELSE 'completed'
        END as status
      FROM maintenance_schedules m
      LEFT JOIN fields f ON m.field_id = f.id
      WHERE m.id = ? AND m.is_active = 1
    `;
    
    const [results] = await db.promise().query(sql, [maintenanceId]);
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy lịch bảo trì' });
    }
    
    res.json(results[0]);
    
  } catch (error) {
    console.error('Error getting maintenance detail:', error);
    res.status(500).json({ error: 'Lỗi lấy chi tiết bảo trì' });
  }
};

// Lấy thống kê bảo trì
exports.getMaintenanceStats = async (req, res) => {
  try {
    const sql = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE 
          WHEN NOW() BETWEEN CONCAT(maintenance_date, ' ', COALESCE(start_time, '00:00:00')) 
               AND CONCAT(maintenance_date, ' ', COALESCE(end_time, '23:59:59')) 
          THEN 1 ELSE 0 END) as active,
        SUM(CASE 
          WHEN NOW() < CONCAT(maintenance_date, ' ', COALESCE(start_time, '00:00:00')) 
          THEN 1 ELSE 0 END) as upcoming,
        SUM(CASE 
          WHEN NOW() > CONCAT(maintenance_date, ' ', COALESCE(end_time, '23:59:59')) 
          THEN 1 ELSE 0 END) as completed
      FROM maintenance_schedules 
      WHERE is_active = 1
    `;
    
    const [results] = await db.promise().query(sql);
    res.json(results[0]);
    
  } catch (error) {
    console.error('Error getting maintenance stats:', error);
    res.status(500).json({ error: 'Lỗi lấy thống kê bảo trì' });
  }
};