import React, { useState, useRef, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Bot, Send, ChevronRight, CheckCircle, AlertTriangle, BookOpen, ExternalLink } from 'lucide-react';
import { PageLayout } from '../components/layout/Layout';
import { PageHeader, Card, GovButton, DemoBanner, LoadingOverlay } from '../components/ui';
import { researchQuestions, researchResponses } from '../data/research';

const TYPING_DELAY = 1800;

function SourceBadge({ source }) {
  return (
    <div className="flex items-center gap-2 py-1.5 border-b border-gray-100 last:border-0">
      <CheckCircle size={13} className="text-[#1a6b3c] shrink-0" />
      <span className="text-xs text-gray-700">{source.name}</span>
      <span className="ml-auto text-[10px] text-gray-400 font-medium">{source.year}</span>
    </div>
  );
}

function ChartBlock({ data, chartType, chartKeys, xKey = 'year' }) {
  if (!data || !chartKeys) return null;
  return (
    <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">DATA VISUALIZATION</p>
      <ResponsiveContainer width="100%" height={200}>
        {chartType === 'line' ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
            <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={v => typeof v === 'number' && v > 9999 ? `${(v/1000).toFixed(0)}k` : v} />
            <Tooltip />
            <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
            {chartKeys.map(k => (
              <Line key={k.key} type="monotone" dataKey={k.key} stroke={k.color} strokeWidth={2} dot={{ r: 3 }} name={k.label} />
            ))}
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
            <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={v => typeof v === 'number' && v > 9999 ? `${(v/1000).toFixed(0)}k` : v} />
            <Tooltip />
            <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
            {chartKeys.map(k => (
              <Bar key={k.key} dataKey={k.key} fill={k.color} name={k.label} radius={[3,3,0,0]} />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

function MessageBubble({ msg }) {
  if (msg.role === 'user') {
    return (
      <div className="flex justify-end mb-4">
        <div className="bg-[#0f2d5c] text-white rounded-xl rounded-br-none px-4 py-3 max-w-[80%] text-sm">
          {msg.content}
        </div>
      </div>
    );
  }

  const resp = msg.response;
  return (
    <div className="flex gap-3 mb-6">
      <div className="w-8 h-8 rounded-full bg-[#1a6b3c] flex items-center justify-center shrink-0 mt-1">
        <Bot size={16} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-white border border-gray-200 rounded-xl rounded-tl-none shadow-sm p-4">
          {/* Answer */}
          <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap prose-sm">
            {resp.answer.split(/\*\*(.*?)\*\*/g).map((part, i) =>
              i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
            )}
          </div>

          {/* Chart */}
          {resp.chartData && (
            <ChartBlock
              data={resp.chartData}
              chartType={resp.chartType}
              chartKeys={resp.chartKeys}
              xKey={resp.xKey}
            />
          )}

          {/* Sources */}
          {resp.sources && (
            <div className="mt-4 border-t border-gray-100 pt-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <BookOpen size={11} /> SOURCES
                </p>
                <span className="text-[10px] font-bold text-[#1a6b3c] bg-green-50 px-2 py-0.5 rounded">
                  {resp.groundedness}% DATA GROUNDED
                </span>
              </div>
              {resp.sources.map((s, i) => <SourceBadge key={i} source={s} />)}
            </div>
          )}
        </div>

        <p className="text-[10px] text-gray-400 mt-1.5 ml-1 flex items-center gap-1">
          <AlertTriangle size={10} className="text-amber-400" />
          Simulated AI response for prototype. Not real AI.
        </p>
      </div>
    </div>
  );
}

export default function AIResearchPage() {
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages, typing]);

  const sendMessage = (question) => {
    const q = question || inputVal.trim();
    if (!q) return;
    setInputVal('');

    setMessages(prev => [...prev, { role: 'user', content: q }]);
    setTyping(true);

    setTimeout(() => {
      const resp = researchResponses[q] || {
        answer: `Based on available land records and spatial data for the query: "${q}"\n\nThis query matches partial data in our knowledge base. For a detailed analysis, please try one of the predefined research questions or consult the full analytics dashboard for regional land-use statistics.\n\nOur system has indexed data from ISRO Bhuvan, State Revenue Departments, and the National Cadastral Survey 2023-24 covering all 28+ states.`,
        sources: [
          { name: "National Cadastral Survey 2023-24", verified: true, year: "2024" },
          { name: "State Revenue Dept Records", verified: true, year: "2024" },
        ],
        groundedness: 72.0,
        chartData: null
      };
      setTyping(false);
      setMessages(prev => [...prev, { role: 'assistant', response: resp }]);
    }, TYPING_DELAY);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <PageLayout>
      <PageHeader
        label="AI LAND RESEARCH ASSISTANT"
        title="AI Research Assistant"
        subtitle="Explore land-use trends, policies and research using natural-language questions."
        actions={<DemoBanner message="SIMULATED AI · NO REAL API · DEMO PROTOTYPE" />}
      />

      <div className="flex h-[calc(100vh-175px)]">
        {/* Left: Demo questions */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-hidden">
          <div className="p-3 border-b border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">DEMO QUESTIONS</p>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {researchQuestions.map((q, i) => (
              <button key={i}
                onClick={() => sendMessage(q)}
                disabled={typing}
                className="w-full text-left text-xs text-gray-700 bg-gray-50 hover:bg-[#0f2d5c]/5 hover:text-[#0f2d5c] border border-gray-100 hover:border-[#0f2d5c]/20 rounded-lg p-3 transition-all flex items-start gap-2 disabled:opacity-50">
                <ChevronRight size={13} className="mt-0.5 shrink-0 text-gray-400" />
                {q}
              </button>
            ))}
          </div>

          {/* Research library links */}
          <div className="border-t border-gray-200 p-3 space-y-1.5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">RESOURCES</p>
            {[
              'ISRO Bhuvan Portal',
              'Maharashtra Land Records',
              'DILRMP Dashboard',
              'Census Data 2021',
            ].map(r => (
              <div key={r} className="flex items-center gap-2 text-xs text-gray-500 hover:text-[#0f2d5c] cursor-pointer transition-colors">
                <ExternalLink size={11} /> {r}
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-[#f8fafb] overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-2">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 bg-[#0f2d5c] rounded-2xl flex items-center justify-center mb-4">
                  <Bot size={32} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">AI Land Research Assistant</h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  Ask questions about land use, agricultural trends, policies, or specific parcels.
                  Select a demo question on the left or type your own.
                </p>
                <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 mt-4">
                  ⚠ Prototype — responses are simulated for demonstration purposes
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} />
            ))}

            {typing && (
              <div className="flex gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#1a6b3c] flex items-center justify-center shrink-0">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-xl rounded-tl-none shadow-sm px-5 py-4">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">Analyzing land data...</p>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 bg-white p-4">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder="Ask about land use, policies, or specific regions..."
                disabled={typing}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0f2d5c] focus:ring-2 focus:ring-[#0f2d5c]/10 disabled:bg-gray-50"
              />
              <button type="submit" disabled={typing || !inputVal.trim()}
                className="bg-[#0f2d5c] hover:bg-[#1a3f7a] text-white rounded-lg px-5 py-3 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm font-medium">
                <Send size={16} />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
            <p className="text-[10px] text-gray-400 mt-2 text-center">
              Simulated AI · Data grounded in ISRO, Revenue Dept, DILRMP records · Prototype only
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
