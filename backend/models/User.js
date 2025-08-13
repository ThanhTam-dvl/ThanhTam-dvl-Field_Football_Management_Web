// // backend/models/User.js
// const db = require('../config/db');

// const User = {
//   findByPhone: (phone, callback) => {
//     const sql = `SELECT * FROM users WHERE phone_number = ?`;
//     db.query(sql, [phone], callback);
//   },

//   createIfNotExist: (phone, callback) => {
//     const check = `SELECT * FROM users WHERE phone_number = ?`;
//     db.query(check, [phone], (err, result) => {
//       if (err) return callback(err);
//       if (result.length > 0) return callback(null, result[0]);

//       const insert = `INSERT INTO users (phone_number, name) VALUES (?, 'Người dùng mới')`;
//       db.query(insert, [phone], (err2, result2) => {
//         if (err2) return callback(err2);
//         User.findByPhone(phone, callback);
//       });
//     });
//   }
// };

// module.exports = User;


// backend/models/User.js
const db = require('../config/db');

const User = {
  findById: (id, callback) => {
    const sql = `SELECT id, phone_number, name, email, role, is_active, total_bookings, cancelled_bookings FROM users WHERE id = ?`;
    db.query(sql, [id], callback);
  },

  updateInfo: (id, data, callback) => {
    const sql = `
      UPDATE users SET name = ?, email = ?, phone_number = ? WHERE id = ?`;
    const values = [data.name, data.email, data.phone_number, id];
    db.query(sql, values, callback);
  },


  findAll: (callback) => {
    const sql = `SELECT id, phone_number, name, role, total_bookings FROM users WHERE is_active = 1`;
    db.query(sql, callback);
  },

  softDelete: (id, callback) => {
    const sql = `UPDATE users SET is_active = 0 WHERE id = ?`;
    db.query(sql, [id], callback);
  },

  createIfNotExist: (phone, callback) => {
    const check = `SELECT * FROM users WHERE phone_number = ?`;
    db.query(check, [phone], (err, result) => {
      if (err) return callback(err);
      if (result.length > 0) return callback(null, result[0]);

      const insert = `INSERT INTO users (phone_number, name) VALUES (?, 'Người dùng mới')`;
      db.query(insert, [phone], (err2, result2) => {
        if (err2) return callback(err2);
        // Lấy lại user vừa tạo (có id)
        db.query(check, [phone], (err3, result3) => {
          if (err3) return callback(err3);
          callback(null, result3[0]);
        });
      });
    });
  },

  
  // backend/models/User.js - Bổ sung methods

// Thêm vào cuối file User.js trước module.exports:

  // Tìm khách hàng với thống kê booking
  findByIdWithStats: async (id, callback) => {
    const sql = `
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
    `;
    db.query(sql, [id, id], callback);
  },

  // Cập nhật trạng thái active
  updateStatus: (id, isActive, callback) => {
    const sql = `UPDATE users SET is_active = ?, updated_at = NOW() WHERE id = ?`;
    db.query(sql, [isActive, id], callback);
  },

  // Kiểm tra tồn tại của phone (trừ user hiện tại)
  checkPhoneDuplicate: (phone, excludeId, callback) => {
    const sql = `SELECT id FROM users WHERE phone_number = ? AND id != ?`;
    db.query(sql, [phone, excludeId], callback);
  }
};




module.exports = User;
