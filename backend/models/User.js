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
    const sql = `UPDATE users SET name = ?, email = ? WHERE id = ?`;
    db.query(sql, [data.name, data.email, id], callback);
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
      db.query(insert, [phone], (err2) => {
        if (err2) return callback(err2);
        db.query(check, [phone], callback);
      });
    });
  }
};



module.exports = User;
