const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Deal title is required'],
      trim: true,
    },
    value: {
      type: Number,
      default: 0,
    },
    stage: {
      type: String,
      enum: ['prospecting', 'proposal', 'negotiation', 'closed_won', 'closed_lost'],
      default: 'prospecting',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    expectedCloseDate: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Deal', dealSchema);
