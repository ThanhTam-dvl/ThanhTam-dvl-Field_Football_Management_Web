// frontend/src/admin/pages/AdminMaintenanceManagement.jsx
import { useState, useEffect } from 'react';
import maintenanceService from '../services/maintenanceService';
import { fieldService } from '../services';
import '../assets/styles/maintenance-management.css';

const AdminMaintenanceManagement = () => {
  // State management
  const [maintenances, setMaintenances] = useState([]);
  const [fields, setFields] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, upcoming: 0, completed: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filters and pagination
  const [filters, setFilters] = useState({
    search: '',
    field_id: 'all',
    type: 'all',
    status: 'all',
    date_filter: 'all'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  
  // View and modals
  const [currentView, setCurrentView] = useState('list'); // list | calendar
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState(null);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  
  // Form states
  const [maintenanceForm, setMaintenanceForm] = useState({
    field_id: '',
    maintenance_date: '',
    start_time: '00:00',
    end_time: '23:59',
    reason: '',
    description: '',
    type: 'regular'
  });
  
  const [holidayForm, setHolidayForm] = useState({
    maintenance_date: '',
    end_date: '',
    reason: '',
    description: '',
    apply_all_fields: true,
    selected_fields: []
  });

  // Load initial data
  useEffect(() => {
    loadFields();
    loadMaintenances();
    loadStats();
  }, []);

  // Reload when filters change
  useEffect(() => {
    loadMaintenances();
  }, [filters, pagination.page]);

  // Load functions
  const loadFields = async () => {
    try {
      const data = await fieldService.getAllFields();
      setFields(data);
    } catch (error) {
      setError('Lỗi tải danh sách sân');
    }
  };

  const loadMaintenances = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      };
      const data = await maintenanceService.getAllMaintenances(params);
      setMaintenances(data.data || []);
      setPagination(prev => ({
        ...prev,
        total: data.pagination?.total || 0,
        totalPages: data.pagination?.totalPages || 0
      }));
    } catch (error) {
      setError(error.error || 'Lỗi tải danh sách bảo trì');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await maintenanceService.getMaintenanceStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  // Filter handlers
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      field_id: 'all',
      type: 'all',
      status: 'all',
      date_filter: 'all'
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Modal handlers
  const openMaintenanceModal = (maintenance = null) => {
    if (maintenance) {
      setEditingMaintenance(maintenance);
      setMaintenanceForm({
        field_id: maintenance.field_id || '',
        maintenance_date: maintenance.maintenance_date,
        start_time: maintenance.start_time?.slice(0, 5) || '00:00',
        end_time: maintenance.end_time?.slice(0, 5) || '23:59',
        reason: maintenance.reason || '',
        description: maintenance.description || '',
        type: maintenance.type || 'regular'
      });
    } else {
      setEditingMaintenance(null);
      setMaintenanceForm({
        field_id: '',
        maintenance_date: '',
        start_time: '00:00',
        end_time: '23:59',
        reason: '',
        description: '',
        type: 'regular'
      });
    }
    setShowMaintenanceModal(true);
  };

  const openDetailsModal = (maintenance) => {
    setSelectedMaintenance(maintenance);
    setShowDetailsModal(true);
  };

  // CRUD operations
  const handleSubmitMaintenance = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingMaintenance) {
        await maintenanceService.updateMaintenance(editingMaintenance.id, maintenanceForm);
      } else {
        await maintenanceService.createMaintenance(maintenanceForm);
      }
      setShowMaintenanceModal(false);
      loadMaintenances();
      loadStats();
    } catch (error) {
      setError(error.error || 'Lỗi lưu lịch bảo trì');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMaintenance = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa lịch bảo trì này?')) return;
    
    try {
      setLoading(true);
      await maintenanceService.deleteMaintenance(id);
      loadMaintenances();
      loadStats();
    } catch (error) {
      setError(error.error || 'Lỗi xóa lịch bảo trì');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const getTypeText = (type) => {
    const types = {
      regular: 'Bảo trì thường',
      holiday: 'Nghỉ lễ',
      emergency: 'Khẩn cấp'
    };
    return types[type] || 'Không xác định';
  };

  const getStatusText = (status) => {
    const statuses = {
      active: 'Đang bảo trì',
      upcoming: 'Sắp tới',
      completed: 'Đã hoàn thành'
    };
    return statuses[status] || 'Không xác định';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  return (
    <div className="maintenance-management">
      {/* Header Stats */}
      <div className="maintenance-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-tools"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Tổng lịch bảo trì</p>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.active}</h3>
            <p>Đang bảo trì</p>
          </div>
        </div>
        <div className="stat-card info">
          <div className="stat-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.upcoming}</h3>
            <p>Sắp tới</p>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.completed}</h3>
            <p>Đã hoàn thành</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="maintenance-controls">
        <div className="view-toggle">
          <button 
            className={`view-btn ${currentView === 'list' ? 'active' : ''}`}
            onClick={() => setCurrentView('list')}
          >
            <i className="fas fa-list"></i>
            <span>Danh sách</span>
          </button>
          <button 
            className={`view-btn ${currentView === 'calendar' ? 'active' : ''}`}
            onClick={() => setCurrentView('calendar')}
          >
            <i className="fas fa-calendar-alt"></i>
            <span>Lịch</span>
          </button>
        </div>

        <div className="action-buttons">
          <button 
            className="btn btn-secondary"
            onClick={() => setShowHolidayModal(true)}
          >
            <i className="fas fa-calendar-check"></i>
            Nghỉ lễ
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => openMaintenanceModal()}
          >
            <i className="fas fa-plus"></i>
            Thêm lịch
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="maintenance-filters">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Tìm kiếm theo sân, lý do..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <select
            value={filters.field_id}
            onChange={(e) => handleFilterChange('field_id', e.target.value)}
          >
            <option value="all">Tất cả sân</option>
            <option value="all-fields">Tất cả sân (đồng thời)</option>
            {fields.map(field => (
              <option key={field.id} value={field.id}>
                {field.name}
              </option>
            ))}
          </select>

          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="all">Tất cả loại</option>
            <option value="regular">Bảo trì thường</option>
            <option value="holiday">Nghỉ lễ</option>
            <option value="emergency">Khẩn cấp</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang bảo trì</option>
            <option value="upcoming">Sắp tới</option>
            <option value="completed">Đã hoàn thành</option>
          </select>

          <select
            value={filters.date_filter}
            onChange={(e) => handleFilterChange('date_filter', e.target.value)}
          >
            <option value="all">Tất cả thời gian</option>
            <option value="today">Hôm nay</option>
            <option value="tomorrow">Ngày mai</option>
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
          </select>

          <button className="btn btn-outline" onClick={clearFilters}>
            <i className="fas fa-times"></i>
            Xóa lọc
          </button>
        </div>
      </div>

      {/* Alert for active maintenances */}
      {stats.active > 0 && (
        <div className="alert alert-warning">
          <i className="fas fa-exclamation-triangle"></i>
          <div className="alert-content">
            <h4>Có sân đang bảo trì</h4>
            <p>Hiện có {stats.active} sân đang trong thời gian bảo trì. Khách hàng không thể đặt các sân này.</p>
          </div>
        </div>
      )}

      {/* Content based on view */}
      {currentView === 'list' ? (
        <MaintenanceList 
          maintenances={maintenances}
          loading={loading}
          onEdit={openMaintenanceModal}
          onDelete={handleDeleteMaintenance}
          onViewDetails={openDetailsModal}
          getTypeText={getTypeText}
          getStatusText={getStatusText}
          formatDate={formatDate}
        />
      ) : (
        <MaintenanceCalendar 
          maintenances={maintenances}
          onViewDetails={openDetailsModal}
        />
      )}

      {/* Pagination */}
      {currentView === 'list' && pagination.totalPages > 1 && (
        <Pagination 
          pagination={pagination}
          onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
        />
      )}

      {/* Modals */}
      {showMaintenanceModal && (
        <MaintenanceModal
          isEdit={!!editingMaintenance}
          form={maintenanceForm}
          setForm={setMaintenanceForm}
          fields={fields}
          onSubmit={handleSubmitMaintenance}
          onClose={() => setShowMaintenanceModal(false)}
          loading={loading}
        />
      )}

      {showHolidayModal && (
        <HolidayModal
          form={holidayForm}
          setForm={setHolidayForm}
          fields={fields}
          onClose={() => setShowHolidayModal(false)}
          onSubmit={() => {/* TODO: Implement holiday creation */}}
        />
      )}

      {showDetailsModal && selectedMaintenance && (
        <DetailsModal
          maintenance={selectedMaintenance}
          onClose={() => setShowDetailsModal(false)}
          onEdit={() => {
            setShowDetailsModal(false);
            openMaintenanceModal(selectedMaintenance);
          }}
          getTypeText={getTypeText}
          getStatusText={getStatusText}
          formatDate={formatDate}
          formatDateTime={formatDateTime}
        />
      )}

      {/* Error display */}
      {error && (
        <div className="toast toast-error">
          <i className="fas fa-exclamation-circle"></i>
          {error}
          <button onClick={() => setError(null)}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
    </div>
  );
};

// Sub-components sẽ được tạo riêng để tránh file quá dài
const MaintenanceList = ({ maintenances, loading, onEdit, onDelete, onViewDetails, getTypeText, getStatusText, formatDate }) => {
  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (maintenances.length === 0) {
    return (
      <div className="empty-state">
        <i className="fas fa-tools"></i>
        <h3>Không có lịch bảo trì</h3>
        <p>Thử thay đổi bộ lọc hoặc thêm lịch bảo trì mới</p>
      </div>
    );
  }

  return (
    <div className="maintenance-table-container">
      <table className="maintenance-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Sân</th>
            <th>Loại</th>
            <th>Ngày bảo trì</th>
            <th>Thời gian</th>
            <th>Lý do</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {maintenances.map(maintenance => (
            <tr key={maintenance.id}>
              <td>#{maintenance.id}</td>
              <td>
                <span className={maintenance.field_id ? '' : 'all-fields'}>
                  {maintenance.field_name || 'Tất cả sân'}
                </span>
              </td>
              <td>
                <span className={`maintenance-type ${maintenance.type}`}>
                  {getTypeText(maintenance.type)}
                </span>
              </td>
              <td>{formatDate(maintenance.maintenance_date)}</td>
              <td>
                {maintenance.start_time?.slice(0, 5)} - {maintenance.end_time?.slice(0, 5)}
              </td>
              <td>{maintenance.reason}</td>
              <td>
                <span className={`maintenance-status ${maintenance.status}`}>
                  {getStatusText(maintenance.status)}
                </span>
              </td>
              <td className="actions">
                <button 
                  className="btn-icon btn-view" 
                  onClick={() => onViewDetails(maintenance)}
                  title="Xem chi tiết"
                >
                  <i className="fas fa-eye"></i>
                </button>
                {maintenance.status !== 'completed' && (
                  <button 
                    className="btn-icon btn-edit" 
                    onClick={() => onEdit(maintenance)}
                    title="Chỉnh sửa"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                )}
                <button 
                  className="btn-icon btn-delete" 
                  onClick={() => onDelete(maintenance.id)}
                  title="Xóa"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Placeholder components - sẽ implement sau
const MaintenanceCalendar = ({ maintenances }) => (
  <div className="calendar-placeholder">
    <i className="fas fa-calendar-alt"></i>
    <h3>Calendar View</h3>
    <p>Đang phát triển...</p>
  </div>
);

const Pagination = ({ pagination, onPageChange }) => (
  <div className="pagination">
    <span>Hiển thị {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} trong tổng số {pagination.total} lịch</span>
    <div className="pagination-controls">
      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          className={`page-btn ${page === pagination.page ? 'active' : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
    </div>
  </div>
);

const MaintenanceModal = ({ isEdit, form, setForm, fields, onSubmit, onClose, loading }) => (
  <div className="modal active">
    <div className="modal-content">
      <div className="modal-header">
        <h3>{isEdit ? 'Chỉnh sửa lịch bảo trì' : 'Thêm lịch bảo trì'}</h3>
        <button className="modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      <form onSubmit={onSubmit} className="modal-body">
        <div className="form-group">
          <label>Loại bảo trì *</label>
          <select
            value={form.type}
            onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value }))}
            required
          >
            <option value="regular">Bảo trì thường</option>
            <option value="holiday">Nghỉ lễ</option>
            <option value="emergency">Khẩn cấp</option>
          </select>
        </div>

        <div className="form-group">
          <label>Sân *</label>
          <select
            value={form.field_id}
            onChange={(e) => setForm(prev => ({ ...prev, field_id: e.target.value }))}
            required
          >
            <option value="">Chọn sân</option>
            <option value="all-fields">Tất cả sân</option>
            {fields.map(field => (
              <option key={field.id} value={field.id}>
                {field.name} ({field.type})
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Ngày bảo trì *</label>
            <input
              type="date"
              value={form.maintenance_date}
              onChange={(e) => setForm(prev => ({ ...prev, maintenance_date: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Giờ bắt đầu</label>
            <input
              type="time"
              value={form.start_time}
              onChange={(e) => setForm(prev => ({ ...prev, start_time: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label>Giờ kết thúc</label>
            <input
              type="time"
              value={form.end_time}
              onChange={(e) => setForm(prev => ({ ...prev, end_time: e.target.value }))}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Lý do bảo trì *</label>
          <input
            type="text"
            value={form.reason}
            onChange={(e) => setForm(prev => ({ ...prev, reason: e.target.value }))}
            placeholder="VD: Sửa chữa cỏ nhân tạo, Nghỉ Tết Nguyên Đán..."
            required
          />
        </div>

        <div className="form-group">
          <label>Mô tả chi tiết</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Thêm mô tả chi tiết công việc bảo trì (tùy chọn)"
            rows="3"
          />
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Hủy
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </form>
    </div>
  </div>
);

// Placeholder modals
const HolidayModal = ({ onClose }) => (
  <div className="modal active">
    <div className="modal-content">
      <div className="modal-header">
        <h3>Đặt lịch nghỉ lễ</h3>
        <button className="modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      <div className="modal-body">
        <p>Chức năng đang phát triển...</p>
      </div>
    </div>
  </div>
);

const DetailsModal = ({ maintenance, onClose, onEdit, getTypeText, getStatusText, formatDate, formatDateTime }) => (
  <div className="modal active">
    <div className="modal-content">
      <div className="modal-header">
        <h3>Chi tiết bảo trì #{maintenance.id}</h3>
        <button className="modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      <div className="modal-body">
        <div className="details-grid">
          <div className="detail-item">
            <label>Sân:</label>
            <span>{maintenance.field_name || 'Tất cả sân'}</span>
          </div>
          <div className="detail-item">
            <label>Loại:</label>
            <span className={`maintenance-type ${maintenance.type}`}>
              {getTypeText(maintenance.type)}
            </span>
          </div>
          <div className="detail-item">
            <label>Ngày bảo trì:</label>
            <span>{formatDate(maintenance.maintenance_date)}</span>
          </div>
          <div className="detail-item">
            <label>Thời gian:</label>
            <span>{maintenance.start_time?.slice(0, 5)} - {maintenance.end_time?.slice(0, 5)}</span>
          </div>
          <div className="detail-item">
            <label>Trạng thái:</label>
            <span className={`maintenance-status ${maintenance.status}`}>
              {getStatusText(maintenance.status)}
            </span>
          </div>
          <div className="detail-item full-width">
            <label>Lý do:</label>
            <span>{maintenance.reason}</span>
          </div>
          {maintenance.description && (
            <div className="detail-item full-width">
              <label>Mô tả:</label>
              <p>{maintenance.description}</p>
            </div>
          )}
          <div className="detail-item">
            <label>Ngày tạo:</label>
            <span>{formatDateTime(maintenance.created_at)}</span>
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={onClose}>
          Đóng
        </button>
        {maintenance.status !== 'completed' && (
          <button className="btn btn-primary" onClick={onEdit}>
            <i className="fas fa-edit"></i>
            Chỉnh sửa
          </button>
        )}
      </div>
    </div>
  </div>
);

export default AdminMaintenanceManagement;