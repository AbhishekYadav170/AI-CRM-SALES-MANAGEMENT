const Deal = require("../models/Deal");
const Lead = require("../models/Lead");

const STAGES = [
  "prospecting",
  "proposal",
  "negotiation",
  "closed_won",
  "closed_lost",
];

// @desc    Create a new deal (usually from an existing lead)
// @route   POST /api/deals
// @access  Private
const createDeal = async (req, res, next) => {
  try {
    const { leadId, title, value, stage, expectedCloseDate, notes } = req.body;

    if (!leadId || !title) {
      res.status(400);
      throw new Error("leadId and title are required");
    }

    const lead = await Lead.findOne({ _id: leadId, companyId: req.companyId });
    if (!lead) {
      res.status(404);
      throw new Error("Lead not found");
    }

    const isAgent = req.user.role === "agent";
    const assignedTo = isAgent
      ? req.user._id
      : req.body.assignedTo || req.user._id;

    const deal = await Deal.create({
      companyId: req.companyId,
      leadId,
      title,
      value: value || 0,
      stage: stage || "prospecting",
      assignedTo,
      expectedCloseDate: expectedCloseDate || null,
      notes: notes || "",
    });

    res.status(201).json({ message: "Deal created successfully", deal });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all deals for the company, grouped by stage (kanban-ready)
//          Agent ko sirf apne assigned deals dikhein, admin/superadmin ko sab
// @route   GET /api/deals
// @access  Private
const getDeals = async (req, res, next) => {
  try {
    const query = { companyId: req.companyId };
    if (req.user.role === "agent") {
      query.assignedTo = req.user._id;
    }

    const deals = await Deal.find(query)
      .populate("leadId", "name phone email")
      .populate("assignedTo", "name email")
      .sort({ updatedAt: -1 });

    // Kanban board ke liye stage-wise group kar dete hain
    const board = STAGES.reduce((acc, stage) => {
      acc[stage] = deals.filter((d) => d.stage === stage);
      return acc;
    }, {});

    const totalValue = deals.reduce((sum, d) => sum + (d.value || 0), 0);
    const wonValue = deals
      .filter((d) => d.stage === "closed_won")
      .reduce((sum, d) => sum + (d.value || 0), 0);

    res.status(200).json({
      board,
      stages: STAGES,
      totalValue,
      wonValue,
      count: deals.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a deal (stage, value, notes, etc.) — used for kanban drag-drop
// @route   PUT /api/deals/:id
// @access  Private
const updateDeal = async (req, res, next) => {
  try {
    const deal = await Deal.findOne({
      _id: req.params.id,
      companyId: req.companyId,
    });
    if (!deal) {
      res.status(404);
      throw new Error("Deal not found");
    }

    const isAgent = req.user.role === "agent";
    if (isAgent && String(deal.assignedTo) !== String(req.user._id)) {
      res.status(403);
      throw new Error("You can only update deals assigned to you");
    }

    if (req.body.stage && !STAGES.includes(req.body.stage)) {
      res.status(400);
      throw new Error(`Invalid stage. Must be one of: ${STAGES.join(", ")}`);
    }

    const allowedFields = [
      "title",
      "value",
      "stage",
      "assignedTo",
      "expectedCloseDate",
      "notes",
    ];
    allowedFields.forEach((field) => {
      // Agent apne deal ko kisi aur ko reassign nahi kar sakta
      if (field === "assignedTo" && isAgent) return;
      if (req.body[field] !== undefined) {
        deal[field] = req.body[field];
      }
    });

    await deal.save();
    res.status(200).json({ message: "Deal updated successfully", deal });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a deal
// @route   DELETE /api/deals/:id
// @access  Private
const deleteDeal = async (req, res, next) => {
  try {
    const deal = await Deal.findOne({
      _id: req.params.id,
      companyId: req.companyId,
    });
    if (!deal) {
      res.status(404);
      throw new Error("Deal not found");
    }

    if (
      req.user.role === "agent" &&
      String(deal.assignedTo) !== String(req.user._id)
    ) {
      res.status(403);
      throw new Error("You can only delete deals assigned to you");
    }

    await deal.deleteOne();
    res.status(200).json({ message: "Deal deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { createDeal, getDeals, updateDeal, deleteDeal };
