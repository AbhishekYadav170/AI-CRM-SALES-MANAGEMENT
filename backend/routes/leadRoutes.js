const express = require('express');
const router = express.Router();
const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  getLeadStats,
} = require('../controllers/leadController');
const { protect } = require('../middleware/authMiddleware');

// Har route protected hai — login zaroori hai
router.use(protect);

// IMPORTANT: '/stats' ko '/:id' se pehle define karna zaroori hai,
// warna Express 'stats' ko ek lead ID samajh lega
router.get('/stats', getLeadStats);

router.route('/')
  .post(createLead)
  .get(getLeads);

router.route('/:id')
  .get(getLeadById)
  .put(updateLead)
  .delete(deleteLead);

module.exports = router;
