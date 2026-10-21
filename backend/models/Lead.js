const mongoose = require('mongoose');


const leadSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true, // fast lookups jab companyId se filter karenge
    },
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: '',
    },
    source: {
      type: String,
      enum: ['website', 'whatsapp', 'facebook', 'manual', 'referral'],
      default: 'manual',
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'negotiation', 'won', 'lost'],
      default: 'new',
    },
    aiScore: {
      type: Number,
      min: 0,
      max: 10,
      default: null, // jab tak AI analyze na kare, null rahega
    },
    aiSummary: {
      type: String,
      default: '',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
    budget: {
      type: String,
      default: '',
    },
    lastContactedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Ek hi company ke andar duplicate phone number wale leads na banein
leadSchema.index({ companyId: 1, phone: 1 }, { unique: true });

module.exports = mongoose.model('Lead', leadSchema);
