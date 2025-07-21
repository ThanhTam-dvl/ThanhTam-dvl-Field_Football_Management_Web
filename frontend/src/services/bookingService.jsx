import API from './api';

// Lấy danh sách sân trống theo điều kiện tìm kiếm
export const fetchAvailableFields = async ({ date, startTime, endTime, fieldTypes }) => {
  const res = await API.get('/fields/available', {
    params: {
      date,
      start: startTime,
      end: endTime,
      types: fieldTypes.join(','),
    },
  });
  return res.data;
};

// Gửi yêu cầu đặt sân
export const createBooking = async (bookingData) => {
  const res = await API.post('/bookings', bookingData);
  return res.data;
};
