import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

function UserProfile() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '' });
  const [stats, setStats] = useState({ total: 0, cancelled: 0 });

  useEffect(() => {
    if (user?.id) {
      API.get(`/users/${user.id}`).then((res) => {
        setForm({ name: res.data.name || '', email: res.data.email || '' });
        setStats({
          total: res.data.total_bookings || 0,
          cancelled: res.data.cancelled_bookings || 0,
        });
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
      const res = await API.put(`/users/${user.id}`, {
        ...form,
        phone_number: user.phone_number,
      });
      alert('Cập nhật thành công');
      login({ ...user, ...form });
    } catch (err) {
      console.error('API error:', err);
      if (err.response) {
        alert('Lỗi khi cập nhật: ' + (err.response.data.message || JSON.stringify(err.response.data)));
      } else {
        alert('Lỗi khi cập nhật: ' + err.message);
      }
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
                    <input value={user.phone_number} disabled />
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