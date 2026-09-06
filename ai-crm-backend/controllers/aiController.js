const Conversation = require('../models/Conversation');
const Lead = require('../models/Lead');
const Company = require('../models/Company');
const { getAIReply, scoreConversation } = require('../services/aiService');

// @desc    Customer se message aata hai, AI reply generate karke conversation mein save karta hai
// @route   POST /api/ai/chat
// @access  Private (agent/admin ki taraf se test ke liye; real mein website widget/WhatsApp webhook isse call karega)
// body: { leadId, message, channel }
const chatWithAI = async (req, res, next) => {
  try {
    const { leadId, message, channel } = req.body;

    if (!leadId || !message) {
      res.status(400);
      throw new Error('leadId and message are required');
    }

    const lead = await Lead.findOne({ _id: leadId, companyId: req.companyId });
    if (!lead) {
      res.status(404);
      throw new Error('Lead not found');
    }

    const company = await Company.findById(req.companyId);

    // Existing active conversation dhoondo, nahi to nayi banao
    let conversation = await Conversation.findOne({
      leadId,
      companyId: req.companyId,
      status: 'active',
    });

    if (!conversation) {
      conversation = await Conversation.create({
        companyId: req.companyId,
        leadId,
        channel: channel || 'website_chat',
        messages: [],
      });
    }

    // Customer ka message add karo
    conversation.messages.push({ sender: 'customer', text: message });

    // Agar company ne auto-reply off kar rakha hai, to AI reply skip karo
    if (company?.aiSettings?.autoReplyEnabled === false) {
      await conversation.save();
      return res.status(200).json({
        message: 'Message logged, auto-reply is disabled for this company',
        conversation,
      });
    }

    // AI se reply lo (poori conversation history context ke saath)
    const aiReplyText = await getAIReply({
      company,
      lead,
      messages: conversation.messages,
    });

    conversation.messages.push({ sender: 'ai', text: aiReplyText });
    await conversation.save();

    // Lead ka lastContactedAt update kar do
    lead.lastContactedAt = new Date();
    if (lead.status === 'new') lead.status = 'contacted';
    await lead.save();

    res.status(200).json({
      reply: aiReplyText,
      conversationId: conversation._id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get full conversation history for a lead
// @route   GET /api/ai/conversation/:leadId
// @access  Private
const getConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({
      leadId: req.params.leadId,
      companyId: req.companyId,
    }).sort({ createdAt: -1 });

    if (!conversation) {
      return res.status(200).json({ conversation: null, messages: [] });
    }

    res.status(200).json({ conversation });
  } catch (error) {
    next(error);
  }
};

// @desc    Conversation analyze karke lead ko score + summary do
// @route   POST /api/ai/score/:leadId
// @access  Private
const scoreLead = async (req, res, next) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.leadId, companyId: req.companyId });
    if (!lead) {
      res.status(404);
      throw new Error('Lead not found');
    }

    const conversation = await Conversation.findOne({
      leadId: lead._id,
      companyId: req.companyId,
    }).sort({ createdAt: -1 });

    if (!conversation || conversation.messages.length === 0) {
      res.status(400);
      throw new Error('No conversation found for this lead yet');
    }

    const company = await Company.findById(req.companyId);

    const { score, summary } = await scoreConversation({
      company,
      lead,
      messages: conversation.messages,
    });

    lead.aiScore = score;
    lead.aiSummary = summary;
    await lead.save();

    res.status(200).json({ message: 'Lead scored successfully', score, summary, lead });
  } catch (error) {
    next(error);
  }
};

module.exports = { chatWithAI, getConversation, scoreLead };
