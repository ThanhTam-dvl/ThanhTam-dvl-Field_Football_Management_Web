import { useState, useEffect } from 'react';
import { fetchAvailableFields } from '../services/bookingService';

function BookingSearchForm({ setFields, setSearchInfo }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    fieldTypes: ['5', '7'],
  });

  const [endTimeOptions, setEndTimeOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setForm((prev) => {
        const types = checked
          ? [...prev.fieldTypes, value]
          : prev.fieldTypes.filter((v) => v !== value);
        return { ...prev, fieldTypes: types };
      });
    } else {
      // Khi startTime thay đổi, cập nhật endTimeOptions
      if (name === 'startTime') {
        const start = parseInt(value);
        if (start) {
          // Tạo danh sách giờ kết thúc từ start+1 đến 22
          const newEndOptions = [];
          for (let i = start + 1; i <= 22; i++) {
            newEndOptions.push(i);
          }
          setEndTimeOptions(newEndOptions);
          // Reset endTime nếu không còn hợp lệ
          if (parseInt(form.endTime) <= start) {
            setForm(prev => ({ ...prev, endTime: '' }));
          }
        } else {
          setEndTimeOptions([]);
        }
      }
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    // Khởi tạo endTimeOptions nếu startTime có sẵn
    if (form.startTime) {
      const start = parseInt(form.startTime);
      const newEndOptions = [];
      for (let i = start + 1; i <= 22; i++) {
        newEndOptions.push(i);
      }
      setEndTimeOptions(newEndOptions);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const start = parseInt(form.startTime);
    const end = parseInt(form.endTime);
    const duration = end - start;

    if (duration < 1 || duration > 3) {
      alert('Bạn chỉ được phép đặt sân từ 1 đến 3 giờ.');
      return;
    }

    setIsLoading(true);
    try {
      const fields = await fetchAvailableFields(form);
      setFields(fields);
      setSearchInfo(form);
    } catch (err) {
      console.error(err);
      alert('Lỗi khi tìm sân trống.');
      setFields([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="search-card">
      <h2>Tìm sân trống</h2>
      <form onSubmit={handleSubmit} className="search-form">
        <div className="form-group">
          <label htmlFor="booking-date">Ngày đặt</label>
          <input 
            type="date" 
            id="booking-date" 
            name="date" 
            value={form.date} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="start-time">Từ giờ</label>
            <select 
              id="start-time" 
              name="startTime" 
              value={form.startTime} 
              onChange={handleChange} 
              required
            >
              <option value="" disabled>Chọn giờ</option>
              {[...Array(17).keys()].map((h) => (
                <option key={h + 6} value={h + 6}>{h + 6}:00</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="end-time">Đến giờ</label>
            <select 
              id="end-time" 
              name="endTime" 
              value={form.endTime} 
              onChange={handleChange} 
              required
              disabled={!form.startTime}
            >
              <option value="" disabled>Chọn giờ</option>
              {endTimeOptions.map((hour) => (
                <option key={hour} value={hour}>{hour}:00</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Loại sân</label>
          <div className="field-type-options">
            {['5', '7', '11'].map((type) => (
              <div key={type} className="field-type-option">
                <input
                  type="checkbox"
                  value={type}
                  checked={form.fieldTypes.includes(type)}
                  onChange={handleChange}
                  id={`field-${type}`}
                />
                <label htmlFor={`field-${type}`}>Sân {type} người</label>
              </div>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          className="search-btn"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span> Đang tìm kiếm...
            </>
          ) : (
            'Tìm sân trống'
          )}
        </button>
      </form>
      <p>
        Ngày: {form.date} | Thời gian: {form.startTime}:00 - {form.endTime}:00 
        ({parseInt(form.endTime) - parseInt(form.startTime)} giờ) |
        Loại sân: {form.fieldTypes.join(', ')} người
      </p>
    </div>
  );
}

export default BookingSearchForm;