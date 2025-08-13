// ====== frontend/src/admin/components/common/LoadingSpinner.jsx ======
const LoadingSpinner = ({ message = 'Đang tải...' }) => {
  return (
    <div className="admin-customer-loading">
      <i className="fas fa-spinner"></i>
      <span>{message}</span>
    </div>
  );
};

export default LoadingSpinner;