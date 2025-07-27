// components/CreateMatchModal.jsx
import { useState, useEffect } from 'react';
import { createMatch } from '../services/matchService';

function CreateMatchModal({ onClose, onRefresh }) {
  const [form, setForm] = useState({
    field_type: '5vs5',
    match_date: new Date().toISOString().split('T')[0],
    time_slot: '',
    level: 'intermediate',
    age_min: 18,
    age_max: 30,
    price_per_person: 0,
    description: '',
    contact_name: '',
    contact_phone: '',
    allow_join: true,
    max_players: 10, // Thêm mặc định
    field_id: '',    // Thêm trường này
  });

  // Lấy user từ localStorage
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (!user) {
      alert('Bạn cần đăng nhập để tạo kèo!');
      onClose();
    }
  }, [user, onClose]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Bạn cần đăng nhập để tạo kèo!');
      return;
    }
    try {
      // Giả sử bạn chọn field_id là 1 (hoặc cho user chọn sân)
      const data = {
        ...form,
        creator_id: user.id,
        field_id: 1, // TODO: Cho user chọn sân, tạm thời fix cứng
        time_slot_id: form.time_slot, // Gửi đúng tên trường backend
      };
      await createMatch(data);
      onRefresh();
      onClose();
      alert('Tạo kèo thành công');
    } catch (err) {
      console.error(err);
      alert('Lỗi khi tạo kèo');
    }
  };

  return (
    <div className="create-match-modal active" onClick={onClose}>
      <div className="create-match-content" onClick={(e) => e.stopPropagation()}>
        <div className="create-match-header">
          <h3>Tạo kèo mới</h3>
          <span className="close-create-match" onClick={onClose}>&times;</span>
        </div>
        <form className="create-match-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Ngày đá</label>
              <input type="date" name="match_date" value={form.match_date} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Giờ đá</label>
              <select name="time_slot" value={form.time_slot} onChange={handleChange} required>
                <option value="">Chọn giờ</option>
                {[...Array(16)].map((_, i) => {
                  const h = i + 6;
                  return <option key={h} value={h}>{h}:00</option>;
                })}
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
              <label>Tuổi từ</label>
              <input type="number" name="age_min" value={form.age_min} onChange={handleChange} min={10} />
            </div>
            <div className="form-group">
              <label>Đến</label>
              <input type="number" name="age_max" value={form.age_max} onChange={handleChange} min={form.age_min} />
            </div>
          </div>
          <div className="form-group">
            <label>Giá mỗi người</label>
            <input type="number" name="price_per_person" value={form.price_per_person} onChange={handleChange} min={0} />
          </div>
          <div className="form-group">
            <label>Ghi chú</label>
            <textarea name="description" value={form.description} onChange={handleChange}></textarea>
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
          <div className="form-group checkbox-group">
            <input type="checkbox" name="allow_join" checked={form.allow_join} onChange={handleChange} />
            <label>Cho phép ghép đội</label>
          </div>
          <button type="submit" className="create-match-submit-btn">Tạo kèo</button>
        </form>
      </div>
    </div>
  );
}

export default CreateMatchModal;
