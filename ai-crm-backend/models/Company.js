const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    industry: {
      type: String,
      default: 'general',
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    subscriptionPlan: {
      type: String,
      enum: ['free', 'basic', 'pro'],
      default: 'free',
    },
    subscriptionStatus: {
      type: String,
      enum: ['active', 'expired', 'trial'],
      default: 'trial',
    },
    aiSettings: {
      tone: { type: String, default: 'friendly' },
      customPrompt: { type: String, default: '' },
      autoReplyEnabled: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);
