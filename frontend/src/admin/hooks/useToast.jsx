import { useCallback } from 'react';

export const useToast = () => {
  const showToast = useCallback((message, type = 'success') => {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `admin-toast admin-toast-${type}`;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#00b894' : type === 'error' ? '#e17055' : '#fdcb6e'};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      animation: slideInRight 0.3s ease;
      font-weight: 500;
      max-width: 400px;
      word-wrap: break-word;
    `;
    
    // Add animation keyframes if not exists
    if (!document.head.querySelector('#toast-styles')) {
      const style = document.createElement('style');
      style.id = 'toast-styles';
      style.textContent = `
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }, []);

  return { showToast };
};