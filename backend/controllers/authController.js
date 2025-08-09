// backend/controllers/authController.js
const db = require('../config/db');
const nodemailer = require('nodemailer');

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

exports.sendOtp = async (req, res) => {
  const rawEmail = req.body.email;
  if (!rawEmail) return res.status(400).json({ error: 'Thiếu email' });

  const email = rawEmail.trim().toLowerCase();
  const otpCode = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  db.query(
    'INSERT INTO otps (email, otp, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE otp=?, expires_at=?',
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
          subject: 'Mã xác thực OTP - FootballField',
          html: `<p>Mã xác thực của bạn là: <b>${otpCode}</b>. Mã này có hiệu lực trong 5 phút.</p>`
        });

        res.status(200).json({ message: 'Đã gửi OTP đến email' });
      } catch (mailErr) {
        res.status(500).json({ error: 'Lỗi gửi email', details: mailErr });
      }
    }
  );
};

exports.verifyOtp = (req, res) => {
  const rawEmail = req.body.email;
  const otp = req.body.otp;
  if (!rawEmail || !otp) return res.status(400).json({ error: 'Thiếu thông tin' });

  const email = rawEmail.trim().toLowerCase();

  db.query(
    'SELECT * FROM otps WHERE email = ? AND otp = ? AND expires_at > NOW()',
    [email, otp],
    (err, results) => {
      if (err || results.length === 0) return res.status(400).json({ error: 'OTP không hợp lệ hoặc đã hết hạn' });

      db.query('SELECT * FROM users WHERE email = ?', [email], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Lỗi kiểm tra user' });

        if (rows.length > 0) {
          return res.status(200).json({ message: 'Đăng nhập thành công', user: rows[0] });
        } else {
          const defaultName = 'Người dùng mới';
          db.query(
            'INSERT INTO users (email, name) VALUES (?, ?)',
            [email, defaultName],
            (err2, result) => {
              if (err2) return res.status(500).json({ error: 'Lỗi tạo user mới', details: err2 });
              res.status(200).json({ message: 'Tạo tài khoản mới thành công', user: { id: result.insertId, email, name: defaultName } });
            }
          );
        }
      });
    }
  );
};
