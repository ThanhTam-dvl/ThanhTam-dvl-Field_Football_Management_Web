import { useEffect, useState } from 'react';
import API from '../services/api';

function FieldStatus() {
  const [fields, setFields] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [maintenances, setMaintenances] = useState([]);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    const element = document.getElementById('field-status-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [fieldsRes, bookingsRes, maintenanceRes] = await Promise.all([
          API.get('/fields'),
          API.get(`/bookings?date=${formatDate(date)}`),
          API.get(`/maintenance?date=${formatDate(date)}`)
        ]);
        
        setFields(fieldsRes.data || []);
        setBookings(bookingsRes.data || []);
        setMaintenances(maintenanceRes.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date]);

  const formatDate = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const nextDate = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    setDate(newDate);
  };

  const prevDate = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 1);
    setDate(newDate);
  };

  const isTimeBetween = (target, start, end) => {
    return target >= start && target < end;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-400';
      case 'booked': return 'bg-red-400';
      case 'maintenance': return 'bg-gray-400';
      default: return 'bg-gray-200';
    }
  };

  const renderTimeline = (fieldId) => {
    const blocks = [];
    const totalBlocks = 32; // 16 hours * 2 blocks per hour

    for (let hour = 6; hour < 22; hour++) {
      for (let minute of [0, 30]) {
        const blockTime = `${hour.toString().padStart(2, '0')}:${minute === 0 ? '00' : '30'}:00`;
        let status = 'available';

        const hasBooking = bookings.some(
          b => b.field_id === fieldId && isTimeBetween(blockTime, b.start_time, b.end_time)
        );
        const isMaintained = maintenances.some(
          m => m.field_id === fieldId && isTimeBetween(blockTime, m.start_time, m.end_time)
        );

        if (isMaintained) status = 'maintenance';
        else if (hasBooking) status = 'booked';

        const blockIndex = (hour - 6) * 2 + (minute === 30 ? 1 : 0);
        
        blocks.push(
          <div
            key={`${hour}:${minute}`}
            className={`h-8 transition-all duration-300 hover:scale-110 hover:z-10 relative cursor-pointer ${getStatusColor(status)} border-r border-white/30`}
            style={{
              width: `${100 / totalBlocks}%`,
            }}
            title={`${blockTime} - ${status === 'available' ? 'Trống' : status === 'booked' ? 'Đã đặt' : 'Bảo trì'}`}
          >
            {/* Hover tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-20">
              {blockTime}
            </div>
          </div>
        );
      }
    }

    return <div className="flex h-8 bg-gray-100 rounded-lg overflow-hidden">{blocks}</div>;
  };

  const timeSlots = [6, 8, 10, 12, 14, 16, 18, 20];

  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="field-status-section" className="py-8 lg:py-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header */}
        <div className={`flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 transition-all duration-700 ${
          isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-10'
        }`}>
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Tình trạng{' '}
              <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                sân bóng
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Kiểm tra lịch trống và đặt sân nhanh chóng</p>
          </div>

          {/* Date Picker */}
          <div className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-800 rounded-xl p-2">
            <button 
              onClick={prevDate}
              className="w-10 h-10 rounded-lg bg-white dark:bg-gray-700 shadow-sm hover:shadow-md flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            
            <div className="text-center px-4 py-2">
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {date.toLocaleDateString('vi-VN', { 
                  weekday: 'long',
                  day: '2-digit', 
                  month: '2-digit', 
                  year: 'numeric' 
                })}
              </div>
            </div>
            
            <button 
              onClick={nextDate}
              className="w-10 h-10 rounded-lg bg-white dark:bg-gray-700 shadow-sm hover:shadow-md flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className={`flex flex-wrap items-center justify-center gap-6 mb-8 transition-all duration-700 delay-200 ${
          isVisible ? 'animate-fade-in' : 'opacity-0'
        }`}>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-400 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Trống</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-400 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Đã đặt</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-400 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Bảo trì</span>
          </div>
        </div>

        {/* Timeline Header */}
        <div className={`hidden md:flex items-center mb-4 transition-all duration-700 delay-300 ${
          isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-10'
        }`}>
          <div className="w-32 flex-shrink-0"></div>
          <div className="flex-1 flex justify-between text-sm text-gray-500 px-4">
            {timeSlots.map(hour => (
              <div key={hour} className="text-center">
                {hour}:00
              </div>
            ))}
          </div>
        </div>

        {/* Fields List */}
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div 
              key={field.id}
              className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-lg transition-all duration-700 ${
                isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-10'
              }`}
              style={{ 
                animationDelay: isVisible ? `${400 + index * 100}ms` : '0ms',
                transitionDelay: isVisible ? `${400 + index * 100}ms` : '0ms'
              }}
            >
              <div className="flex flex-col md:flex-row md:items-center">
                {/* Field Info */}
                <div className="w-full md:w-32 flex-shrink-0 mb-4 md:mb-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                      <i className="fas fa-futbol text-white"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{field.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{field.type}</p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex-1 md:px-4">
                  {renderTimeline(field.id)}
                </div>

                {/* Action Button */}
                <div className="w-full md:w-auto mt-4 md:mt-0 md:ml-4">
                  <a
                    href="/booking"
                    className="w-full md:w-auto inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <i className="fas fa-calendar-plus mr-2"></i>
                    Đặt sân
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Fields Message */}
        {fields.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-futbol text-gray-400 text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Chưa có sân nào</h3>
            <p className="text-gray-600 dark:text-gray-400">Hiện tại chưa có thông tin sân bóng nào.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default FieldStatus;