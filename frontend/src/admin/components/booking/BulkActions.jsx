// ====== frontend/src/admin/components/booking/BulkActions.jsx ======
const BulkActions = ({ selectedCount, onBulkAction }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="admin-bulk-actions">
      <div className="admin-bulk-info">
        <span>{selectedCount} đơn được chọn</span>
      </div>
      <div className="admin-bulk-buttons">
        <button 
          className="admin-btn admin-btn-success admin-btn-sm"
          onClick={() => onBulkAction('approved')}
        >
          <i className="fas fa-check"></i>
          Duyệt tất cả
        </button>
        <button 
          className="admin-btn admin-btn-warning admin-btn-sm"
          onClick={() => onBulkAction('cancelled')}
        >
          <i className="fas fa-times"></i>
          Từ chối tất cả
        </button>
        <button 
          className="admin-btn admin-btn-info admin-btn-sm"
          onClick={() => onBulkAction('completed')}
        >
          <i className="fas fa-check-circle"></i>
          Hoàn thành tất cả
        </button>
        <button 
          className="admin-btn admin-btn-danger admin-btn-sm"
          onClick={() => onBulkAction('delete')}
        >
          <i className="fas fa-trash"></i>
          Xóa tất cả
        </button>
      </div>
    </div>
  );
};

export default BulkActions;