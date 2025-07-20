// backend/controllers/matchController.js
const Match = require('../models/Match');
const MatchParticipant = require('../models/MatchParticipant');

exports.createMatch = (req, res) => {
  const data = req.body;
  if (!data.creator_id || !data.field_id || !data.match_date || !data.time_slot_id || !data.max_players || !data.price_per_person) {
    return res.status(400).json({ error: 'Thiếu thông tin trận đấu' });
  }

  Match.create(data, (err, result) => {
    if (err) return res.status(500).json({ error: 'Lỗi tạo trận đấu' });
    res.status(201).json({ message: 'Tạo trận thành công', matchId: result.insertId });
  });
};

exports.listMatches = (req, res) => {
  Match.listOpenMatches((err, results) => {
    if (err) return res.status(500).json({ error: 'Không lấy được danh sách trận' });
    res.json(results);
  });
};

exports.joinMatch = (req, res) => {
  const data = req.body;
  if (!data.match_id || !data.user_id) {
    return res.status(400).json({ error: 'Thiếu match_id hoặc user_id' });
  }

  MatchParticipant.join(data, (err) => {
    if (err) return res.status(500).json({ error: 'Không thể tham gia trận' });
    res.status(200).json({ message: 'Tham gia thành công' });
  });
};

exports.listParticipants = (req, res) => {
  const matchId = req.params.matchId;
  MatchParticipant.listByMatch(matchId, (err, results) => {
    if (err) return res.status(500).json({ error: 'Không lấy được danh sách người tham gia' });
    res.json(results);
  });
};
