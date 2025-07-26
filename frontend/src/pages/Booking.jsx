// src/pages/Booking.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookingSearchForm from '../components/BookingSearchForm';
import FieldCard from '../components/FieldCard';
import BookingModal from '../components/BookingModal';
import { createBooking } from '../services/bookingService';
import LoginModal from '../components/LoginModal';

function Booking() {
  const { user } = useAuth();
  const [fields, setFields] = useState([]);
  const [searchInfo, setSearchInfo] = useState(null);
  const [selected, setSelected] = useState(null); // {field, slot}

  // Xử lý khi xác nhận đặt sân từ BookingModal
  const handleConfirmBooking = async (form) => {
    try {
      const payload = {
        user_id: 1, // TODO: lấy từ AuthContext
        field_id: selected.field.id,
        booking_date: searchInfo.date,
        start_time: selected.slot.start_time,
        end_time: selected.slot.end_time,
        total_amount: selected.slot.price,
        payment_method: form.payment,
        notes: form.note,
      };

      await createBooking(payload);
      alert('Đặt sân thành công!');
      setSelected(null);
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

  const handleBook = (field, slot) => {
    if (!user) {
      document.getElementById('login-modal')?.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      setSelected({ field, slot });
    }
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
                  onBook={handleBook} // Truyền handleBook vào FieldCard
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      {selected && (
        <BookingModal
          field={selected.field}
          slot={selected.slot}
          searchInfo={searchInfo}
          onClose={() => setSelected(null)}
          onConfirm={handleConfirmBooking}
        />
      )}
      <Footer />
      <LoginModal />
    </>
  );
}

export default Booking;