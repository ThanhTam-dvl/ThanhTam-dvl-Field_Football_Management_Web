// ====== frontend/src/admin/components/field/FieldList.jsx ======
const FieldList = ({ fieldsData, currentDate, onBookingClick, filters }) => {
  const allBookings = fieldsData.flatMap(field => 
    field.bookings.map(booking => ({
      ...booking,
      field_name: field.name,
      field_type: field.type
    }))
  );

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { class: 'pending', text: 'Chờ duyệt' },
      approved: { class: 'approved', text: 'Đã duyệt' },
      completed: { class: 'completed', text: 'Hoàn thành' },
      cancelled: { class: 'cancelled', text: 'Đã hủy' }
    };
    return statusMap[status] || { class: 'pending', text: status };
  };

  const filteredBookings = allBookings.filter(booking => {
    if (filters.fieldType !== 'all' && booking.field_type !== filters.fieldType) {
      return false;
    }
    if (filters.status !== 'all' && booking.status !== filters.status) {
      return false;
    }
    return true;
  });

  return (
    <div className="admin-list-view">
      <div className="admin-bookings-list">
        {filteredBookings.map(booking => (
          <div 
            key={booking.id}
            className={`admin-booking-card ${booking.status}`}
            onClick={() => onBookingClick(booking)}
          >
            <div className="admin-booking-card-header">
              <div className="admin-booking-card-title">
                {booking.field_name} - {booking.customer_name}
              </div>
              <div className={`admin-status-badge ${getStatusBadge(booking.status).class}`}>
                {getStatusBadge(booking.status).text}
              </div>
            </div>
            <div className="admin-booking-card-details">
              <div className="admin-booking-detail">
                <i className="fas fa-clock"></i>
                {booking.start_time} - {booking.end_time}
              </div>
              <div className="admin-booking-detail">
                <i className="fas fa-phone"></i>
                {booking.phone_number}
              </div>
              <div className="admin-booking-detail">
                <i className="fas fa-futbol"></i>
                {booking.field_type}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FieldList;
