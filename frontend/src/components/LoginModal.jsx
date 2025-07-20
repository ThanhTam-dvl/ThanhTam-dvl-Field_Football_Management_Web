import { useEffect } from 'react';

function LoginModal() {
  useEffect(() => {
    const modal = document.getElementById('login-modal');
    const closeModal = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
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

  return (
    <div className="login-modal" id="login-modal">
      <div className="login-content">
        <div className="login-header">
          <h3>Đăng nhập</h3>
          <span className="close-modal">&times;</span>
        </div>
        <div className="login-form">
          <div className="phone-input">
            <label htmlFor="phone">Số điện thoại</label>
            <input type="tel" id="phone" placeholder="Nhập số điện thoại" />
            <button id="send-otp">Gửi OTP</button>
          </div>
          <div className="otp-input" style={{ display: 'none' }}>
            <label htmlFor="otp">Mã OTP</label>
            <input type="text" id="otp" placeholder="Nhập mã OTP" />
            <div className="otp-timer">Mã OTP sẽ hết hạn sau: <span id="timer">60</span>s</div>
          </div>
          <button id="login-submit" disabled>Đăng nhập</button>
          <div className="admin-link">
            <a href="/admin/login">Đăng nhập quản trị</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
