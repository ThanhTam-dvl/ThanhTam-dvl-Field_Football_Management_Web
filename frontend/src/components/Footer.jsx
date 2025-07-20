function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <h3>FootballField</h3>
            <p>Đặt sân bóng nhanh chóng và thuận tiện</p>
          </div>
          <div className="footer-links">
            <h4>Liên kết nhanh</h4>
            <ul>
              <li><a href="/">Trang chủ</a></li>
              <li><a href="/booking">Đặt sân</a></li>
              <li><a href="/find-match">Tìm kèo</a></li>
              <li><a href="/join-team">Ghép đội</a></li>
              <li><a href="/contact">Liên hệ</a></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h4>Liên hệ</h4>
            <p><i className="fas fa-map-marker-alt"></i> 123 Đường ABC, Quận XYZ, TP.HCM</p>
            <p><i className="fas fa-phone"></i> 0123 456 789</p>
            <p><i className="fas fa-envelope"></i> info@footballfield.com</p>
          </div>
          <div className="footer-social">
            <h4>Kết nối với chúng tôi</h4>
            <div className="social-icons">
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-tiktok"></i></a>
              <a href="#"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 FootballField. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
