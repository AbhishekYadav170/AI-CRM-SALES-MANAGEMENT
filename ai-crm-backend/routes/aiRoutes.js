const express = require('express');
const router = express.Router();
const { chatWithAI, getConversation, scoreLead } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/chat', chatWithAI);
router.get('/conversation/:leadId', getConversation);
router.post('/score/:leadId', scoreLead);

module.exports = router;
