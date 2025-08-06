// models/TeamJoin.js
const db = require('../config/db');

const TeamJoin = {
  create: (data, callback) => {
    const sql = `
      INSERT INTO team_join_posts 
      (match_date, start_time, field_type, level, players_needed, position_needed, description, contact_name, contact_phone, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'open')
    `;
    const values = [
      data.match_date,
      data.start_time,
      data.field_type,
      data.level,
      data.players_needed,
      data.position_needed,
      data.description,
      data.contact_name,
      data.contact_phone
    ];
    db.query(sql, values, callback);
  },

  list: (filter = {}, callback) => {
    let sql = `SELECT * FROM team_join_posts WHERE status = 'open' AND match_date >= CURDATE()`;
    const values = [];

    if (filter.date) {
      sql += ' AND match_date = ?';
      values.push(filter.date);
    }
    if (filter.time) {
      sql += ' AND start_time = ?';
      values.push(filter.time);
    }
    if (filter.field_type) {
      sql += ' AND field_type = ?';
      values.push(filter.field_type);
    }
    if (filter.level) {
      sql += ' AND level = ?';
      values.push(filter.level);
    }
    if (filter.position_needed) {
      sql += ' AND position_needed = ?';
      values.push(filter.position_needed);
    }

    sql += ' ORDER BY match_date ASC, start_time ASC';

    db.query(sql, values, callback);
  }
};

module.exports = TeamJoin;
