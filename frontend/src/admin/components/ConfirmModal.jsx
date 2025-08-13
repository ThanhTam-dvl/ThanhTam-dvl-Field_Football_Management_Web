// frontend/src/admin/components/ConfirmModal.jsx
const ConfirmModal = ({ title, message, onConfirm, onCancel, confirmText = 'Xác nhận', cancelText = 'Hủy' }) => {
  return (
    <div className="admin-modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="admin-modal admin-confirm-modal">
        <div className="admin-modal-header">
          <h2>
            <i className="fas fa-question-circle"></i>
            {title}
          </h2>
          <button className="admin-modal-close" onClick={onCancel}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="admin-modal-body">
          <div className="admin-confirm-content">
            <div className="admin-confirm-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <p className="admin-confirm-message">{message}</p>
          </div>
        </div>

        <div className="admin-modal-footer">
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-danger"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;