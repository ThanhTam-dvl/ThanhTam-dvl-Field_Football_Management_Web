// ====== 3. FIX: frontend/src/admin/pages/AdminBookingManagement.jsx ======
import { useState, useEffect } from 'react';
import { bookingService } from '../services';
import BookingStats from '../components/booking/BookingStats';
import BookingFilters from '../components/booking/BookingFilters';
import BookingTable from '../components/booking/BookingTable';
import BookingModal from '../components/booking/BookingModal';
import BulkActions from '../components/booking/BulkActions';
import ConfirmModal from '../components/common/ConfirmModal';
import { useToast } from '../hooks/useToast';
import '../assets/styles/admin-booking.css';
import '../assets/styles/admin.css';

const AdminBookingManagement = () => {
  // State management
  const [bookings, setBookings] = useState([]);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookings, setSelectedBookings] = useState([]);
  
  // Pagination & Filters
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    field: 'all',
    date: 'all'
  });
  
  // Modals
  const [modals, setModals] = useState({
    booking: false,
    confirm: false
  });
  
  const [editingBooking, setEditingBooking] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');

  const { showToast } = useToast();

  // Load data on mount and filter changes
  useEffect(() => {
    loadData();
  }, [filters, pagination.page]);

  const loadData = async () => {
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

      const [bookingsData, fieldsData] = await Promise.all([
        bookingService.getAllBookings(params),
        bookingService.getFields()
      ]);

      setBookings(bookingsData.bookings);
      setPagination(prev => ({
        ...prev,
        total: bookingsData.pagination.total,
        totalPages: bookingsData.pagination.totalPages
      }));
      setFields(fieldsData);
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Không thể tải danh sách đặt sân', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filter handlers
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
    setSelectedBookings([]);
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  // Selection handlers
  const handleSelectBooking = (bookingId, checked) => {
    if (checked) {
      setSelectedBookings(prev => [...prev, bookingId]);
    } else {
      setSelectedBookings(prev => prev.filter(id => id !== bookingId));
    }
  };

  const handleSelectAll = (checked) => {
    setSelectedBookings(checked ? bookings.map(b => b.id) : []);
  };

  // Modal handlers
  const openModal = (modalType, data = null) => {
    if (modalType === 'booking') {
      setEditingBooking(data);
    }
    setModals(prev => ({ ...prev, [modalType]: true }));
  };

  const closeModal = (modalType) => {
    setModals(prev => ({ ...prev, [modalType]: false }));
    if (modalType === 'booking') {
      setEditingBooking(null);
    }
  };

  // CRUD operations
  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await bookingService.updateBookingStatus(bookingId, newStatus);
      showToast('Cập nhật trạng thái thành công', 'success');
      await loadData();
    } catch (error) {
      showToast('Không thể cập nhật trạng thái', 'error');
    }
  };

  const handleSaveBooking = async (bookingData) => {
    try {
      if (editingBooking) {
        await bookingService.updateBooking(editingBooking.id, bookingData);
        showToast('Cập nhật đơn đặt sân thành công', 'success');
      } else {
        await bookingService.createManualBooking(bookingData);
        showToast('Tạo đơn đặt sân thành công', 'success');
      }
      closeModal('booking');
      await loadData();
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Có lỗi xảy ra';
      showToast(errorMessage, 'error');
    }
  };

  const handleDelete = (bookingId) => {
    showConfirm(
      'Bạn có chắc chắn muốn xóa đơn đặt sân này? Hành động này không thể hoàn tác.',
      async () => {
        try {
          await bookingService.deleteBooking(bookingId);
          showToast('Xóa đơn đặt sân thành công', 'success');
          await loadData();
        } catch (error) {
          showToast('Không thể xóa đơn đặt sân', 'error');
        }
      }
    );
  };

  // Bulk operations
  const handleBulkAction = (action) => {
    if (selectedBookings.length === 0) return;
    
    const actionText = {
      approved: 'duyệt',
      cancelled: 'từ chối',
      completed: 'hoàn thành',
      delete: 'xóa'
    };

    showConfirm(
      `Bạn có chắc chắn muốn ${actionText[action]} ${selectedBookings.length} đơn đặt sân?`,
      async () => {
        try {
          if (action === 'delete') {
            await Promise.all(selectedBookings.map(id => bookingService.deleteBooking(id)));
          } else {
            await Promise.all(selectedBookings.map(id => bookingService.updateBookingStatus(id, action)));
          }
          showToast(`${actionText[action]} thành công ${selectedBookings.length} đơn`, 'success');
          setSelectedBookings([]);
          await loadData();
        } catch (error) {
          showToast(`Không thể ${actionText[action]} đơn đặt sân`, 'error');
        }
      }
    );
  };

  // Confirm helper
  const showConfirm = (message, action) => {
    setConfirmMessage(message);
    setConfirmAction(() => action);
    openModal('confirm');
  };

  const handleConfirm = () => {
    closeModal('confirm');
    if (confirmAction) confirmAction();
    setConfirmAction(null);
  };

  return (
    <div className="admin-booking-management">
      {/* Header Actions */}
      <div className="admin-page-header">
        <div className="admin-header-actions">
          <button 
            className="admin-btn admin-btn-primary"
            onClick={() => openModal('booking')}
          >
            <i className="fas fa-plus"></i>
            <span className="admin-desktop-only">Thêm đơn</span>
          </button>
          <button 
            className="admin-btn admin-btn-secondary"
            onClick={loadData}
          >
            <i className="fas fa-sync-alt"></i>
            <span className="admin-desktop-only">Làm mới</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <BookingStats bookings={bookings} />

      {/* Filters */}
      <BookingFilters
        filters={filters}
        fields={fields}
        onFilterChange={handleFilterChange}
      />

      {/* Bulk Actions */}
      {selectedBookings.length > 0 && (
        <BulkActions
          selectedCount={selectedBookings.length}
          onBulkAction={handleBulkAction}
        />
      )}

      {/* Bookings Table */}
      <BookingTable
        bookings={bookings}
        loading={loading}
        selectedBookings={selectedBookings}
        onSelectBooking={handleSelectBooking}
        onSelectAll={handleSelectAll}
        onStatusUpdate={handleStatusUpdate}
        onEdit={(booking) => openModal('booking', booking)}
        onDelete={handleDelete}
      />

      {/* Modals */}
      {modals.booking && (
        <BookingModal
          booking={editingBooking}
          fields={fields}
          onSave={handleSaveBooking}
          onClose={() => closeModal('booking')}
        />
      )}

      {modals.confirm && (
        <ConfirmModal
          message={confirmMessage}
          onConfirm={handleConfirm}
          onCancel={() => closeModal('confirm')}
        />
      )}
    </div>
  );
};

export default AdminBookingManagement;