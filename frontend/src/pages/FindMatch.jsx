// src/pages/FindMatch.jsx
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoginModal from '../components/LoginModal';
import ContactModal from '../components/ContactModal';
import CreateMatchModal from '../components/CreateMatchModal';
import MatchCard from '../components/MatchCard';
import { fetchMatches } from '../services/matchService';

function FindMatch() {
  const [matches, setMatches] = useState([]);
  const [filter, setFilter] = useState({});
  const [showFilter, setShowFilter] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [contact, setContact] = useState(null);

  useEffect(() => {
    loadMatches();
  }, [filter]);

  const loadMatches = async () => {
    try {
      const res = await fetchMatches(filter);
      setMatches(res);
    } catch (err) {
      console.error(err);
      setMatches([]);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const newFilter = {
      date: form.date.value,
      time: form.time.value,
      type: form.type.value,
      level: form.level.value
    };
    setFilter(newFilter);
  };

  const clearFilter = () => {
    setFilter({});
    document.getElementById('filter-form').reset();
  };

  const handleCreateClick = () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
      alert('Bạn cần đăng nhập để tạo kèo!');
      return;
    }
    setShowCreate(true);
  };

  return (
    <>
      <Header />
      <main className="find-match-page">
        <section className="find-match-hero">
          <div className="container">
            <h1>Tìm Kèo Bóng Đá</h1>
            <p>Kết nối với những người chơi cùng sở thích, tìm đối thủ xứng tầm</p>
          </div>
        </section>

        <section className="find-match-actions">
          <div className="container">
            <div className="actions-header">
              <button className="create-match-btn" onClick={handleCreateClick}>
                <i className="fas fa-plus"></i> Tạo kèo mới
              </button>
              <button className={`filter-toggle-btn ${showFilter ? 'active' : ''}`} onClick={() => setShowFilter(!showFilter)}>
                <i className="fas fa-filter"></i> {showFilter ? 'Ẩn bộ lọc' : 'Bộ lọc'}
              </button>
            </div>

            {showFilter && (
              <div className="filter-section active">
                <div className="filter-card">
                  <h3>Tìm kiếm kèo</h3>
                  <form id="filter-form" className="filter-form" onSubmit={handleFilterSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Ngày</label>
                        <input type="date" name="date" />
                      </div>
                      <div className="form-group">
                        <label>Giờ</label>
                        <select name="time">
                          <option value="">Tất cả</option>
                          {[...Array(16)].map((_, i) => {
                            const hour = i + 6;
                            return <option key={hour} value={hour}>{hour}:00</option>;
                          })}
                        </select>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Loại sân</label>
                        <select name="type">
                          <option value="">Tất cả</option>
                          <option value="5vs5">Sân 5 người</option>
                          <option value="7vs7">Sân 7 người</option>
                          <option value="11vs11">Sân 11 người</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Trình độ</label>
                        <select name="level">
                          <option value="">Tất cả</option>
                          <option value="beginner">Mới chơi</option>
                          <option value="intermediate">Trung bình</option>
                          <option value="advanced">Khá</option>
                          <option value="pro">Giỏi</option>
                        </select>
                      </div>
                    </div>
                    <button type="submit" className="filter-btn">Tìm kiếm</button>
                    <button type="button" onClick={clearFilter} className="clear-filter-btn">Xóa bộ lọc</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="matches-section">
          <div className="container">
            <div className="matches-header">
              <h2>Danh sách kèo</h2>
              <div className="matches-count">Tìm thấy {matches.length} kèo</div>
            </div>
            <div className="matches-container">
              {matches.length > 0 ? matches.map(m => (
                <MatchCard key={m.id} match={m} onContact={setContact} />
              )) : (
                <div className="no-matches">
                  <i className="fas fa-search"></i>
                  <h3>Không tìm thấy kèo nào</h3>
                  <p>Thử thay đổi bộ lọc hoặc tạo kèo mới</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <LoginModal />
      {showCreate && <CreateMatchModal onClose={() => setShowCreate(false)} onRefresh={loadMatches} />}
      {contact && <ContactModal data={contact} onClose={() => setContact(null)} />}
    </>
  );
}

export default FindMatch;
