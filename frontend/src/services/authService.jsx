// services/authService.js
import API from './api';

export const sendOtp = async (emailOrPhone) => {
  const res = await API.post('/auth/send-otp', { email: emailOrPhone, phone: emailOrPhone });
  return res.data;
};

export const verifyOtp = async (emailOrPhone, otp) => {
  const res = await API.post('/auth/verify-otp', { email: emailOrPhone, phone: emailOrPhone, otp });
  return res;
};
