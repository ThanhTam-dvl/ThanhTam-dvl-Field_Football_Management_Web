// backend/models/Field.js
const db = require('../config/db');

// Hàm lấy các khung giờ trống cho 1 sân trong ngày
async function getAvailableTimeRanges(fieldId, fieldType, date) {
  // Lấy các booking đã đặt trong ngày
  const [bookings] = await db.promise().query(
    `SELECT start_time, end_time FROM bookings WHERE field_id = ? AND booking_date = ?`,
    [fieldId, date]
  );

  // Lấy khung giờ mở cửa (ví dụ 6h-22h)
  const openHour = 6, closeHour = 22;
  const availableRanges = [];

  for (let hour = openHour; hour < closeHour; hour++) {
    const start = `${hour.toString().padStart(2, '0')}:00:00`;
    const end = `${(hour + 1).toString().padStart(2, '0')}:00:00`;

    // Kiểm tra có bị trùng với booking nào không
    const isBooked = bookings.some(b =>
      !(b.end_time <= start || b.start_time >= end)
    );
    if (!isBooked) {
      // Lấy giá theo pricing_rules
      const [rows] = await db.promise().query(
        `SELECT price_per_hour FROM pricing_rules WHERE field_type = ? AND start_hour <= ? AND end_hour > ? LIMIT 1`,
        [fieldType, hour, hour]
      );
      const price = rows.length > 0 ? Number(rows[0].price_per_hour) : 0;
      availableRanges.push({
        start_time: start,
        end_time: end,
        label: `${hour}:00 - ${hour + 1}:00`,
        price,
      });
    }
  }
  return availableRanges;
}

const Field = {
  getAll: async () => {
    const [fields] = await db.promise().query('SELECT * FROM fields');
    return fields;
  },

  getAvailable: async (date, start, end, types) => {
    const [fields] = await db.promise().query(
      `SELECT * FROM fields WHERE type IN (?)`,
      [types.split(',')]
    );

    const result = [];
    for (const field of fields) {
      // Lấy các booking đã đặt trong ngày
      const [bookings] = await db.promise().query(
        `SELECT start_time, end_time FROM bookings WHERE field_id = ? AND booking_date = ?`,
        [field.id, date]
      );
      // Kiểm tra có bị trùng không
      const isBooked = bookings.some(b =>
        !(b.end_time <= start || b.start_time >= end)
      );
      if (!isBooked) {
        // Tính tổng tiền cho toàn bộ khoảng
        let total = 0;
        let cur = start;
        while (cur < end) {
          const hour = parseInt(cur.split(':')[0]);
          const minute = parseInt(cur.split(':')[1]);
          const [rows] = await db.promise().query(
            `SELECT price_per_hour FROM pricing_rules WHERE field_type = ? AND start_hour <= ? AND end_hour > ? LIMIT 1`,
            [field.type, hour, hour]
          );
          const pricePerHour = rows.length > 0 ? Number(rows[0].price_per_hour) : 0;
          // Nếu bước là 30 phút thì tính nửa giá
          total += (minute === 0 && (parseInt(end.split(':')[1]) === 30 && cur === end)) ? pricePerHour * 0.5 : pricePerHour * 0.5;
          // Tăng 30 phút
          let [h, m] = cur.split(':').map(Number);
          m += 30;
          if (m >= 60) { h += 1; m = 0; }
          cur = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        }
        result.push({
          ...field,
          slots: [{
            start_time: start,
            end_time: end,
            label: `${start} - ${end}`,
            price: total,
          }],
        });
      } else {
        result.push({
          ...field,
          slots: [],
        });
      }
    }
    return result;
  },
};

module.exports = Field;
