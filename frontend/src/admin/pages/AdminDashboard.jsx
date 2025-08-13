// frontend/src/admin/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { getDashboardStats, getRecentBookings } from '../services/adminService';
import '../assets/styles/admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    today_revenue: 0,
    today_bookings: 0,
    pending_bookings: 0,
    total_fields: 0,
    total_users: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const [statsData, bookingsData] = await Promise.all([
        getDashboardStats(),
        getRecentBookings(5)
      ]);
      setStats(statsData);
      setRecentBookings(bookingsData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setError('Không thể tải dữ liệu dashboard');
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

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { class: 'pending', text: 'Chờ duyệt' },
      approved: { class: 'approved', text: 'Đã duyệt' },
      completed: { class: 'completed', text: 'Hoàn thành' },
      cancelled: { class: 'cancelled', text: 'Đã hủy' }
    };
    return statusMap[status] || { class: 'pending', text: status };
  };

  if (loading) {
    return (
      <div className="admin-loading-container">
        <div className="admin-loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error-container" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        textAlign: 'center',
        color: '#e17055'
      }}>
        <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem', marginBottom: '16px' }}></i>
        <h3 style={{ color: '#ffffff', marginBottom: '8px' }}>Lỗi tải dữ liệu</h3>
        <p style={{ color: '#b2b2b2', marginBottom: '20px' }}>{error}</p>
        <button 
          onClick={loadDashboardData}
          className="admin-refresh-btn"
        >
          <i className="fas fa-sync-alt"></i>
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Stats Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card revenue">
          <div className="admin-stat-icon">
            <i className="fas fa-money-bill-wave"></i>
          </div>
          <div className="admin-stat-content">
            <div className="admin-stat-value">{formatCurrency(stats.today_revenue)}</div>
            <div className="admin-stat-label">Doanh thu hôm nay</div>
          </div>
        </div>

        <div className="admin-stat-card bookings">
          <div className="admin-stat-icon">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="admin-stat-content">
            <div className="admin-stat-value">{stats.today_bookings}</div>
            <div className="admin-stat-label">Đặt sân hôm nay</div>
          </div>
        </div>

        <div className="admin-stat-card pending">
          <div className="admin-stat-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="admin-stat-content">
            <div className="admin-stat-value">{stats.pending_bookings}</div>
            <div className="admin-stat-label">Chờ duyệt</div>
          </div>
        </div>

        <div className="admin-stat-card fields">
          <div className="admin-stat-icon">
            <i className="fas fa-futbol"></i>
          </div>
          <div className="admin-stat-content">
            <div className="admin-stat-value">{stats.total_fields}</div>
            <div className="admin-stat-label">Tổng số sân</div>
          </div>
        </div>

        <div className="admin-stat-card users">
          <div className="admin-stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="admin-stat-content">
            <div className="admin-stat-value">{stats.total_users}</div>
            <div className="admin-stat-label">Khách hàng</div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="admin-content-section">
        <div className="admin-section-header">
          <h2>Đặt sân gần đây</h2>
          <button className="admin-refresh-btn" onClick={loadDashboardData}>
            <i className="fas fa-sync-alt"></i>
            Làm mới
          </button>
        </div>

        <div className="admin-bookings-container">
          {recentBookings.length === 0 ? (
            <div className="admin-empty-state">
              <i className="fas fa-inbox"></i>
              <p>Chưa có đặt sân nào</p>
            </div>
          ) : (
            <div className="admin-bookings-list">
              {recentBookings.map((booking) => (
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

      {/* Quick Actions */}
      <div className="admin-content-section" style={{ marginTop: '32px' }}>
        <div className="admin-section-header">
          <h2>Thao tác nhanh</h2>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <button className="admin-quick-action-btn" style={{
            background: 'linear-gradient(135deg, #74b9ff, #0984e3)',
            border: 'none',
            borderRadius: '12px',
            padding: '20px',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            minHeight: '100px'
          }}>
            <i className="fas fa-plus" style={{ fontSize: '1.5rem' }}></i>
            <span>Đặt sân mới</span>
          </button>
          
          <button className="admin-quick-action-btn" style={{
            background: 'linear-gradient(135deg, #00b894, #00a085)',
            border: 'none',
            borderRadius: '12px',
            padding: '20px',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            minHeight: '100px'
          }}>
            <i className="fas fa-futbol" style={{ fontSize: '1.5rem' }}></i>
            <span>Thêm sân</span>
          </button>
          
          <button className="admin-quick-action-btn" style={{
            background: 'linear-gradient(135deg, #fdcb6e, #e17055)',
            border: 'none',
            borderRadius: '12px',
            padding: '20px',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            minHeight: '100px'
          }}>
            <i className="fas fa-chart-line" style={{ fontSize: '1.5rem' }}></i>
            <span>Báo cáo</span>
          </button>
          
          <button className="admin-quick-action-btn" style={{
            background: 'linear-gradient(135deg, #a29bfe, #6c5ce7)',
            border: 'none',
            borderRadius: '12px',
            padding: '20px',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            minHeight: '100px'
          }}>
            <i className="fas fa-tools" style={{ fontSize: '1.5rem' }}></i>
            <span>Bảo trì</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .admin-quick-action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;