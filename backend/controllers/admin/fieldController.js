// ====== backend/controllers/admin/fieldController.js ======
const db = require('../../config/db');

exports.getFields = async (req, res) => {
  try {
    const [results] = await db.promise().query(`
      SELECT 
        f.*,
        COUNT(b.id) as total_bookings,
        SUM(CASE WHEN b.booking_date = CURDATE() THEN 1 ELSE 0 END) as today_bookings
      FROM fields f
      LEFT JOIN bookings b ON f.id = b.field_id AND b.status != 'cancelled'
      WHERE f.is_active = 1
      GROUP BY f.id
      ORDER BY f.name
    `);

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi lấy danh sách sân' });
  }
};

exports.createField = async (req, res) => {
  const { name, type, price_per_hour, description, facilities } = req.body;

  if (!name || !type || !price_per_hour) {
    return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
  }

  try {
    const [result] = await db.promise().query(`
      INSERT INTO fields (name, type, price_per_hour, description, facilities)
      VALUES (?, ?, ?, ?, ?)
    `, [name, type, price_per_hour, description, JSON.stringify(facilities || [])]);

    res.status(201).json({ 
      message: 'Tạo sân thành công', 
      fieldId: result.insertId 
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Tên sân đã tồn tại' });
    }
    res.status(500).json({ error: 'Lỗi tạo sân' });
  }
};

exports.updateField = async (req, res) => {
  const { fieldId } = req.params;
  const { name, type, price_per_hour, description, facilities, is_active } = req.body;

  try {
    const [result] = await db.promise().query(`
      UPDATE fields 
      SET name = ?, type = ?, price_per_hour = ?, description = ?, 
          facilities = ?, is_active = ?, updated_at = NOW()
      WHERE id = ?
    `, [
      name, type, price_per_hour, description, 
      JSON.stringify(facilities || []), is_active, fieldId
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy sân' });
    }

    res.json({ message: 'Cập nhật sân thành công' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi cập nhật sân' });
  }
};

// Lấy danh sách sân kèm lịch đặt
exports.getFieldsWithBookings = async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];
    
    const [results] = await db.promise().query(`
      SELECT 
        f.id, f.name, f.type, f.price_per_hour,
        b.id as booking_id, b.start_time, b.end_time, 
        b.status, u.name as customer_name, u.phone_number
      FROM fields f
      LEFT JOIN bookings b ON f.id = b.field_id AND b.booking_date = ? AND b.status != 'cancelled'
      LEFT JOIN users u ON b.user_id = u.id
      WHERE f.is_active = 1
      ORDER BY f.name, b.start_time
    `, [date]);

    // Group bookings by field
    const fieldsMap = new Map();
    results.forEach(row => {
      if (!fieldsMap.has(row.id)) {
        fieldsMap.set(row.id, {
          id: row.id,
          name: row.name,
          type: row.type,
          price_per_hour: row.price_per_hour,
          bookings: []
        });
      }
      
      if (row.booking_id) {
        fieldsMap.get(row.id).bookings.push({
          id: row.booking_id,
          start_time: row.start_time,
          end_time: row.end_time,
          status: row.status,
          customer_name: row.customer_name,
          phone_number: row.phone_number
        });
      }
    });

    res.json(Array.from(fieldsMap.values()));
  } catch (error) {
    console.error('Error getting fields with bookings:', error);
    res.status(500).json({ error: 'Lỗi lấy danh sách sân với lịch đặt' });
  }
};
