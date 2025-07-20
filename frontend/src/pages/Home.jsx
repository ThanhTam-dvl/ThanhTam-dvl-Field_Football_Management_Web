// src/pages/Home.js
import Header from '../components/Header';
import Footer from '../components/Footer';
import FieldStatus from '../components/FieldStatus';
import Features from '../components/Features';
import LoginModal from '../components/LoginModal';

function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <h2>Đặt sân bóng nhanh chóng & dễ dàng</h2>
              <p>Tìm và đặt sân bóng yêu thích chỉ với vài thao tác đơn giản</p>
              <a href="/booking" className="cta-button">Đặt sân ngay</a>
            </div>
          </div>
        </section>

        <FieldStatus />

        <section className="features">
          <div className="container">
            <h2>Tại sao chọn chúng tôi?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-calendar-check"></i>
                </div>
                <h3>Đặt sân dễ dàng</h3>
                <p>Không cần tài khoản phức tạp, chỉ cần số điện thoại và OTP</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-futbol"></i>
                </div>
                <h3>Đa dạng sân bóng</h3>
                <p>Nhiều loại sân phù hợp với nhu cầu của bạn</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-users"></i>
                </div>
                <h3>Tìm kèo & ghép đội</h3>
                <p>Dễ dàng tìm đối thủ hoặc tham gia vào các đội đang thiếu người</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-money-bill-wave"></i>
                </div>
                <h3>Thanh toán linh hoạt</h3>
                <p>Hỗ trợ thanh toán tiền mặt và trực tuyến</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <LoginModal />
    </>
  );
}

export default Home;
