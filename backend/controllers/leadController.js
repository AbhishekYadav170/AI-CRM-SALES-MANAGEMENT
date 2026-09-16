// const mongoose = require('mongoose');
// const Lead = require('../models/Lead');

// // @desc    Create a new lead
// // @route   POST /api/leads
// // @access  Private
// const createLead = async (req, res, next) => {
//   try {
//     const { name, phone, email, source, status, tags, budget } = req.body;

//     if (!name || !phone) {
//       res.status(400);
//       throw new Error('Name and phone are required');
//     }

//     const lead = await Lead.create({
//       companyId: req.companyId, // logged-in user ki company se link
//       name,
//       phone,
//       email,
//       source,
//       status,
//       tags,
//       budget,
//       assignedTo: req.body.assignedTo || req.user._id,
//     });

//     res.status(201).json({ message: 'Lead created successfully', lead });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get all leads for the logged-in user's company (with filters + pagination)
// // @route   GET /api/leads?status=new&source=website&page=1&limit=10&search=ravi
// // @access  Private
// const getLeads = async (req, res, next) => {
//   try {
//     const { status, source, assignedTo, search, page = 1, limit = 20 } = req.query;

//     const query = { companyId: req.companyId }; // multi-tenant safety — sirf apni company ke leads

//     if (status) query.status = status;
//     if (source) query.source = source;
//     if (assignedTo) query.assignedTo = assignedTo;
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { phone: { $regex: search, $options: 'i' } },
//         { email: { $regex: search, $options: 'i' } },
//       ];
//     }

//     const skip = (Number(page) - 1) * Number(limit);

//     const [leads, total] = await Promise.all([
//       Lead.find(query)
//         .populate('assignedTo', 'name email')
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(Number(limit)),
//       Lead.countDocuments(query),
//     ]);

//     res.status(200).json({
//       leads,
//       pagination: {
//         total,
//         page: Number(page),
//         limit: Number(limit),
//         totalPages: Math.ceil(total / Number(limit)),
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get single lead by id
// // @route   GET /api/leads/:id
// // @access  Private
// const getLeadById = async (req, res, next) => {
//   try {
//     const lead = await Lead.findOne({
//       _id: req.params.id,
//       companyId: req.companyId, // dusri company ka lead access na ho paye
//     }).populate('assignedTo', 'name email');

//     if (!lead) {
//       res.status(404);
//       throw new Error('Lead not found');
//     }

//     res.status(200).json({ lead });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Update a lead
// // @route   PUT /api/leads/:id
// // @access  Private
// const updateLead = async (req, res, next) => {
//   try {
//     const lead = await Lead.findOne({ _id: req.params.id, companyId: req.companyId });

//     if (!lead) {
//       res.status(404);
//       throw new Error('Lead not found');
//     }

//     const allowedFields = [
//       'name', 'phone', 'email', 'source', 'status',
//       'tags', 'budget', 'assignedTo', 'lastContactedAt',
//     ];

//     allowedFields.forEach((field) => {
//       if (req.body[field] !== undefined) {
//         lead[field] = req.body[field];
//       }
//     });

//     await lead.save();

//     res.status(200).json({ message: 'Lead updated successfully', lead });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Delete a lead
// // @route   DELETE /api/leads/:id
// // @access  Private
// const deleteLead = async (req, res, next) => {
//   try {
//     const lead = await Lead.findOneAndDelete({ _id: req.params.id, companyId: req.companyId });

//     if (!lead) {
//       res.status(404);
//       throw new Error('Lead not found');
//     }

//     res.status(200).json({ message: 'Lead deleted successfully' });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Quick stats for dashboard (count by status)
// // @route   GET /api/leads/stats
// // @access  Private
// const getLeadStats = async (req, res, next) => {
//   try {
//     // aggregate() Mongoose ki tarah auto-cast nahi karta, isliye ObjectId manually banana zaroori hai
//     const stats = await Lead.aggregate([
//       { $match: { companyId: new mongoose.Types.ObjectId(req.companyId) } },
//       { $group: { _id: '$status', count: { $sum: 1 } } },
//     ]);

//     const total = await Lead.countDocuments({ companyId: req.companyId });

//     res.status(200).json({ total, breakdown: stats });
//   } catch (error) {
//     next(error);
//   }
// };

// module.exports = { createLead, getLeads, getLeadById, updateLead, deleteLead, getLeadStats };





const mongoose = require('mongoose');
const Lead = require('../models/Lead');
 
