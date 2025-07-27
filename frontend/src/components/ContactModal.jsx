// components/ContactModal.jsx
function ContactModal({ data, onClose }) {
  if (!data) return null;

  const phone = data.phone?.replace(/\D/g, '');

  return (
    <div className="contact-modal active" onClick={onClose}>
      <div className="contact-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="contact-modal-header">
          <h3>Thông tin liên hệ</h3>
          <span className="close-contact-modal" onClick={onClose}>&times;</span>
        </div>
        <div className="contact-info">
          <div className="contact-item">
            <i className="fas fa-user"></i>
            <div><strong>Tên:</strong> {data.name}</div>
          </div>
          <div className="contact-item">
            <i className="fas fa-phone"></i>
            <div><strong>Điện thoại:</strong> {data.phone}</div>
          </div>
          <div className="contact-actions">
            <a href={`https://zalo.me/${phone}`} className="contact-btn zalo-btn" target="_blank" rel="noreferrer">
              <i className="fas fa-comments"></i> Liên hệ Zalo
            </a>
            <a href={`tel:${phone}`} className="contact-btn call-btn">
              <i className="fas fa-phone"></i> Gọi điện
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactModal;
