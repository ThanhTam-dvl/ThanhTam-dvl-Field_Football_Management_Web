// ====== frontend/src/admin/components/customer/CustomerDetailModal.jsx ======
import { customerService } from '../../services';

const CustomerDetailModal = ({ customer, onClose, onEdit }) => {
  const formatDate = (dateString) => {
    return customerService.formatDate(dateString);
  };

  const formatCurrency = (amount) => {
    return customerService.formatCurrency(amount);
  };

  const calculateSuccessRate = (customer) => {
    return customerService.calculateSuccessRate(customer);
  };

  const detailSections = [
    {
      title: 'Thông tin cơ bản',
      icon: 'fas fa-user',
      items: [
        { label: 'Tên khách hàng', value: customer.name },
        { label: 'Số điện thoại', value: customer.phone_number },
        { label: 'Email', value: customer.email || 'Chưa có' },
        { label: 'Ngày tạo', value: formatDate(customer.created_at) }
      ]
    },
    {
      title: 'Thông tin tài chính',
      icon: 'fas fa-money-bill-wave',
      items: [
        { 
          label: 'Tổng chi tiêu', 
          value: formatCurrency(customer.total_spent),
          highlight: true 
        },
        { 
          label: 'Trung bình mỗi lần', 
          value: formatCurrency(customer.total_bookings > 0 ? 
            customer.total_spent / customer.total_bookings : 0),
          highlight: true 
        }
      ]
    },
    {
      title: 'Thông tin khác',
      icon: 'fas fa-info-circle',
      items: [
        { 
          label: 'Loại khách hàng', 
          value: customer.total_bookings >= 10 ? (
            <span className="admin-customer-vip-badge">VIP</span>
          ) : 'Thường'
        },
        {
          label: 'Trạng thái',
          value: (
            <span className={`admin-customer-status-badge ${customer.is_active ? 'active' : 'inactive'}`}>
              {customer.is_active ? 'Hoạt động' : 'Không hoạt động'}
            </span>
          )
        },
        { label: 'Lần đặt cuối', value: formatDate(customer.last_booking_date) }
      ]
    }
  ];

  const bookingStats = [
    {
      value: customer.total_bookings,
      label: 'Tổng đặt sân'
    },
    {
      value: customer.completed_bookings,
      label: 'Hoàn thành',
      color: 'success'
    },
    {
      value: customer.cancelled_bookings,
      label: 'Đã hủy',
      color: 'danger'
    },
    {
      value: `${calculateSuccessRate(customer).toFixed(1)}%`,
      label: 'Tỷ lệ thành công',
      color: 'warning'
    }
  ];

  return (
    <div className="admin-customer-modal-overlay">
      <div className="admin-customer-modal">
        <div className="admin-customer-modal-header">
          <h3 className="admin-customer-modal-title">
            Chi tiết khách hàng - {customer.name}
          </h3>
          <button
            onClick={onClose}
            className="admin-customer-modal-close"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="admin-customer-detail-sections">
          {/* Booking Stats */}
          <div className="admin-customer-detail-section">
            <h4 className="admin-customer-detail-section-title">
              <i className="fas fa-chart-bar"></i>
              Thống kê đặt sân
            </h4>
            <div className="admin-customer-detail-stats">
              {bookingStats.map((stat, index) => (
                <div key={index} className="admin-customer-detail-stat-card">
                  <div className={`admin-customer-detail-stat-value ${stat.color || ''}`}>
                    {stat.value}
                  </div>
                  <div className="admin-customer-detail-stat-label">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detail Sections */}
          {detailSections.map((section, index) => (
            <div key={index} className="admin-customer-detail-section">
              <h4 className="admin-customer-detail-section-title">
                <i className={section.icon}></i>
                {section.title}
              </h4>
              <div className="admin-customer-detail-grid">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="admin-customer-detail-item">
                    <div className="admin-customer-detail-label">{item.label}:</div>
                    <div className={`admin-customer-detail-value ${item.highlight ? 'highlight' : ''}`}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="admin-customer-form-actions">
          <button
            onClick={onClose}
            className="admin-customer-form-btn cancel"
          >
            Đóng
          </button>
          <button
            onClick={onEdit}
            className="admin-customer-form-btn save"
          >
            Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailModal;
