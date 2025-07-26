function FieldCard({ field, searchInfo, onBook }) {
  const slot = (field.slots ?? [])[0];
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
            {slot ? (
              <>
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
              </>
            ) : (
              <span className="no-slot">Không còn khung giờ phù hợp</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FieldCard;