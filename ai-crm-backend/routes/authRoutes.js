const express = require('express');
const router = express.Router();
const { signup, login, getMe, addAgent } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);

// Sirf admin/superadmin naye sales agents add kar sakte hain
router.post('/add-agent', protect, authorize('admin', 'superadmin'), addAgent);

module.exports = router;
