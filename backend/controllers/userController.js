// backend/controllers/userController.js
const User = require('../models/User');

exports.getUserById = (req, res) => {
  const id = req.params.id;
  User.findById(id, (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    res.json(results[0]);
  });
};

exports.updateUser = (req, res) => {
  const id = req.params.id;
  const { name, email } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Thiếu tên' });
  }

  User.updateInfo(id, { name, email }, (err) => {
    if (err) return res.status(500).json({ error: 'Lỗi cập nhật thông tin' });
    res.json({ message: 'Cập nhật thành công' });
  });
};

exports.getAllUsers = (req, res) => {
  User.findAll((err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi lấy danh sách người dùng' });
    res.json(results);
  });
};

exports.deleteUser = (req, res) => {
  const id = req.params.id;
  User.softDelete(id, (err) => {
    if (err) return res.status(500).json({ error: 'Lỗi xoá người dùng' });
    res.json({ message: 'Xoá mềm thành công' });
  });
};
