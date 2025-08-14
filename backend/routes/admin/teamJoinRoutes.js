// backend/routes/admin/teamJoinRoutes.js
const express = require('express');
const router = express.Router();
const AdminTeamJoinController = require('../../controllers/admin/teamJoinController');
const { requireAuth, requirePermission } = require('../../middleware/adminAuth');

// Tất cả routes đều cần admin auth
router.use(requireAuth);

// GET /admin/team-joins - Lấy danh sách team join posts
router.get('/', AdminTeamJoinController.getAllPosts);

// GET /admin/team-joins/stats - Thống kê team join posts
router.get('/stats', AdminTeamJoinController.getPostStats);

// GET /admin/team-joins/:id - Lấy chi tiết post
router.get('/:id', AdminTeamJoinController.getPostById);

// POST /admin/team-joins - Tạo post mới
router.post('/', AdminTeamJoinController.createPost);

// PUT /admin/team-joins/:id - Cập nhật post
router.put('/:id', AdminTeamJoinController.updatePost);

// DELETE /admin/team-joins/:id - Xóa post
router.delete('/:id', AdminTeamJoinController.deletePost);

// POST /admin/team-joins/bulk-update - Cập nhật hàng loạt
router.post('/bulk-update', AdminTeamJoinController.bulkUpdateStatus);

module.exports = router;