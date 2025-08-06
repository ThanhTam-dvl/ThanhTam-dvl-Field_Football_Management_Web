// components/JoinTeamModal.jsx
import { useState } from 'react';
import { createTeamJoinPost } from '../services/teamJoinService';

function JoinTeamModal({ onClose, onRefresh }) {
  const [form, setForm] = useState({
    match_date: new Date().toISOString().split('T')[0],
    start_time: '',
    field_type: '5vs5',
    level: 'intermediate',
    players_needed: 1,
    position_needed: 'any',
    description: '',
    contact_name: '',
    contact_phone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTeamJoinPost(form);
      onClose();
      onRefresh();
      alert('Đăng tin ghép đội thành công!');
    } catch (err) {
      console.error(err);
      alert('Lỗi khi đăng tin');
    }
  };

  const timeOptions = [];
  for (let h = 6; h <= 21; h++) {
    timeOptions.push(`${h.toString().padStart(2, '0')}:00`);
    timeOptions.push(`${h.toString().padStart(2, '0')}:30`);
  }

  return (
    <div className="create-team-modal active" onClick={onClose}>
      <div className="create-team-content" onClick={(e) => e.stopPropagation()}>
        <div className="create-team-header">
          <h3>Đăng tin ghép đội</h3>
          <span className="close-create-team" onClick={onClose}>&times;</span>
        </div>
        <form className="create-team-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Ngày đá</label>
              <input type="date" name="match_date" value={form.match_date} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Giờ đá</label>
              <select name="start_time" value={form.start_time} onChange={handleChange} required>
                <option value="">Chọn giờ</option>
                {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Loại sân</label>
              <select name="field_type" value={form.field_type} onChange={handleChange}>
                <option value="5vs5">Sân 5 người</option>
                <option value="7vs7">Sân 7 người</option>
                <option value="11vs11">Sân 11 người</option>
              </select>
            </div>
            <div className="form-group">
              <label>Trình độ</label>
              <select name="level" value={form.level} onChange={handleChange}>
                <option value="beginner">Mới chơi</option>
                <option value="intermediate">Trung bình</option>
                <option value="advanced">Khá</option>
                <option value="pro">Giỏi</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Vị trí cần</label>
              <select name="position_needed" value={form.position_needed} onChange={handleChange}>
                <option value="goalkeeper">Thủ môn</option>
                <option value="defender">Hậu vệ</option>
                <option value="midfielder">Tiền vệ</option>
                <option value="forward">Tiền đạo</option>
                <option value="any">Vị trí nào cũng được</option>
              </select>
            </div>
            <div className="form-group">
              <label>Số lượng cần</label>
              <input type="number" name="players_needed" value={form.players_needed} min={1} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tên liên hệ</label>
              <input type="text" name="contact_name" value={form.contact_name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Số điện thoại</label>
              <input type="tel" name="contact_phone" value={form.contact_phone} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Ghi chú</label>
            <textarea name="description" value={form.description} onChange={handleChange}></textarea>
          </div>

          <button type="submit" className="create-team-submit-btn">Đăng tin</button>
        </form>
      </div>
    </div>
  );
}

export default JoinTeamModal;
