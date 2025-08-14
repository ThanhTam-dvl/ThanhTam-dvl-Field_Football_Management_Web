// ====== 4. CREATE: frontend/src/admin/components/common/ConfirmModal.jsx ======
const ConfirmModal = ({ message, onConfirm, onCancel, title = "Xác nhận" }) => {
  return (
    <div className="admin-modal-overlay" onClick={onCancel}>
      <div className="admin-confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-confirm-icon">
          <i className="fas fa-question-circle"></i>
        </div>
        <h3 className="admin-confirm-title">
          {title}
        </h3>
        <p className="admin-confirm-message">
          {message}
        </p>
        <div className="admin-confirm-actions">
          <button
            onClick={onCancel}
            className="admin-btn admin-btn-secondary"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="admin-btn admin-btn-primary"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;