// frontend/src/admin/components/AdminLayout.jsx
import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import '../assets/styles/admin.css';

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const { admin, logout, hasPermission } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('adminSidebarCollapsed');
    if (stored) setSidebarCollapsed(JSON.parse(stored));
  }, []);

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('adminSidebarCollapsed', JSON.stringify(newState));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const menuItems = [
    {
      path: '/admin/dashboard',
      icon: 'fas fa-tachometer-alt',
      label: 'Dashboard',
      permission: null
    },
    {
      path: '/admin/bookings',
      icon: 'fas fa-clipboard-list',
      label: 'Đơn đặt sân',
      permission: 'bookings'
    },
    {
      path: '/admin/fields',
      icon: 'fas fa-calendar-alt',
      label: 'Quản lý sân',
      permission: 'fields'
    },
    {
      path: '/admin/users',
      icon: 'fas fa-users',
      label: 'Khách hàng',
      permission: 'users'
    },
    {
      path: '/admin/reports',
      icon: 'fas fa-chart-line',
      label: 'Báo cáo',
      permission: 'reports'
    }
  ].filter(item => !item.permission || hasPermission(item.permission));

  const getPageTitle = () => {
    const titles = {
      '/admin/dashboard': 'Dashboard',
      '/admin/bookings': 'Quản lý đặt sân',
      '/admin/fields': 'Quản lý sân',
      '/admin/users': 'Quản lý khách hàng',
      '/admin/reports': 'Báo cáo'
    };
    return titles[location.pathname] || 'Admin Panel';
  };

  return (
    <div className="admin-app">
      <div className="admin-layout">
        {/* Desktop Sidebar */}
        <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="admin-sidebar-header">
            <div className="admin-logo">
              <i className="fas fa-futbol"></i>
              {!sidebarCollapsed && <span className="admin-logo-text">FootballField</span>}
            </div>
            <button className="admin-sidebar-toggle admin-desktop-only" onClick={toggleSidebar}>
              <i className="fas fa-bars"></i>
            </button>
          </div>
          
          <nav className="admin-sidebar-nav">
            <ul className="admin-nav-menu">
              {menuItems.map((item) => (
                <li 
                  key={item.path}
                  className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                >
                  <a 
                    href="#"
                    className="admin-nav-link"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.path);
                      setMobileNavOpen(false);
                    }}
                  >
                    <i className={item.icon}></i>
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="admin-sidebar-footer">
            <div className="admin-profile">
              <div className="admin-avatar">
                <i className="fas fa-user-shield"></i>
              </div>
              {!sidebarCollapsed && (
                <div className="admin-info">
                  <span className="admin-name">{admin?.name}</span>
                  <span className="admin-role">{admin?.role}</span>
                </div>
              )}
            </div>
            <button className="admin-logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              {!sidebarCollapsed && <span className="admin-logout-text">Đăng xuất</span>}
            </button>
          </div>
        </aside>

        {/* Mobile Header */}
        <header className="admin-mobile-header admin-mobile-only">
          <div className="admin-header-left">
            <button 
              className="admin-menu-toggle" 
              onClick={() => setMobileNavOpen(true)}
            >
              <i className="fas fa-bars"></i>
            </button>
            <div className="admin-logo">
              <i className="fas fa-futbol"></i>
              <span>FootballField</span>
            </div>
          </div>
          <div className="header-right">
            <button className="admin-profile-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </header>

        {/* Mobile Navigation */}
        <nav className={`admin-mobile-nav admin-mobile-only ${mobileNavOpen ? 'active' : ''}`}>
          <div className="admin-nav-overlay" onClick={() => setMobileNavOpen(false)}></div>
          <div className="admin-nav-drawer">
            <div className="admin-nav-header">
              <div className="admin-profile">
                <div className="admin-avatar">
                  <i className="fas fa-user-shield"></i>
                </div>
                <div className="admin-info">
                  <span className="admin-name">{admin?.name}</span>
                  <span className="admin-role">{admin?.role}</span>
                </div>
              </div>
              <button className="admin-nav-close" onClick={() => setMobileNavOpen(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <ul className="admin-nav-menu">
              {menuItems.map((item) => (
                <li 
                  key={item.path}
                  className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                >
                  <a 
                    href="#"
                    className="admin-nav-link"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.path);
                      setMobileNavOpen(false);
                    }}
                  >
                    <i className={item.icon}></i>
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
            
            <div className="admin-nav-footer">
              <button className="admin-logout-btn" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i>
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="admin-main-content">
          {/* Desktop Header */}
          <header className="admin-desktop-header admin-desktop-only">
            <div className="admin-header-left">
              <h1>{getPageTitle()}</h1>
              <div className="admin-breadcrumb">
                <span>Admin</span>
                <i className="fas fa-chevron-right"></i>
                <span>{getPageTitle()}</span>
              </div>
            </div>
            <div className="header-right">
              <div className="admin-current-time">
                {currentTime.toLocaleString('vi-VN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </header>

          {/* Mobile Page Title */}
          <div className="admin-mobile-page-title admin-mobile-only">
            <h1>{getPageTitle()}</h1>
          </div>

          {/* Page Content */}
          <div className="admin-page-content">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;