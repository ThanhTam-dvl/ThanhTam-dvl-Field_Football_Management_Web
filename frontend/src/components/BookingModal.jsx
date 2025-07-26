// src/components/BookingModal.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function BookingModal({ field, slot, searchInfo, onClose, onConfirm }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    phone: user?.phone_number || '',
    name: user?.name || '',
    note: '',
    payment: 'cash',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.phone || !form.name) {
      alert('Vui lòng nhập đủ thông tin');
      return;
    }
    onConfirm(form);
  };

  // Hàm định dạng ngày: yyyy-mm-dd -> dd/mm/yyyy
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="booking-modal active" onClick={onClose}>
      <div className="booking-modal-content" onClick={e => e.stopPropagation()}>
        <div className="booking-modal-header">
          <h3>Đặt sân</h3>
          <span className="close-booking-modal" onClick={onClose}>&times;</span>
        </div>
        <div className="booking-form">
          <div className="booking-details">
            <div className="booking-info-item">
              <span className="label">Sân:</span>
              <span id="modal-field-name">{field.name} ({field.type})</span>
            </div>
            <div className="booking-info-item">
              <span className="label">Ngày:</span>
              <span id="modal-date">{formatDate(searchInfo.date)}</span>
            </div>
            <div className="booking-info-item">
              <span className="label">Thời gian:</span>
              <span id="modal-time">{slot.label}</span>
            </div>
            <div className="booking-info-item">
              <span className="label">Giá:</span>
              <span id="modal-price">{slot.price.toLocaleString()} VNĐ</span>
            </div>
          </div>

          <form id="booking-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="booker-phone">Số điện thoại</label>
              <input 
                type="tel" 
                id="booker-phone" 
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại" 
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="booker-name">Họ tên</label>
              <input 
                type="text" 
                id="booker-name" 
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nhập họ tên" 
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="booking-note">Ghi chú</label>
              <textarea 
                id="booking-note" 
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="Thông tin thêm (nếu có)"
              ></textarea>
            </div>
            
            <div className="form-group">
              <label>Phương thức thanh toán</label>
              <div className="payment-methods">
                <div className="payment-method">
                  <input 
                    type="radio" 
                    id="payment-cash" 
                    name="payment" 
                    value="cash" 
                    checked={form.payment === 'cash'}
                    onChange={handleChange}
                  />
                  <label htmlFor="payment-cash">Tiền mặt</label>
                </div>
                <div className="payment-method">
                  <input 
                    type="radio" 
                    id="payment-online" 
                    name="payment" 
                    value="online" 
                    checked={form.payment === 'online'}
                    onChange={handleChange}
                  />
                  <label htmlFor="payment-online">Thanh toán online</label>
                </div>
              </div>
            </div>
            
            <button type="submit" id="confirm-booking" className="confirm-booking-btn">
              Xác nhận đặt sân
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookingModal;