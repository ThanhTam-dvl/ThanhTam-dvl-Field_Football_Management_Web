import { useState, useEffect } from 'react';

function JoinTeamCard({ post, onContact, index = 0 }) {
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

  const positionMap = {
    goalkeeper: 'Thủ môn',
    defender: 'Hậu vệ',
    midfielder: 'Tiền vệ',
    forward: 'Tiền đạo',
    any: 'Bất kỳ'
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  const formatTime = () => {
    return post.start_time?.slice(0, 5) || '';
  };

  const getFieldTypeColor = (type) => {
    const colorMap = {
      '5vs5': 'from-blue-500 to-blue-600',
      '7vs7': 'from-purple-500 to-purple-600',
      '11vs11': 'from-green-500 to-green-600'
    };
    return colorMap[type] || 'from-purple-500 to-purple-600';
  };

  // FIXED: Get the correct field type number
  const getFieldTypeNumber = (type) => {
    if (!type) return '5';
    
    // Extract number from field type (5vs5 -> 5, 7vs7 -> 7, 11vs11 -> 11)
    const match = type.match(/^(\d+)vs\d+$/);
    return match ? match[1] : '5';
  };

  // FIXED: Get the proper field display name
  const getFieldDisplayName = (type) => {
    if (!type) return 'Sân 5v5';
    
    const typeMap = {
      '5vs5': 'Sân 5v5',
      '7vs7': 'Sân 7v7', 
      '11vs11': 'Sân 11v11'
    };
    
    return typeMap[type] || 'Sân 5v5';
  };

  return (
    <div className={`transition-all duration-500 hover-lift ${
      isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-10'
    }`}>
      <div className="group bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 h-full">
        
        {/* Header */}
        <div className={`bg-gradient-to-r ${getFieldTypeColor(post.field_type)} p-3 relative`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center">
                <span className="text-white text-xs font-bold">{getFieldTypeNumber(post.field_type)}</span>
              </div>
              <div>
                <span className="text-white font-medium text-sm">
                  {getFieldDisplayName(post.field_type)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <span className="px-2 py-0.5 bg-orange-400 text-orange-900 rounded-full text-xs font-medium">
                Tuyển
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 space-y-3">
          
          {/* Date & Time */}
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2.5 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <i className="fas fa-calendar text-purple-600 dark:text-purple-400 text-xs"></i>
                <span className="font-medium text-purple-800 dark:text-purple-200 text-sm">
                  {formatDate(post.match_date)}
                </span>
              </div>
              
              <div className="text-right">
                <div className="font-medium text-purple-700 dark:text-purple-300 text-sm">
                  {formatTime()}
                </div>
                <div className="text-xs text-purple-600 dark:text-purple-400">
                  Giờ đá
                </div>
              </div>
            </div>
          </div>

          {/* Team Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                <i className="fas fa-trophy text-gray-400"></i>
                <span>{levelMap[post.level] || 'Trung bình'}</span>
              </div>
              <span className="text-gray-500 dark:text-gray-400">
                Cần {post.players_needed} người
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                <i className="fas fa-running text-gray-400"></i>
                <span>{positionMap[post.position_needed] || 'Bất kỳ'}</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                <i className="fas fa-user text-gray-400"></i>
                <span className="truncate max-w-[80px]">{post.contact_name}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {post.description && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                {post.description}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-3 pb-3">
          <div className="flex items-center gap-2">
            <button className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-2 px-3 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md flex items-center justify-center space-x-1 text-xs">
              <i className="fas fa-hand-paper text-xs"></i>
              <span>Xin đá kèm</span>
            </button>

            <button
              onClick={() => onContact({ name: post.contact_name, phone: post.contact_phone })}
              className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-2 px-3 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md flex items-center justify-center space-x-1 text-xs"
            >
              <i className="fas fa-phone text-xs"></i>
              <span>Liên hệ</span>
            </button>
          </div>
        </div>

        {/* Hover Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"></div>
      </div>
    </div>
  );
}

export default JoinTeamCard;