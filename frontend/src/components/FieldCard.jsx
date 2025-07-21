function FieldCard({ field, searchInfo, onBook }) {
  return (
    <div
      className="field-card"
      data-field-id={field.id}
      data-date={searchInfo.date}
      data-start-time={searchInfo.startTime}
      data-end-time={searchInfo.endTime}
    >
      <div className="field-card-header">
        <h3>{field.name}</h3>
        <p>{field.type}</p>
      </div>
      <div className="field-card-body">
        <div className="field-slots">
          <div className="field-slots-title">Khung giờ trống:</div>
          <div className="slots-list">
            {field.slots.map((slot, idx) => (
              <span key={idx} className="time-slot-tag">{slot}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="field-card-footer">
        <div className="field-price">
          {field.price}
          <span className="price-per-hour">{field.pricePerHour}</span>
        </div>
        <button className="book-now-btn" onClick={onBook}>
          Đặt ngay
        </button>
      </div>
    </div>
  );
}

export default FieldCard;