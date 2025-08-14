// backend/models/Maintenance.js (Updated)
const db = require('../config/db');

const Maintenance = {
  // Tạo lịch bảo trì mới
  create: (data, callback) => {
    const sql = `
      INSERT INTO maintenance_schedules
      (field_id, maintenance_date, start_time, end_time, reason, description, type)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      data.field_id,
      data.maintenance_date,
      data.start_time || '00:00:00',
      data.end_time || '23:59:59',
      data.reason,
      data.description || null,
      data.type || 'regular'
    ];
    db.query(sql, values, callback);
  },

  // Lấy tất cả lịch bảo trì (cho customer)
  listAll: (callback) => {
    const sql = `
      SELECT m.*, f.name as field_name, f.type as field_type
      FROM maintenance_schedules m
      LEFT JOIN fields f ON m.field_id = f.id
      WHERE m.is_active = 1 
      ORDER BY m.maintenance_date DESC
    `;
    db.query(sql, callback);
  },

  // Lấy lịch bảo trì theo sân (cho customer)
  listByField: (fieldId, callback) => {
    const sql = `
      SELECT m.*, f.name as field_name, f.type as field_type
      FROM maintenance_schedules m
      LEFT JOIN fields f ON m.field_id = f.id
      WHERE m.field_id = ? AND m.is_active = 1 
      ORDER BY m.maintenance_date DESC
    `;
    db.query(sql, [fieldId], callback);
  },

  // Tìm lịch bảo trì theo ID
  findById: (id, callback) => {
    const sql = `
      SELECT m.*, f.name as field_name, f.type as field_type
      FROM maintenance_schedules m
      LEFT JOIN fields f ON m.field_id = f.id
      WHERE m.id = ? AND m.is_active = 1
    `;
    db.query(sql, [id], callback);
  },

  // Cập nhật lịch bảo trì
  update: (id, data, callback) => {
    const sql = `
      UPDATE maintenance_schedules 
      SET field_id = ?, maintenance_date = ?, start_time = ?, end_time = ?, 
          reason = ?, description = ?, type = ?, updated_at = NOW()
      WHERE id = ? AND is_active = 1
    `;
    const values = [
      data.field_id,
      data.maintenance_date,
      data.start_time || '00:00:00',
      data.end_time || '23:59:59',
      data.reason,
      data.description,
      data.type || 'regular',
      id
    ];
    db.query(sql, values, callback);
  },

  // Xóa lịch bảo trì (soft delete)
  delete: (id, callback) => {
    const sql = 'UPDATE maintenance_schedules SET is_active = 0 WHERE id = ?';
    db.query(sql, [id], callback);
  },

  // Kiểm tra sân có đang bảo trì không (cho booking system)
  checkFieldMaintenance: (fieldId, date, startTime, endTime, callback) => {
    const sql = `
      SELECT COUNT(*) as count
      FROM maintenance_schedules 
      WHERE field_id = ? 
        AND maintenance_date = ?
        AND is_active = 1
        AND (
          (start_time <= ? AND end_time > ?) OR
          (start_time < ? AND end_time >= ?) OR
          (start_time >= ? AND end_time <= ?)
        )
    `;
    db.query(sql, [fieldId, date, startTime, startTime, endTime, endTime, startTime, endTime], callback);
  },

  // Lấy tất cả sân đang bảo trì hiện tại
  getActiveMaintenances: (callback) => {
    const sql = `
      SELECT m.*, f.name as field_name, f.type as field_type
      FROM maintenance_schedules m
      LEFT JOIN fields f ON m.field_id = f.id
      WHERE m.is_active = 1
        AND NOW() BETWEEN CONCAT(m.maintenance_date, ' ', COALESCE(m.start_time, '00:00:00'))
                      AND CONCAT(m.maintenance_date, ' ', COALESCE(m.end_time, '23:59:59'))
      ORDER BY m.maintenance_date DESC
    `;
    db.query(sql, callback);
  }
};

module.exports = Maintenance;