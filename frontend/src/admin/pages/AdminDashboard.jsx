// ====== frontend/src/admin/pages/AdminDashboard.jsx (REFACTORED) ======
import { useState, useEffect } from 'react';
import { dashboardService } from '../services';
import DashboardStats from '../components/dashboard/DashboardStats';
import RecentBookings from '../components/dashboard/RecentBookings';
import QuickActions from '../components/dashboard/QuickActions';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useToast } from '../hooks/useToast';
import '../assets/styles/admin.css';
import '../assets/styles/dashboard-only.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    today_revenue: 0,
    today_bookings: 0,
    pending_bookings: 0,
    total_fields: 0,
    total_users: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, bookingsData] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getRecentBookings(5)
      ]);
      setStats(statsData);
      setRecentBookings(bookingsData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      showToast('Không thể tải dữ liệu dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Đang tải dữ liệu..." />;
  }

  return (
    <div className="admin-dashboard">
      {/* Stats Cards */}
      <DashboardStats stats={stats} />

      {/* Recent Bookings */}
      <RecentBookings 
        bookings={recentBookings} 
        onRefresh={loadDashboardData}
      />

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
};

export default AdminDashboard;




