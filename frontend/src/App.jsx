import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './admin/context/AdminContext';

// Customer Pages
import Home from './pages/Home';
import Booking from './pages/Booking';
import UserProfile from './pages/UserProfile';
import FindMatch from './pages/FindMatch';
import JoinTeam from './pages/JoinTeam';
import Contact from './pages/Contact';

// Admin Components - Import từ thư mục admin riêng
import AdminLogin from './admin/components/AdminLogin';
import AdminLayout from './admin/components/AdminLayout';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminFieldManagement from './admin/pages/AdminFieldManagement';
import ProtectedAdminRoute from './admin/components/ProtectedAdminRoute';
import AdminBookingManagement from './admin/pages/AdminBookingManagement';
import AdminCustomerManagement from './admin/pages/AdminCustomerManagement';
import AdminInventoryManagement from './admin/pages/AdminInventoryManagement';
import AdminMaintenanceManagement from './admin/pages/AdminMaintenanceManagement';
import AdminTeamManagement from './admin/pages/AdminTeamManagement';

// Shared Components
import ScrollToTop from './components/ScrollToTop';

// Styles - Customer và Admin có CSS riêng biệt
import './assets/styles/styles.css'; // Customer styles
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AdminProvider>
          <ScrollToTop />
          <Routes>
            {/* ===== CUSTOMER ROUTES ===== */}
            <Route path="/" element={<Home />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/find-match" element={<FindMatch />} />
            <Route path="/join-team" element={<JoinTeam />} />
            <Route path="/contact" element={<Contact />} />

            {/* ===== ADMIN ROUTES ===== */}
            {/* Admin Login - Không cần bảo vệ */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Protected Admin Routes với Layout */}
            <Route path="/admin" element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }>
              {/* Dashboard - Tất cả admin đều có quyền truy cập */}
              <Route path="dashboard" element={<AdminDashboard />} />
              
              {/* Booking Management - Cần quyền 'bookings' */}
              <Route path="bookings" element={
                <ProtectedAdminRoute permission="bookings">
                  <AdminBookingManagement />
                </ProtectedAdminRoute>
              } />
              
              {/* Field Management - Cần quyền 'fields' */}
              <Route path="fields" element={
                <ProtectedAdminRoute permission="fields">
                  <AdminFieldManagement />
                </ProtectedAdminRoute>
              } />
              
              {/* User Management - Cần quyền 'users' */}
              <Route path="users" element={
                <ProtectedAdminRoute permission="users">
                  <AdminCustomerManagement />
                </ProtectedAdminRoute>
              } />

              {/* Inventory Management - Cần quyền 'inventory' */}
              <Route path="inventory" element={
                <ProtectedAdminRoute permission="inventory">
                  <AdminInventoryManagement />
                </ProtectedAdminRoute>
              } />

              {/* Maintenance Management - Cần quyền 'fields' */}
              <Route path="maintenance" element={
                <ProtectedAdminRoute permission="fields">
                  <AdminMaintenanceManagement />
                </ProtectedAdminRoute>
              } />

              {/* Team Management - Cần quyền 'bookings' */}
              <Route path="teams" element={
                <ProtectedAdminRoute permission="bookings">
                  <AdminTeamManagement />
                </ProtectedAdminRoute>
              } />
              
              {/* Reports - Cần quyền 'reports' */}
              <Route path="reports" element={
                <ProtectedAdminRoute permission="reports">
                  <div style={{ 
                    padding: '20px', 
                    color: 'white', 
                    textAlign: 'center',
                    background: 'var(--admin-bg-card)',
                    borderRadius: '12px',
                    border: '1px solid var(--admin-border)'
                  }}>
                    <i className="fas fa-chart-line" style={{ fontSize: '3rem', marginBottom: '16px', color: '#00b894' }}></i>
                    <h2>Báo cáo & Thống kê</h2>
                    <p style={{ color: '#b2b2b2', marginTop: '8px' }}>Trang này đang trong quá trình phát triển...</p>
                    <p style={{ fontSize: '0.9rem', color: '#888888', marginTop: '16px' }}>
                      Sẽ bao gồm: Doanh thu, Sân phổ biến, Khách hàng VIP, Biểu đồ thống kê
                    </p>
                  </div>
                </ProtectedAdminRoute>
              } />

              {/* Default redirect to dashboard */}
              <Route index element={<AdminDashboard />} />
            </Route>
            
            {/* 404 Route */}
            <Route path="*" element={
              <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
                color: '#ffffff',
                textAlign: 'center',
                padding: '20px'
              }}>
                <i className="fas fa-exclamation-triangle" style={{ fontSize: '4rem', color: '#fdcb6e', marginBottom: '24px' }}></i>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>404</h1>
                <p style={{ fontSize: '1.2rem', color: '#b2b2b2', marginBottom: '32px' }}>Trang không tồn tại</p>
                <a href="/" style={{
                  background: 'linear-gradient(135deg, #e94560, #d63031)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}>
                  <i className="fas fa-home" style={{ marginRight: '8px' }}></i>
                  Về trang chủ
                </a>
              </div>
            } />
          </Routes>
        </AdminProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;