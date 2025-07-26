// src/components/LoginModal.jsx
import { useEffect, useState } from 'react';
import { sendOtp, verifyOtp } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginModal() {
  const { login } = useAuth();
  const navigate = useNavigate(); // Thêm dòng này
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const modal = document.getElementById('login-modal');
    const closeModal = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      setPhone('');
      setOtp('');
      setStep(1);
      setTimer(60);
    };

    const closeBtn = modal.querySelector('.close-modal');
    const outsideClick = (e) => {
      if (e.target === modal) closeModal();
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', outsideClick);

    return () => {
      closeBtn.removeEventListener('click', closeModal);
      modal.removeEventListener('click', outsideClick);
    };
  }, []);

  useEffect(() => {
    let countdown;
    if (step === 2 && timer > 0) {
      countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(countdown);
  }, [step, timer]);

  const handleSendOtp = async () => {
    if (!phone) return alert('Vui lòng nhập số điện thoại');
    try {
      setIsLoading(true);
      await sendOtp(phone);
      setStep(2);
    } catch (err) {
      console.error(err);
      alert('Không gửi được OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return;
    try {
      setIsLoading(true);
      const res = await verifyOtp(phone, otp);
      login(res.data.user);

      const modal = document.getElementById('login-modal');
      document.body.style.overflow = '';
      modal?.classList.remove('active');

      // 👇 THÊM kiểm tra tên
      if (
        !res.data.user.name ||
        res.data.user.name.trim().toLowerCase() === 'người dùng mới'
      ) {
        navigate('/profile'); // → Bắt người dùng cập nhật tên
      }

    } catch (err) {
      console.error(err);
      alert('Mã OTP không đúng hoặc đã hết hạn');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="login-modal" id="login-modal">
      <div className="login-content">
        <div className="login-header">
          <h3>Đăng nhập</h3>
          <span className="close-modal">&times;</span>
        </div>
        <div className="login-form">
          {step === 1 && (
            <div className="phone-input">
              <label htmlFor="phone">Số điện thoại</label>
              <input
                type="tel"
                id="phone"
                placeholder="Nhập số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <button id="send-otp" onClick={handleSendOtp} disabled={isLoading}>
                {isLoading ? 'Đang gửi...' : 'Gửi OTP'}
              </button>
            </div>
          )}

          {step === 2 && (
            <>
              <div className="otp-input">
                <label htmlFor="otp">Mã OTP</label>
                <input
                  type="text"
                  id="otp"
                  placeholder="Nhập mã OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <div className="otp-timer">
                  Mã OTP sẽ hết hạn sau: <span id="timer">{timer}</span>s
                </div>
              </div>
              <button id="login-submit" onClick={handleVerifyOtp} disabled={!otp || isLoading}>
                {isLoading ? 'Đang xác minh...' : 'Đăng nhập'}
              </button>
            </>
          )}

          <div className="admin-link">
            <a href="/admin/login">Đăng nhập quản trị</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
