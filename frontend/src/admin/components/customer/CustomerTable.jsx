// ====== frontend/src/admin/components/customer/CustomerTable.jsx ======
import { customerService } from '../../services';

const CustomerTable = ({
  customers,
  selectedCustomers,
  filters,
  onSelectCustomer,
  onSelectAll,
  onSort,
  onViewDetail,
  onEditCustomer,
  onDeleteCustomer
}) => {
  const getSortIcon = (field) => {
    if (filters.sortBy !== field) return 'fas fa-sort';
    return filters.sortOrder === 'ASC' ? 'fas fa-sort-up' : 'fas fa-sort-down';
  };

  const calculateSuccessRate = (customer) => {
    return customerService.calculateSuccessRate(customer);
  };

  const formatCurrency = (amount) => {
    return customerService.formatCurrency(amount);
  };

  const getProgressClass = (rate) => {
    if (rate >= 80) return 'high';
    if (rate >= 50) return 'medium';
    return 'low';
  };

  return (
    <div className="admin-customer-table-container">
      <table className="admin-customer-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedCustomers.length === customers.length && customers.length > 0}
                onChange={(e) => onSelectAll(e.target.checked)}
              />
            </th>
            <th className="sortable" onClick={() => onSort('name')}>
              Khách hàng
              <i className={`sort-icon ${getSortIcon('name')}`}></i>
            </th>
            <th className="sortable" onClick={() => onSort('phone_number')}>
              Số điện thoại
              <i className={`sort-icon ${getSortIcon('phone_number')}`}></i>
            </th>
            <th>Tổng đặt sân</th>
            <th>Tỷ lệ thành công</th>
            <th>Tổng chi tiêu</th>
            <th className="sortable" onClick={() => onSort('is_active')}>
              Trạng thái
              <i className={`sort-icon ${getSortIcon('is_active')}`}></i>
            </th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => {
            const successRate = calculateSuccessRate(customer);
            const isSelected = selectedCustomers.includes(customer.id);
            
            return (
              <tr key={customer.id} className={isSelected ? 'selected' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => onSelectCustomer(customer.id, e.target.checked)}
                  />
                </td>
                <td>
                  <div className="admin-customer-info">
                    <div className="admin-customer-name">
                      {customer.name}
                      {customer.total_bookings >= 10 && (
                        <span className="admin-customer-vip-badge">VIP</span>
                      )}
                    </div>
                    <div className="admin-customer-email">
                      {customer.email || 'Chưa có email'}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="admin-customer-phone">{customer.phone_number}</div>
                </td>
                <td>
                  <div className="admin-customer-booking-stats">
                    <div className="admin-customer-total-bookings">
                      {customer.total_bookings}
                    </div>
                    <div className="admin-customer-cancelled-bookings">
                      {customer.cancelled_bookings} hủy
                    </div>
                  </div>
                </td>
                <td>
                  <div className="admin-customer-success-rate">
                    <div className="admin-customer-progress-container">
                      <div className="admin-customer-progress-bar">
                        <div 
                          className={`admin-customer-progress-fill ${getProgressClass(successRate)}`}
                          style={{ width: `${successRate}%` }}
                        ></div>
                      </div>
                      <div className="admin-customer-progress-text">
                        {successRate.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="admin-customer-total-spent">
                    {formatCurrency(customer.total_spent)}
                  </div>
                </td>
                <td>
                  <span className={`admin-customer-status-badge ${customer.is_active ? 'active' : 'inactive'}`}>
                    {customer.is_active ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </td>
                <td>
                  <div className="admin-customer-actions">
                    <button
                      onClick={() => onViewDetail(customer.id)}
                      className="admin-customer-action-btn view"
                      title="Xem chi tiết"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button
                      onClick={() => onEditCustomer(customer)}
                      className="admin-customer-action-btn edit"
                      title="Chỉnh sửa"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => onDeleteCustomer(customer.id)}
                      className="admin-customer-action-btn delete"
                      title="Xóa"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;





