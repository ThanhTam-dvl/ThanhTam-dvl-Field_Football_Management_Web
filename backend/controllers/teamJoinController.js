// controllers/teamJoinController.js
const TeamJoin = require('../models/TeamJoin');

exports.createPost = (req, res) => {
  const data = req.body;
  if (!data.match_date || !data.start_time || !data.field_type || !data.level || !data.players_needed || !data.position_needed || !data.contact_name || !data.contact_phone) {
    return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
  }
  TeamJoin.create(data, (err, result) => {
    if (err) return res.status(500).json({ error: 'Không thể đăng tin', details: err });
    res.status(201).json({ message: 'Đăng tin thành công', id: result.insertId });
  });
};

exports.listPosts = (req, res) => {
  const filter = req.query || {};
  TeamJoin.list(filter, (err, results) => {
    if (err) return res.status(500).json({ error: 'Không thể lấy danh sách', details: err });
    res.json(results);
  });
};
