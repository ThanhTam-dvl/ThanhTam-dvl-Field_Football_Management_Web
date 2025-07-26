function FieldCard({ field, searchInfo, onBook }) {
  const slot = (field.slots ?? [])[0];

  // Nếu không có slot phù hợp, không hiển thị card
  if (!slot) return null;

  return (
    <div className="field-card">
      <div className="field-card-header">
        <h3>{field.name}</h3>
        <p>{field.type}</p>
      </div>
      <div className="field-card-body">
        <div className="field-slots">
          <div className="field-slots-title">Khung giờ trống:</div>
          <div className="slots-list" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="time-slot-tag">
              {slot.label} <b>{slot.price.toLocaleString()} VNĐ</b>
            </span>
            <button
              className="book-now-btn"
              onClick={() => onBook(field, slot)}
              style={{ marginLeft: 8 }}
            >
              Đặt ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FieldCard;