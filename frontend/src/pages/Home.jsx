import { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FieldStatus from '../components/FieldStatus';
import Features from '../components/Features';
import LoginModal from '../components/LoginModal';

function Home() {
  const heroRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);

    // Parallax effect
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollY = window.scrollY;
        const rate = scrollY * -0.5;
        heroRef.current.style.transform = `translateY(${rate}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { number: '500+', label: 'Sân bóng', icon: 'fas fa-futbol' },
    { number: '10K+', label: 'Lượt đặt', icon: 'fas fa-calendar-check' },
    { number: '2K+', label: 'Thành viên', icon: 'fas fa-users' },
    { number: '4.9', label: 'Đánh giá', icon: 'fas fa-star' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-25 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[55vh] md:min-h-[65vh] flex items-center justify-center overflow-hidden">
          {/* Background - Fixed để không bị parallax */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 dark:from-gray-800 dark:via-green-800 dark:to-emerald-900">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-20 left-20 w-72 h-72 bg-green-500 rounded-full blur-3xl animate-float"></div>
              <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
            </div>

            {/* Football Field Pattern */}
            <div className="absolute inset-0 opacity-5">
              <svg className="w-full h-full" viewBox="0 0 100 60">
                <defs>
                  <pattern id="field" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <rect width="20" height="20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100" height="60" fill="url(#field)"/>
                <circle cx="50" cy="30" r="8" fill="none" stroke="currentColor" strokeWidth="1"/>
                <rect x="5" y="15" width="15" height="30" fill="none" stroke="currentColor" strokeWidth="1"/>
                <rect x="80" y="15" width="15" height="30" fill="none" stroke="currentColor" strokeWidth="1"/>
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 text-center text-white">
            <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 mb-4 md:mb-6">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium">Nền tảng đặt sân #1 Việt Nam</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-xl md:text-3xl lg:text-4xl font-bold mb-3 leading-tight">
                Đặt sân bóng{' '}
                <span className="bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                  nhanh chóng
                </span>
                <br />
                & dễ dàng
              </h1>

              <p className="text-sm md:text-base text-green-100 mb-4 md:mb-6 max-w-md md:max-w-xl mx-auto leading-relaxed px-2">
                Tìm và đặt sân bóng yêu thích chỉ với vài thao tác đơn giản. 
                Kết nối với cộng đồng bóng đá khắp cả nước.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 mb-4 md:mb-6 px-2">
                <a
                  href="/booking"
                  className="group relative px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-green-800 font-bold rounded-lg shadow-lg shadow-yellow-400/30 hover:shadow-yellow-400/50 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden w-full sm:w-auto text-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative flex items-center justify-center space-x-2">
                    <i className="fas fa-calendar-plus text-sm"></i>
                    <span className="text-sm">Đặt sân ngay</span>
                    <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform duration-300 text-xs"></i>
                  </div>
                </a>

                <a
                  href="/find-match"
                  className="px-4 py-2.5 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center space-x-2 w-full sm:w-auto"
                >
                  <i className="fas fa-search text-sm"></i>
                  <span className="text-sm">Tìm kèo đá</span>
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 px-2">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="bg-white/15 dark:bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-2.5 md:p-3 hover:bg-white/25 dark:hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-1 group">
                      <div className="mb-1">
                        <i className={`${stat.icon} text-base md:text-lg text-yellow-300 group-hover:scale-110 transition-transform duration-300`}></i>
                      </div>
                      <div className="text-lg md:text-xl font-bold mb-0.5 text-white">{stat.number}</div>
                      <div className="text-green-100 text-xs">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          {/* <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 text-white/80 animate-bounce">
            <div className="flex flex-col items-center space-y-1">
              <span className="text-xs md:text-sm">Cuộn xuống</span>
              <i className="fas fa-chevron-down text-sm"></i>
            </div>
          </div> */}
        </section>

        {/* Field Status Section */}
        <FieldStatus />

        {/* Features Section */}
        <Features />

        {/* Testimonials Section */}
        <section className="py-12 lg:py-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Khách hàng{' '}
                <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                  nói gì?
                </span>
              </h2>
              <p className="text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Hàng ngàn khách hàng đã tin tương và sử dụng dịch vụ của chúng tôi
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Anh Minh',
                  role: 'Thành viên VIP',
                  content: 'Đặt sân rất nhanh và tiện lợi. Giao diện đẹp, dễ sử dụng. Tôi đã đặt được nhiều sân hay ở đây.',
                  rating: 5,
                  avatar: 'M'
                },
                {
                  name: 'Chị Lan',
                  role: 'Quản lý CLB',
                  content: 'Dịch vụ tuyệt vời! Hỗ trợ đặt sân cho cả đội rất thuận tiện. Giá cả hợp lý.',
                  rating: 5,
                  avatar: 'L'
                },
                {
                  name: 'Anh Tuấn',
                  role: 'Người chơi',
                  content: 'Tìm kèo và ghép đội rất dễ dàng. Đã gặp được nhiều bạn mới qua ứng dụng này.',
                  rating: 5,
                  avatar: 'T'
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <i key={i} className="fas fa-star text-yellow-400"></i>
                    ))}
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 italic">"{testimonial.content}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 lg:py-16 bg-gradient-to-r from-green-600 to-green-700 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-10 left-10 w-24 h-24 border-2 border-white rounded-full"></div>
              <div className="absolute top-20 right-20 w-16 h-16 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-20 left-1/3 w-28 h-28 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-10 right-10 w-12 h-12 border-2 border-white rounded-full"></div>
            </div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 md:mb-6">
                Sẵn sàng tham gia cộng đồng bóng đá?
              </h2>
              <p className="text-lg md:text-xl text-green-100 mb-6 md:mb-8">
                Đăng ký ngay hôm nay và nhận ưu đãi đặc biệt cho lần đặt sân đầu tiên
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 md:space-x-6">
                <a
                  href="/booking"
                  className="px-6 md:px-8 py-3 md:py-4 bg-white text-green-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1 shadow-xl flex items-center space-x-2 w-full sm:w-auto justify-center"
                >
                  <i className="fas fa-rocket"></i>
                  <span>Bắt đầu ngay</span>
                </a>
                
                <a
                  href="/contact"
                  className="px-6 md:px-8 py-3 md:py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-green-600 transition-all duration-300 transform hover:-translate-y-1 flex items-center space-x-2 w-full sm:w-auto justify-center"
                >
                  <i className="fas fa-phone"></i>
                  <span>Liên hệ tư vấn</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <LoginModal />
    </div>
  );
}

export default Home;