// ====== frontend/src/admin/pages/AdminDashboard.jsx (TAILWIND VERSION) ======
import { useState, useEffect } from 'react';
import { dashboardService } from '../services';
import DashboardStats from '../components/dashboard/DashboardStats';
import RecentBookings from '../components/dashboard/RecentBookings';
import QuickActions from '../components/dashboard/QuickActions';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useToast } from '../hooks/useToast';

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
  const [refreshing, setRefreshing] = useState(false);

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

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadDashboardData();
      showToast('Đã cập nhật dữ liệu', 'success');
    } catch (error) {
      showToast('Lỗi khi cập nhật', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner message="Đang tải dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-3 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header với Refresh Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Tổng quan hoạt động hệ thống
          </p>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium disabled:opacity-50"
        >
          <i className={`fas fa-sync-alt ${refreshing ? 'animate-spin' : ''}`}></i>
          <span className="hidden sm:inline">Làm mới</span>
        </button>
      </div>

      {/* Stats Cards */}
      <DashboardStats stats={stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Recent Bookings - Takes 2/3 on desktop */}
        <div className="lg:col-span-2">
          <RecentBookings 
            bookings={recentBookings} 
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />
        </div>

        {/* Quick Actions - Takes 1/3 on desktop */}
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>

      {/* Additional Analytics Cards (if needed) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Popular Fields */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Sân phổ biến
          </h3>
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <i className="fas fa-futbol text-green-600 dark:text-green-400 text-sm"></i>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">Sân {item}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">7vs7</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600 dark:text-green-400 text-sm">{15 - item * 2} lượt</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{95 - item * 5}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Chart Placeholder */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Doanh thu tuần
          </h3>
          <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Biểu đồ sẽ được thêm</p>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Trạng thái hệ thống
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Server</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600 dark:text-green-400">Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600 dark:text-green-400">Connected</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Payment</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-yellow-600 dark:text-yellow-400">Checking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;