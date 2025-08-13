// ====== frontend/src/admin/components/customer/CustomerStats.jsx ======
const CustomerStats = ({ stats }) => {
  const statItems = [
    {
      icon: 'fas fa-users',
      value: stats.total_customers,
      label: 'Tổng khách hàng',
      color: 'users'
    },
    {
      icon: 'fas fa-check-circle',
      value: stats.active_customers,
      label: 'Đang hoạt động',
      color: 'success'
    },
    {
      icon: 'fas fa-star',
      value: stats.vip_customers,
      label: 'Khách VIP',
      color: 'warning'
    },
    {
      icon: 'fas fa-user-plus',
      value: stats.new_customers_30d,
      label: 'Khách mới (30 ngày)',
      color: 'info'
    }
  ];

  return (
    <div className="admin-customer-stats-grid">
      {statItems.map((item, index) => (
        <div key={index} className={`admin-customer-stat-card ${item.color}`}>
          <div className="admin-customer-stat-icon">
            <i className={item.icon}></i>
          </div>
          <div className="admin-customer-stat-content">
            <div className="admin-customer-stat-value">{item.value}</div>
            <div className="admin-customer-stat-label">{item.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomerStats;
