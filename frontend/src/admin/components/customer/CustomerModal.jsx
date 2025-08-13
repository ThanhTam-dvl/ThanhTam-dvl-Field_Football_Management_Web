// ====== frontend/src/admin/components/customer/CustomerModal.jsx ======
import { useState, useEffect } from 'react';

const CustomerModal = ({ customer, onSave, onClose, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    email: '',
    is_active: 1
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        phone_number: customer.phone_number,
        email: customer.email || '',
        is_active: customer.is_active
      });
    } else {
      setFormData({
        name: '',
        phone_number: '',
        email: '',
        is_active: 1
      });
    }
  }, [customer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="admin-customer-modal-overlay">
      <div className="admin-customer-modal">
        <div className="admin-customer-modal-header">
          <h3 className="admin-customer-modal-title">
            {customer ? 'Chỉnh sửa khách hàng' : 'Thêm khách hàng'}
          </h3>
          <button
            onClick={onClose}
            className="admin-customer-modal-close"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-customer-form">
          <div className="admin-customer-form-group">
            <label className="admin-customer-form-label required">
              Tên khách hàng
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              className="admin-customer-form-input"
              placeholder="Nhập tên khách hàng"
            />
          </div>

          <div className="admin-customer-form-group">
            <label className="admin-customer-form-label required">
              Số điện thoại
            </label>
            <input
              type="tel"
              value={formData.phone_number}
              onChange={(e) => handleChange('phone_number', e.target.value)}
              required
              className="admin-customer-form-input"
              placeholder="Nhập số điện thoại"
            />
          </div>

          <div className="admin-customer-form-group">
            <label className="admin-customer-form-label">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="admin-customer-form-input"
              placeholder="Nhập email (không bắt buộc)"
            />
          </div>

          <div className="admin-customer-form-group">
            <label className="admin-customer-form-label">
              Trạng thái
            </label>
            <select
              value={formData.is_active}
              onChange={(e) => handleChange('is_active', parseInt(e.target.value))}
              className="admin-customer-form-select"
            >
              <option value={1}>Hoạt động</option>
              <option value={0}>Không hoạt động</option>
            </select>
          </div>

          <div className="admin-customer-form-actions">
            <button
              type="button"
              onClick={onClose}
              className="admin-customer-form-btn cancel"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="admin-customer-form-btn save"
            >
              {loading ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerModal;
