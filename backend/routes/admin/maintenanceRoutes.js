// backend/routes/admin/maintenanceRoutes.js
const express = require('express');
const router = express.Router();
const { requireAuth, requirePermission } = require('../../middleware/adminAuth');
const maintenanceController = require('../../controllers/admin/maintenanceController');

// Middleware xác thực admin và quyền fields cho tất cả routes
router.use(requireAuth);
router.use(requirePermission('fields'));

// GET /api/admin/maintenance - Lấy danh sách bảo trì (có phân trang, filter)
router.get('/', maintenanceController.getAllMaintenances);

// GET /api/admin/maintenance/stats - Lấy thống kê bảo trì
router.get('/stats', maintenanceController.getMaintenanceStats);

// GET /api/admin/maintenance/:id - Lấy chi tiết bảo trì
router.get('/:id', maintenanceController.getMaintenanceById);

// POST /api/admin/maintenance - Tạo lịch bảo trì mới
router.post('/', maintenanceController.createMaintenance);

// PUT /api/admin/maintenance/:id - Cập nhật lịch bảo trì
router.put('/:id', maintenanceController.updateMaintenance);

// DELETE /api/admin/maintenance/:id - Xóa lịch bảo trì
router.delete('/:id', maintenanceController.deleteMaintenance);

module.exports = router;