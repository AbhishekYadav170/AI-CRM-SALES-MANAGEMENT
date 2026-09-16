// import { useEffect, useRef, useState } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import Sidebar from '../components/Sidebar';
// import api from '../services/api';

// export default function LeadDetail() {
//   const { id } = useParams();
//   const [lead, setLead] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [sending, setSending] = useState(false);
//   const [scoring, setScoring] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const bottomRef = useRef(null);

//   const fetchLead = async () => {
//     const { data } = await api.get(`/leads/${id}`);
//     setLead(data.lead);
//   };

//   const fetchConversation = async () => {
//     const { data } = await api.get(`/ai/conversation/${id}`);
//     setMessages(data.conversation?.messages || []);
//   };

//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);
//       await Promise.all([fetchLead(), fetchConversation()]);
//       setLoading(false);
//     };
//     load();
//   }, [id]);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const customerMsg = { sender: 'customer', text: input, timestamp: new Date() };
//     setMessages((prev) => [...prev, customerMsg]);
//     setInput('');
//     setSending(true);

//     try {
//       const { data } = await api.post('/ai/chat', {
//         leadId: id,
//         message: customerMsg.text,
//         channel: 'website_chat',
//       });
//       setMessages((prev) => [...prev, { sender: 'ai', text: data.reply, timestamp: new Date() }]);
//     } catch (err) {
//       setMessages((prev) => [
//         ...prev,
//         { sender: 'ai', text: `⚠️ Error: ${err.response?.data?.message || 'AI reply fail hui'}`, timestamp: new Date() },
//       ]);
//     } finally {
//       setSending(false);
//     }
//   };

//   const handleScore = async () => {
//     setScoring(true);
//     try {
//       const { data } = await api.post(`/ai/score/${id}`);
//       setLead(data.lead);
//     } catch (err) {
//       alert(err.response?.data?.message || 'Scoring failed');
//     } finally {
//       setScoring(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex">
//         <Sidebar />
//         <main className="flex-1 p-8 text-slate-500">Loading...</main>
//       </div>
//     );
//   }

//   return (
//     <div className="flex">
//       <Sidebar />
//       <main className="flex-1 p-8">
//         <Link to="/leads" className="text-sm text-indigo-600 hover:underline">← Back to Leads</Link>

//         <div className="grid grid-cols-3 gap-6 mt-4">
//           {/* Lead Info Panel */}
//           <div className="col-span-1 bg-white rounded-xl border border-slate-200 p-6 h-fit">
//             <h2 className="text-xl font-bold text-slate-800">{lead.name}</h2>
//             <p className="text-sm text-slate-500 mb-4 capitalize">{lead.status} · {lead.source}</p>

//             <dl className="space-y-3 text-sm">
//               <div><dt className="text-slate-400">Phone</dt><dd className="text-slate-700 font-medium">{lead.phone}</dd></div>
//               <div><dt className="text-slate-400">Email</dt><dd className="text-slate-700 font-medium">{lead.email || '—'}</dd></div>
//               <div><dt className="text-slate-400">Budget</dt><dd className="text-slate-700 font-medium">{lead.budget || '—'}</dd></div>
//             </dl>

//             <div className="mt-6 pt-6 border-t border-slate-100">
//               <div className="flex items-center justify-between mb-2">
//                 <span className="text-sm font-semibold text-slate-700">AI Score</span>
//                 {lead.aiScore !== null && (
//                   <span className={`text-lg font-bold ${lead.aiScore >= 7 ? 'text-green-600' : lead.aiScore >= 4 ? 'text-amber-600' : 'text-red-600'}`}>
//                     {lead.aiScore}/10
//                   </span>
//                 )}
//               </div>
//               {lead.aiSummary && (
//                 <p className="text-xs text-slate-500 leading-relaxed">{lead.aiSummary}</p>
//               )}
//               <button
//                 onClick={handleScore}
//                 disabled={scoring || messages.length === 0}
//                 className="mt-4 w-full text-sm bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
//               >
//                 {scoring ? 'Analyzing...' : '✨ Score This Lead with AI'}
//               </button>
//               {messages.length === 0 && (
//                 <p className="text-xs text-slate-400 mt-2">Pehle conversation shuru karein, phir score karein.</p>
//               )}
//             </div>
//           </div>

//           {/* Chat Panel */}
//           <div className="col-span-2 bg-white rounded-xl border border-slate-200 flex flex-col h-[600px]">
//             <div className="px-6 py-4 border-b border-slate-100">
//               <h3 className="font-semibold text-slate-800">💬 AI Conversation Simulator</h3>
//               <p className="text-xs text-slate-400">Customer ki taraf se message type karke AI ka reply dekhein</p>
//             </div>

