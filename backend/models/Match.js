// backend/models/Match.js
const db = require('../config/db');

const Match = {
  create: (data, callback) => {
    const sql = `
      INSERT INTO matches 
      (creator_id, field_id, field_type, match_date, start_time, end_time, level, age_min, age_max, price_per_person, description, contact_name, contact_phone, allow_join)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      data.creator_id,
      data.field_id,
      data.field_type,
      data.match_date,
      data.start_time,
      data.end_time,
      data.level,
      data.age_min,
      data.age_max,
      data.price_per_person,
      data.description,
      data.contact_name,
      data.contact_phone,
      data.allow_join ? 1 : 0
    ];
    db.query(sql, values, callback);
  },

  listOpenMatches: (filter = {}, callback) => {
    let sql = `SELECT * FROM matches WHERE status = 'open' AND match_date >= CURDATE()`;
    const params = [];

    if (filter.date) {
      sql += ' AND match_date = ?';
      params.push(filter.date);
    }
    if (filter.time) {
      sql += ' AND start_time = ?';
      params.push(filter.time);
    }
    if (filter.type) {
      sql += ' AND field_type = ?';
      params.push(filter.type);
    }
    if (filter.level) {
      sql += ' AND level = ?';
      params.push(filter.level);
    }

    sql += ' ORDER BY match_date ASC, start_time ASC';
    db.query(sql, params, callback);
  }
};

module.exports = Match;
