import API from './api';

// Lấy danh sách sân trống theo điều kiện tìm kiếm
export const fetchAvailableFields = async ({ date, startTime, endTime, fieldTypes }) => {
  // Map sang đúng format backend
  const typeMap = { '5': '5vs5', '7': '7vs7', '11': '11vs11' };
  const mappedTypes = fieldTypes.map(t => typeMap[t] || t);

  const res = await API.get('/fields/available', {
    params: {
      date,
      start: startTime,
      end: endTime,
      types: mappedTypes.join(','),
    },
  });
  return res.data;
};

// Gửi yêu cầu đặt sân
export const createBooking = async (bookingData) => {
  const res = await API.post('/bookings', bookingData);
  return res.data;
};
