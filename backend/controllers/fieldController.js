//backend/controllers/fieldController.js
const Field = require('../models/Field');

exports.getAllFields = async (req, res) => {
  try {
    const fields = await Field.getAll();
    res.json(fields);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi khi lấy danh sách sân' });
  }
};

exports.getAvailableFields = async (req, res) => {
  const { date, start, end, types } = req.query;

  if (!date || !start || !end || !types) {
    return res.status(400).json({ error: 'Thiếu tham số' });
  }

  try {
    const fields = await Field.getAvailable(date, start, end, types);
    res.json(fields);
  } catch (err) {
    console.error('Lỗi khi truy vấn sân trống:', err);
    res.status(500).json({ error: 'Lỗi máy chủ' });
  }
};
