// backend/models/Maintenance.js
const db = require('../config/db');

const Maintenance = {
  create: (data, callback) => {
    const sql = `
      INSERT INTO maintenance_schedules
      (field_id, maintenance_date, start_time, end_time, reason, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
      data.field_id,
      data.maintenance_date,
      data.start_time,
      data.end_time,
      data.reason,
      data.description || null,
    ];
    db.query(sql, values, callback);
  },

  listAll: (callback) => {
    const sql = `SELECT * FROM maintenance_schedules WHERE is_active = 1 ORDER BY maintenance_date DESC`;
    db.query(sql, callback);
  },

  listByField: (fieldId, callback) => {
    const sql = `SELECT * FROM maintenance_schedules WHERE field_id = ? AND is_active = 1 ORDER BY maintenance_date DESC`;
    db.query(sql, [fieldId], callback);
  }
};

module.exports = Maintenance;
