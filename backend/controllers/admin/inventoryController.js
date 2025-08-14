// backend/controllers/admin/inventoryController.js
const Product = require('../../models/Product');
const StockTransaction = require('../../models/StockTransaction');

class InventoryController {
  // Get all products with filters
  static async getProducts(req, res) {
    try {
      console.log('Getting products with filters:', req.query); // DEBUG LOG
      
      const filters = {
        search: req.query.search,
        category: req.query.category,
        stock_status: req.query.stock_status,
        limit: req.query.limit
      };

      const products = await Product.getAll(filters);
      console.log('Found products:', products.length); // DEBUG LOG
      
      res.json(products);
    } catch (error) {
      console.error('Error getting products:', error);
      res.status(500).json({ error: 'Lỗi lấy danh sách sản phẩm' });
    }
  }

  // Get product by ID
  static async getProduct(req, res) {
    try {
      const product = await Product.getById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
      }
      res.json(product);
    } catch (error) {
      console.error('Error getting product:', error);
      res.status(500).json({ error: 'Lỗi lấy thông tin sản phẩm' });
    }
  }

  // Create new product
  static async createProduct(req, res) {
    try {
      const productId = await Product.create(req.body);
      const newProduct = await Product.getById(productId);
      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Error creating product:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Mã sản phẩm đã tồn tại' });
      }
      res.status(500).json({ error: 'Lỗi tạo sản phẩm' });
    }
  }

  // Update product
  static async updateProduct(req, res) {
    try {
      await Product.update(req.params.id, req.body);
      const updatedProduct = await Product.getById(req.params.id);
      res.json(updatedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Lỗi cập nhật sản phẩm' });
    }
  }

  // Delete product (soft delete)
  static async deleteProduct(req, res) {
    try {
      await Product.delete(req.params.id);
      res.json({ message: 'Xóa sản phẩm thành công' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Lỗi xóa sản phẩm' });
    }
  }

  // Get inventory statistics
  static async getStats(req, res) {
    try {
      const stats = await Product.getStats();
      res.json(stats);
    } catch (error) {
      console.error('Error getting inventory stats:', error);
      res.status(500).json({ error: 'Lỗi lấy thống kê tồn kho' });
    }
  }

  // Create stock transaction
  static async createTransaction(req, res) {
    try {
      const { products, transaction_date, reference, notes } = req.body;
      const admin_id = req.admin.id;

      // Process multiple products
      const transactionIds = [];
      for (const item of products) {
        const { product_id, quantity, type } = item;
        const product = await Product.getById(product_id);
        
        if (!product) {
          return res.status(400).json({ error: `Sản phẩm ID ${product_id} không tồn tại` });
        }

        const price = type === 'import' ? product.purchase_price : product.selling_price;
        
        // Create transaction record
        const transactionId = await StockTransaction.create({
          product_id,
          type,
          quantity,
          price,
          transaction_date,
          reference,
          notes,
          created_by: admin_id
        });

        // Update stock
        await Product.updateStock(product_id, quantity, type);
        
        transactionIds.push(transactionId);
      }

      res.status(201).json({ 
        message: 'Giao dịch thành công',
        transaction_ids: transactionIds
      });
    } catch (error) {
      console.error('Error creating transaction:', error);
      res.status(500).json({ error: 'Lỗi tạo giao dịch' });
    }
  }

  // Get transaction history
  static async getTransactionHistory(req, res) {
    try {
      const filters = {
        type: req.query.type,
        product_id: req.query.product_id,
        start_date: req.query.start_date,
        end_date: req.query.end_date,
        limit: req.query.limit || 20
      };

      const transactions = await StockTransaction.getAll(filters);
      res.json(transactions);
    } catch (error) {
      console.error('Error getting transaction history:', error);
      res.status(500).json({ error: 'Lỗi lấy lịch sử giao dịch' });
    }
  }

  // Quick stock update
  static async quickStockUpdate(req, res) {
    try {
      const { product_id, quantity, type } = req.body;
      const admin_id = req.admin.id;

      const product = await Product.getById(product_id);
      if (!product) {
        return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
      }

      // Create transaction
      const price = type === 'import' ? product.purchase_price : product.selling_price;
      await StockTransaction.create({
        product_id,
        type,
        quantity,
        price,
        transaction_date: new Date().toISOString().split('T')[0],
        reference: `Quick ${type}`,
        notes: `Quick ${type} via admin panel`,
        created_by: admin_id
      });

      // Update stock
      const newStock = await Product.updateStock(product_id, quantity, type);

      res.json({ 
        message: 'Cập nhật tồn kho thành công',
        new_stock: newStock
      });
    } catch (error) {
      console.error('Error quick stock update:', error);
      res.status(500).json({ error: 'Lỗi cập nhật tồn kho' });
    }
  }
}

module.exports = InventoryController;