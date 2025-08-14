// frontend/src/admin/pages/AdminTeamManagement.jsx
import { useState, useEffect } from 'react';
import { matchService, teamJoinService } from '../services';
import '../assets/styles/team-management.css';

const AdminTeamManagement = () => {
  const [activeTab, setActiveTab] = useState('matches');
  const [matches, setMatches] = useState({ data: [], pagination: {} });
  const [teamJoins, setTeamJoins] = useState({ data: [], pagination: {} });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});
  
  // Filters
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    status: '',
    field_type: '',
    date_from: '',
    date_to: ''
  });

  // Load data based on active tab
  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'matches') {
        const [matchData, matchStats] = await Promise.all([
          matchService.getMatches(filters),
          matchService.getStats()
        ]);
        setMatches(matchData);
        setStats(matchStats);
      } else {
        const [postData, postStats] = await Promise.all([
          teamJoinService.getPosts(filters),
          teamJoinService.getStats()
        ]);
        setTeamJoins(postData);
        setStats(postStats);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset page when filters change
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  return (
    <div className="admin-team-management">
      {/* Header Stats */}
      <div className="team-stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-handshake"></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.total || 0}</div>
            <div className="stat-label">Tổng {activeTab === 'matches' ? 'Kèo' : 'Ghép đội'}</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon active">
            <i className="fas fa-play"></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.open || 0}</div>
            <div className="stat-label">Đang hoạt động</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-calendar"></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.today || 0}</div>
            <div className="stat-label">Hôm nay</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.thisWeek || 0}</div>
            <div className="stat-label">Tuần này</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="team-tabs">
        <button 
          className={`tab-btn ${activeTab === 'matches' ? 'active' : ''}`}
          onClick={() => setActiveTab('matches')}
        >
          <i className="fas fa-futbol"></i>
          Tìm Kèo
        </button>
        <button 
          className={`tab-btn ${activeTab === 'team-joins' ? 'active' : ''}`}
          onClick={() => setActiveTab('team-joins')}
        >
          <i className="fas fa-users"></i>
          Ghép Đội
        </button>
      </div>

      {/* Filters */}
      <div className="team-filters">
        <div className="filter-row">
          <div className="filter-group">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="filter-select"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="open">Đang mở</option>
              {activeTab === 'matches' ? (
                <>
                  <option value="full">Đầy</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="closed">Đóng</option>
                </>
              ) : (
                <option value="closed">Đóng</option>
              )}
            </select>
          </div>
          
          <div className="filter-group">
            <select
              value={filters.field_type}
              onChange={(e) => handleFilterChange('field_type', e.target.value)}
              className="filter-select"
            >
              <option value="">Tất cả loại sân</option>
              <option value="5vs5">Sân 5</option>
              <option value="7vs7">Sân 7</option>
              <option value="11vs11">Sân 11</option>
            </select>
          </div>
          
          <div className="filter-group">
            <input
              type="date"
              value={filters.date_from}
              onChange={(e) => handleFilterChange('date_from', e.target.value)}
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <input
              type="date"
              value={filters.date_to}
              onChange={(e) => handleFilterChange('date_to', e.target.value)}
              className="filter-input"
            />
          </div>
          
          <button 
            className="filter-clear-btn"
            onClick={() => setFilters({
              page: 1,
              limit: 10,
              search: '',
              status: '',
              field_type: '',
              date_from: '',
              date_to: ''
            })}
          >
            <i className="fas fa-times"></i>
            Xóa lọc
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="team-content">
        {loading ? (
          <div className="loading-container">
            <i className="fas fa-spinner fa-spin"></i>
            <span>Đang tải dữ liệu...</span>
          </div>
        ) : (
          <>
            {activeTab === 'matches' ? (
              <MatchTable 
                matches={matches.data} 
                onRefresh={loadData}
              />
            ) : (
              <TeamJoinTable 
                teamJoins={teamJoins.data} 
                onRefresh={loadData}
              />
            )}
            
            {/* Pagination */}
            <Pagination 
              pagination={activeTab === 'matches' ? matches.pagination : teamJoins.pagination}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

// Match Table Component
const MatchTable = ({ matches, onRefresh }) => {
  const formatDateTime = (date, time) => {
    return `${new Date(date).toLocaleDateString('vi-VN')} ${time}`;
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      open: { class: 'open', text: 'Đang mở' },
      full: { class: 'full', text: 'Đầy' },
      completed: { class: 'completed', text: 'Hoàn thành' },
      closed: { class: 'closed', text: 'Đóng' }
    };
    const statusInfo = statusMap[status] || { class: 'unknown', text: status };
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  return (
    <div className="team-table-container">
      <table className="team-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Người tạo</th>
            <th>Loại sân</th>
            <th>Ngày & Giờ</th>
            <th>Số người</th>
            <th>Giá/người</th>
            <th>Liên hệ</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {matches.map(match => (
            <tr key={match.id}>
              <td>#{match.id}</td>
              <td>
                <div className="creator-info">
                  <div className="creator-name">{match.creator_name || 'N/A'}</div>
                  <div className="creator-phone">{match.creator_phone || 'N/A'}</div>
                </div>
              </td>
              <td>
                <span className="field-type">{match.field_type}</span>
              </td>
              <td>
                <div className="datetime">
                  {formatDateTime(match.match_date, match.start_time)}
                </div>
              </td>
              <td>
                <div className="players">
                  {match.current_players}/{match.max_players || '∞'}
                </div>
              </td>
              <td>
                <div className="price">
                  {match.price_per_person?.toLocaleString('vi-VN')}đ
                </div>
              </td>
              <td>
                <div className="contact">
                  <div>{match.contact_name}</div>
                  <div>{match.contact_phone}</div>
                </div>
              </td>
              <td>{getStatusBadge(match.status)}</td>
              <td>
                <div className="action-buttons">
                  <button className="action-btn view" title="Xem chi tiết">
                    <i className="fas fa-eye"></i>
                  </button>
                  <button className="action-btn edit" title="Chỉnh sửa">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="action-btn delete" title="Xóa">
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {matches.length === 0 && (
        <div className="empty-state">
          <i className="fas fa-futbol"></i>
          <h3>Không có kèo nào</h3>
          <p>Chưa có kèo nào được tạo</p>
        </div>
      )}
    </div>
  );
};

// Team Join Table Component
const TeamJoinTable = ({ teamJoins, onRefresh }) => {
  const formatDateTime = (date, time) => {
    return `${new Date(date).toLocaleDateString('vi-VN')} ${time}`;
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      open: { class: 'open', text: 'Đang mở' },
      closed: { class: 'closed', text: 'Đóng' }
    };
    const statusInfo = statusMap[status] || { class: 'unknown', text: status };
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  const getPositionText = (position) => {
    const positionMap = {
      goalkeeper: 'Thủ môn',
      defender: 'Hậu vệ',
      midfielder: 'Tiền vệ',
      forward: 'Tiền đạo',
      any: 'Bất kỳ'
    };
    return positionMap[position] || position;
  };

  return (
    <div className="team-table-container">
      <table className="team-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Loại sân</th>
            <th>Ngày & Giờ</th>
            <th>Số người cần</th>
            <th>Vị trí</th>
            <th>Trình độ</th>
            <th>Liên hệ</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {teamJoins.map(post => (
            <tr key={post.id}>
              <td>#{post.id}</td>
              <td>
                <span className="field-type">{post.field_type}</span>
              </td>
              <td>
                <div className="datetime">
                  {formatDateTime(post.match_date, post.start_time)}
                </div>
              </td>
              <td>
                <div className="players-needed">
                  {post.players_needed} người
                </div>
              </td>
              <td>
                <div className="position">
                  {getPositionText(post.position_needed)}
                </div>
              </td>
              <td>
                <div className="level">
                  {post.level}
                </div>
              </td>
              <td>
                <div className="contact">
                  <div>{post.contact_name}</div>
                  <div>{post.contact_phone}</div>
                </div>
              </td>
              <td>{getStatusBadge(post.status)}</td>
              <td>
                <div className="action-buttons">
                  <button className="action-btn view" title="Xem chi tiết">
                    <i className="fas fa-eye"></i>
                  </button>
                  <button className="action-btn edit" title="Chỉnh sửa">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="action-btn delete" title="Xóa">
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {teamJoins.length === 0 && (
        <div className="empty-state">
          <i className="fas fa-users"></i>
          <h3>Không có tin ghép đội nào</h3>
          <p>Chưa có tin ghép đội nào được đăng</p>
        </div>
      )}
    </div>
  );
};

// Pagination Component
const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages } = pagination;
  
  return (
    <div className="pagination">
      <button 
        className="pagination-btn"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <i className="fas fa-chevron-left"></i>
      </button>
      
      <span className="pagination-info">
        Trang {page} / {totalPages}
      </span>
      
      <button 
        className="pagination-btn"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
};

export default AdminTeamManagement;