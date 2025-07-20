// backend/controllers/serviceController.js
const Service = require('../models/Service');

exports.getAllServices = (req, res) => {
  Service.getAll((err, results) => {
    if (err) return res.status(500).json({ error: 'Không lấy được dịch vụ' });
    res.json(results);
  });
};

exports.getByCategory = (req, res) => {
  const category = req.params.category;
  Service.getByCategory(category, (err, results) => {
    if (err) return res.status(500).json({ error: 'Không lấy được theo loại' });
    res.json(results);
  });
};
