// ====== frontend/src/admin/pages/AdminFieldManagement.jsx (REFACTORED) ======
import { useState, useEffect } from 'react';
import { fieldService, bookingService } from '../services';
import FieldDateNavigation from '../components/field/FieldDateNavigation';
import FieldViewControls from '../components/field/FieldViewControls';
import FieldTimeline from '../components/field/FieldTimeline';
import FieldList from '../components/field/FieldList';
import FieldLegend from '../components/field/FieldLegend';
import BookingDetailModal from '../components/field/BookingDetailModal';
import CreateBookingModal from '../components/field/CreateBookingModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useToast } from '../hooks/useToast';
import '../assets/styles/field-management.css';

const AdminFieldManagement = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [fieldsData, setFieldsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('timeline');
  const [filters, setFilters] = useState({
    fieldType: 'all',
    status: 'all'
  });

  // Modal states
  const [modals, setModals] = useState({
    bookingDetail: false,
    createBooking: false
  });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const { showToast } = useToast();

  useEffect(() => {
    loadFieldData();
  }, [currentDate]);

  const loadFieldData = async () => {
    try {
      setLoading(true);
      const dateStr = formatDateForAPI(currentDate);
      const data = await fieldService.getFieldsWithBookings(dateStr);
      setFieldsData(data);
    } catch (error) {
      console.error('Error loading field data:', error);
      showToast('Không thể tải dữ liệu sân', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatDateForAPI = (date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDateForDisplay = (date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const changeDate = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleTimeSlotClick = (fieldId, hour, booking = null) => {
    if (booking) {
      setSelectedBooking(booking);
      openModal('bookingDetail');
    } else {
      setSelectedSlot({ fieldId, hour, date: currentDate });
      openModal('createBooking');
    }
  };

  const openModal = (modalType, data = null) => {
    setModals(prev => ({ ...prev, [modalType]: true }));
  };

  const closeModal = (modalType) => {
    setModals(prev => ({ ...prev, [modalType]: false }));
    if (modalType === 'bookingDetail') {
      setSelectedBooking(null);
    } else if (modalType === 'createBooking') {
      setSelectedSlot(null);
    }
  };

  const handleBookingAction = async (action, bookingId) => {
    try {
      setLoading(true);
      
      switch (action) {
        case 'approve':
          await bookingService.updateBookingStatus(bookingId, 'approved');
          showToast('Đã duyệt booking', 'success');
          break;
        case 'cancel':
          await bookingService.deleteBooking(bookingId);
          showToast('Đã hủy booking', 'warning');
          break;
        case 'complete':
          await bookingService.updateBookingStatus(bookingId, 'completed');
          showToast('Đã hoàn thành booking', 'success');
          break;
      }
      
      closeModal('bookingDetail');
      await loadFieldData();
    } catch (error) {
      showToast(error.response?.data?.error || 'Lỗi xử lý booking', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = async (bookingData) => {
    try {
      await bookingService.createManualBooking(bookingData);
      showToast('Tạo booking thành công!', 'success');
      closeModal('createBooking');
      await loadFieldData();
    } catch (error) {
      showToast(error.response?.data?.error || 'Lỗi tạo booking', 'error');
    }
  };

  if (loading && fieldsData.length === 0) {
    return <LoadingSpinner message="Đang tải dữ liệu..." />;
  }

  return (
    <div className="admin-field-management">
      {/* Date Navigation */}
      <FieldDateNavigation
        currentDate={currentDate}
        onChangeDate={changeDate}
        onGoToToday={goToToday}
        formatDate={formatDateForDisplay}
      />

      {/* View Controls */}
      <FieldViewControls
        currentView={currentView}
        filters={filters}
        onViewChange={setCurrentView}
        onFilterChange={setFilters}
        onRefresh={loadFieldData}
        loading={loading}
      />

      {/* Content Views */}
      {currentView === 'timeline' ? (
        <FieldTimeline
          fieldsData={fieldsData}
          onTimeSlotClick={handleTimeSlotClick}
          filters={filters}
        />
      ) : (
        <FieldList
          fieldsData={fieldsData}
          currentDate={currentDate}
          onBookingClick={(booking) => {
            setSelectedBooking(booking);
            openModal('bookingDetail');
          }}
          filters={filters}
        />
      )}

      {/* Legend */}
      <FieldLegend />

      {/* Modals */}
      {modals.bookingDetail && selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          fieldsData={fieldsData}
          currentDate={currentDate}
          onAction={handleBookingAction}
          onClose={() => closeModal('bookingDetail')}
        />
      )}

      {modals.createBooking && selectedSlot && (
        <CreateBookingModal
          slot={selectedSlot}
          fieldsData={fieldsData}
          onSave={handleCreateBooking}
          onClose={() => closeModal('createBooking')}
        />
      )}
    </div>
  );
};

export default AdminFieldManagement;





