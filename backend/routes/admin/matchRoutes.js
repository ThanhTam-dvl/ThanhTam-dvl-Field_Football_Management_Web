// backend/routes/admin/matchRoutes.js
const express = require('express');
const router = express.Router();
const AdminMatchController = require('../../controllers/admin/matchController');
const { requireAuth, requirePermission } = require('../../middleware/adminAuth');

// Tất cả routes đều cần admin auth
router.use(requireAuth);

// GET /admin/matches - Lấy danh sách matches
router.get('/', AdminMatchController.getAllMatches);

// GET /admin/matches/stats - Thống kê matches
router.get('/stats', AdminMatchController.getMatchStats);

// GET /admin/matches/:id - Lấy chi tiết match
router.get('/:id', AdminMatchController.getMatchById);

// POST /admin/matches - Tạo match mới
router.post('/', AdminMatchController.createMatch);

// PUT /admin/matches/:id - Cập nhật match
router.put('/:id', AdminMatchController.updateMatch);

// DELETE /admin/matches/:id - Xóa match
router.delete('/:id', AdminMatchController.deleteMatch);

// POST /admin/matches/bulk-update - Cập nhật hàng loạt
router.post('/bulk-update', AdminMatchController.bulkUpdateStatus);

module.exports = router;