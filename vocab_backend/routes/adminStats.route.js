const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middlewares/auth.middleware');
const { getAdminStats } = require('../controllers/adminStats.controller');

// Route GET /api/admin/stats
router.get('/stats', auth, adminOnly, getAdminStats);

module.exports = router;
