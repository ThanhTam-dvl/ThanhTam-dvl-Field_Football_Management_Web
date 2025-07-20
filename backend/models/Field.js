// backend/models/Field.js
const db = require('../config/db');

const Field = {
  getAll: (callback) => {
    const sql = 'SELECT * FROM fields WHERE is_active = 1';
    db.query(sql, callback);
  },
};

module.exports = Field;
