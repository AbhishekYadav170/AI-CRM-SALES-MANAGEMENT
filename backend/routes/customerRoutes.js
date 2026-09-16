const express = require("express");
const router = express.Router();

const {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// Login required for all customer routes
router.use(protect);

// Admin can create customers
router.post(
  "/",
  authorize("admin", "superadmin"),
  createCustomer
);

// Admin + Agent can view customers
router.get(
  "/",
  authorize("admin", "superadmin", "agent"),
  getCustomers
);

// Admin + Agent can view a customer
router.get(
  "/:id",
  authorize("admin", "superadmin", "agent"),
  getCustomerById
);

// Admin + Agent can update a customer
router.put(
  "/:id",
  authorize("admin", "superadmin", "agent"),
  updateCustomer
);

// Only Admin can delete customers
router.delete(
  "/:id",
  authorize("admin", "superadmin"),
  deleteCustomer
);

module.exports = router;