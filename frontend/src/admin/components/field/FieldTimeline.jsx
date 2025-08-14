// ====== frontend/src/admin/components/field/FieldTimeline.jsx ======
const FieldTimeline = ({ fieldsData, onTimeSlotClick, filters }) => {
  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 5; hour <= 23; hour++) {
      slots.push(hour);
    }
    return slots;
  };

  const getBookingForTimeSlot = (fieldId, hour) => {
    const field = fieldsData.find(f => f.id === fieldId);
    if (!field) return null;

    const booking = field.bookings?.find(b => {
      const startHour = parseInt(b.start_time.split(':')[0]);
      const endHour = parseInt(b.end_time.split(':')[0]);
      return hour >= startHour && hour < endHour;
    });

    if (booking) return { ...booking, type: 'booking' };

    const maintenance = field.maintenance?.find(m => {
      const startHour = parseInt(m.start_time.split(':')[0]);
      const endHour = parseInt(m.end_time.split(':')[0]);
      return hour >= startHour && hour < endHour;
    });

    if (maintenance) return { ...maintenance, type: 'maintenance' };

    return null;
  };

  const filteredFields = fieldsData.filter(field => {
    if (filters.fieldType !== 'all' && field.type !== filters.fieldType) {
      return false;
    }
    return true;
  });

  return (
    <div className="admin-timeline-view">
      <div className="admin-timeline-header">
        <div className="admin-field-column">Sân</div>
        <div className="admin-time-columns">
          {getTimeSlots().map(hour => (
            <div key={hour} className="admin-time-column">
              {hour}:00
            </div>
          ))}
        </div>
      </div>

      <div className="admin-timeline-body">
        {filteredFields.map(field => (
          <div key={field.id} className="admin-field-row">
            <div className="admin-field-info">
              <div className="admin-field-name">{field.name}</div>
              <div className="admin-field-type">{field.type}</div>
            </div>
            
            <div className="admin-field-timeline">
              {getTimeSlots().map(hour => {
                const booking = getBookingForTimeSlot(field.id, hour);
                const isFirstHour = booking && parseInt(booking.start_time?.split(':')[0]) === hour;
                
                return (
                  <div 
                    key={hour}
                    className={`admin-time-slot ${!booking ? 'available' : ''}`}
                    onClick={() => onTimeSlotClick(field.id, hour, booking)}
                  >
                    {booking && isFirstHour && (
                      <div 
                        className={`admin-booking-block ${booking.status || 'maintenance'}`}
                        style={{
                          '--duration': Math.ceil((parseInt(booking.end_time.split(':')[0]) - parseInt(booking.start_time.split(':')[0])))
                        }}
                      >
                        {booking.type === 'maintenance' ? (
                          <div className="admin-booking-customer">Bảo trì</div>
                        ) : (
                          <>
                            <div className="admin-booking-customer">
                              {booking.customer_name}
                            </div>
                            <div className="admin-booking-phone">
                              {booking.phone_number}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FieldTimeline;
