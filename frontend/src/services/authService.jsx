// services/authService.js
import API from './api';

export const sendOtp = async (email) => {
  const res = await API.post('/auth/send-otp', { email });
  return res.data;
};

export const verifyOtp = async (email, otp) => {
  const res = await API.post('/auth/verify-otp', { email, otp });
  return res;
};