//             <div className="flex-1 overflow-y-auto p-6 space-y-4">
//               {messages.length === 0 && (
//                 <p className="text-sm text-slate-400 text-center mt-10">
//                   Abhi tak koi message nahi. Neeche se ek message bhejein, jaise ek customer bhejta.
//                 </p>
//               )}
//               {messages.map((m, i) => (
//                 <div key={i} className={`flex ${m.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
//                   <div
//                     className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
//                       m.sender === 'customer'
//                         ? 'bg-indigo-600 text-white rounded-br-sm'
//                         : 'bg-slate-100 text-slate-800 rounded-bl-sm'
//                     }`}
//                   >
//                     <p>{m.text}</p>
//                     <span className={`text-[10px] block mt-1 ${m.sender === 'customer' ? 'text-indigo-200' : 'text-slate-400'}`}>
//                       {m.sender === 'ai' ? '🤖 AI Assistant' : '👤 Customer'}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//               {sending && (
//                 <div className="flex justify-start">
//                   <div className="bg-slate-100 text-slate-400 px-4 py-2.5 rounded-2xl text-sm rounded-bl-sm">
//                     AI type kar raha hai...
//                   </div>
//                 </div>
//               )}
//               <div ref={bottomRef} />
//             </div>

//             <form onSubmit={handleSend} className="p-4 border-t border-slate-100 flex gap-2">
//               <input
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 placeholder="Customer ki taraf se message likhein..."
//                 className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//               <button
//                 type="submit"
//                 disabled={sending}
//                 className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 rounded-lg transition disabled:opacity-60"
//               >
//                 Send
//               </button>
//             </form>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }




// import { useEffect, useRef, useState } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import Sidebar from '../components/Sidebar';
// import api from '../services/api';

// // AI kabhi kabhi **bold** markdown bhej deta hai — isse actual bold text mein render karte hain
// // (bina kisi extra markdown library install kiye, simple regex split se)
// function renderMessageText(text) {
//   const lines = text.split('\n');
//   return lines.map((line, lineIdx) => {
//     const parts = line.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
//     return (
//       <span key={lineIdx} className="block">
//         {parts.map((part, i) => {
//           if (part.startsWith('**') && part.endsWith('**')) {
//             return <strong key={i}>{part.slice(2, -2)}</strong>;
//           }
//           return <span key={i}>{part}</span>;
//         })}
//       </span>
//     );
//   });
// }

// export default function LeadDetail() {
//   const { id } = useParams();
//   const [lead, setLead] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [sending, setSending] = useState(false);
//   const [scoring, setScoring] = useState(false);
//    const [dealMsg, setDealMsg] = useState('');
//   const [loading, setLoading] = useState(true);
//   const bottomRef = useRef(null);

//   const fetchLead = async () => {
//     const { data } = await api.get(`/leads/${id}`);
//     setLead(data.lead);
//   };

//   const fetchConversation = async () => {
//     const { data } = await api.get(`/ai/conversation/${id}`);
//     setMessages(data.conversation?.messages || []);
//   };

//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);
//       await Promise.all([fetchLead(), fetchConversation()]);
//       setLoading(false);
//     };
//     load();
//   }, [id]);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const customerMsg = { sender: 'customer', text: input, timestamp: new Date() };
//     setMessages((prev) => [...prev, customerMsg]);
//     setInput('');
//     setSending(true);

//     try {
//       const { data } = await api.post('/ai/chat', {
//         leadId: id,
//         message: customerMsg.text,
//         channel: 'website_chat',
//       });
//       setMessages((prev) => [...prev, { sender: 'ai', text: data.reply, timestamp: new Date() }]);
//     } catch (err) {
//       setMessages((prev) => [
//         ...prev,
//         { sender: 'ai', text: `⚠️ Error: ${err.response?.data?.message || 'AI reply fail hui'}`, timestamp: new Date() },
//       ]);
//     } finally {
//       setSending(false);
//     }
//   };

//   const handleScore = async () => {
//     setScoring(true);
//     try {
//       const { data } = await api.post(`/ai/score/${id}`);
//       setLead(data.lead);
//     } catch (err) {
//       alert(err.response?.data?.message || 'Scoring failed');
//     } finally {
//       setScoring(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex">
//         <Sidebar />
//         <main className="flex-1 p-8 text-slate-500">Loading...</main>
//       </div>
//     );
//   }

//   return (
//     <div className="flex">
//       <Sidebar />
//       <main className="flex-1 p-8">
//         <Link to="/leads" className="text-sm text-indigo-600 hover:underline">← Back to Leads</Link>

