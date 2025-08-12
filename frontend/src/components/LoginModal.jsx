import { useState, useEffect } from 'react';
import { sendOtp, verifyOtp } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginModal() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);  // Step 1: Enter email/phone, Step 2: Enter OTP
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const modal = document.getElementById('login-modal');
    const closeModal = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      setEmailOrPhone('');
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
    if (!emailOrPhone) return alert('Vui lòng nhập email hoặc số điện thoại');
    setIsLoading(true);
    try {
      await sendOtp(emailOrPhone);
      setStep(2);  // Move to OTP verification step
    } catch (err) {
      console.error(err);
      alert('Không gửi được OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return alert('Vui lòng nhập mã OTP');
    try {
      setIsLoading(true);
      const res = await verifyOtp(emailOrPhone, otp);
      login(res.data.user);  // Save user info in context

      const modal = document.getElementById('login-modal');
      document.body.style.overflow = '';
      modal?.classList.remove('active');

      // If user is new, navigate to profile page for completion
      if (!res.data.user.name || res.data.user.name.trim().toLowerCase() === 'người dùng mới') {
        navigate('/profile');
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
            <div className="input-field">
              <label>Nhập email hoặc số điện thoại</label>
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="Email hoặc số điện thoại"
                style={{ width: '72%' }}
              />
              <button onClick={handleSendOtp} disabled={isLoading}>
                {isLoading ? 'Đang gửi OTP...' : 'Gửi OTP'}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="otp-input">
              <label>Nhập mã OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Mã OTP"
              />
              <div className="otp-timer">
                Mã OTP sẽ hết hạn sau: <span>{timer}</span>s
              </div>
              <button onClick={handleVerifyOtp} disabled={!otp || isLoading}>
                {isLoading ? 'Đang xác minh...' : 'Đăng nhập'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
