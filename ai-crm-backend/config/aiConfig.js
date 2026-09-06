// Yeh file decide karta hai konsa AI provider use hoga (.env ke AI_PROVIDER variable se)
// Teeno providers support karte hain: claude, openai, gemini

const aiConfig = {
  provider: process.env.AI_PROVIDER || 'claude', // 'claude' | 'openai' | 'gemini'

  claude: {
    apiKey: process.env.CLAUDE_API_KEY,
    model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-6',
    url: 'https://api.anthropic.com/v1/messages',
  },

  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    url: 'https://api.openai.com/v1/chat/completions',
  },

  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    url: (model, key) =>
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
  },
};

module.exports = aiConfig;