//         <div className="grid grid-cols-3 gap-6 mt-4">
//           {/* Lead Info Panel */}
//           <div className="col-span-1 bg-white rounded-xl border border-slate-200 p-6 h-fit">
//             <h2 className="text-xl font-bold text-slate-800">{lead.name}</h2>
//             <p className="text-sm text-slate-500 mb-4 capitalize">{lead.status} · {lead.source}</p>

//             <dl className="space-y-3 text-sm">
//               <div><dt className="text-slate-400">Phone</dt><dd className="text-slate-700 font-medium">{lead.phone}</dd></div>
//               <div><dt className="text-slate-400">Email</dt><dd className="text-slate-700 font-medium">{lead.email || '—'}</dd></div>
//               <div><dt className="text-slate-400">Budget</dt><dd className="text-slate-700 font-medium">{lead.budget || '—'}</dd></div>
//             </dl>

//             <div className="mt-6 pt-6 border-t border-slate-100">
//               <div className="flex items-center justify-between mb-2">
//                 <span className="text-sm font-semibold text-slate-700">AI Score</span>
//                 {lead.aiScore !== null && (
//                   <span className={`text-lg font-bold ${lead.aiScore >= 7 ? 'text-green-600' : lead.aiScore >= 4 ? 'text-amber-600' : 'text-red-600'}`}>
//                     {lead.aiScore}/10
//                   </span>
//                 )}
//               </div>
//               {lead.aiSummary && (
//                 <p className="text-xs text-slate-500 leading-relaxed">{lead.aiSummary}</p>
//               )}
//               <button
//                 onClick={handleScore}
//                 disabled={scoring || messages.length === 0}
//                 className="mt-4 w-full text-sm bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
//               >
//                 {scoring ? 'Analyzing...' : '✨ Score This Lead with AI'}
//               </button>
//               {messages.length === 0 && (
//                 <p className="text-xs text-slate-400 mt-2">Pehle conversation shuru karein, phir score karein.</p>
//               )}
//             </div>
//           </div>

//           {/* Chat Panel */}
//           <div className="col-span-2 bg-white rounded-xl border border-slate-200 flex flex-col h-[600px]">
//             <div className="px-6 py-4 border-b border-slate-100">
//               <h3 className="font-semibold text-slate-800">💬 AI Conversation Simulator</h3>
//               <p className="text-xs text-slate-400">Customer ki taraf se message type karke AI ka reply dekhein</p>
//             </div>

//             <div className="flex-1 overflow-y-auto p-6 space-y-4">
//               {messages.length === 0 && (
//                 <p className="text-sm text-slate-400 text-center mt-10">
//                   Abhi tak koi message nahi. Neeche se ek message bhejein, jaise ek customer bhejta.
//                 </p>
//               )}
//               {messages.map((m, i) => (
//                 <div key={i} className={`flex ${m.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
//                   <div
//                     className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
//                       m.sender === 'customer'
//                         ? 'bg-indigo-600 text-white rounded-br-sm'
//                         : 'bg-slate-100 text-slate-800 rounded-bl-sm'
//                     }`}
//                   >
//                     <p>{renderMessageText(m.text)}</p>
//                     <span className={`text-[10px] block mt-1 ${m.sender === 'customer' ? 'text-indigo-200' : 'text-slate-400'}`}>
//                       {m.sender === 'ai' ? '🤖 AI Assistant' : '👤 Customer'}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//               {sending && (
//                 <div className="flex justify-start">
//                   <div className="bg-slate-100 text-slate-400 px-4 py-2.5 rounded-2xl text-sm rounded-bl-sm">
//                     AI type kar raha hai...
//                   </div>
//                 </div>
//               )}
//               <div ref={bottomRef} />
//             </div>

//             <form onSubmit={handleSend} className="p-4 border-t border-slate-100 flex gap-2">
//               <input
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 placeholder="Customer ki taraf se message likhein..."
//                 className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//               <button
//                 type="submit"
//                 disabled={sending}
//                 className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 rounded-lg transition disabled:opacity-60"
//               >
//                 Send
//               </button>
//             </form>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }



import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import api from '../services/api';

// AI kabhi kabhi **bold** markdown bhej deta hai — isse actual bold text mein render karte hain
// (bina kisi extra markdown library install kiye, simple regex split se)
function renderMessageText(text) {
  const lines = text.split('\n');
  return lines.map((line, lineIdx) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
    return (
      <span key={lineIdx} className="block">
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
          }
          return <span key={i}>{part}</span>;
        })}
      </span>
    );
  });
}

