// ====== frontend/src/admin/components/common/ConfirmModal.jsx ======
const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="admin-customer-modal-overlay">
      <div className="admin-customer-confirm-modal">
        <div className="admin-customer-confirm-icon">
          <i className="fas fa-question-circle"></i>
        </div>
        <h3 className="admin-customer-confirm-title">
          Xác nhận
        </h3>
        <p className="admin-customer-confirm-message">
          {message}
        </p>
        <div className="admin-customer-confirm-actions">
          <button
            onClick={onCancel}
            className="admin-customer-form-btn cancel"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="admin-customer-form-btn save"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
