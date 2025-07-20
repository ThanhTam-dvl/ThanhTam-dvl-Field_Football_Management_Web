// backend/models/Match.js
const db = require('../config/db');

const Match = {
  create: (data, callback) => {
    const sql = `
      INSERT INTO matches 
      (creator_id, field_id, match_date, time_slot_id, max_players, level, age_min, age_max, price_per_person, description, contact_name, contact_phone, position_needed, players_needed)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      data.creator_id,
      data.field_id,
      data.match_date,
      data.time_slot_id,
      data.max_players,
      data.level || 'intermediate',
      data.age_min || null,
      data.age_max || null,
      data.price_per_person,
      data.description || null,
      data.contact_name || null,
      data.contact_phone || null,
      data.position_needed || 'any',
      data.players_needed || 1
    ];
    db.query(sql, values, callback);
  },

  listOpenMatches: (callback) => {
    const sql = `SELECT * FROM matches WHERE status = 'open' ORDER BY match_date ASC`;
    db.query(sql, callback);
  }
};

module.exports = Match;
