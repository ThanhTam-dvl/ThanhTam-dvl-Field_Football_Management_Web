// ====== frontend/src/admin/components/customer/CustomerFilters.jsx ======
const CustomerFilters = ({ filters, onFilterChange, onAddCustomer }) => {
  const handleSearchChange = (e) => {
    onFilterChange({ search: e.target.value });
  };

  const handleStatusChange = (e) => {
    onFilterChange({ status: e.target.value });
  };

  return (
    <div className="admin-customer-filters">
      <div className="admin-customer-filters-row">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, SĐT, email..."
          value={filters.search}
          onChange={handleSearchChange}
          className="admin-customer-search-input"
        />
        
        <select
          value={filters.status}
          onChange={handleStatusChange}
          className="admin-customer-filter-select"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Không hoạt động</option>
        </select>

        <button
          onClick={onAddCustomer}
          className="admin-customer-add-btn"
        >
          <i className="fas fa-plus"></i>
          Thêm khách hàng
        </button>
      </div>
    </div>
  );
};

export default CustomerFilters;
