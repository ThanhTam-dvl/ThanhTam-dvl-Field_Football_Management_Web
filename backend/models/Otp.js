// backend/models/Otp.js
const db = require('../config/db');

const Otp = {
  insertCode: (phone, code, expiresAt, callback) => {
    const sql = `INSERT INTO otp_codes (phone_number, otp_code, expires_at) VALUES (?, ?, ?)`;
    db.query(sql, [phone, code, expiresAt], callback);
  },

  verifyCode: (phone, code, callback) => {
    const sql = `
      SELECT * FROM otp_codes 
      WHERE phone_number = ? AND otp_code = ? AND is_used = 0 AND expires_at >= NOW()
      ORDER BY created_at DESC LIMIT 1
    `;
    db.query(sql, [phone, code], callback);
  },

  markUsed: (id, callback) => {
    const sql = `UPDATE otp_codes SET is_used = 1 WHERE id = ?`;
    db.query(sql, [id], callback);
  }
};

module.exports = Otp;
