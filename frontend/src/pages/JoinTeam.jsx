// pages/JoinTeam.jsx
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import JoinTeamCard from '../components/JoinTeamCard';
import JoinTeamModal from '../components/JoinTeamModal';
import ContactModal from '../components/ContactModal';
import { fetchTeamJoinPosts } from '../services/teamJoinService';

function JoinTeam() {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [contact, setContact] = useState(null);
  const [filter, setFilter] = useState({});

  const loadPosts = async () => {
    try {
      const res = await fetchTeamJoinPosts(filter);
      setPosts(res);
    } catch (err) {
      console.error(err);
      setPosts([]);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [filter]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const newFilter = {
      date: form.date.value,
      time: form.time.value,
      field_type: form.field_type.value,
      level: form.level.value,
      position_needed: form.position_needed.value
    };
    setFilter(newFilter);
  };

  const clearFilter = () => {
    document.getElementById('filter-form').reset();
    setFilter({});
  };

  return (
    <>
      <Header />
      <main className="join-team-page">
        <section className="join-team-hero">
          <div className="container">
            <h1>Ghép Đội Bóng Đá</h1>
            <p>Tìm đồng đội hoặc xin đá ké khi thiếu người</p>
          </div>
        </section>

        <section className="join-team-actions">
          <div className="container">
            <div className="actions-header">
              <button className="create-team-btn" onClick={() => setShowModal(true)}>
                <i className="fas fa-plus"></i> Đăng tin ghép đội
              </button>
              <button
                className={`filter-toggle-btn ${showFilter ? 'active' : ''}`}
                onClick={() => setShowFilter(!showFilter)}
              >
                <i className="fas fa-filter"></i> {showFilter ? 'Ẩn bộ lọc' : 'Bộ lọc'}
              </button>
            </div>
            {showFilter && (
              <div className="filter-section active">
                <div className="filter-card">
                  <h3>Tìm kiếm đội bóng</h3>
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
                            const h = i + 6;
                            return <option key={h} value={`${h.toString().padStart(2,'0')}:00`}>{h}:00</option>;
                          })}
                        </select>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Loại sân</label>
                        <select name="field_type">
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
                    <div className="form-group">
                      <label>Vị trí cần</label>
                      <select name="position_needed">
                        <option value="">Tất cả</option>
                        <option value="goalkeeper">Thủ môn</option>
                        <option value="defender">Hậu vệ</option>
                        <option value="midfielder">Tiền vệ</option>
                        <option value="forward">Tiền đạo</option>
                        <option value="any">Vị trí bất kỳ</option>
                      </select>
                    </div>
                    <button type="submit" className="filter-btn">Tìm kiếm</button>
                    <button type="button" onClick={clearFilter} className="clear-filter-btn">Xóa bộ lọc</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="teams-section">
          <div className="container">
            <div className="teams-header">
              <h2>Danh sách đội cần ghép</h2>
              <div className="teams-count">
                Tìm thấy {posts.length} đội bóng
              </div>
            </div>
            <div className="teams-container">
              {posts.length > 0 ? (
                posts.map(p => <JoinTeamCard key={p.id} post={p} onContact={setContact} />)
              ) : (
                <div className="no-teams">
                  <i className="fas fa-search"></i>
                  <h3>Không tìm thấy đội nào</h3>
                  <p>Thử đăng tin ghép đội mới</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      {showModal && <JoinTeamModal onClose={() => setShowModal(false)} onRefresh={loadPosts} />}
      {contact && <ContactModal data={contact} onClose={() => setContact(null)} />}
      <Footer />
    </>
  );
}

export default JoinTeam;
