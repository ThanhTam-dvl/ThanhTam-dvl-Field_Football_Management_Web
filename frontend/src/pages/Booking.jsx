// src/pages/Booking.jsx
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookingSearchForm from '../components/BookingSearchForm';
import FieldCard from '../components/FieldCard';
import BookingModal from '../components/BookingModal';
import { createBooking } from '../services/bookingService';
import LoginModal from '../components/LoginModal';

function Booking() {
  const [fields, setFields] = useState([]);
  const [searchInfo, setSearchInfo] = useState(null);
  const [selectedField, setSelectedField] = useState(null);

  // ánh xạ giờ bắt đầu → time_slot_id (nếu backend cần)
const mapTimeToSlotId = (startTime) => {
  const map = {
    6: 1, 8: 2, 10: 3, 12: 4,
    14: 5, 16: 6, 18: 7, 20: 8
  };
  return map[parseInt(startTime)];
};

// Xử lý khi xác nhận đặt sân từ BookingModal
const handleConfirmBooking = async () => {
  try {
    const payload = {
      user_id: 1, // TODO: lấy từ AuthContext
      field_id: selectedField.id,
      booking_date: searchInfo.date,
      time_slot_id: mapTimeToSlotId(searchInfo.startTime),
      total_amount: selectedField.priceNumeric || 300000, // backend phải hỗ trợ hoặc xử lý từ client
    };

    await createBooking(payload);
    alert('Đặt sân thành công!');
    setSelectedField(null);
  } catch (err) {
    console.error(err);
    alert('Đặt sân thất bại!');
  }
};

  // Hàm định dạng ngày: yyyy-mm-dd -> dd/mm/yyyy
  const formatDateForDisplay = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <Header />
      <main className="booking-page">
        <section className="booking-hero">
          <div className="container">
            <h1>Đặt Sân Bóng</h1>
            <p>Tìm và đặt sân trống nhanh chóng, dễ dàng</p>
          </div>
        </section>
        <section className="booking-search">
          <div className="container">
            <BookingSearchForm setFields={setFields} setSearchInfo={setSearchInfo} />
          </div>
        </section>
        <section className="search-results">
          <div className="container">
            <div id="search-status" className="search-status">
              <h2>Kết quả tìm kiếm</h2>
              {!searchInfo ? (
                <p>Vui lòng tìm kiếm để xem các sân trống</p>
              ) : (
                <p>
                  Ngày: {formatDateForDisplay(searchInfo.date)} | 
                  Thời gian: {searchInfo.startTime}:00 - {searchInfo.endTime}:00
                  ({parseInt(searchInfo.endTime) - parseInt(searchInfo.startTime)} giờ) | 
                  Loại sân: {searchInfo.fieldTypes.join(', ')} người
                </p>
              )}
            </div>
            
            <div id="results-container" className="results-container">
              {fields.map(field => (
                <FieldCard
                  key={field.id}
                  field={field}
                  searchInfo={searchInfo}
                  onBook={() => setSelectedField(field)}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      {selectedField && (
        <BookingModal
          field={selectedField}
          searchInfo={searchInfo}
          onClose={() => setSelectedField(null)}
          onConfirm={handleConfirmBooking}
        />
      )}
      <Footer />
      <LoginModal />
    </>
  );
}

export default Booking;