// pages/Contact.jsx
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'booking',
    message: ''
  });

  const [status, setStatus] = useState(null);

  useEffect(() => {
    const mapContainer = document.getElementById('map');
    if (mapContainer._leaflet_id != null) {
      mapContainer._leaflet_id = null;
    }

    const map = L.map('map').setView([10.865252, 106.696365], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    L.marker([10.865252, 106.696365]).addTo(map)
      .bindPopup('<b>FootballField</b><br>16 TL03, Thạnh Lộc, Q.12, TP.HCM')
      .openPopup();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/contact', form);
      setStatus('Gửi liên hệ thành công!');
      setForm({ name: '', email: '', subject: 'booking', message: '' });
    } catch (err) {
      console.error(err);
      setStatus('Gửi thất bại. Vui lòng thử lại sau.');
    }
  };

  return (
    <>
      <Header />
      <main className="contact-page">
        <section className="contact-hero">
          <div className="container">
            <h1>Liên hệ với chúng tôi</h1>
            <p>Mọi thắc mắc, góp ý xin vui lòng gửi tại đây</p>
          </div>
        </section>

        <section className="contact-content">
          <div className="container contact-grid">
            <div className="contact-form-section">
              <h2>Gửi tin nhắn</h2>
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Họ và tên</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Chủ đề</label>
                  <select name="subject" value={form.subject} onChange={handleChange} required>
                    <option value="booking">Đặt sân</option>
                    <option value="feedback">Góp ý</option> 
                    <option value="complaint">Khiếu nại</option>
                    <option value="partner">Hợp tác</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Nội dung</label>
                  <textarea name="message" value={form.message} onChange={handleChange} required></textarea>
                </div>
                <button type="submit" className="submit-btn">Gửi</button>
                {status && <p className="form-status">{status}</p>}
              </form>
            </div>

            <div className="contact-info-section">
              <h2>Thông tin liên hệ</h2>
              <p><strong>Địa chỉ:</strong> 16 TL03, Thạnh Lộc, Q.12, TP.HCM</p>
              <p><strong>Hotline:</strong> <a href="tel:0123456789">0123 456 789</a></p>
              <p><strong>Email:</strong> <a href="mailto:info@footballfield.com">info@footballfield.com</a></p>
              <p><strong>Giờ làm việc:</strong><br />
                Thứ 2 - Thứ 6: 06:00 - 22:00<br />
                Thứ 7 - Chủ nhật: 06:00 - 23:00</p>
            </div>
          </div>

          <div className="map-section">
            <h2>Vị trí của chúng tôi</h2>
            <div id="map" style={{ height: '400px', borderRadius: '10px' }}></div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Contact;