export default function LeadDetail() {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [scoring, setScoring] = useState(false);
  const [dealMsg, setDealMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  const fetchLead = async () => {
    const { data } = await api.get(`/leads/${id}`);
    setLead(data.lead);
  };

  const fetchConversation = async () => {
    const { data } = await api.get(`/ai/conversation/${id}`);
    setMessages(data.conversation?.messages || []);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchLead(), fetchConversation()]);
      setLoading(false);
    };
    load();
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const customerMsg = { sender: 'customer', text: input, timestamp: new Date() };
    setMessages((prev) => [...prev, customerMsg]);
    setInput('');
    setSending(true);

    try {
      const { data } = await api.post('/ai/chat', {
        leadId: id,
        message: customerMsg.text,
        channel: 'website_chat',
      });
      setMessages((prev) => [...prev, { sender: 'ai', text: data.reply, timestamp: new Date() }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: `⚠️ Error: ${err.response?.data?.message || 'AI reply fail hui'}`, timestamp: new Date() },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleScore = async () => {
    setScoring(true);
    try {
      const { data } = await api.post(`/ai/score/${id}`);
      setLead(data.lead);
    } catch (err) {
      alert(err.response?.data?.message || 'Scoring failed');
    } finally {
      setScoring(false);
    }
  };

  const handleCreateDeal = async () => {
    setDealMsg('Creating...');
    try {
      await api.post('/deals', {
        leadId: lead._id,
        title: `${lead.name} - Deal`,
        stage: 'prospecting',
      });
      setDealMsg('✅ Deal created! Check the Deals tab.');
    } catch (err) {
      setDealMsg(err.response?.data?.message || 'Failed to create deal');
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 text-slate-500">Loading...</main>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <Link to="/leads" className="text-sm text-indigo-600 hover:underline">← Back to Leads</Link>

        <div className="grid grid-cols-3 gap-6 mt-4">
          {/* Lead Info Panel */}
          <div className="col-span-1 bg-white rounded-xl border border-slate-200 p-6 h-fit">
            <h2 className="text-xl font-bold text-slate-800">{lead.name}</h2>
            <p className="text-sm text-slate-500 mb-4 capitalize">{lead.status} · {lead.source}</p>

            <dl className="space-y-3 text-sm">
              <div><dt className="text-slate-400">Phone</dt><dd className="text-slate-700 font-medium">{lead.phone}</dd></div>
              <div><dt className="text-slate-400">Email</dt><dd className="text-slate-700 font-medium">{lead.email || '—'}</dd></div>
              <div><dt className="text-slate-400">Budget</dt><dd className="text-slate-700 font-medium">{lead.budget || '—'}</dd></div>
            </dl>

            <button
              onClick={handleCreateDeal}
              className="mt-4 w-full text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition"
            >
              🤝 Convert to Deal
            </button>
            {dealMsg && <p className="text-xs text-slate-500 mt-2">{dealMsg}</p>}

            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">AI Score</span>
                {lead.aiScore !== null && (
                  <span className={`text-lg font-bold ${lead.aiScore >= 7 ? 'text-green-600' : lead.aiScore >= 4 ? 'text-amber-600' : 'text-red-600'}`}>
                    {lead.aiScore}/10
                  </span>
                )}
              </div>
              {lead.aiSummary && (
                <p className="text-xs text-slate-500 leading-relaxed">{lead.aiSummary}</p>
              )}
              <button
                onClick={handleScore}
                disabled={scoring || messages.length === 0}
                className="mt-4 w-full text-sm bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
              >
                {scoring ? 'Analyzing...' : '✨ Score This Lead with AI'}
              </button>
              {messages.length === 0 && (
                <p className="text-xs text-slate-400 mt-2">Pehle conversation shuru karein, phir score karein.</p>
              )}
            </div>
          </div>

          {/* Chat Panel */}
          <div className="col-span-2 bg-white rounded-xl border border-slate-200 flex flex-col h-[600px]">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">💬 AI Conversation Simulator</h3>
              <p className="text-xs text-slate-400">Customer ki taraf se message type karke AI ka reply dekhein</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <p className="text-sm text-slate-400 text-center mt-10">
                  Abhi tak koi message nahi. Neeche se ek message bhejein, jaise ek customer bhejta.
                </p>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                      m.sender === 'customer'
                        ? 'bg-indigo-600 text-white rounded-br-sm'
                        : 'bg-slate-100 text-slate-800 rounded-bl-sm'
                    }`}
                  >
                    <p>{renderMessageText(m.text)}</p>
                    <span className={`text-[10px] block mt-1 ${m.sender === 'customer' ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {m.sender === 'ai' ? '🤖 AI Assistant' : '👤 Customer'}
                    </span>
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 text-slate-400 px-4 py-2.5 rounded-2xl text-sm rounded-bl-sm">
                    AI type kar raha hai...
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-slate-100 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Customer ki taraf se message likhein..."
                className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={sending}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 rounded-lg transition disabled:opacity-60"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
