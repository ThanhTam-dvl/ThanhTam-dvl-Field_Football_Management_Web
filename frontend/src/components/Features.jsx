function Features() {
  return (
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
  );
}

export default Features;
