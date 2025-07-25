// backend/models/Field.js
const db = require('../config/db');

const Field = {
  getAll: async () => {
    const [fields] = await db.promise().query('SELECT * FROM fields');
    return fields;
  },

  getAvailable: async (date, start, end, types) => {
    // Lấy slotIds
    const [slotRows] = await db.promise().query(
      `SELECT id FROM time_slots WHERE start_time >= ? AND end_time <= ?`,
      [`${start}:00:00`, `${end}:00:00`]
    );
    const slotIds = slotRows.map((row) => row.id);
    if (slotIds.length === 0) return [];

    const [fields] = await db.promise().query(
      `
      SELECT * FROM fields
      WHERE type IN (?) AND id NOT IN (
        SELECT field_id FROM bookings
        WHERE booking_date = ? AND time_slot_id IN (?)
      )
      `,
      [types.split(','), date, slotIds]
    );
    return fields;
  },
};

module.exports = Field;
