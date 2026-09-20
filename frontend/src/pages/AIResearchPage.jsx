import React, { useState, useRef, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Bot, Send, ChevronRight, CheckCircle, AlertTriangle, BookOpen, ExternalLink, FileText, Download, Copy, Plus, Users, Check } from 'lucide-react';
import { PageLayout } from '../components/layout/Layout';
import { PageHeader, Card, GovButton, DemoBanner, Badge } from '../components/ui';
import { researchQuestions } from '../data/research';
import { useApp } from '../App';
import { queryResearchAssistant } from '../lib/api';

const researchPapers = [
  {
    id: 'PAPER-2025-01',
    title: 'Decadal Land-Use & Land-Cover (LULC) Dynamics in Western Maharashtra (2015–2025)',
    authors: 'Dr. K. Radhakrishnan, ISRO National Remote Sensing Centre (NRSC)',
    journal: 'Journal of Indian Remote Sensing & Geoinformatics',
    year: '2025',
    category: 'Satellite Telemetry',
    abstract: 'Multispectral remote sensing assessment of peri-urban agrarian land conversion, surface groundwater recharge loss, and urban thermal heat island shifts across Pune and Haveli Talukas.',
    citationAPA: 'Radhakrishnan, K. (2025). Decadal Land-Use & Land-Cover (LULC) Dynamics in Western Maharashtra (2015–2025). Journal of Indian Remote Sensing & Geoinformatics, 53(2), 114–129.',
    citationBibTeX: '@article{radhakrishnan2025decadal, author = {Radhakrishnan, K.}, title = {Decadal Land-Use and Land-Cover Dynamics in Western Maharashtra}, journal = {J. Ind. Remote Sensing}, year = {2025} }',
  },
  {
    id: 'PAPER-2025-02',
    title: 'Digital Public Infrastructure (DPI) in Land Governance & ULPIN Cadastral Interoperability',
    authors: 'Department of Land Resources (DoLR) & NITI Aayog Expert Committee',
    journal: 'Government Policy Monograph Series · DPI Architecture',
    year: '2025',
    category: 'Governance & DPI',
    abstract: 'Technical implementation framework for sovereign 14-digit Unique Land Parcel Identification Number (Bhu-Aadhaar), cryptographic mutation logs, and open GIS API integrations.',
    citationAPA: 'DoLR & NITI Aayog. (2025). Digital Public Infrastructure (DPI) in Land Governance & ULPIN Cadastral Interoperability. Ministry of Rural Development, New Delhi.',
    citationBibTeX: '@techreport{dolr2025dpi, author = {DoLR and NITI Aayog}, title = {DPI in Land Governance & ULPIN Interoperability}, institution = {Govt of India}, year = {2025} }',
  },
  {
    id: 'PAPER-2024-03',
    title: 'Groundwater Drawdown Multipliers under Rapid Peri-Urban Agricultural Conversion',
    authors: 'Central Ground Water Board (CGWB) & Water Resources Regulatory Authority',
    journal: 'Hydro-Geological Survey Bulletin',
    year: '2024',
    category: 'Hydrology & Ecology',
    abstract: 'Empirical data correlating non-agricultural conversion permissions with rapid aquifer depletion in basaltic sub-basins of western Maharashtra.',
    citationAPA: 'CGWB. (2024). Groundwater Drawdown Multipliers under Rapid Peri-Urban Agricultural Conversion. Ministry of Jal Shakti, GoI.',
    citationBibTeX: '@report{cgwb2024groundwater, author = {CGWB}, title = {Groundwater Drawdown Multipliers under Rapid Peri-Urban Conversion}, year = {2024} }',
  },
  {
    id: 'PAPER-2024-04',
    title: 'Multi-Tier Automated Parking & Urban Mobility Corridors in High-Density Indian Heritage Nodes',
    authors: 'Urban Planning Directorate & School of Planning and Architecture',
    journal: 'Indian Journal of Urban Mobility & Transportation',
    year: '2024',
    category: 'Urban Infrastructure',
    abstract: 'Simulated spatial re-engineering for high-density congestion archetypes (Dagdusheth / Core Market node) via mechanized vertical parking paired with pedestrianized green buffers.',
    citationAPA: 'SPA & UATD. (2024). Multi-Tier Automated Parking & Urban Mobility Corridors in High-Density Heritage Nodes. Indian J. Urban Mobility, 19(4), 88–104.',
    citationBibTeX: '@article{spa2024parking, author = {SPA and UATD}, title = {Multi-Tier Automated Parking in High-Density Heritage Nodes}, journal = {Ind. J. Urban Mobility}, year = {2024} }',
  },
];

