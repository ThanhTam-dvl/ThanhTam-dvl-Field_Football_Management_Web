// backend/models/MatchParticipant.js
const db = require('../config/db');

const MatchParticipant = {
  join: (data, callback) => {
    const sql = `INSERT INTO match_participants (match_id, user_id) VALUES (?, ?)`;
    db.query(sql, [data.match_id, data.user_id], callback);
  },

  listByMatch: (matchId, callback) => {
    const sql = `
      SELECT u.name, u.phone_number
      FROM match_participants mp
      JOIN users u ON mp.user_id = u.id
      WHERE mp.match_id = ?
    `;
    db.query(sql, [matchId], callback);
  }
};

module.exports = MatchParticipant;
