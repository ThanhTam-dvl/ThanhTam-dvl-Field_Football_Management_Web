// ====== frontend/src/admin/components/booking/BookingStats.jsx ======
const BookingStats = ({ bookings = [] }) => {
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    approved: bookings.filter(b => b.status === 'approved').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    revenue: bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + (parseFloat(b.total_amount) || 0), 0)
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const statItems = [
    {
      key: 'total',
      icon: 'fas fa-clipboard-list',
      value: stats.total,
      label: 'Tổng đơn',
      color: 'total'
    },
    {
      key: 'pending',
      icon: 'fas fa-clock',
      value: stats.pending,
      label: 'Chờ duyệt',
      color: 'pending'
    },
    {
      key: 'approved',
      icon: 'fas fa-check-circle',
      value: stats.approved,
      label: 'Đã duyệt',
      color: 'approved'
    },
    {
      key: 'completed',
      icon: 'fas fa-trophy',
      value: stats.completed,
      label: 'Hoàn thành',
      color: 'completed'
    },
    {
      key: 'revenue',
      icon: 'fas fa-money-bill-wave',
      value: formatCurrency(stats.revenue),
      label: 'Doanh thu',
      color: 'revenue'
    }
  ];

  return (
    <div className="admin-booking-stats">
      <div className="admin-stats-grid">
        {statItems.map((item) => (
          <div key={item.key} className={`admin-stat-card ${item.color}`}>
            <div className="admin-stat-icon">
              <i className={item.icon}></i>
            </div>
            <div className="admin-stat-content">
              <div className="admin-stat-value">{item.value}</div>
              <div className="admin-stat-label">{item.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingStats;