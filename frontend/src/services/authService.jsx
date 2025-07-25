// src/services/authService.js
import API from './api';

export const sendOtp = (phoneNumber) =>
  API.post('/auth/send-otp', { phone_number: phoneNumber });

export const verifyOtp = (phoneNumber, otpCode) =>
  API.post('/auth/verify-otp', {
    phone_number: phoneNumber,
    otp_code: otpCode,
  });
