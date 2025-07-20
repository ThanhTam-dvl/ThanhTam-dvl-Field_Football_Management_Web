// backend/controllers/maintenanceController.js
const Maintenance = require('../models/Maintenance');

exports.createSchedule = (req, res) => {
  const data = req.body;
  if (!data.field_id || !data.maintenance_date || !data.reason) {
    return res.status(400).json({ error: 'Thiếu thông tin bảo trì' });
  }

  Maintenance.create(data, (err, result) => {
    if (err) return res.status(500).json({ error: 'Không thể tạo lịch bảo trì' });
    res.status(201).json({ message: 'Đã tạo lịch bảo trì', id: result.insertId });
  });
};

exports.getAll = (req, res) => {
  Maintenance.listAll((err, results) => {
    if (err) return res.status(500).json({ error: 'Không lấy được danh sách' });
    res.json(results);
  });
};

exports.getByField = (req, res) => {
  const fieldId = req.params.fieldId;
  Maintenance.listByField(fieldId, (err, results) => {
    if (err) return res.status(500).json({ error: 'Không lấy được theo sân' });
    res.json(results);
  });
};
