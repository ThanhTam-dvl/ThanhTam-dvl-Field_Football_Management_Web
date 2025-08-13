// ====== frontend/src/admin/services/customerService.js ======
import BaseService from './baseService';

class CustomerService extends BaseService {
  constructor() {
    super('/admin/customers');
  }

  async getCustomers(params = {}) {
    return this.get('/', params);
  }

  async getCustomerStats() {
    return this.get('/stats');
  }

  async getCustomerById(customerId) {
    return this.get(`/${customerId}`);
  }

  async createCustomer(customerData) {
    return this.post('/', customerData);
  }

  async updateCustomer(customerId, customerData) {
    return this.put(`/${customerId}`, customerData);
  }

  async deleteCustomer(customerId) {
    return this.delete(`/${customerId}`);
  }

  async bulkUpdateCustomers(customerIds, action) {
    return this.patch('/bulk', { customerIds, action });
  }

  // Helper methods
  calculateSuccessRate(customer) {
    if (customer.total_bookings === 0) return 0;
    return ((customer.completed_bookings / customer.total_bookings) * 100);
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  formatDate(dateString) {
    if (!dateString) return 'Chưa có';
    return new Date(dateString).toLocaleDateString('vi-VN');
  }

  exportCustomersToCSV(customers) {
    const csvContent = [
      ['ID', 'Tên', 'Số điện thoại', 'Email', 'Tổng đặt sân', 'Số lần hủy', 'Tỷ lệ thành công (%)', 'Tổng chi tiêu', 'Lần đặt cuối', 'Trạng thái', 'Ngày tạo'].join(','),
      ...customers.map(customer => [
        customer.id,
        `"${customer.name}"`,
        customer.phone_number,
        `"${customer.email || ''}"`,
        customer.total_bookings,
        customer.cancelled_bookings,
        this.calculateSuccessRate(customer).toFixed(1),
        customer.total_spent,
        customer.last_booking_date || '',
        customer.is_active ? 'Hoạt động' : 'Không hoạt động',
        new Date(customer.created_at).toLocaleDateString('vi-VN')
      ].join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `khach-hang-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export default new CustomerService();

// Named exports for compatibility
export const getCustomers = (params) => new CustomerService().getCustomers(params);
export const getCustomerStats = () => new CustomerService().getCustomerStats();
export const getCustomerById = (id) => new CustomerService().getCustomerById(id);
export const createCustomer = (data) => new CustomerService().createCustomer(data);
export const updateCustomer = (id, data) => new CustomerService().updateCustomer(id, data);
export const deleteCustomer = (id) => new CustomerService().deleteCustomer(id);
export const bulkUpdateCustomers = (ids, action) => new CustomerService().bulkUpdateCustomers(ids, action);
