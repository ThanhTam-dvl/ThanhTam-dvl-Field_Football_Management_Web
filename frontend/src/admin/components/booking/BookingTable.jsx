
// ====== 2. FIX: frontend/src/admin/components/booking/BookingTable.jsx ======
import { useState } from 'react';

const BookingTable = ({ 
  bookings, 
  loading, 
  selectedBookings, 
  onSelectBooking, 
  onSelectAll, 
  onStatusUpdate, 
  onEdit, 
  onDelete
}) => {
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { class: 'warning', text: 'Chờ duyệt', icon: 'clock' },
      approved: { class: 'success', text: 'Đã duyệt', icon: 'check' },
      cancelled: { class: 'danger', text: 'Đã hủy', icon: 'times' },
      completed: { class: 'info', text: 'Hoàn thành', icon: 'check-circle' }
    };
    return statusMap[status] || { class: 'secondary', text: status, icon: 'question' };
  };

  if (bookings.length === 0 && !loading) {
    return (
      <div className="admin-empty-state">
        <i className="fas fa-clipboard-list"></i>
        <h3>Không có đơn đặt sân nào</h3>
        <p>Thử thay đổi bộ lọc hoặc thêm đơn đặt sân mới</p>
      </div>
    );
  }

  return (
    <div className="admin-table-container">
      {/* Desktop Table */}
      <div className="admin-desktop-only">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="admin-table-checkbox">
                <input
                  type="checkbox"
                  checked={bookings.length > 0 && selectedBookings.length === bookings.length}
                  onChange={(e) => onSelectAll(e.target.checked)}
                />
              </th>
              <th 
                className="admin-table-sortable"
                onClick={() => handleSort('id')}
              >
                ID
                <i className={`fas fa-sort${sortField === 'id' ? (sortDirection === 'asc' ? '-up' : '-down') : ''}`}></i>
              </th>
              <th 
                className="admin-table-sortable"
                onClick={() => handleSort('customer_name')}
              >
                Khách hàng
                <i className={`fas fa-sort${sortField === 'customer_name' ? (sortDirection === 'asc' ? '-up' : '-down') : ''}`}></i>
              </th>
              <th>Sân</th>
              <th 
                className="admin-table-sortable"
                onClick={() => handleSort('booking_date')}
              >
                Ngày & Giờ
                <i className={`fas fa-sort${sortField === 'booking_date' ? (sortDirection === 'asc' ? '-up' : '-down') : ''}`}></i>
              </th>
              <th 
                className="admin-table-sortable"
                onClick={() => handleSort('status')}
              >
                Trạng thái
                <i className={`fas fa-sort${sortField === 'status' ? (sortDirection === 'asc' ? '-up' : '-down') : ''}`}></i>
              </th>
              <th 
                className="admin-table-sortable"
                onClick={() => handleSort('total_amount')}
              >
                Tổng tiền
                <i className={`fas fa-sort${sortField === 'total_amount' ? (sortDirection === 'asc' ? '-up' : '-down') : ''}`}></i>
              </th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="admin-table-loading">
                  <div className="admin-loading-spinner">
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Đang tải...</span>
                  </div>
                </td>
              </tr>
            ) : (
              bookings.map(booking => {
                const status = getStatusBadge(booking.status);
                return (
                  <tr key={booking.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedBookings.includes(booking.id)}
                        onChange={(e) => onSelectBooking(booking.id, e.target.checked)}
                      />
                    </td>
                    <td>
                      <strong>#{booking.id}</strong>
                    </td>
                    <td>
                      <div className="admin-customer-info">
                        <div className="admin-customer-name">{booking.customer_name}</div>
                        <div className="admin-customer-phone">{booking.phone_number}</div>
                      </div>
                    </td>
                    <td>
                      <div className="admin-field-info">
                        <div className="admin-field-name">{booking.field_name}</div>
                        <div className="admin-field-type">{booking.field_type}</div>
                      </div>
                    </td>
                    <td>
                      <div className="admin-datetime-info">
                        <div className="admin-date">{formatDate(booking.booking_date)}</div>
                        <div className="admin-time">{booking.start_time} - {booking.end_time}</div>
                      </div>
                    </td>
                    <td>
                      <span className={`admin-status-badge admin-status-${status.class}`}>
                        <i className={`fas fa-${status.icon}`}></i>
                        {status.text}
                      </span>
                    </td>
                    <td>
                      <strong className="admin-amount">{formatCurrency(booking.total_amount)}</strong>
                    </td>
                    <td>
                      <div className="admin-action-buttons">
                        {booking.status === 'pending' && (
                          <>
                            <button
                              className="admin-btn admin-btn-success admin-btn-xs"
                              onClick={() => onStatusUpdate(booking.id, 'approved')}
                              title="Duyệt"
                            >
                              <i className="fas fa-check"></i>
                            </button>
                            <button
                              className="admin-btn admin-btn-warning admin-btn-xs"
                              onClick={() => onStatusUpdate(booking.id, 'cancelled')}
                              title="Từ chối"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </>
                        )}
                        <button
                          className="admin-btn admin-btn-primary admin-btn-xs"
                          onClick={() => onEdit(booking)}
                          title="Chỉnh sửa"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="admin-btn admin-btn-danger admin-btn-xs"
                          onClick={() => onDelete(booking.id)}
                          title="Xóa"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="admin-mobile-only">
        <div className="admin-booking-cards">
          {loading ? (
            <div className="admin-loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
              <span>Đang tải...</span>
            </div>
          ) : (
            bookings.map(booking => {
              const status = getStatusBadge(booking.status);
              return (
                <div key={booking.id} className="admin-booking-card">
                  <div className="admin-card-header">
                    <div className="admin-card-id">#{booking.id}</div>
                    <div className="admin-card-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedBookings.includes(booking.id)}
                        onChange={(e) => onSelectBooking(booking.id, e.target.checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="admin-card-content">
                    <div className="admin-customer-info">
                      <h4>{booking.customer_name}</h4>
                      <p>{booking.phone_number}</p>
                    </div>
                    
                    <div className="admin-booking-details">
                      <div className="admin-detail-item">
                        <i className="fas fa-futbol"></i>
                        <span>{booking.field_name} ({booking.field_type})</span>
                      </div>
                      <div className="admin-detail-item">
                        <i className="fas fa-calendar"></i>
                        <span>{formatDate(booking.booking_date)}</span>
                      </div>
                      <div className="admin-detail-item">
                        <i className="fas fa-clock"></i>
                        <span>{booking.start_time} - {booking.end_time}</span>
                      </div>
                      <div className="admin-detail-item">
                        <i className="fas fa-money-bill-wave"></i>
                        <span>{formatCurrency(booking.total_amount)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="admin-card-footer">
                    <span className={`admin-status-badge admin-status-${status.class}`}>
                      <i className={`fas fa-${status.icon}`}></i>
                      {status.text}
                    </span>
                    
                    <div className="admin-action-buttons">
                      {booking.status === 'pending' && (
                        <>
                          <button
                            className="admin-btn admin-btn-success admin-btn-xs"
                            onClick={() => onStatusUpdate(booking.id, 'approved')}
                          >
                            <i className="fas fa-check"></i>
                          </button>
                          <button
                            className="admin-btn admin-btn-warning admin-btn-xs"
                            onClick={() => onStatusUpdate(booking.id, 'cancelled')}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </>
                      )}
                      <button
                        className="admin-btn admin-btn-primary admin-btn-xs"
                        onClick={() => onEdit(booking)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="admin-btn admin-btn-danger admin-btn-xs"
                        onClick={() => onDelete(booking.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingTable;
