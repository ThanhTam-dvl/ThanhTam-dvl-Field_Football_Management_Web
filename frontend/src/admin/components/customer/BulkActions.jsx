// ====== frontend/src/admin/components/customer/BulkActions.jsx ======
const BulkActions = ({ selectedCount, onBulkAction, onExport }) => {
  return (
    <div className="admin-customer-bulk-actions">
      <span className="admin-customer-bulk-text">
        Đã chọn {selectedCount} khách hàng
      </span>
      <div className="admin-customer-bulk-buttons">
        <button
          onClick={() => onBulkAction('activate')}
          className="admin-customer-bulk-btn activate"
        >
          <i className="fas fa-check"></i> Kích hoạt
        </button>
        <button
          onClick={() => onBulkAction('deactivate')}
          className="admin-customer-bulk-btn deactivate"
        >
          <i className="fas fa-ban"></i> Vô hiệu hóa
        </button>
        <button
          onClick={onExport}
          className="admin-customer-bulk-btn export"
        >
          <i className="fas fa-download"></i> Xuất Excel
        </button>
        <button
          onClick={() => onBulkAction('delete')}
          className="admin-customer-bulk-btn delete"
        >
          <i className="fas fa-trash"></i> Xóa
        </button>
      </div>
    </div>
  );
};

export default BulkActions;
