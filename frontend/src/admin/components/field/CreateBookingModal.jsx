// ====== frontend/src/admin/components/field/CreateBookingModal.jsx ======
import { useState, useEffect } from 'react';

const CreateBookingModal = ({ slot, fieldsData, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    field_id: '',
    customer_name: '',
    customer_phone: '',
    booking_date: '',
    start_time: '',
    end_time: '',
    total_amount: 0,
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (slot) {
      const startTime = `${slot.hour.toString().padStart(2, '0')}:00`;
      const endTime = `${(slot.hour + 1).toString().padStart(2, '0')}:00`;
      const dateStr = slot.date.toISOString().split('T')[0];
      
      setFormData(prev => ({
        ...prev,
        field_id: slot.fieldId,
        booking_date: dateStr,
        start_time: startTime,
        end_time: endTime
      }));
    }
  }, [slot]);

  // Calculate total amount when field or time changes
  useEffect(() => {
    if (formData.field_id && formData.start_time && formData.end_time) {
      calculateTotalAmount();
    }
  }, [formData.field_id, formData.start_time, formData.end_time]);

  const calculateTotalAmount = () => {
    const field = fieldsData.find(f => f.id === parseInt(formData.field_id));
    if (!field) return;

    const startHour = parseInt(formData.start_time.split(':')[0]);
    const endHour = parseInt(formData.end_time.split(':')[0]);
    
    if (endHour > startHour) {
      const hours = endHour - startHour;
      const total = hours * field.price_per_hour;
      setFormData(prev => ({ ...prev, total_amount: total }));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSave({
        ...formData,
        phone_number: formData.customer_phone
      });
    } catch (error) {
      console.error('Error creating booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="admin-modal active" onClick={(e) => e.target.classList.contains('admin-modal') && onClose()}>
      <div className="admin-modal-content admin-field-modal">
        <div className="admin-modal-header">
          <h3>Thêm đặt sân mới</h3>
          <button className="admin-modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            <div className="admin-form-section">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Sân</label>
                  <select 
                    value={formData.field_id}
                    onChange={(e) => handleInputChange('field_id', e.target.value)}
                    required
                  >
                    <option value="">Chọn sân</option>
                    {fieldsData.map(field => (
                      <option key={field.id} value={field.id}>
                        {field.name} ({field.type}) - {formatCurrency(field.price_per_hour)}/giờ
                      </option>
                    ))}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Ngày</label>
                  <input 
                    type="date"
                    value={formData.booking_date}
                    onChange={(e) => handleInputChange('booking_date', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="admin-form-row admin-time-inputs">
                <div className="admin-form-group">
                  <label>Giờ bắt đầu</label>
                  <input 
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => handleInputChange('start_time', e.target.value)}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Giờ kết thúc</label>
                  <input 
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => handleInputChange('end_time', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Tên khách hàng</label>
                  <input 
                    type="text"
                    value={formData.customer_name}
                    onChange={(e) => handleInputChange('customer_name', e.target.value)}
                    placeholder="Nhập tên khách hàng"
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Số điện thoại</label>
                  <input 
                    type="tel"
                    value={formData.customer_phone}
                    onChange={(e) => handleInputChange('customer_phone', e.target.value)}
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Tổng tiền</label>
                  <div className="admin-amount-display">
                    {formatCurrency(formData.total_amount)}
                  </div>
                </div>
              </div>

              <div className="admin-form-group">
                <label>Ghi chú</label>
                <textarea 
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Ghi chú thêm (tùy chọn)"
                  rows={3}
                />
              </div>
            </div>
          </div>
          
          <div className="admin-modal-footer">
            <button 
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={onClose}
            >
              Hủy
            </button>
            <button 
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={loading}
            >
              {loading ? 'Đang lưu...' : 'Lưu đặt sân'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBookingModal;
