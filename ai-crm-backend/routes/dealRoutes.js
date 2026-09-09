const express = require('express');
const router = express.Router();
const { createDeal, getDeals, updateDeal, deleteDeal } = require('../controllers/dealController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .post(createDeal)
  .get(getDeals);

router.route('/:id')
  .put(updateDeal)
  .delete(deleteDeal);

module.exports = router;
