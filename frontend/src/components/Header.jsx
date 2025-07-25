// src/components/Header.jsx
import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const openLogin = () => {
    const modal = document.getElementById('login-modal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const isActive = (path) => (location.pathname === path ? 'active' : '');

  const handleLogout = () => {
    logout();
    navigate('/');
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
                <li><Link to="/" className={isActive('/')}>Trang chủ</Link></li>
                <li><Link to="/booking" className={isActive('/booking')}>Đặt sân</Link></li>
                <li><Link to="/find-match" className={isActive('/find-match')}>Tìm kèo</Link></li>
                <li><Link to="/join-team" className={isActive('/join-team')}>Ghép đội</Link></li>
                <li><Link to="/contact" className={isActive('/contact')}>Liên hệ</Link></li>
              </ul>
            </nav>
            <div className="user-actions">
              {user ? (
                <div className="login-btn" style={{ position: 'relative' }}>
                  <Link to="/profile">
                    <i className="fas fa-user-circle"></i> {user.name || 'Tài khoản'}
                  </Link>
                  <button onClick={handleLogout} style={{
                    position: 'absolute', top: '100%', left: 0, background: 'white', border: '1px solid #ccc', padding: '5px 10px', cursor: 'pointer', zIndex: 10
                  }}>Đăng xuất</button>
                </div>
              ) : (
                <button className="login-btn" onClick={openLogin}>
                  <i className="fas fa-user"></i> Đăng nhập
                </button>
              )}
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
          {user ? (
            <>
              <li><Link to="/profile" className={isActive('/profile')}><i className="fas fa-user-circle"></i> Hồ sơ</Link></li>
              <li><button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'red', padding: '8px' }}>Đăng xuất</button></li>
            </>
          ) : (
            <li>
              <a href="#" className="login-mobile" onClick={openLogin}>
                <i className="fas fa-user"></i> Đăng nhập
              </a>
            </li>
          )}
        </ul>
      </div>
    </>
  );
}

export default Header;
