import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { createBooking } from '../services/bookingService';
import { fetchAvailableFields } from '../services/bookingService';
import LoginModal from '../components/LoginModal';

function Booking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);
  const [searchInfo, setSearchInfo] = useState(null);
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Form search state
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    fieldTypes: ['5', '7'],
  });

  const timeOptions = [];
  for (let h = 6; h <= 22; h++) {
    timeOptions.push(`${h.toString().padStart(2, '0')}:00`);
    if (h < 22) timeOptions.push(`${h.toString().padStart(2, '0')}:30`);
  }

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
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

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

  const handleBook = (field, slot) => {
    if (!user) {
      document.getElementById('login-modal')?.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      setSelected({ field, slot });
      setShowBookingModal(true);
    }
  };

  const handleConfirmBooking = async (formData) => {
    try {
      const payload = {
        user_id: user.id,
        field_id: selected.field.id,
        booking_date: searchInfo.date,
        start_time: selected.slot.start_time,
        end_time: selected.slot.end_time,
        total_amount: selected.slot.price,
        payment_method: formData.payment,
        notes: formData.note,
      };

      await createBooking(payload);
      alert('Đặt sân thành công!');
      setSelected(null);
      setShowBookingModal(false);
    } catch (err) {
      console.error(err);
      alert('Đặt sân thất bại!');
    }
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const resultRef = useRef(null);
  useEffect(() => {
    if (searchInfo && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [searchInfo]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-green-900">
      <Header />
      
      <main className="pt-12 md:pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-green-700 dark:from-gray-800 dark:to-green-800 text-white py-8 md:py-16">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
                Đặt Sân Bóng
              </h1>
              <p className="text-base md:text-xl text-green-100 opacity-90">
                Tìm và đặt sân trống nhanh chóng, dễ dàng
              </p>
            </div>
          </div>
        </section>

        {/* Search Form */}
        <section className="py-6 md:py-8">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 md:p-8 -mt-8 md:-mt-12 relative z-10">
              <div className="flex items-center space-x-3 mb-4 md:mb-6">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <i className="fas fa-search text-white text-sm md:text-base"></i>
                </div>
                <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Tìm sân trống
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ngày đặt
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2.5 md:px-4 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Từ giờ
                    </label>
                    <select
                      name="startTime"
                      value={form.startTime}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2.5 md:px-4 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                    >
                      <option value="" disabled>Chọn giờ</option>
                      {timeOptions.slice(0, -1).map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Đến giờ
                    </label>
                    <select
                      name="endTime"
                      value={form.endTime}
                      onChange={handleChange}
                      required
                      disabled={!form.startTime}
                      className="w-full px-3 py-2.5 md:px-4 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-300 disabled:opacity-50"
                    >
                      <option value="" disabled>Chọn giờ</option>
                      {timeOptions
                        .filter(t => t > form.startTime)
                        .map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Loại sân
                  </label>
                  <div className="grid grid-cols-3 gap-3 md:gap-4">
                    {['5', '7', '11'].map((type) => (
                      <label
                        key={type}
                        className={`relative flex items-center justify-center p-3 md:p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                          form.fieldTypes.includes(type)
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-green-400'
                        }`}
                      >
                        <input
                          type="checkbox"
                          value={type}
                          checked={form.fieldTypes.includes(type)}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <div className="text-lg md:text-xl font-bold">Sân {type}</div>
                          <div className="text-xs md:text-sm opacity-75">{type} người</div>
                        </div>
                        {form.fieldTypes.includes(type) && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <i className="fas fa-check text-white text-xs"></i>
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 md:py-4 px-4 rounded-lg md:rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm md:text-base"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Đang tìm kiếm...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-search"></i>
                      <span>Tìm sân trống</span>
                    </>
                  )}
                </button>

                {form.date && form.startTime && form.endTime && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 md:p-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex flex-wrap items-center gap-2 md:gap-4">
                      <span className="flex items-center space-x-1">
                        <i className="fas fa-calendar text-green-500"></i>
                        <span>{formatDate(form.date)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <i className="fas fa-clock text-green-500"></i>
                        <span>{form.startTime} - {form.endTime}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <i className="fas fa-futbol text-green-500"></i>
                        <span>Sân {form.fieldTypes.join(', ')} người</span>
                      </span>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>

        {/* Search Results */}
        <section className="py-6 md:py-8" ref={resultRef}>
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                Kết quả tìm kiếm
              </h2>
              {fields.length > 0 && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {fields.length} sân có sẵn
                </div>
              )}
            </div>

            {!searchInfo ? (
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-8 md:p-12 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-search text-gray-400 text-2xl md:text-3xl"></i>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Vui lòng tìm kiếm để xem các sân trống
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Chọn ngày, giờ và loại sân để tìm sân phù hợp
                </p>
              </div>
            ) : fields.length === 0 ? (
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-8 md:p-12 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-calendar-times text-gray-400 text-2xl md:text-3xl"></i>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Không có sân trống
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Không tìm thấy sân nào phù hợp với yêu cầu của bạn
                </p>
                <button
                  onClick={() => setSearchInfo(null)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
                >
                  Tìm kiếm lại
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {fields.map((field) => {
                  const slot = (field.slots ?? [])[0];
                  if (!slot) return null;

                  return (
                    <div
                      key={field.id}
                      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4">
                        <h3 className="font-bold text-lg">{field.name}</h3>
                        <p className="text-green-100 text-sm">{field.type}</p>
                      </div>

                      <div className="p-4">
                        <div className="mb-4">
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Khung giờ trống:
                          </div>
                          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-green-700 dark:text-green-400">
                                {slot.label}
                              </div>
                              <div className="text-xl font-bold text-green-600 dark:text-green-300">
                                {slot.price.toLocaleString()} VNĐ
                              </div>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleBook(field, slot)}
                          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 px-4 rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                        >
                          <i className="fas fa-calendar-plus"></i>
                          <span>Đặt ngay</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Booking Modal */}
      {showBookingModal && selected && (
        <BookingModal
          field={selected.field}
          slot={selected.slot}
          searchInfo={searchInfo}
          onClose={() => {
            setShowBookingModal(false);
            setSelected(null);
          }}
          onConfirm={handleConfirmBooking}
        />
      )}

      <Footer />
      <LoginModal />
    </div>
  );
}

// Booking Modal Component
function BookingModal({ field, slot, searchInfo, onClose, onConfirm }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    phone: user?.phone_number || '',
    name: user?.name || '',
    note: '',
    payment: 'cash',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.phone || !form.name) {
      alert('Vui lòng nhập đủ thông tin');
      return;
    }
    onConfirm(form);
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">Đặt sân</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors duration-300"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="p-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Sân:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {field.name} ({field.type})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Ngày:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {formatDate(searchInfo.date)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Thời gian:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {slot.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Giá:</span>
                <span className="font-bold text-green-600 dark:text-green-400">
                  {slot.price.toLocaleString()} VNĐ
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Số điện thoại
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Họ tên
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Nhập họ tên"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ghi chú
              </label>
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Thông tin thêm (nếu có)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Phương thức thanh toán
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={form.payment === 'cash'}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-gray-900 dark:text-gray-100">Tiền mặt</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={form.payment === 'online'}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-gray-900 dark:text-gray-100">Thanh toán online</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Xác nhận đặt sân
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Booking;