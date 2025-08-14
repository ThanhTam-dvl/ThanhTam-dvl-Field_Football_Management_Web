// ====== frontend/src/admin/components/dashboard/DashboardStats.jsx ======
const DashboardStats = ({ stats }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const statItems = [
    {
      key: 'revenue',
      icon: 'fas fa-money-bill-wave',
      value: formatCurrency(stats.today_revenue),
      label: 'Doanh thu hôm nay',
      color: 'revenue'
    },
    {
      key: 'bookings',
      icon: 'fas fa-calendar-check',
      value: stats.today_bookings,
      label: 'Đặt sân hôm nay',
      color: 'bookings'
    },
    {
      key: 'pending',
      icon: 'fas fa-clock',
      value: stats.pending_bookings,
      label: 'Chờ duyệt',
      color: 'pending'
    },
    {
      key: 'fields',
      icon: 'fas fa-futbol',
      value: stats.total_fields,
      label: 'Tổng số sân',
      color: 'fields'
    },
    {
      key: 'users',
      icon: 'fas fa-users',
      value: stats.total_users,
      label: 'Khách hàng',
      color: 'users'
    }
  ];

  return (
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
  );
};

export default DashboardStats;
