// backend/controllers/maintenanceController.js - Maintenance Management
const db = require('../config/db');
const Maintenance = require('../models/Maintenance'); // [NOTE] Cần models

// =============== CUSTOMER MAINTENANCE APIs ===============
exports.getMaintenanceSchedule = async (req, res) => {
  try {
    const { field_id, date } = req.query;
    const schedules = await Maintenance.getByFieldAndDate(field_id, date);
    res.json(schedules);
  } catch (error) {
    console.error('Get maintenance schedule error:', error);
    res.status(500).json({ error: 'Lỗi lấy lịch bảo trì' });
  }
};

exports.getActiveMaintenances = async (req, res) => {
  try {
    const maintenances = await Maintenance.getActive();
    res.json(maintenances);
  } catch (error) {
    console.error('Get active maintenances error:', error);
    res.status(500).json({ error: 'Lỗi lấy lịch bảo trì đang hoạt động' });
  }
};

// =============== ADMIN MAINTENANCE MANAGEMENT ===============
exports.getAllMaintenances = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    const filters = {
      search: req.query.search,
      field_id: req.query.field_id,
      status: req.query.status,
      type: req.query.type,
      date_filter: req.query.date_filter
    };
    
    let whereClause = 'WHERE m.is_active = 1';
    let params = [];
    
    if (filters.search) {
      whereClause += ' AND (f.name LIKE ? OR m.reason LIKE ? OR m.description LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    if (filters.field_id && filters.field_id !== 'all') {
      whereClause += ' AND m.field_id = ?';
      params.push(filters.field_id);
    }
    
    if (filters.type && filters.type !== 'all') {
      whereClause += ' AND m.type = ?';
      params.push(filters.type);
    }
    
    if (filters.status && filters.status !== 'all') {
      const now = new Date();
      switch (filters.status) {
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
    
    if (filters.date_filter && filters.date_filter !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      switch (filters.date_filter) {
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
    console.error('Get maintenances error:', error);
    res.status(500).json({ error: 'Lỗi lấy danh sách bảo trì' });
  }
};

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
    
    if (!maintenance_date || !reason) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }
    
    if (field_id === 'all-fields') {
      const [fields] = await db.promise().query('SELECT id FROM fields WHERE is_active = 1');
      
      const promises = fields.map(field => {
        const data = {
          field_id: field.id,
          maintenance_date,
          start_time: start_time || '00:00:00',
          end_time: end_time || '23:59:59',
          reason,
          description,
          type
        };
        return Maintenance.create(data);
      });
      
      await Promise.all(promises);
      res.status(201).json({ message: 'Đã tạo lịch bảo trì cho tất cả sân' });
      
    } else {
      const data = {
        field_id: field_id || null,
        maintenance_date,
        start_time: start_time || '00:00:00',
        end_time: end_time || '23:59:59',
        reason,
        description,
        type
      };
      
      const result = await Maintenance.create(data);
      res.status(201).json({ 
        message: 'Đã tạo lịch bảo trì', 
        id: result.insertId 
      });
    }
    
  } catch (error) {
    console.error('Create maintenance error:', error);
    res.status(500).json({ error: 'Lỗi tạo lịch bảo trì' });
  }
};

exports.updateMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const result = await Maintenance.update(id, updateData);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy lịch bảo trì' });
    }
    
    res.json({ message: 'Cập nhật lịch bảo trì thành công' });
    
  } catch (error) {
    console.error('Update maintenance error:', error);
    res.status(500).json({ error: 'Lỗi cập nhật lịch bảo trì' });
  }
};

exports.deleteMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await Maintenance.softDelete(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy lịch bảo trì' });
    }
    
    res.json({ message: 'Xóa lịch bảo trì thành công' });
    
  } catch (error) {
    console.error('Delete maintenance error:', error);
    res.status(500).json({ error: 'Lỗi xóa lịch bảo trì' });
  }
};

exports.getMaintenanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const maintenance = await Maintenance.getById(id);
    
    if (!maintenance) {
      return res.status(404).json({ error: 'Không tìm thấy lịch bảo trì' });
    }
    
    res.json(maintenance);
    
  } catch (error) {
    console.error('Get maintenance detail error:', error);
    res.status(500).json({ error: 'Lỗi lấy chi tiết bảo trì' });
  }
};

exports.getMaintenanceStats = async (req, res) => {
  try {
    const [results] = await db.promise().query(`
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
    `);
    
    res.json(results[0]);
    
  } catch (error) {
    console.error('Get maintenance stats error:', error);
    res.status(500).json({ error: 'Lỗi lấy thống kê bảo trì' });
  }
};