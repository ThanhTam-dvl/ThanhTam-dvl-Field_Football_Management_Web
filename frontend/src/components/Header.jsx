import { useState } from 'react';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const openLogin = () => {
    document.getElementById('login-modal')?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  return (
    <>
      <header>
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <h1>FootballField</h1>
            </div>
            <nav className="main-nav">
              <ul>
                <li><a href="/" className="active">Trang chủ</a></li>
                <li><a href="/booking">Đặt sân</a></li>
                <li><a href="/find-match">Tìm kèo</a></li>
                <li><a href="/join-team">Ghép đội</a></li>
                <li><a href="/contact">Liên hệ</a></li>
              </ul>
            </nav>
            <div className="user-actions">
              <button className="login-btn" onClick={openLogin}>
                <i className="fas fa-user"></i> Đăng nhập
              </button>
            </div>
            <div className="mobile-menu-btn" onClick={toggleMenu}>
              <i className="fas fa-bars"></i>
            </div>
          </div>
        </div>
      </header>

      <div className={`mobile-menu ${menuOpen ? 'active' : ''}`}>
        <ul>
          <li><a href="/" className="active">Trang chủ</a></li>
          <li><a href="/booking">Đặt sân</a></li>
          <li><a href="/find-match">Tìm kèo</a></li>
          <li><a href="/join-team">Ghép đội</a></li>
          <li><a href="/contact">Liên hệ</a></li>
          <li>
            <a href="#" className="login-mobile" onClick={openLogin}>
              <i className="fas fa-user"></i> Đăng nhập
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Header;
