// frontend/src/admin/pages/AdminFieldManagement.jsx
import { useState, useEffect } from 'react';
import { getFieldsWithBookings, createManualBooking, updateBookingStatus, deleteBooking } from '../services/fieldService';
import '../assets/styles/admin.css';
import '../assets/styles/field-management.css';

const AdminFieldManagement = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [fieldsData, setFieldsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentView, setCurrentView] = useState('timeline');
  const [filters, setFilters] = useState({
    fieldType: 'all',
    status: 'all'
  });

  // Modal states
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showAddBookingModal, setShowAddBookingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);

  // Form state
  const [bookingForm, setBookingForm] = useState({
    field_id: '',
    customer_name: '',
    customer_phone: '',
    booking_date: '',
    start_time: '',
    end_time: '',
    notes: ''
  });

  useEffect(() => {
    loadFieldData();
  }, [currentDate]);

  const loadFieldData = async () => {
    try {
      setLoading(true);
      setError('');
      const dateStr = formatDateForAPI(currentDate);
      const data = await getFieldsWithBookings(dateStr);
      setFieldsData(data);
    } catch (err) {
      setError('Không thể tải dữ liệu sân');
      console.error('Error loading field data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDateForAPI = (date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDateForDisplay = (date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const changeDate = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 5; hour <= 23; hour++) {
      slots.push(hour);
    }
    return slots;
  };

  const getBookingForTimeSlot = (fieldId, hour) => {
    if (!Array.isArray(fieldsData)) return null; // Thêm dòng này để tránh lỗi
    const field = fieldsData.find(f => f.id === fieldId);
    if (!field) return null;

    // Check bookings
    const booking = field.bookings?.find(b => {
      const startHour = parseInt(b.start_time.split(':')[0]);
      const endHour = parseInt(b.end_time.split(':')[0]);
      return hour >= startHour && hour < endHour;
    });

    if (booking) return { ...booking, type: 'booking' };

    // Check maintenance
    const maintenance = field.maintenance?.find(m => {
      const startHour = parseInt(m.start_time.split(':')[0]);
      const endHour = parseInt(m.end_time.split(':')[0]);
      return hour >= startHour && hour < endHour;
    });

    if (maintenance) return { ...maintenance, type: 'maintenance' };

    return null;
  };

  const handleTimeSlotClick = (fieldId, hour) => {
    const booking = getBookingForTimeSlot(fieldId, hour);
    
    if (booking) {
      setSelectedBooking(booking);
      setShowBookingModal(true);
    } else {
      // Open add booking modal
      setSelectedField(fieldId);
      setSelectedHour(hour);
      setBookingForm({
        ...bookingForm,
        field_id: fieldId,
        booking_date: formatDateForAPI(currentDate),
        start_time: `${hour.toString().padStart(2, '0')}:00`,
        end_time: `${(hour + 1).toString().padStart(2, '0')}:00`
      });
      setShowAddBookingModal(true);
    }
  };

  const handleAddBooking = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createManualBooking(bookingForm);
      setShowAddBookingModal(false);
      setBookingForm({
        field_id: '',
        customer_name: '',
        customer_phone: '',
        booking_date: '',
        start_time: '',
        end_time: '',
        notes: ''
      });
      await loadFieldData();
      showToast('Tạo booking thành công!', 'success');
    } catch (error) {
      showToast(error.response?.data?.error || 'Lỗi tạo booking', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingAction = async (action, bookingId) => {
    try {
      setLoading(true);
      
      switch (action) {
        case 'approve':
          await updateBookingStatus(bookingId, 'approved');
          showToast('Đã duyệt booking', 'success');
          break;
        case 'cancel':
          await deleteBooking(bookingId);
          showToast('Đã hủy booking', 'warning');
          break;
        case 'complete':
          await updateBookingStatus(bookingId, 'completed');
          showToast('Đã hoàn thành booking', 'success');
          break;
      }
      
      setShowBookingModal(false);
      await loadFieldData();
    } catch (error) {
      showToast(error.response?.data?.error || 'Lỗi xử lý booking', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { class: 'pending', text: 'Chờ duyệt' },
      approved: { class: 'approved', text: 'Đã duyệt' },
      completed: { class: 'approved', text: 'Hoàn thành' },
      cancelled: { class: 'cancelled', text: 'Đã hủy' },
      maintenance: { class: 'maintenance', text: 'Bảo trì' }
    };
    return statusMap[status] || { class: 'pending', text: status };
  };

  const showToast = (message, type = 'success') => {
    // Simple toast implementation
    const toast = document.createElement('div');
    toast.className = `admin-toast ${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 24px;
      border-radius: 8px;
      color: white;
      z-index: 9999;
      font-weight: 500;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      background: ${type === 'success' ? '#00b894' : type === 'error' ? '#e17055' : '#fdcb6e'};
    `;
    
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 3000);
  };

  const renderTimelineView = () => (
    <div className="admin-timeline-view">
      <div className="admin-timeline-header">
        <div className="admin-field-column">Sân</div>
        <div className="admin-time-columns">
          {getTimeSlots().map(hour => (
            <div key={hour} className="admin-time-column">
              {hour}:00
            </div>
          ))}
        </div>
      </div>

      <div className="admin-timeline-body">
        {fieldsData.map(field => (
          <div key={field.id} className="admin-field-row">
            <div className="admin-field-info">
              <div className="admin-field-name">{field.name}</div>
              <div className="admin-field-type">{field.type}</div>
            </div>
            
            <div className="admin-field-timeline">
              {getTimeSlots().map(hour => {
                const booking = getBookingForTimeSlot(field.id, hour);
                const isFirstHour = booking && parseInt(booking.start_time?.split(':')[0]) === hour;
                
                return (
                  <div 
                    key={hour}
                    className={`admin-time-slot ${!booking ? 'available' : ''}`}
                    onClick={() => handleTimeSlotClick(field.id, hour)}
                  >
                    {booking && isFirstHour && (
                      <div 
                        className={`admin-booking-block ${booking.status || 'maintenance'}`}
                        style={{
                          '--duration': booking.type === 'maintenance' 
                            ? Math.ceil((parseInt(booking.end_time.split(':')[0]) - parseInt(booking.start_time.split(':')[0])))
                            : Math.ceil((parseInt(booking.end_time.split(':')[0]) - parseInt(booking.start_time.split(':')[0])))
                        }}
                      >
                        {booking.type === 'maintenance' ? (
                          <div className="admin-booking-customer">Bảo trì</div>
                        ) : (
                          <>
                            <div className="admin-booking-customer">
                              {booking.customer_name}
                            </div>
                            <div className="admin-booking-phone">
                              {booking.phone_number}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderListView = () => {
    const allBookings = fieldsData.flatMap(field => 
      field.bookings.map(booking => ({
        ...booking,
        field_name: field.name,
        field_type: field.type
      }))
    );

    return (
      <div className="admin-list-view">
        <div className="admin-bookings-list">
          {allBookings.map(booking => (
            <div 
              key={booking.id}
              className={`admin-booking-card ${booking.status}`}
              onClick={() => {
                setSelectedBooking(booking);
                setShowBookingModal(true);
              }}
            >
              <div className="admin-booking-card-header">
                <div className="admin-booking-card-title">
                  {booking.field_name} - {booking.customer_name}
                </div>
                <div className={`admin-status-badge ${getStatusBadge(booking.status).class}`}>
                  {getStatusBadge(booking.status).text}
                </div>
              </div>
              <div className="admin-booking-card-details">
                <div className="admin-booking-detail">
                  <i className="fas fa-clock"></i>
                  {booking.start_time} - {booking.end_time}
                </div>
                <div className="admin-booking-detail">
                  <i className="fas fa-phone"></i>
                  {booking.phone_number}
                </div>
                <div className="admin-booking-detail">
                  <i className="fas fa-futbol"></i>
                  {booking.field_type}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading && fieldsData.length === 0) {
    return (
      <div className="admin-loading-container">
        <div className="admin-loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-field-management">
      {/* Date Navigation */}
      <div className="admin-date-navigation">
        <button className="admin-nav-btn" onClick={() => changeDate(-1)}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <div className="admin-current-date">
          <h2>{formatDateForDisplay(currentDate)}</h2>
          <button className="admin-today-btn" onClick={goToToday}>
            Hôm nay
          </button>
        </div>
        <button className="admin-nav-btn" onClick={() => changeDate(1)}>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      {/* View Controls */}
      <div className="admin-view-controls">
        <div className="admin-view-modes">
          <button 
            className={`admin-view-mode-btn ${currentView === 'timeline' ? 'active' : ''}`}
            onClick={() => setCurrentView('timeline')}
          >
            <i className="fas fa-calendar-week"></i>
            Timeline
          </button>
          <button 
            className={`admin-view-mode-btn ${currentView === 'list' ? 'active' : ''}`}
            onClick={() => setCurrentView('list')}
          >
            <i className="fas fa-list"></i>
            Danh sách
          </button>
        </div>

        <div className="admin-filters">
          <select 
            className="admin-filter-select"
            value={filters.fieldType}
            onChange={(e) => setFilters({...filters, fieldType: e.target.value})}
          >
            <option value="all">Tất cả sân</option>
            <option value="5vs5">Sân 5 người</option>
            <option value="7vs7">Sân 7 người</option>
            <option value="11vs11">Sân 11 người</option>
          </select>

          <select 
            className="admin-filter-select"
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="available">Trống</option>
            <option value="booked">Đã đặt</option>
            <option value="maintenance">Bảo trì</option>
          </select>

          <button 
            className="admin-refresh-btn"
            onClick={loadFieldData}
            disabled={loading}
          >
            <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i>
            Làm mới
          </button>
        </div>
      </div>

      {error && (
        <div className="admin-error-message">
          <i className="fas fa-exclamation-triangle"></i>
          {error}
        </div>
      )}

      {/* Content Views */}
      {currentView === 'timeline' ? renderTimelineView() : renderListView()}

      {/* Legend */}
      <div className="admin-legend">
        <div className="admin-legend-item">
          <div className="admin-legend-color available"></div>
          <span>Trống</span>
        </div>
        <div className="admin-legend-item">
          <div className="admin-legend-color booked"></div>
          <span>Đã đặt</span>
        </div>
        <div className="admin-legend-item">
          <div className="admin-legend-color pending"></div>
          <span>Chờ duyệt</span>
        </div>
        <div className="admin-legend-item">
          <div className="admin-legend-color maintenance"></div>
          <span>Bảo trì</span>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {showBookingModal && selectedBooking && (
        <div className="admin-modal active" onClick={(e) => e.target.classList.contains('admin-modal') && setShowBookingModal(false)}>
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <h3>{selectedBooking.type === 'maintenance' ? 'Chi tiết bảo trì' : 'Chi tiết đặt sân'}</h3>
              <button className="admin-modal-close" onClick={() => setShowBookingModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="admin-modal-body">
              <div style={{ display: 'grid', gap: '16px' }}>
                <div><strong>Sân:</strong> {fieldsData.find(f => f.id === selectedBooking.field_id)?.name}</div>
                <div><strong>Thời gian:</strong> {selectedBooking.start_time} - {selectedBooking.end_time}</div>
                <div><strong>Ngày:</strong> {formatDateForDisplay(currentDate)}</div>
                {selectedBooking.type !== 'maintenance' && (
                  <>
                    <div><strong>Khách hàng:</strong> {selectedBooking.customer_name}</div>
                    <div><strong>Số điện thoại:</strong> {selectedBooking.phone_number}</div>
                    <div><strong>Trạng thái:</strong> 
                      <span className={`admin-status-badge ${getStatusBadge(selectedBooking.status).class}`}>
                        {getStatusBadge(selectedBooking.status).text}
                      </span>
                    </div>
                  </>
                )}
                {selectedBooking.notes && (
                  <div><strong>Ghi chú:</strong> {selectedBooking.notes}</div>
                )}
              </div>
            </div>
            <div className="admin-modal-footer">
              {selectedBooking.type !== 'maintenance' && (
                <>
                  {selectedBooking.status === 'pending' && (
                    <>
                      <button 
                        className="admin-btn admin-btn-primary"
                        onClick={() => handleBookingAction('approve', selectedBooking.id)}
                      >
                        <i className="fas fa-check"></i> Duyệt
                      </button>
                      <button 
                        className="admin-btn admin-btn-secondary"
                        onClick={() => handleBookingAction('cancel', selectedBooking.id)}
                      >
                        <i className="fas fa-times"></i> Từ chối
                      </button>
                    </>
                  )}
                  {selectedBooking.status === 'approved' && (
                    <button 
                      className="admin-btn admin-btn-primary"
                      onClick={() => handleBookingAction('complete', selectedBooking.id)}
                    >
                      <i className="fas fa-check-circle"></i> Hoàn thành
                    </button>
                  )}
                  <a 
                    href={`tel:${selectedBooking.phone_number}`}
                    className="admin-btn admin-btn-secondary"
                  >
                    <i className="fas fa-phone"></i> Gọi
                  </a>
                </>
              )}
              <button 
                className="admin-btn admin-btn-secondary"
                onClick={() => setShowBookingModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Booking Modal */}
      {showAddBookingModal && (
        <div className="admin-modal active" onClick={(e) => e.target.classList.contains('admin-modal') && setShowAddBookingModal(false)}>
          <div className="admin-modal-content admin-field-modal">
            <div className="admin-modal-header">
              <h3>Thêm đặt sân mới</h3>
              <button className="admin-modal-close" onClick={() => setShowAddBookingModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleAddBooking}>
              <div className="admin-modal-body">
                <div className="admin-form-section">
                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label>Sân</label>
                      <select 
                        value={bookingForm.field_id}
                        onChange={(e) => setBookingForm({...bookingForm, field_id: e.target.value})}
                        required
                      >
                        <option value="">Chọn sân</option>
                        {fieldsData.map(field => (
                          <option key={field.id} value={field.id}>
                            {field.name} ({field.type})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="admin-form-group">
                      <label>Ngày</label>
                      <input 
                        type="date"
                        value={bookingForm.booking_date}
                        onChange={(e) => setBookingForm({...bookingForm, booking_date: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="admin-form-row admin-time-inputs">
                    <div className="admin-form-group">
                      <label>Giờ bắt đầu</label>
                      <input 
                        type="time"
                        value={bookingForm.start_time}
                        onChange={(e) => setBookingForm({...bookingForm, start_time: e.target.value})}
                        required
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Giờ kết thúc</label>
                      <input 
                        type="time"
                        value={bookingForm.end_time}
                        onChange={(e) => setBookingForm({...bookingForm, end_time: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label>Tên khách hàng</label>
                      <input 
                        type="text"
                        value={bookingForm.customer_name}
                        onChange={(e) => setBookingForm({...bookingForm, customer_name: e.target.value})}
                        placeholder="Nhập tên khách hàng"
                        required
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Số điện thoại</label>
                      <input 
                        type="tel"
                        value={bookingForm.customer_phone}
                        onChange={(e) => setBookingForm({...bookingForm, customer_phone: e.target.value})}
                        placeholder="Nhập số điện thoại"
                        required
                      />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Ghi chú</label>
                    <textarea 
                      value={bookingForm.notes}
                      onChange={(e) => setBookingForm({...bookingForm, notes: e.target.value})}
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
                  onClick={() => setShowAddBookingModal(false)}
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
      )}

      <style jsx>{`
        .admin-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          display: none;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }

        .admin-modal.active {
          display: flex;
        }

        .admin-modal-content {
          background: var(--admin-bg-card);
          border-radius: 16px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: var(--admin-shadow-lg);
          border: 1px solid var(--admin-border);
        }

        .admin-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--admin-spacing-xl);
          border-bottom: 1px solid var(--admin-border);
        }

        .admin-modal-header h3 {
          color: var(--admin-text-primary);
          font-size: 1.3rem;
          font-weight: 600;
          margin: 0;
        }

        .admin-modal-close {
          background: none;
          border: none;
          color: var(--admin-text-secondary);
          font-size: 1.3rem;
          cursor: pointer;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .admin-modal-close:hover {
          background: var(--admin-bg-hover);
          color: var(--admin-text-primary);
        }

        .admin-modal-body {
          padding: var(--admin-spacing-xl);
          color: var(--admin-text-primary);
        }

        .admin-modal-footer {
          padding: var(--admin-spacing-xl);
          border-top: 1px solid var(--admin-border);
          display: flex;
          gap: var(--admin-spacing-sm);
          justify-content: flex-end;
          flex-wrap: wrap;
        }

        .admin-btn {
          padding: var(--admin-spacing-sm) var(--admin-spacing-lg);
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.9rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--admin-spacing-xs);
          text-decoration: none;
        }

        .admin-btn-primary {
          background: linear-gradient(135deg, var(--admin-highlight), #d63031);
          color: white;
        }

        .admin-btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(233, 69, 96, 0.3);
        }

        .admin-btn-secondary {
          background: var(--admin-bg-primary);
          color: var(--admin-text-secondary);
          border: 1px solid var(--admin-border);
        }

        .admin-btn-secondary:hover {
          background: var(--admin-bg-hover);
          color: var(--admin-text-primary);
          border-color: var(--admin-highlight);
        }

        .admin-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }

        .admin-form-section {
          background: var(--admin-bg-primary);
          border-radius: 12px;
          padding: var(--admin-spacing-lg);
          border: 1px solid var(--admin-border);
        }

        .admin-form-group {
          display: flex;
          flex-direction: column;
          gap: var(--admin-spacing-xs);
        }

        .admin-form-group label {
          font-weight: 500;
          color: var(--admin-text-primary);
          font-size: 0.9rem;
        }

        .admin-form-group input,
        .admin-form-group select,
        .admin-form-group textarea {
          padding: var(--admin-spacing-sm);
          border: 1px solid var(--admin-border);
          border-radius: 6px;
          background: var(--admin-bg-secondary);
          color: var(--admin-text-primary);
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .admin-form-group input:focus,
        .admin-form-group select:focus,
        .admin-form-group textarea:focus {
          outline: none;
          border-color: var(--admin-highlight);
          box-shadow: 0 0 0 3px rgba(233, 69, 96, 0.1);
        }

        .admin-form-group textarea {
          resize: vertical;
          min-height: 60px;
        }

        @media (max-width: 768px) {
          .admin-modal-content {
            width: 95%;
            margin: var(--admin-spacing-sm);
          }

          .admin-modal-footer {
            flex-direction: column;
          }

          .admin-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminFieldManagement;