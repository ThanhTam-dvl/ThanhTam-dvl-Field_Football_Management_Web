import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';

function UserProfile() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '' });
  const [stats, setStats] = useState({ total: 0, cancelled: 0 });
  const bookingInfo = location.state?.bookingInfo;

  useEffect(() => {
    if (user?.id) {
      API.get(`/users/${user.id}`).then((res) => {
        setForm({
          name: res.data.name || '',
          email: res.data.email || '',
          phone_number: res.data.phone_number || user.phone_number || '',
        });
        setStats({
          total: res.data.total_bookings || 0,
          cancelled: res.data.cancelled_bookings || 0,
        });
      }).catch(() => {
        // Nếu lỗi (ví dụ user mới chưa có trên DB), vẫn lấy số điện thoại từ context
        setForm({
          name: '',
          email: '',
          phone_number: user.phone_number || '',
        });
      });
    } else if (user?.phone_number) {
      // Nếu chưa có id (user mới), vẫn set số điện thoại
      setForm({
        name: '',
        email: '',
        phone_number: user.phone_number,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/users/${user.id}`, {
        name: form.name,
        email: form.email,
        phone_number: form.phone_number || '', // Nếu người dùng không nhập số điện thoại, gửi trống
      });

      // Lấy lại user mới nhất từ API
      const res = await API.get(`/users/${user.id}`);
      login(res.data); // cập nhật context
      setForm({
        name: res.data.name || '',
        email: res.data.email || '',
        phone_number: res.data.phone_number || user.phone_number || '',
      });
      alert('Cập nhật thành công');
      if (bookingInfo) {
        navigate('/booking', { state: { bookingInfo } });
      }
    } catch (err) {
      alert('Lỗi khi cập nhật: ' + (err.response?.data?.message || err.message));
    }
  };

  if (!user) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>
        <p>Vui lòng đăng nhập</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="booking-page">
        <style>
          {`
            .profile-header {
              display: flex;
              align-items: center;
              gap: 15px;
              margin-bottom: 20px;
            }
            .profile-stats-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 20px;
              margin-top: 30px;
            }
          `}
        </style>
        <section className="booking-hero">
          <div className="container">
            <div className="profile-header">
              <i className="fas fa-user-circle" style={{ fontSize: '2rem', color: 'var(--primary-color)' }}></i>
              <h1>Trang cá nhân</h1>
            </div>
            <p>Quản lý thông tin cá nhân và xem lịch sử đặt sân</p>
          </div>
        </section>

        <section className="booking-search">
          <div className="container">
            <div className="search-card">
              <h2>Thông tin người dùng</h2>
              <form onSubmit={handleSubmit} className="search-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Số điện thoại</label>
                    <input
                      name="phone_number"
                      value={form.phone_number}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Tên</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <button type="submit" className="search-btn">Lưu thay đổi</button>
              </form>
            </div>

            <div className="search-status" style={{ marginTop: '40px' }}>
              <h2>Thống kê</h2>
              <div className="profile-stats-grid">
                <div className="feature-card">
                  <i className="fas fa-futbol feature-icon"></i>
                  <h3>Số lần đặt sân</h3>
                  <p><strong>{stats.total}</strong></p>
                </div>
                <div className="feature-card">
                  <i className="fas fa-times-circle feature-icon"></i>
                  <h3>Số lần huỷ sân</h3>
                  <p><strong>{stats.cancelled}</strong></p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '30px', textAlign: 'center' }}>
              <button
                className="search-btn"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default UserProfile;