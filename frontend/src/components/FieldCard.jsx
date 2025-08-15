import { useState, useEffect } from 'react';

function FieldCard({ field, searchInfo, onBook, index = 0 }) {
  const [isVisible, setIsVisible] = useState(false);
  const slot = (field.slots ?? [])[0];

  // Animation trigger
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 50);
    return () => clearTimeout(timer);
  }, [index]);

  // Nếu không có slot phù hợp, không hiển thị card
  if (!slot) return null;

  const getFieldTypeColor = (type) => {
    const colorMap = {
      '5vs5': 'from-blue-500 to-blue-600',
      '7vs7': 'from-purple-500 to-purple-600',
      '11vs11': 'from-green-500 to-green-600'
    };
    return colorMap[type] || 'from-green-500 to-green-600';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const getFieldTypeShort = (type) => {
    return type.replace('vs', '');
  };

  return (
    <div className={`transition-all duration-500 hover-lift ${
      isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-10'
    }`}>
      <div className="group bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 h-full">
        
        {/* Header - Compact */}
        <div className={`bg-gradient-to-r ${getFieldTypeColor(field.type)} p-3 relative`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center">
                <span className="text-white text-xs font-bold">{getFieldTypeShort(field.type)}</span>
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm leading-tight">
                  {field.name}
                </h3>
              </div>
            </div>
            
            <span className="px-2 py-0.5 bg-green-400 text-green-900 rounded-full text-xs font-medium">
              Trống
            </span>
          </div>
        </div>

        {/* Content - Ultra Compact */}
        <div className="p-3 space-y-3">
          
          {/* Time & Price */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2.5 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <i className="fas fa-clock text-green-600 dark:text-green-400 text-xs"></i>
                <span className="font-medium text-green-800 dark:text-green-200 text-sm">
                  {slot.label}
                </span>
              </div>
              
              <div className="text-right">
                <div className="font-bold text-green-700 dark:text-green-300 text-sm">
                  {formatPrice(slot.price)}đ
                </div>
                <div className="text-xs text-green-600 dark:text-green-400">
                  /giờ
                </div>
              </div>
            </div>
          </div>

          {/* Location - Minimal */}
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <i className="fas fa-map-marker-alt text-gray-400"></i>
              <span>Khu vực trung tâm</span>
            </div>
            <span className="text-gray-500">Tiêu chuẩn</span>
          </div>
        </div>

        {/* Footer - Minimal */}
        <div className="px-3 pb-3">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <div className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                {formatPrice(slot.price)}đ
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Tổng tiền
              </div>
            </div>

            <button
              onClick={() => onBook(field, slot)}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 py-2 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md flex items-center space-x-1.5 text-xs"
            >
              <i className="fas fa-calendar-plus"></i>
              <span>Đặt ngay</span>
            </button>
          </div>
        </div>

        {/* Hover Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"></div>
      </div>
    </div>
  );
}

export default FieldCard;