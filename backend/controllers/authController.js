// backend/controllers/authController.js
const db = require('../config/db');
const nodemailer = require('nodemailer');

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000); // Tạo OTP ngẫu nhiên
}

exports.sendOtp = async (req, res) => {
  const { email, phone } = req.body;
  const otpCode = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP hết hạn sau 5 phút

  if (!email && !phone) {
    return res.status(400).json({ error: 'Vui lòng nhập email hoặc số điện thoại' });
  }

  if (email) {
    // Gửi OTP qua email
    db.query(
      'INSERT INTO otp_codes (email, otp_code, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE otp_code=?, expires_at=?',
      [email, otpCode, expiresAt, otpCode, expiresAt],
      async (err) => {
        if (err) return res.status(500).json({ error: 'Lỗi ghi OTP', details: err });
        try {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASS
            }
          });

          await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Mã xác thực OTP - TaZi FootballField',
            html: `<p>Mã xác thực của bạn là: <b>${otpCode}</b>. Mã này có hiệu lực trong 5 phút.</p>`
          });

          res.status(200).json({ message: 'Đã gửi OTP đến email' });
        } catch (mailErr) {
          res.status(500).json({ error: 'Lỗi gửi email', details: mailErr });
        }
      }
    );
  } else if (phone) {
    // Gửi OTP qua số điện thoại (giả lập gửi OTP về terminal cho test)
    db.query(
      'INSERT INTO otp_codes (phone_number, otp_code, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE otp_code=?, expires_at=?',
      [phone, otpCode, expiresAt, otpCode, expiresAt],
      (err) => {
        if (err) return res.status(500).json({ error: 'Lỗi ghi OTP', details: err });

        // Giả lập gửi OTP về số điện thoại (hiển thị trong terminal)
        console.log(`Gửi OTP giả lập đến số điện thoại: ${phone} với mã: ${otpCode}`);
        res.status(200).json({ message: 'Đã gửi OTP qua số điện thoại' });
      }
    );
  }
};



// backend/controllers/authController.js
exports.verifyOtp = (req, res) => {
  const { email, phone, otp } = req.body;
  if (!email && !phone) return res.status(400).json({ error: 'Vui lòng nhập email hoặc số điện thoại' });
  if (!otp) return res.status(400).json({ error: 'Thiếu mã OTP' });

  const condition = email ? `email = ?` : `phone_number = ?`;
  const value = email ? email : phone;

  db.query(
    `SELECT * FROM otp_codes WHERE ${condition} AND otp_code = ? AND is_used = 0 AND expires_at > NOW()`,
    [value, otp],
    (err, results) => {
      if (err || results.length === 0) return res.status(400).json({ error: 'OTP không hợp lệ hoặc đã hết hạn' });

      db.query('UPDATE otp_codes SET is_used = 1 WHERE id = ?', [results[0].id], (err2) => {
        if (err2) return res.status(500).json({ error: 'Lỗi xác thực OTP' });

        // Tạo user nếu chưa có
        db.query('SELECT * FROM users WHERE email = ? OR phone_number = ?', [email, phone], (err3, rows) => {
          if (err3) return res.status(500).json({ error: 'Lỗi kiểm tra người dùng' });

          let user = rows[0];
          if (!user) {
            const defaultName = 'Người dùng mới';
            db.query(
              'INSERT INTO users (email, phone_number, name) VALUES (?, ?, ?)',
              [email, phone, defaultName],
              (err4, result) => {
                if (err4) return res.status(500).json({ error: 'Lỗi tạo tài khoản mới', details: err4 });
                user = { id: result.insertId, email, phone, name: defaultName };
              }
            );
          }

          res.status(200).json({ message: 'Đăng nhập thành công', user });
        });
      });
    }
  );
};