// @desc    Create a new lead
// @route   POST /api/leads
// @access  Private
const createLead = async (req, res, next) => {
  try {
    const { name, phone, email, source, status, tags, budget } = req.body;
 
    if (!name || !phone) {
      res.status(400);
      throw new Error('Name and phone are required');
    }
 
    // Agent hamesha khud ko hi assign hoga (chahe body mein kuch aur bheja ho) —
    // sirf admin/superadmin kisi doosre agent ko assign kar sakte hain
    const isAgent = req.user.role === 'agent';
    const assignedTo = isAgent ? req.user._id : (req.body.assignedTo || req.user._id);
 
    const lead = await Lead.create({
      companyId: req.companyId,
      name,
      phone,
      email,
      source,
      status,
      tags,
      budget,
      assignedTo,
    });
 
    res.status(201).json({ message: 'Lead created successfully', lead });
  } catch (error) {
    next(error);
  }
};
 
// @desc    Get all leads for the logged-in user's company (with filters + pagination)
// @route   GET /api/leads?status=new&source=website&page=1&limit=10&search=ravi
// @access  Private
const getLeads = async (req, res, next) => {
  try {
    const { status, source, assignedTo, search, page = 1, limit = 20 } = req.query;
 
    const query = { companyId: req.companyId }; // multi-tenant safety — sirf apni company ke leads
 
    // Agent ko sirf apne assigned leads dikhein — admin/superadmin sabko dekh sakte hain
    if (req.user.role === 'agent') {
      query.assignedTo = req.user._id;
    } else if (assignedTo) {
      query.assignedTo = assignedTo;
    }
 
    if (status) query.status = status;
    if (source) query.source = source;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
 
    const skip = (Number(page) - 1) * Number(limit);
 
    const [leads, total] = await Promise.all([
      Lead.find(query)
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Lead.countDocuments(query),
    ]);
 
    res.status(200).json({
      leads,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};
 
// @desc    Get single lead by id
// @route   GET /api/leads/:id
// @access  Private
const getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findOne({
      _id: req.params.id,
      companyId: req.companyId, // dusri company ka lead access na ho paye
    }).populate('assignedTo', 'name email');
 
    if (!lead) {
      res.status(404);
      throw new Error('Lead not found');
    }
 
    // Agent sirf apna assigned lead dekh sakta hai
    if (req.user.role === 'agent' && String(lead.assignedTo?._id) !== String(req.user._id)) {
      res.status(403);
      throw new Error('You can only view leads assigned to you');
    }
 
    res.status(200).json({ lead });
  } catch (error) {
    next(error);
  }
};
 
// @desc    Update a lead
// @route   PUT /api/leads/:id
// @access  Private
const updateLead = async (req, res, next) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, companyId: req.companyId });
 
    if (!lead) {
      res.status(404);
      throw new Error('Lead not found');
    }
 
    const isAgent = req.user.role === 'agent';
 
    if (isAgent && String(lead.assignedTo) !== String(req.user._id)) {
      res.status(403);
      throw new Error('You can only update leads assigned to you');
    }
 
    const allowedFields = [
      'name', 'phone', 'email', 'source', 'status',
      'tags', 'budget', 'assignedTo', 'lastContactedAt',
    ];
 
    allowedFields.forEach((field) => {
      // Agent apne lead ko kisi aur ko reassign nahi kar sakta
      if (field === 'assignedTo' && isAgent) return;
      if (req.body[field] !== undefined) {
        lead[field] = req.body[field];
      }
    });
 
    await lead.save();
 
    res.status(200).json({ message: 'Lead updated successfully', lead });
  } catch (error) {
    next(error);
  }
};
 
// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private
const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, companyId: req.companyId });
 
    if (!lead) {
      res.status(404);
      throw new Error('Lead not found');
    }
 
    if (req.user.role === 'agent' && String(lead.assignedTo) !== String(req.user._id)) {
      res.status(403);
      throw new Error('You can only delete leads assigned to you');
    }
 
    await lead.deleteOne();
 
    res.status(200).json({ message: 'Lead deleted successfully' });
  } catch (error) {
    next(error);
  }
};
 
// @desc    Quick stats for dashboard (count by status)
// @route   GET /api/leads/stats
// @access  Private
const getLeadStats = async (req, res, next) => {
  try {
    const matchStage = { companyId: new mongoose.Types.ObjectId(req.companyId) };
    if (req.user.role === 'agent') {
      matchStage.assignedTo = new mongoose.Types.ObjectId(req.user._id);
    }
 
    const stats = await Lead.aggregate([
      { $match: matchStage },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
 
    const total = await Lead.countDocuments(matchStage);
 
    res.status(200).json({ total, breakdown: stats });
  } catch (error) {
    next(error);
  }
};
 
module.exports = { createLead, getLeads, getLeadById, updateLead, deleteLead, getLeadStats };