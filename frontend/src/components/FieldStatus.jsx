import { useEffect, useState } from 'react';
import API from '../services/api';

function FieldStatus() {
  const [fields, setFields] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [maintenances, setMaintenances] = useState([]);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    API.get('/fields').then(res => setFields(res.data));
    API.get(`/bookings?date=${formatDate(date)}`).then(res => setBookings(res.data || []));
    API.get(`/maintenance?date=${formatDate(date)}`).then(res => setMaintenances(res.data || []));
  }, [date]);

  const formatDate = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const nextDate = () => setDate(new Date(date.setDate(date.getDate() + 1)));
  const prevDate = () => setDate(new Date(date.setDate(date.getDate() - 1)));

  const renderTimeline = (fieldId) => {
    const blocks = [];

    for (let hour = 6; hour < 22; hour += 2) {
      let status = 'available';

      const hasBooking = bookings.find(
        b => b.field_id === fieldId && b.time_slot_hour === hour
      );
      const isMaintained = maintenances.find(
        m => m.field_id === fieldId && parseInt(m.start_time) <= hour && hour < parseInt(m.end_time)
      );

      if (isMaintained) status = 'maintenance';
      else if (hasBooking) status = 'booked';

      blocks.push(
        <div
          key={hour}
          className={`time-block ${status}`}
          style={{ left: `${(hour - 6) * 100 / 16}%`, width: `12.5%` }}
          title={`${hour}:00 - ${hour + 2}:00`}
        ></div>
      );
    }

    return <div className="timeline">{blocks}</div>;
  };

  return (
    <section className="fields-status">
      <div className="container">
        <div className="section-title">
          <h2>Tình trạng sân bóng</h2>
          <div className="date-picker">
            <button onClick={prevDate}><i className="fas fa-chevron-left"></i></button>
            <span>{date.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
            <button onClick={nextDate}><i className="fas fa-chevron-right"></i></button>
          </div>
        </div>

        <div className="timeline-header">
          <div className="field-name">Sân</div>
          <div className="time-slots">
            {[6,8,10,12,14,16,18,20].map(h => (
              <div key={h} className="time-slot">{h}h</div>
            ))}
          </div>
        </div>

        <div className="fields-list">
          {fields.map(field => (
            <div key={field.id} className="field-row">
              <div className="field-name">{field.name}</div>
              {renderTimeline(field.id)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FieldStatus;
