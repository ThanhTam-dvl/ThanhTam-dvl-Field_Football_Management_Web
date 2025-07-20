// backend/controllers/authController.js
const Otp = require('../models/Otp');
const User = require('../models/User');

exports.sendOtp = (req, res) => {
  const { phone_number } = req.body;
  if (!phone_number) return res.status(400).json({ error: 'Thiếu số điện thoại' });

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3 phút

  Otp.insertCode(phone_number, otpCode, expiresAt, (err) => {
    if (err) return res.status(500).json({ error: 'Lỗi gửi mã OTP' });

    // 📝 gửi thật thì tích hợp SMS, còn giờ log ra
    console.log(`📩 OTP cho ${phone_number} là ${otpCode}`);
    res.json({ message: 'Đã gửi mã OTP (giả lập)', otpCode }); // bạn có thể ẩn không trả về mã thật
  });
};

exports.verifyOtp = (req, res) => {
  const { phone_number, otp_code } = req.body;
  if (!phone_number || !otp_code) {
    return res.status(400).json({ error: 'Thiếu số điện thoại hoặc mã OTP' });
  }

  Otp.verifyCode(phone_number, otp_code, (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ error: 'Mã OTP không hợp lệ hoặc hết hạn' });

    const otp = results[0];
    Otp.markUsed(otp.id, () => {});

    User.createIfNotExist(phone_number, (err2, user) => {
      if (err2) return res.status(500).json({ error: 'Lỗi đăng nhập' });

      // Nếu cần bảo mật hơn, có thể tạo JWT ở đây
      res.json({ message: 'Đăng nhập thành công', user });
    });
  });
};
