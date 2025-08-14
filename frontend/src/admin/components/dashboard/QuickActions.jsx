// ====== frontend/src/admin/components/dashboard/QuickActions.jsx ======
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Đặt sân mới',
      icon: 'fas fa-plus',
      color: 'linear-gradient(135deg, #74b9ff, #0984e3)',
      action: () => navigate('/admin/bookings?action=create')
    },
    {
      title: 'Thêm sân',
      icon: 'fas fa-futbol',
      color: 'linear-gradient(135deg, #00b894, #00a085)',
      action: () => navigate('/admin/fields?action=create')
    },
    {
      title: 'Báo cáo',
      icon: 'fas fa-chart-line',
      color: 'linear-gradient(135deg, #fdcb6e, #e17055)',
      action: () => navigate('/admin/revenue')
    },
    {
      title: 'Bảo trì',
      icon: 'fas fa-tools',
      color: 'linear-gradient(135deg, #a29bfe, #6c5ce7)',
      action: () => navigate('/admin/maintenance')
    }
  ];

  return (
    <div className="admin-content-section" style={{ marginTop: '32px' }}>
      <div className="admin-section-header">
        <h2>Thao tác nhanh</h2>
      </div>
      
      <div className="admin-quick-actions-grid">
        {quickActions.map((action, index) => (
          <button 
            key={index}
            className="admin-quick-action-btn"
            onClick={action.action}
            style={{ background: action.color }}
          >
            <i className={action.icon}></i>
            <span>{action.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
