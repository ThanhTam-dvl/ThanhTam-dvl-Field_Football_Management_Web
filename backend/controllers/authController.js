// backend/controllers/authController.js - FIXED VERSION
const User = require('../models/User');
const Otp = require('../models/Otp');
const Admin = require('../models/Admin');
const sendOtp = require('../utils/sendOtp');
const crypto = require('crypto');

// =============== CUSTOMER AUTHENTICATION ===============
exports.sendOtp = async (req, res) => {
  try {
    const { email, phone } = req.body;
    
    console.log('Send OTP request:', { email, phone });
    
    if (!email && !phone) {
      return res.status(400).json({ error: 'Vui lòng nhập email hoặc số điện thoại' });
    }

    // Validate format
    if (email && !sendOtp.isValidEmail(email)) {
      return res.status(400).json({ error: 'Email không hợp lệ' });
    }
    
    if (phone && !sendOtp.isValidPhone(phone)) {
      return res.status(400).json({ error: 'Số điện thoại không hợp lệ' });
    }

    const identifier = email || phone;
    
    // Check recent attempts to prevent spam
    const recentAttempts = await Otp.getRecentAttempts(identifier, 5);
    if (recentAttempts >= 3) {
      return res.status(429).json({ 
        error: 'Bạn đã gửi quá nhiều OTP. Vui lòng thử lại sau 5 phút.' 
      });
    }

    const otpCode = sendOtp.generateOTP(6);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    console.log('Generated OTP:', otpCode, 'for', identifier);

    // Save OTP to database
    await Otp.create(identifier, otpCode, expiresAt);

    // Send OTP
    if (email) {
      await sendOtp.sendEmail(email, otpCode);
      res.json({ message: 'Đã gửi OTP đến email' });
    } else {
      await sendOtp.sendSMS(phone, otpCode);
      res.json({ message: 'Đã gửi OTP qua số điện thoại' });
    }
    
    console.log('OTP sent successfully to', identifier);
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ 
      error: 'Lỗi gửi OTP',
      details: error.message 
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, phone, otp } = req.body;
    
    console.log('Verify OTP request:', { email, phone, otp });
    
    if (!email && !phone || !otp) {
      return res.status(400).json({ error: 'Thiếu thông tin xác thực' });
    }

    const identifier = email || phone;
    
    // Verify OTP
    const isValidOtp = await Otp.verify(identifier, otp);
    if (!isValidOtp) {
      return res.status(400).json({ error: 'OTP không hợp lệ hoặc đã hết hạn' });
    }

    console.log('OTP verified successfully for', identifier);

    // Find or create user
    const user = await User.findOrCreate(email, phone);
    
    console.log('User found/created:', user.id);
    
    res.json({ 
      message: 'Đăng nhập thành công', 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone_number: user.phone_number
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ 
      error: 'Lỗi xác thực OTP',
      details: error.message 
    });
  }
};

// =============== USER PROFILE MANAGEMENT ===============
exports.getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Getting user profile for ID:', id);
    
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ 
      error: 'Lỗi lấy thông tin người dùng',
      details: error.message 
    });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone_number } = req.body;

    console.log('Updating user profile:', { id, name, email, phone_number });

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'Tên phải có ít nhất 2 ký tự' });
    }

    // Validate email if provided
    if (email && !sendOtp.isValidEmail(email)) {
      return res.status(400).json({ error: 'Email không hợp lệ' });
    }

    // Validate phone if provided
    if (phone_number && !sendOtp.isValidPhone(phone_number)) {
      return res.status(400).json({ error: 'Số điện thoại không hợp lệ' });
    }

    await User.updateInfo(id, { name: name.trim(), email, phone_number });
    
    console.log('User profile updated successfully');
    res.json({ message: 'Cập nhật thông tin thành công' });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ 
      error: 'Lỗi cập nhật thông tin',
      details: error.message 
    });
  }
};

// backend/controllers/authController.js - ADMIN SECTION ONLY (FIXED)
// ... (keep other customer auth methods as they are)

// =============== ADMIN AUTHENTICATION - FIXED ===============
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Admin login attempt:', email);

    if (!email || !password) {
      return res.status(400).json({ error: 'Email và mật khẩu là bắt buộc' });
    }

    // Use callback version to match adminAuthController pattern
    Admin.findByEmail(email, async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Lỗi máy chủ' });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
      }

      const admin = results[0];
      console.log('Found admin:', admin);

      try {
        // Simple password check (in production, use bcrypt)
        if (password !== admin.password) {
          return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
        }

        const sessionToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

        // Use callback version
        Admin.saveSession(admin.id, sessionToken, expiresAt, (sessionErr) => {
          if (sessionErr) {
            console.error('Session error:', sessionErr);
            return res.status(500).json({ error: 'Lỗi tạo phiên đăng nhập' });
          }

          // Update last login
          Admin.updateLastLogin(admin.id, () => {});

          console.log('Admin login successful for:', email);

          res.json({
            message: 'Đăng nhập thành công',
            admin: {
              id: admin.id,
              email: admin.email,
              name: admin.name,
              role: admin.role,
              permissions: JSON.parse(admin.permissions || '[]')
            },
            sessionToken,
            expiresAt
          });
        });

      } catch (error) {
        console.error('Login processing error:', error);
        res.status(500).json({ error: 'Lỗi xử lý đăng nhập' });
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ 
      error: 'Lỗi xác thực',
      details: error.message 
    });
  }
};

exports.adminLogout = async (req, res) => {
  try {
    const sessionToken = req.headers.authorization?.replace('Bearer ', '');

    if (!sessionToken) {
      return res.status(400).json({ error: 'Không tìm thấy token' });
    }

    console.log('Admin logout request');

    // Use callback version
    Admin.removeSession(sessionToken, (err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ error: 'Lỗi đăng xuất' });
      }
      res.json({ message: 'Đăng xuất thành công' });
    });
  } catch (error) {
    console.error('Admin logout error:', error);
    res.status(500).json({ 
      error: 'Lỗi đăng xuất',
      details: error.message 
    });
  }
};

exports.verifyAdminSession = async (req, res) => {
  try {
    const sessionToken = req.headers.authorization?.replace('Bearer ', '');

    if (!sessionToken) {
      return res.status(401).json({ error: 'Thiếu token xác thực' });
    }

    // Use callback version
    Admin.findSession(sessionToken, (err, results) => {
      if (err || results.length === 0) {
        console.error('Session verify error:', err);
        return res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
      }

      const session = results[0];
      res.json({
        admin: {
          id: session.admin_id,
          email: session.email,
          name: session.name,
          role: session.role,
          permissions: JSON.parse(session.permissions || '[]')
        }
      });
    });
  } catch (error) {
    console.error('Verify admin session error:', error);
    res.status(500).json({ 
      error: 'Lỗi xác thực session',
      details: error.message 
    });
  }
};

exports.changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.admin.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Thiếu mật khẩu hiện tại hoặc mật khẩu mới' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ error: 'Không tìm thấy admin' });
    }

    if (currentPassword !== admin.password) {
      return res.status(401).json({ error: 'Mật khẩu hiện tại không đúng' });
    }

    await Admin.updatePassword(adminId, newPassword);
    
    console.log('Admin password changed successfully');
    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    console.error('Change admin password error:', error);
    res.status(500).json({ 
      error: 'Lỗi cập nhật mật khẩu',
      details: error.message 
    });
  }
};