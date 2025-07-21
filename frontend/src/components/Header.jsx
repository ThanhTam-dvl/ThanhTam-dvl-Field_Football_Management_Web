import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const openLogin = () => {
    document.getElementById('login-modal')?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

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
                <li><Link to="/" className={isActive('/')}>Trang chủ</Link></li>
                <li><Link to="/booking" className={isActive('/booking')}>Đặt sân</Link></li>
                <li><Link to="/find-match" className={isActive('/find-match')}>Tìm kèo</Link></li>
                <li><Link to="/join-team" className={isActive('/join-team')}>Ghép đội</Link></li>
                <li><Link to="/contact" className={isActive('/contact')}>Liên hệ</Link></li>
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
          <li><Link to="/" className={isActive('/')}>Trang chủ</Link></li>
          <li><Link to="/booking" className={isActive('/booking')}>Đặt sân</Link></li>
          <li><Link to="/find-match" className={isActive('/find-match')}>Tìm kèo</Link></li>
          <li><Link to="/join-team" className={isActive('/join-team')}>Ghép đội</Link></li>
          <li><Link to="/contact" className={isActive('/contact')}>Liên hệ</Link></li>
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
