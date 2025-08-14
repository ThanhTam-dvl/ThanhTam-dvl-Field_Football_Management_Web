// ====== frontend/src/admin/components/field/BookingDetailModal.jsx ======
const BookingDetailModal = ({ booking, fieldsData, currentDate, onAction, onClose }) => {
  const formatDateForDisplay = (date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { class: 'pending', text: 'Chờ duyệt' },
      approved: { class: 'approved', text: 'Đã duyệt' },
      completed: { class: 'completed', text: 'Hoàn thành' },
      cancelled: { class: 'cancelled', text: 'Đã hủy' },
      maintenance: { class: 'maintenance', text: 'Bảo trì' }
    };
    return statusMap[status] || { class: 'pending', text: status };
  };

  const field = fieldsData.find(f => f.id === booking.field_id);
  const statusBadge = getStatusBadge(booking.status);

  return (
    <div className="admin-modal active" onClick={(e) => e.target.classList.contains('admin-modal') && onClose()}>
      <div className="admin-modal-content">
        <div className="admin-modal-header">
          <h3>{booking.type === 'maintenance' ? 'Chi tiết bảo trì' : 'Chi tiết đặt sân'}</h3>
          <button className="admin-modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="admin-modal-body">
          <div className="admin-booking-detail-grid">
            <div className="admin-detail-section">
              <h4>Thông tin cơ bản</h4>
              <div className="admin-detail-item">
                <strong>Sân:</strong> {field?.name} ({field?.type})
              </div>
              <div className="admin-detail-item">
                <strong>Thời gian:</strong> {booking.start_time} - {booking.end_time}
              </div>
              <div className="admin-detail-item">
                <strong>Ngày:</strong> {formatDateForDisplay(currentDate)}
              </div>
              {booking.type !== 'maintenance' && (
                <div className="admin-detail-item">
                  <strong>Trạng thái:</strong> 
                  <span className={`admin-status-badge ${statusBadge.class}`}>
                    {statusBadge.text}
                  </span>
                </div>
              )}
            </div>

            {booking.type !== 'maintenance' && (
              <div className="admin-detail-section">
                <h4>Thông tin khách hàng</h4>
                <div className="admin-detail-item">
                  <strong>Khách hàng:</strong> {booking.customer_name}
                </div>
                <div className="admin-detail-item">
                  <strong>Số điện thoại:</strong> {booking.phone_number}
                </div>
                {booking.total_amount && (
                  <div className="admin-detail-item">
                    <strong>Tổng tiền:</strong> {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(booking.total_amount)}
                  </div>
                )}
              </div>
            )}

            {booking.notes && (
              <div className="admin-detail-section">
                <h4>Ghi chú</h4>
                <div className="admin-detail-item">
                  {booking.notes}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="admin-modal-footer">
          {booking.type !== 'maintenance' && (
            <>
              {booking.status === 'pending' && (
                <>
                  <button 
                    className="admin-btn admin-btn-primary"
                    onClick={() => onAction('approve', booking.id)}
                  >
                    <i className="fas fa-check"></i> Duyệt
                  </button>
                  <button 
                    className="admin-btn admin-btn-secondary"
                    onClick={() => onAction('cancel', booking.id)}
                  >
                    <i className="fas fa-times"></i> Từ chối
                  </button>
                </>
              )}
              {booking.status === 'approved' && (
                <button 
                  className="admin-btn admin-btn-primary"
                  onClick={() => onAction('complete', booking.id)}
                >
                  <i className="fas fa-check-circle"></i> Hoàn thành
                </button>
              )}
              <a 
                href={`tel:${booking.phone_number}`}
                className="admin-btn admin-btn-secondary"
              >
                <i className="fas fa-phone"></i> Gọi
              </a>
            </>
          )}
          <button 
            className="admin-btn admin-btn-secondary"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailModal;


