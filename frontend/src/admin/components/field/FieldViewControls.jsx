// ====== frontend/src/admin/components/field/FieldViewControls.jsx ======
const FieldViewControls = ({ currentView, filters, onViewChange, onFilterChange, onRefresh, loading }) => {
  return (
    <div className="admin-view-controls">
      <div className="admin-view-modes">
        <button 
          className={`admin-view-mode-btn ${currentView === 'timeline' ? 'active' : ''}`}
          onClick={() => onViewChange('timeline')}
        >
          <i className="fas fa-calendar-week"></i>
          Timeline
        </button>
        <button 
          className={`admin-view-mode-btn ${currentView === 'list' ? 'active' : ''}`}
          onClick={() => onViewChange('list')}
        >
          <i className="fas fa-list"></i>
          Danh sách
        </button>
      </div>

      <div className="admin-filters">
        <select 
          className="admin-filter-select"
          value={filters.fieldType}
          onChange={(e) => onFilterChange({...filters, fieldType: e.target.value})}
        >
          <option value="all">Tất cả sân</option>
          <option value="5vs5">Sân 5 người</option>
          <option value="7vs7">Sân 7 người</option>
          <option value="11vs11">Sân 11 người</option>
        </select>

        <select 
          className="admin-filter-select"
          value={filters.status}
          onChange={(e) => onFilterChange({...filters, status: e.target.value})}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="available">Trống</option>
          <option value="booked">Đã đặt</option>
          <option value="maintenance">Bảo trì</option>
        </select>

        <button 
          className="admin-refresh-btn"
          onClick={onRefresh}
          disabled={loading}
        >
          <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i>
          Làm mới
        </button>
      </div>
    </div>
  );
};

export default FieldViewControls;
