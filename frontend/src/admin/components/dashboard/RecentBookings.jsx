// ====== frontend/src/admin/components/dashboard/RecentBookings.jsx ======
const RecentBookings = ({ bookings, onRefresh }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { class: 'pending', text: 'Chờ duyệt' },
      approved: { class: 'approved', text: 'Đã duyệt' },
      completed: { class: 'completed', text: 'Hoàn thành' },
      cancelled: { class: 'cancelled', text: 'Đã hủy' }
    };
    return statusMap[status] || { class: 'pending', text: status };
  };

  return (
    <div className="admin-content-section">
      <div className="admin-section-header">
        <h2>Đặt sân gần đây</h2>
        <button className="admin-refresh-btn" onClick={onRefresh}>
          <i className="fas fa-sync-alt"></i>
          Làm mới
        </button>
      </div>

      <div className="admin-bookings-container">
        {bookings.length === 0 ? (
          <div className="admin-empty-state">
            <i className="fas fa-inbox"></i>
            <p>Chưa có đặt sân nào</p>
          </div>
        ) : (
          <div className="admin-bookings-list">
            {bookings.map((booking) => (
              <div key={booking.id} className="admin-booking-item">
                <div className="admin-booking-header">
                  <div className="admin-customer-info">
                    <h4>{booking.customer_name}</h4>
                    <p>{booking.phone_number}</p>
                  </div>
                  <div className="admin-booking-amount">
                    {formatCurrency(booking.total_amount)}
                  </div>
                </div>
                
                <div className="admin-booking-details">
                  <div className="admin-detail-item">
                    <i className="fas fa-futbol"></i>
                    <span>{booking.field_name} ({booking.field_type})</span>
                  </div>
                  <div className="admin-detail-item">
                    <i className="fas fa-calendar"></i>
                    <span>{new Date(booking.booking_date).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="admin-detail-item">
                    <i className="fas fa-clock"></i>
                    <span>{booking.start_time} - {booking.end_time}</span>
                  </div>
                </div>

                <div className="admin-booking-footer">
                  <div className={`admin-status-badge ${getStatusBadge(booking.status).class}`}>
                    {getStatusBadge(booking.status).text}
                  </div>
                  <div className="admin-booking-time">
                    {new Date(booking.created_at).toLocaleString('vi-VN')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentBookings;
