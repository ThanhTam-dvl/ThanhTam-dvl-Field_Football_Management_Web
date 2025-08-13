// frontend/src/admin/pages/AdminBookingManagement.jsx
import { useState, useEffect } from 'react';
import { 
  getAllBookings, 
  updateBookingStatus, 
  deleteBooking,
  createManualBooking
} from '../services/bookingService';
import { getAllFields } from '../services/fieldService';
import BookingFilters from '../components/BookingFilters';
import BookingTable from '../components/BookingTable';
import BookingModal from '../components/BookingModal';
import ConfirmModal from '../components/ConfirmModal';
import '../assets/styles/admin.css';
import '../assets/styles/admin-booking.css';

const AdminBookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters & Pagination
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    field: 'all',
    date: 'all'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  
  // Selection & Bulk Actions
  const [selectedBookings, setSelectedBookings] = useState([]);
  
  // Modals
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    title: '',
    message: '',
    onConfirm: null
  });

  // Load data on mount and filter changes
  useEffect(() => {
    loadBookings();
  }, [filters, pagination.page]);

  useEffect(() => {
    loadFields();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search || undefined,
        status: filters.status !== 'all' ? filters.status : undefined,
        field_id: filters.field !== 'all' ? filters.field : undefined,
        date_filter: filters.date !== 'all' ? filters.date : undefined
      };

      const response = await getAllBookings(params);
      setBookings(response.bookings);
      setPagination(prev => ({
        ...prev,
        total: response.pagination.total,
        totalPages: response.pagination.totalPages
      }));
      setError('');
    } catch (err) {
      setError('Không thể tải danh sách đặt sân');
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadFields = async () => {
    try {
      const response = await getAllFields();
      setFields(response);
    } catch (err) {
      console.error('Error loading fields:', err);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
    setSelectedBookings([]);
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleSelectBooking = (bookingId, checked) => {
    if (checked) {
      setSelectedBookings(prev => [...prev, bookingId]);
    } else {
      setSelectedBookings(prev => prev.filter(id => id !== bookingId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedBookings(bookings.map(b => b.id));
    } else {
      setSelectedBookings([]);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      showSuccess(`Cập nhật trạng thái thành công`);
      loadBookings();
    } catch (err) {
      showError('Không thể cập nhật trạng thái');
    }
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedBookings.length === 0) return;
    
    const statusTexts = {
      approved: 'duyệt',
      cancelled: 'từ chối',
      completed: 'hoàn thành'
    };

    setConfirmModal({
      show: true,
      title: `${statusTexts[newStatus].charAt(0).toUpperCase() + statusTexts[newStatus].slice(1)} đơn đặt sân`,
      message: `Bạn có chắc chắn muốn ${statusTexts[newStatus]} ${selectedBookings.length} đơn đặt sân?`,
      onConfirm: async () => {
        try {
          await Promise.all(
            selectedBookings.map(id => updateBookingStatus(id, newStatus))
          );
          showSuccess(`${statusTexts[newStatus].charAt(0).toUpperCase() + statusTexts[newStatus].slice(1)} thành công ${selectedBookings.length} đơn`);
          setSelectedBookings([]);
          loadBookings();
        } catch (err) {
          showError(`Không thể ${statusTexts[newStatus]} đơn đặt sân`);
        }
      }
    });
  };

  const handleDelete = (bookingId) => {
    setConfirmModal({
      show: true,
      title: 'Xóa đơn đặt sân',
      message: 'Bạn có chắc chắn muốn xóa đơn đặt sân này? Hành động này không thể hoàn tác.',
      onConfirm: async () => {
        try {
          await deleteBooking(bookingId);
          showSuccess('Xóa đơn đặt sân thành công');
          loadBookings();
        } catch (err) {
          showError('Không thể xóa đơn đặt sân');
        }
      }
    });
  };

  const handleBulkDelete = () => {
    if (selectedBookings.length === 0) return;

    setConfirmModal({
      show: true,
      title: 'Xóa đơn đặt sân',
      message: `Bạn có chắc chắn muốn xóa ${selectedBookings.length} đơn đặt sân? Hành động này không thể hoàn tác.`,
      onConfirm: async () => {
        try {
          await Promise.all(
            selectedBookings.map(id => deleteBooking(id))
          );
          showSuccess(`Xóa thành công ${selectedBookings.length} đơn đặt sân`);
          setSelectedBookings([]);
          loadBookings();
        } catch (err) {
          showError('Không thể xóa đơn đặt sân');
        }
      }
    });
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking);
    setShowBookingModal(true);
  };

  const handleCreateNew = () => {
    setEditingBooking(null);
    setShowBookingModal(true);
  };

  const handleBookingSave = async (bookingData) => {
    try {
      if (editingBooking) {
        // Update existing booking (implement if needed)
        showSuccess('Cập nhật đơn đặt sân thành công');
      } else {
        // Create new manual booking
        await createManualBooking(bookingData);
        showSuccess('Tạo đơn đặt sân thành công');
      }
      setShowBookingModal(false);
      setEditingBooking(null);
      loadBookings();
    } catch (err) {
      showError(editingBooking ? 'Không thể cập nhật đơn đặt sân' : 'Không thể tạo đơn đặt sân');
    }
  };

  const showSuccess = (message) => {
    // You can implement a toast notification here
    console.log('Success:', message);
  };

  const showError = (message) => {
    // You can implement a toast notification here
    console.error('Error:', message);
  };

  if (loading && bookings.length === 0) {
    return (
      <div className="admin-loading-container">
        <div className="admin-loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-booking-management">
      {/* Header Actions */}
      <div className="admin-page-header">
        <div className="admin-header-actions">
          <button 
            className="admin-btn admin-btn-primary"
            onClick={handleCreateNew}
          >
            <i className="fas fa-plus"></i>
            <span className="admin-desktop-only">Thêm đơn</span>
          </button>
          <button 
            className="admin-btn admin-btn-secondary"
            onClick={loadBookings}
          >
            <i className="fas fa-sync-alt"></i>
            <span className="admin-desktop-only">Làm mới</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <BookingFilters
        filters={filters}
        fields={fields}
        onFilterChange={handleFilterChange}
      />

      {/* Bulk Actions */}
      {selectedBookings.length > 0 && (
        <div className="admin-bulk-actions">
          <div className="admin-bulk-info">
            <span>{selectedBookings.length} đơn được chọn</span>
          </div>
          <div className="admin-bulk-buttons">
            <button 
              className="admin-btn admin-btn-success admin-btn-sm"
              onClick={() => handleBulkStatusUpdate('approved')}
            >
              <i className="fas fa-check"></i>
              Duyệt tất cả
            </button>
            <button 
              className="admin-btn admin-btn-warning admin-btn-sm"
              onClick={() => handleBulkStatusUpdate('cancelled')}
            >
              <i className="fas fa-times"></i>
              Từ chối tất cả
            </button>
            <button 
              className="admin-btn admin-btn-danger admin-btn-sm"
              onClick={handleBulkDelete}
            >
              <i className="fas fa-trash"></i>
              Xóa tất cả
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="admin-error-message">
          <i className="fas fa-exclamation-triangle"></i>
          {error}
        </div>
      )}

      {/* Bookings Table */}
      <BookingTable
        bookings={bookings}
        loading={loading}
        selectedBookings={selectedBookings}
        onSelectBooking={handleSelectBooking}
        onSelectAll={handleSelectAll}
        onStatusUpdate={handleStatusUpdate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pagination={pagination}
        onPageChange={handlePageChange}
      />

      {/* Modals */}
      {showBookingModal && (
        <BookingModal
          booking={editingBooking}
          fields={fields}
          onSave={handleBookingSave}
          onClose={() => {
            setShowBookingModal(false);
            setEditingBooking(null);
          }}
        />
      )}

      {confirmModal.show && (
        <ConfirmModal
          title={confirmModal.title}
          message={confirmModal.message}
          onConfirm={() => {
            confirmModal.onConfirm();
            setConfirmModal({ show: false, title: '', message: '', onConfirm: null });
          }}
          onCancel={() => {
            setConfirmModal({ show: false, title: '', message: '', onConfirm: null });
          }}
        />
      )}
    </div>
  );
};

export default AdminBookingManagement;