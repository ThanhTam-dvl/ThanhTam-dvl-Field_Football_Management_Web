// backend/controllers/fieldController.js
const Field = require('../models/Field');

exports.getAllFields = (req, res) => {
  Field.getAll((err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
    }
    res.json(results);
  });
};
