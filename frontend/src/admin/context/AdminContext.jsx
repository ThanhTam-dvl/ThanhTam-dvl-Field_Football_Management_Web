// frontend/src/admin/context/AdminContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import API from '../../services/api';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      verifySession(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifySession = async (token) => {
    try {
      const response = await API.get('/admin/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdmin(response.data.admin);
    } catch (error) {
      console.error('Session verification failed:', error);
      localStorage.removeItem('adminToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await API.post('/admin/auth/login', {
        email,
        password
      });
      
      const { admin, sessionToken } = response.data;
      setAdmin(admin);
      localStorage.setItem('adminToken', sessionToken);
      
      return { success: true, admin };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Lỗi đăng nhập' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (token) {
        await API.post('/admin/auth/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAdmin(null);
      localStorage.removeItem('adminToken');
    }
  };

  const hasPermission = (permission) => {
    if (!admin) return false;
    return admin.permissions.includes('all') || admin.permissions.includes(permission);
  };

  const isSuper = () => {
    return admin?.role === 'super_admin';
  };

  return (
    <AdminContext.Provider value={{
      admin,
      loading,
      login,
      logout,
      hasPermission,
      isSuper
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};