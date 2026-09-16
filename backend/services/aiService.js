const aiConfig = require('../config/aiConfig');

/**
 * ============================================================
 *  UNIFIED AI SERVICE
 *  Teeno providers (Claude, OpenAI, Gemini) ke liye ek hi function
 *  use hota hai poore app mein: getAIReply()
 *  Provider .env ke AI_PROVIDER variable se decide hota hai.
 * ============================================================
 */

// ---------- CLAUDE ----------
async function callClaude(systemPrompt, messages) {
  const { apiKey, model, url } = aiConfig.claude;
  if (!apiKey) throw new Error('CLAUDE_API_KEY missing in .env');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 500,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.sender === 'ai' ? 'assistant' : 'user',
        content: m.text,
      })),
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || 'Claude API error');

  return data.content?.[0]?.text?.trim() || '';
}

// ---------- OPENAI ----------
async function callOpenAI(systemPrompt, messages) {
  const { apiKey, model, url } = aiConfig.openai;
  if (!apiKey) throw new Error('OPENAI_API_KEY missing in .env');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((m) => ({
          role: m.sender === 'ai' ? 'assistant' : 'user',
          content: m.text,
        })),
      ],
      max_tokens: 500,
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || 'OpenAI API error');

  return data.choices?.[0]?.message?.content?.trim() || '';
}

// ---------- GEMINI ----------
async function callGemini(systemPrompt, messages) {
  const { apiKey, model, url } = aiConfig.gemini;
  if (!apiKey) throw new Error('GEMINI_API_KEY missing in .env');

  // Gemini mein system prompt ko pehle user turn ke saath prepend karte hain
  const contents = messages.map((m) => ({
    role: m.sender === 'ai' ? 'model' : 'user',
    parts: [{ text: m.text }],
  }));

  const response = await fetch(url(model, apiKey), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents,
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || 'Gemini API error');

  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
}

/**
 * Build a system prompt from company settings + lead context.
 * Yehi prompt tay karta hai AI ka tone aur behaviour.
 */
function buildSystemPrompt(company, lead) {
  const tone = company?.aiSettings?.tone || 'friendly';
  const customPrompt = company?.aiSettings?.customPrompt || '';

  return `Tum ${company?.name || 'is business'} ke sales assistant ho.
Tumhara tone ${tone} hona chahiye.
Customer ka naam ${lead?.name || 'unknown'} hai, unka interest/budget: ${lead?.budget || 'not specified'}.

Tumhara kaam hai:
1. Customer ke sawaalon ka helpful jawab dena
2. Unki requirement (budget, event date, preferences) samajhna
3. Agar customer serious lage, unse phone number/contact time confirm karna
4. Kabhi bhi jhoothi jaankari mat dena — agar pata na ho to bolo "team se confirm karke batata hoon"

${customPrompt ? `Business-specific instructions: ${customPrompt}` : ''}

Chhote, natural, conversational replies do — jaise ek real sales person baat karta hai.`;
}

/**
 * Main function — poore app mein yehi call hoga.
 * messages = [{ sender: 'customer'|'ai', text: '...' }, ...]
 */
async function getAIReply({ company, lead, messages }) {
  const systemPrompt = buildSystemPrompt(company, lead);

  switch (aiConfig.provider) {
    case 'openai':
      return callOpenAI(systemPrompt, messages);
    case 'gemini':
      return callGemini(systemPrompt, messages);
    case 'claude':
    default:
      return callClaude(systemPrompt, messages);
  }
}

/**
 * Conversation ko analyze karke lead score (1-10) aur summary generate karta hai.
 */
async function scoreConversation({ company, lead, messages }) {
  const transcript = messages.map((m) => `${m.sender}: ${m.text}`).join('\n');

  const scoringPrompt = `Neeche ek sales conversation ka transcript hai. Ise analyze karo aur SIRF valid JSON return karo, koi extra text nahi, koi markdown formatting nahi. Format:
{"score": <1-10 integer, kitna serious/hot yeh lead hai>, "summary": "<2-3 lines mein conversation ka summary, Hinglish mein>"}

Transcript:
${transcript}`;

  const rawReply = await getAIReply({
    company,
    lead,
    messages: [{ sender: 'customer', text: scoringPrompt }],
  });

  try {
    // AI kabhi kabhi ```json fences laga deta hai, unhe hata dete hain
    const cleaned = rawReply.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return {
      score: Number(parsed.score) || 5,
      summary: parsed.summary || '',
    };
  } catch (err) {
    // Agar AI ne valid JSON nahi diya, safe fallback do
    return { score: 5, summary: 'AI summary generate nahi ho paya — manually review karein.' };
  }
}

module.exports = { getAIReply, scoreConversation };
