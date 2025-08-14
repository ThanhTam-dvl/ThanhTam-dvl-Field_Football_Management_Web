// frontend/src/admin/pages/AdminInventoryManagement.jsx
import { useState, useEffect, useCallback } from 'react';
import inventoryService from '../services/inventoryService';
import '../assets/styles/inventory-management.css';

const AdminInventoryManagement = () => {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid');
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    stock_status: 'all'
  });

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [productsData, statsData] = await Promise.all([
        inventoryService.getProducts(filters),
        inventoryService.getStats()
      ]);
      setProducts(productsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      stock_status: 'all'
    });
  };

  // Quick stock actions
  const handleQuickImport = async (productId) => {
    if (window.confirm('Nhập thêm 10 sản phẩm?')) {
      try {
        await inventoryService.quickStockUpdate(productId, 10, 'import');
        fetchData();
        alert('Nhập hàng thành công!');
      } catch (error) {
        alert('Lỗi nhập hàng: ' + error.message);
      }
    }
  };

  const handleQuickExport = async (productId) => {
    if (window.confirm('Xuất 1 sản phẩm?')) {
      try {
        await inventoryService.quickStockUpdate(productId, 1, 'export');
        fetchData();
        alert('Xuất hàng thành công!');
      } catch (error) {
        alert('Lỗi xuất hàng: ' + error.message);
      }
    }
  };

  // Utility functions
  const getCategoryText = (category) => {
    const categories = {
      'soft-drink': 'Nước ngọt',
      'energy-drink': 'Nước tăng lực',
      'water': 'Nước suối',
      'tea': 'Trà',
      'snack': 'Đồ ăn nhẹ',
      'equipment': 'Thiết bị'
    };
    return categories[category] || 'Khác';
  };

  const getStockStatusText = (status) => {
    const statuses = {
      'in-stock': 'Còn hàng',
      'low-stock': 'Sắp hết',
      'out-of-stock': 'Hết hàng'
    };
    return statuses[status] || 'Không xác định';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="admin-loading-container">
        <div className="admin-loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Đang tải dữ liệu tồn kho...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="inventory-management-content">
      {/* Summary Statistics */}
      <section className="inventory-summary">
        <div className="summary-card total">
          <div className="card-icon">
            <i className="fas fa-box"></i>
          </div>
          <div className="card-content">
            <div className="card-value">{stats.total_stock || 0}</div>
            <div className="card-label">Tổng tồn kho</div>
          </div>
        </div>

        <div className="summary-card value">
          <div className="card-icon">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="card-content">
            <div className="card-value">{formatPrice(stats.total_value || 0)}</div>
            <div className="card-label">Giá trị tồn kho</div>
          </div>
        </div>

        <div className="summary-card out-stock">
          <div className="card-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="card-content">
            <div className="card-value">{stats.out_of_stock || 0}</div>
            <div className="card-label">Hết hàng</div>
          </div>
        </div>

        <div className="summary-card transactions">
          <div className="card-icon">
            <i className="fas fa-exchange-alt"></i>
          </div>
          <div className="card-content">
            <div className="card-value">{stats.today_transactions || 0}</div>
            <div className="card-label">Giao dịch hôm nay</div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="inventory-filters">
        <div className="filters-row">
          <div className="filter-group">
            <label>Tìm kiếm</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Tìm theo tên, mã sản phẩm..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Danh mục</label>
            <select
              className="filter-select"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="all">Tất cả danh mục</option>
              <option value="soft-drink">Nước ngọt</option>
              <option value="energy-drink">Nước tăng lực</option>
              <option value="water">Nước suối</option>
              <option value="tea">Trà</option>
              <option value="snack">Đồ ăn nhẹ</option>
              <option value="equipment">Thiết bị</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Trạng thái tồn kho</label>
            <select
              className="filter-select"
              value={filters.stock_status}
              onChange={(e) => handleFilterChange('stock_status', e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="in-stock">Còn hàng</option>
              <option value="low-stock">Sắp hết</option>
              <option value="out-of-stock">Hết hàng</option>
            </select>
          </div>

          <div className="filter-group">
            <button
              className="alert-action"
              onClick={clearFilters}
              style={{ marginTop: '26px' }}
            >
              <i className="fas fa-times"></i> Xóa lọc
            </button>
          </div>

          <div className="view-toggle">
            <button
              className={`view-btn ${view === 'grid' ? 'active' : ''}`}
              onClick={() => setView('grid')}
            >
              <i className="fas fa-th"></i>
            </button>
            <button
              className={`view-btn ${view === 'list' ? 'active' : ''}`}
              onClick={() => setView('list')}
            >
              <i className="fas fa-list"></i>
            </button>
          </div>
        </div>
      </section>

      {/* Low Stock Alert */}
      {stats.low_stock > 0 && (
        <section className="inventory-alert">
          <div className="alert-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="alert-content">
            <h4>Cảnh báo tồn kho thấp</h4>
            <p>Có {stats.low_stock} sản phẩm sắp hết hàng. Cần nhập thêm hàng sớm.</p>
          </div>
          <button 
            className="alert-action"
            onClick={() => handleFilterChange('stock_status', 'low-stock')}
          >
            Xem chi tiết
          </button>
        </section>
      )}

      {/* Products Display */}
      {products.length === 0 ? (
        <div className="inventory-empty">
          <i className="fas fa-box-open"></i>
          <h3>Không có sản phẩm nào</h3>
          <p>Thử thay đổi bộ lọc hoặc thêm sản phẩm mới</p>
        </div>
      ) : view === 'grid' ? (
        // Grid View
        <section className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <i className="fas fa-box"></i>
                <span className={`stock-badge ${product.stock_status}`}>
                  {getStockStatusText(product.stock_status)}
                </span>
              </div>
              
              <div className="product-info">
                <div className="product-code">{product.code}</div>
                <h3 className="product-name">{product.name}</h3>
                <div className="product-category">{getCategoryText(product.category)}</div>
                
                <div className="product-stock">
                  <div className="stock-info">
                    <span className="stock-label">Tồn kho:</span>
                    <span className={`stock-value ${product.stock_status}`}>
                      {product.current_stock} {product.unit}
                    </span>
                  </div>
                </div>
                
                <div className="product-prices">
                  <div className="price-item">
                    <span className="price-label">Giá nhập:</span>
                    <span className="price-value">{formatPrice(product.purchase_price)}</span>
                  </div>
                  <div className="price-item">
                    <span className="price-label">Giá bán:</span>
                    <span className="price-value">{formatPrice(product.selling_price)}</span>
                  </div>
                </div>
              </div>
              
              <div className="product-actions">
                <button className="action-btn view" title="Xem chi tiết">
                  <i className="fas fa-eye"></i>
                </button>
                <button 
                  className="action-btn import" 
                  title="Nhập hàng"
                  onClick={() => handleQuickImport(product.id)}
                >
                  <i className="fas fa-plus"></i>
                </button>
                <button 
                  className="action-btn export" 
                  title="Xuất hàng"
                  onClick={() => handleQuickExport(product.id)}
                  disabled={product.current_stock === 0}
                >
                  <i className="fas fa-minus"></i>
                </button>
                <button className="action-btn edit" title="Chỉnh sửa">
                  <i className="fas fa-edit"></i>
                </button>
                <button className="action-btn delete" title="Xóa">
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </section>
      ) : (
        // Table View
        <section className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Mã SP</th>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Tồn kho</th>
                <th>Đơn vị</th>
                <th>Giá nhập</th>
                <th>Giá bán</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.code}</td>
                  <td>
                    <div>
                      <strong>{product.name}</strong>
                      {product.description && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                          {product.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>{getCategoryText(product.category)}</td>
                  <td>
                    <span className={`stock-badge ${product.stock_status}`}>
                      {product.current_stock}
                    </span>
                  </td>
                  <td>{product.unit}</td>
                  <td>{formatPrice(product.purchase_price)}</td>
                  <td>{formatPrice(product.selling_price)}</td>
                  <td>
                    <span className={`stock-badge ${product.stock_status}`}>
                      {getStockStatusText(product.stock_status)}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="table-action-btn view" title="Xem chi tiết">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button 
                        className="table-action-btn import" 
                        title="Nhập hàng"
                        onClick={() => handleQuickImport(product.id)}
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                      <button 
                        className="table-action-btn export" 
                        title="Xuất hàng"
                        onClick={() => handleQuickExport(product.id)}
                        disabled={product.current_stock === 0}
                      >
                        <i className="fas fa-minus"></i>
                      </button>
                      <button className="table-action-btn edit" title="Chỉnh sửa">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="table-action-btn delete" title="Xóa">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
};

export default AdminInventoryManagement;