// backend/models/Service.js
const db = require('../config/db');

const Service = {
  getAll: (callback) => {
    const sql = `SELECT * FROM services WHERE is_active = 1 ORDER BY category`;
    db.query(sql, callback);
  },

  getByCategory: (category, callback) => {
    const sql = `SELECT * FROM services WHERE category = ? AND is_active = 1`;
    db.query(sql, [category], callback);
  }
};

module.exports = Service;