const initialNotebookNotes = [
  {
    id: 'NOTE-101',
    group: 'COEP Urban Planning (Cohort 4B)',
    parcelRef: 'MH-PN-4091 (Khadakwasla)',
    title: 'Buffer Zone Encroachment along SH-48 Corridor',
    content: 'Observed 18.4 Ha transition from seasonal jowar cultivation to commercial warehousing. Ground check confirms 0.8 km distance to highway without mandated 30m environmental green belt.',
    date: '10 Oct 2026',
    tags: ['Field Survey', 'Zoning Violation', 'Highway Buffer']
  },
  {
    id: 'NOTE-102',
    group: 'Symbiosis Geoinformatics Lab',
    parcelRef: 'MH-PN-4095 (Nanded Village)',
    title: 'Aquifer Inundation & Soil Compaction Analysis',
    content: 'Deep black cotton soil retains high moisture index (NDWI 0.42). Propose retaining agro-forestry zoning to preserve sub-surface percolation into Khadakwasla reservoir.',
    date: '08 Oct 2026',
    tags: ['Ecology', 'Hydrology', 'Soil Health']
  }
];

function SourceBadge({ source }) {
  const { showToast } = useApp();
  const copyCitation = (format = 'APA') => {
    const text = format === 'APA'
      ? `${source.name}. ${source.pageLabel || source.year}. ${source.url || 'Official government source.'}`
      : `@misc{geosynk_${source.year}, author = {${source.name}}, title = {National Land Cadastre Data}, year = {${source.year}}}`;
    navigator.clipboard?.writeText(text);
    showToast(`${format} citation copied to clipboard`, 'success');
  };

  return (
    <div className="flex items-center gap-2 py-1.5 border-b border-gray-100 last:border-0">
      <CheckCircle size={13} className="text-[#1a6b3c] shrink-0" />
      <div className="min-w-0">
        {source.url && source.url !== '#'
          ? <a href={source.url} target="_blank" rel="noreferrer" className="text-xs text-[#0f2d5c] hover:underline">{source.name}</a>
          : <span className="text-xs text-gray-700">{source.name}</span>}
        <p className="text-[10px] text-gray-400">{source.pageLabel || source.year}</p>
      </div>
      {source.url && source.url !== '#' && <ExternalLink size={12} className="ml-auto text-[#1a6b3c] shrink-0" />}
      <button
        onClick={() => copyCitation('APA')}
        title="Copy APA Citation"
        className="text-[10px] bg-gray-100 hover:bg-[#0f2d5c] hover:text-white text-gray-600 px-2 py-0.5 rounded font-mono transition-colors"
      >
        Cite
      </button>
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
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${resp.isLive ? 'text-[#1a6b3c] bg-green-50' : 'text-amber-700 bg-amber-50'}`}>
                  {resp.isLive ? `${resp.groundedness}% RAG GROUNDED` : 'AI UNAVAILABLE'}
                </span>
              </div>
              {resp.sources.map((s, i) => <SourceBadge key={i} source={s} />)}
            </div>
          )}
        </div>

        <p className="text-[10px] text-gray-400 mt-1.5 ml-1 flex items-center gap-1">
          {resp.isLive ? <CheckCircle size={10} className="text-green-600" /> : <AlertTriangle size={10} className="text-amber-500" />}
          {resp.isLive ? 'Live response grounded in approved government sources.' : 'The live evidence service is unavailable. No simulated answer was shown.'}
        </p>
      </div>
    </div>
  );
}

export default function AIResearchPage() {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState('assistant'); // 'assistant' | 'library' | 'notebook'
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [typing, setTyping] = useState(false);
  const [apiMode, setApiMode] = useState('checking');
  const [notebookNotes, setNotebookNotes] = useState(initialNotebookNotes);
  const [showAddNote, setShowAddNote] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages, typing]);

  const sendMessage = async (question) => {
    const q = question || inputVal.trim();
    if (!q) return;
    setInputVal('');

    setMessages(prev => [...prev, { role: 'user', content: q }]);
    setTyping(true);

    try {
      const apiResponse = await queryResearchAssistant(q);
      const resp = {
        answer: apiResponse.answer,
        sources: apiResponse.sources.map(source => ({
          name: source.title,
          year: String(source.year),
          verified: source.status === 'approved',
          url: source.sourceUrl || source.fileUrl,
          pageLabel: source.pageRanges?.length
            ? source.pageRanges.map(range => `pp. ${range.pageStart}-${range.pageEnd}`).join(', ')
            : `pp. ${source.pageStart}-${source.pageEnd}`,
        })),
        groundedness: Math.round(apiResponse.confidence * 100),
        chartData: null,
        isLive: true,
      };
      setMessages(prev => [...prev, { role: 'assistant', response: resp }]);
      setApiMode('live');
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', response: {
        answer: `The live evidence service is currently unavailable: ${error.message}. Please retry after the AI Backend is deployed and connected.`,
        sources: [], groundedness: 0, chartData: null, isLive: false,
      } }]);
      setApiMode('unavailable');
    } finally {
      setTyping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <PageLayout>
      <PageHeader
        label="SPATIAL RESEARCH OBSERVATORY"
        title="Land Research & Academic Suite"
        subtitle="Natural-language intelligence, authoritative peer-reviewed papers, and collaborative student field notes."
        actions={
          <div className="flex items-center gap-2">
            <DemoBanner message={apiMode === 'live' ? 'LIVE RAG · APPROVED SOURCES' : apiMode === 'checking' ? 'AI BACKEND CONNECTION PENDING' : 'AI BACKEND UNAVAILABLE'} />
            <button
              onClick={() => setActiveTab('assistant')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all
                ${activeTab === 'assistant' ? 'bg-[#0f2d5c] text-white shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}
            >
              <Bot size={13} /> AI Assistant
            </button>
            <button
              onClick={() => setActiveTab('library')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all
                ${activeTab === 'library' ? 'bg-[#0f2d5c] text-white shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}
            >
              <BookOpen size={13} /> Research Paper Library
            </button>
            <button
              onClick={() => setActiveTab('notebook')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all
                ${activeTab === 'notebook' ? 'bg-[#0f2d5c] text-white shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}
            >
              <Users size={13} /> Collaborative Notebook
            </button>
          </div>
        }
      />

      {activeTab === 'assistant' && (
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
      )}

      {/* Research Paper Library Tab */}
      {activeTab === 'library' && (
        <div className="flex-1 overflow-y-auto p-6 max-w-6xl mx-auto space-y-4 w-full">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Authoritative Research Papers & Policy Studies</h2>
              <p className="text-xs text-gray-500">Peer-reviewed land administration, satellite telemetry, and urban mobility papers</p>
            </div>
            <span className="text-xs bg-blue-50 text-[#0f2d5c] border border-blue-200 px-3 py-1 rounded-full font-bold">
              {researchPapers.length} Publications Indexed
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {researchPapers.map((paper) => (
              <div key={paper.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-gray-400 font-bold">{paper.id}</span>
                    <Badge color="blue">{paper.category}</Badge>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 leading-snug">{paper.title}</h3>
                  <p className="text-xs text-gray-600 font-medium">By {paper.authors} ({paper.year})</p>
                  <p className="text-[11px] text-gray-400 italic">{paper.journal}</p>
                  <p className="text-xs text-gray-500 leading-relaxed pt-1">{paper.abstract}</p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(paper.citationAPA);
                        showToast('APA citation copied to clipboard', 'success');
                      }}
                      className="text-xs font-mono bg-gray-50 hover:bg-[#0f2d5c] hover:text-white border border-gray-200 px-2.5 py-1 rounded transition-colors"
                    >
                      Copy APA
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(paper.citationBibTeX);
                        showToast('BibTeX citation copied to clipboard', 'success');
                      }}
                      className="text-xs font-mono bg-gray-50 hover:bg-[#0f2d5c] hover:text-white border border-gray-200 px-2.5 py-1 rounded transition-colors"
                    >
                      Copy BibTeX
                    </button>
                  </div>
                  <GovButton variant="outline" size="sm" onClick={() => showToast('Opening executive pre-print (demo)', 'success')}>
                    <Download size={12} /> Pre-print PDF
                  </GovButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collaborative Notebooks Tab */}
      {activeTab === 'notebook' && (
        <div className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto space-y-4 w-full">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Users size={20} className="text-[#0f2d5c]" />
                Collaborative Student & Research Notebooks
              </h2>
              <p className="text-xs text-gray-500">Shared spatial observations, field verification findings, and study hypotheses</p>
            </div>
            <GovButton variant="primary" size="sm" onClick={() => setShowAddNote(true)}>
              <Plus size={13} /> Add Study Note
            </GovButton>
          </div>

          <div className="space-y-3">
            {notebookNotes.map((note) => (
              <div key={note.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded font-bold">
                        {note.id}
                      </span>
                      <h3 className="text-sm font-bold text-gray-900">{note.title}</h3>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">Author: <strong className="text-gray-700">{note.group}</strong> · Tagged: <span className="font-mono text-[#0f2d5c]">{note.parcelRef}</span> · {note.date}</p>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                  {note.content}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {note.tags.map((t, idx) => (
                    <span key={idx} className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full font-medium">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Study Note Modal */}
      {showAddNote && (
        <div className="fixed inset-0 z-[9998] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="bg-[#0f2d5c] text-white px-5 py-4 rounded-t-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus size={16} />
                <h3 className="font-bold text-base">New Collaborative Annotation</h3>
              </div>
              <button onClick={() => setShowAddNote(false)} className="text-blue-200 hover:text-white">✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const newNote = {
                id: `NOTE-${Math.floor(103 + Math.random() * 50)}`,
                group: 'Research Cohort (You)',
                parcelRef: 'MH-PN-4091 (Khadakwasla Basin)',
                title: 'Field Survey GIS Discrepancy Observation',
                content: 'Observed significant groundwater drainage divergence into southern agricultural canal.',
                date: 'Today',
                tags: ['Field Note', 'Student Annotation']
              };
              setNotebookNotes([newNote, ...notebookNotes]);
              setShowAddNote(false);
              showToast('Note added to Collaborative Notebook', 'success');
            }} className="p-5 space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Study Group / Author</label>
                <input defaultValue="Geospatial Lab (Student Group)" className="w-full border border-gray-300 rounded-lg p-2.5 text-xs" required />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Observation Title</label>
                <input placeholder="e.g. Groundwater Recharge Zone Shift" className="w-full border border-gray-300 rounded-lg p-2.5 text-xs" required />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Field Findings / Annotation</label>
                <textarea rows={3} placeholder="Describe satellite or ground findings..." className="w-full border border-gray-300 rounded-lg p-2.5 text-xs" required />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <GovButton variant="ghost" type="button" onClick={() => setShowAddNote(false)}>Cancel</GovButton>
                <GovButton variant="primary" type="submit">Publish to Notebook</GovButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
