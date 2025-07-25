// src/pages/UserProfile.jsx
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

function UserProfile() {
  const { user, login } = useAuth();
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
      const res = await API.put(`/users/${user.id}`, form);
      alert('Cập nhật thành công');
      login({ ...user, ...form });
    } catch (err) {
      console.error(err);
      alert('Lỗi khi cập nhật');
    }
  };

  if (!user) return <p style={{ textAlign: 'center', marginTop: '100px' }}>Vui lòng đăng nhập</p>;

  return (
    <>
      <Header />
      <main className="booking-page">
        <section className="booking-hero">
          <div className="container">
            <h1>Trang cá nhân</h1>
            <p>Thông tin người dùng & lịch sử đặt sân</p>
          </div>
        </section>

        <section className="booking-search">
          <div className="container">
            <div className="search-card">
              <h2>Thông tin người dùng</h2>
              <form onSubmit={handleSubmit} className="search-form">
                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input value={user.phone_number} disabled />
                </div>
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
                <button type="submit" className="search-btn">Lưu thay đổi</button>
              </form>
            </div>

            <div className="search-status" style={{ marginTop: '30px' }}>
              <h2>Thống kê</h2>
              <p>Số lần đặt sân: <strong>{stats.total}</strong></p>
              <p>Số lần huỷ sân: <strong>{stats.cancelled}</strong></p>
            </div>
        </div>
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button className="search-btn" onClick={logout}>
                Đăng xuất
            </button>
        </div>

        </section>
      </main>
      <Footer />
    </>
  );
}

export default UserProfile;
