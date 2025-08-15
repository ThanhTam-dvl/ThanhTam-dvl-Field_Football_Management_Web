import { useState, useEffect } from 'react';

function MatchCard({ match, onContact, index = 0 }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 50);
    return () => clearTimeout(timer);
  }, [index]);

  const levelMap = {
    beginner: 'Mới chơi',
    intermediate: 'Trung bình',
    advanced: 'Khá',
    pro: 'Giỏi'
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  const formatTime = () => {
    if (!match.start_time || !match.end_time) return '';
    const start = match.start_time.slice(0, 5);
    const end = match.end_time.slice(0, 5);
    return `${start}-${end}`;
  };

  const getFieldTypeColor = (type) => {
    const colorMap = {
      '5vs5': 'from-blue-500 to-blue-600',
      '7vs7': 'from-purple-500 to-purple-600',
      '11vs11': 'from-green-500 to-green-600'
    };
    return colorMap[type] || 'from-blue-500 to-blue-600';
  };

  const getFieldTypeShort = (type) => {
    return type?.replace('vs', '') || '5';
  };

  const ageText = match.age_min && match.age_max ? `${match.age_min}-${match.age_max}` : 'Tất cả';

  const formatPrice = (price) => {
    if (!price || price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  return (
    <div className={`transition-all duration-500 hover-lift ${
      isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-10'
    }`}>
      <div className="group bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 h-full">
        
        {/* Header */}
        <div className={`bg-gradient-to-r ${getFieldTypeColor(match.field_type)} p-3 relative`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center">
                <span className="text-white text-xs font-bold">{getFieldTypeShort(match.field_type)}</span>
              </div>
              <div>
                <span className="text-white font-medium text-sm">
                  Sân {getFieldTypeShort(match.field_type)}v{getFieldTypeShort(match.field_type)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              {match.allow_join && (
                <span className="px-2 py-0.5 bg-yellow-400 text-yellow-900 rounded-full text-xs font-medium">
                  Ghép đội
                </span>
              )}
              <span className="px-2 py-0.5 bg-green-400 text-green-900 rounded-full text-xs font-medium">
                Mở
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 space-y-3">
          
          {/* Date & Time */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2.5 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <i className="fas fa-calendar text-blue-600 dark:text-blue-400 text-xs"></i>
                <span className="font-medium text-blue-800 dark:text-blue-200 text-sm">
                  {formatDate(match.match_date)}
                </span>
              </div>
              
              <div className="text-right">
                <div className="font-medium text-blue-700 dark:text-blue-300 text-sm">
                  {formatTime()}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  Giờ đá
                </div>
              </div>
            </div>
          </div>

          {/* Match Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                <i className="fas fa-trophy text-gray-400"></i>
                <span>{levelMap[match.level] || 'Trung bình'}</span>
              </div>
              <span className="text-gray-500 dark:text-gray-400">{ageText} tuổi</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                <i className="fas fa-user text-gray-400"></i>
                <span className="truncate max-w-[100px]">{match.contact_name}</span>
              </div>
              <span className="font-medium text-green-600 dark:text-green-400">
                {formatPrice(match.price_per_person)}
              </span>
            </div>
          </div>

          {/* Description */}
          {match.description && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                {match.description}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-3 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onContact({ name: match.contact_name, phone: match.contact_phone })}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-3 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md flex items-center justify-center space-x-1 text-xs"
            >
              <i className="fas fa-phone text-xs"></i>
              <span>Liên hệ</span>
            </button>

            {match.allow_join && (
              <button className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 px-3 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md flex items-center justify-center space-x-1 text-xs">
                <i className="fas fa-user-plus text-xs"></i>
                <span>Vào đội</span>
              </button>
            )}
          </div>
        </div>

        {/* Hover Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"></div>
      </div>
    </div>
  );
}

export default MatchCard;