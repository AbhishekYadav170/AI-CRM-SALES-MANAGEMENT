const Customer = require('../models/Customer');

// Create Customer
const createCustomer = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      address,
      status,
      assignedTo,
      tags,
      notes,
      source,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: 'Name and email are required',
      });
    }

    const customer = await Customer.create({
      companyId: req.companyId,
      name,
      email,
      phone,
      company,
      address,
      status,
      assignedTo: assignedTo || null,
      tags: tags || [],
      notes,
      source,
    });

    res.status(201).json({
      message: 'Customer created successfully',
      customer,
    });
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({
      message: 'Failed to create customer',
    });
  }
};

// Get Customers
const getCustomers = async (req, res) => {
  try {
    const filter = {
      companyId: req.companyId,
    };

    // Agent sirf apne assigned customers dekhega
    if (req.user.role === 'agent') {
      filter.assignedTo = req.user._id;
    }

    const customers = await Customer.find(filter)
      .populate('assignedTo', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: customers.length,
      customers,
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({
      message: 'Failed to fetch customers',
    });
  }
};

// Get Single Customer
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      companyId: req.companyId,
    }).populate('assignedTo', 'name email role');

    if (!customer) {
      return res.status(404).json({
        message: 'Customer not found',
      });
    }

    // Agent doosre agent ka customer access nahi kar sakta
    if (
      req.user.role === 'agent' &&
      (!customer.assignedTo ||
        customer.assignedTo._id.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({
        message: 'You are not allowed to access this customer',
      });
    }

    res.status(200).json({
      customer,
    });
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({
      message: 'Failed to fetch customer',
    });
  }
};

// Update Customer
const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      companyId: req.companyId,
    });

    if (!customer) {
      return res.status(404).json({
        message: 'Customer not found',
      });
    }

    // Agent sirf apne assigned customer ko update karega
    if (
      req.user.role === 'agent' &&
      (!customer.assignedTo ||
        customer.assignedTo.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({
        message: 'You are not allowed to update this customer',
      });
    }

    const allowedFields = [
      'name',
      'email',
      'phone',
      'company',
      'address',
      'status',
      'assignedTo',
      'tags',
      'notes',
      'source',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        customer[field] = req.body[field];
      }
    });

    await customer.save();

    res.status(200).json({
      message: 'Customer updated successfully',
      customer,
    });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({
      message: 'Failed to update customer',
    });
  }
};

// Delete Customer
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      companyId: req.companyId,
    });

    if (!customer) {
      return res.status(404).json({
        message: 'Customer not found',
      });
    }

    await customer.deleteOne();

    res.status(200).json({
      message: 'Customer deleted successfully',
    });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({
      message: 'Failed to delete customer',
    });
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};