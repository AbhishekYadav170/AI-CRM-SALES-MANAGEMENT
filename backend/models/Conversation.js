const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      enum: ['customer', 'ai', 'agent'],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const conversationSchema = new mongoose.Schema(
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
      index: true,
    },
    channel: {
      type: String,
      enum: ['website_chat', 'whatsapp', 'email'],
      default: 'website_chat',
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'handed_to_agent'],
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Conversation', conversationSchema);
