import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Map, Globe, Sliders, ChevronRight, Shield, Database, Users, FileCheck, ArrowRight, Layers, BarChart2, Bot } from 'lucide-react';
import { Header } from '../components/layout/Layout';
import { getParcelBySearch } from '../data/parcels';
import { useApp } from '../App';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [searching, setSearching] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { setSelectedParcel, role } = useApp();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearchResult(null);
    setSearchError('');
    setTimeout(() => {
      const result = getParcelBySearch(searchQuery);
      if (result) {
        setSearchResult(result);
      } else {
        setSearchError('No parcel found matching that ULPIN, Survey Number or Village. Try: MH-PN-4091, 142/3-A or Khadakwasla');
      }
      setSearching(false);
    }, 800);
  };

  const openParcel = (parcel) => {
    setSelectedParcel(parcel);
    navigate(`/parcel360/${parcel.id}`);
  };

  const exampleSearches = ['MH-PN-4091', '142/3-A', 'Khadakwasla', '1489-0821-9982'];

  const stats = [
    { value: '28+', label: 'States & UTs' },
    { value: '700+', label: 'Districts' },
    { value: '140M+', label: 'Digitized Parcels' },
    { value: '2,500+', label: 'Research Records' },
  ];

  const features = [
    {
      icon: Map,
      tag: 'SPATIAL INTELLIGENCE',
      title: 'National GIS Cadastre',
      desc: 'Interactive land map with cadastral boundaries, land-use classification, infrastructure overlays and environmental information at parcel level.',
      to: '/gis',
      btnLabel: 'Open GIS Map',
      color: 'navy'
    },
    {
      icon: Globe,
      tag: 'CITIZEN SERVICES',
      title: 'My Land',
      desc: 'Secure citizen dashboard for viewing land parcels, managing documents, tracking applications, and accessing government schemes.',
      to: '/my-land',
      btnLabel: 'Open Citizen Portal',
      color: 'green'
    },
    ...(role === 'officer' ? [
      {
        icon: Sliders,
        tag: 'POLICY INTELLIGENCE',
        title: 'Policy Simulator',
        desc: 'Interactive policy simulation for understanding economic, environmental and agricultural impacts of proposed land-use interventions.',
        to: '/policy',
        btnLabel: 'Open Policy Simulator',
        color: 'navy'
      }
    ] : [
      {
        icon: Bot,
        tag: 'RESEARCH & INTELLIGENCE',
        title: 'AI Research Assistant',
        desc: 'Ask complex natural language questions on land-use patterns, regional zoning trends, and cadastral datasets.',
        to: '/research',
        btnLabel: 'Open AI Assistant',
        color: 'navy'
      }
    ]),
  ];

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Hero */}
      <section className="pt-[88px] bg-[#0f2d5c] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full"
            style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #1a6b3c 0%, transparent 60%), radial-gradient(circle at 80% 20%, #1a3f7a 0%, transparent 50%)' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2.5 bg-white/10 border border-white/20 rounded-full pl-2 pr-4 py-1.5 mb-6">
                <img src="/bhunirnay-logo.png" alt="BhuNirnay" className="w-6 h-6 rounded-full bg-white p-0.5 object-contain" />
                <span className="text-xs font-medium text-blue-200 uppercase tracking-wider">
                  BHUNIRNAY · NATIONAL LAND INTELLIGENCE PLATFORM · SIH 26019
                </span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
                <span className="text-[#4ade80]">BhuNirnay:</span> Sovereign Land Intelligence &{' '}
                <span className="text-[#4ade80]">Evidence-Based</span>{' '}
                Land Governance
              </h1>

              <p className="text-blue-200 text-sm leading-relaxed mb-8 max-w-lg">
                A unified digital platform for exploring land records, geospatial data, land-use trends, policy scenarios and citizen land services. Powered by AI and GIS for every stakeholder in India's land ecosystem.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link to="/gis"
                  className="flex items-center gap-2 bg-[#1a6b3c] hover:bg-[#228b4e] text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm">
                  Explore Land Data <ArrowRight size={16} />
                </Link>
                <Link to="/my-land"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm">
                  Citizen Portal →
                </Link>
                <Link to="/gis"
                  className="flex items-center gap-2 text-blue-300 hover:text-white text-sm font-medium px-3 py-2.5 transition-colors">
                  <Map size={16} />
                  View GIS Map
                </Link>
              </div>

              {/* Quick nav chips */}
              <div className="flex flex-wrap gap-2 mt-6">
                {[
                  { to: '/research', label: '🤖 AI Research' },
                  { to: '/analytics', label: '📊 Analytics' },
                  ...(role === 'officer' ? [{ to: '/policy', label: '⚙️ Policy Simulator' }] : [{ to: '/documents', label: '📁 Document Vault' }]),
                  { to: '/schemes', label: '🏛️ Schemes' },
                ].map(c => (
                  <Link key={c.to} to={c.to}
                    className="text-[11px] bg-white/10 hover:bg-white/20 text-blue-200 hover:text-white border border-white/15 px-3 py-1 rounded-full transition-colors">
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right — GIS visual */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Map card */}
                <div className="bg-[#1a3f7a] border border-blue-700 rounded-xl overflow-hidden shadow-2xl">
                  {/* Map header */}
                  <div className="bg-[#0a1f42] border-b border-blue-800 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-xs text-blue-300 font-medium">LIVE CADASTRAL VIEW · Maharashtra, Pune District</span>
                    </div>
                    <span className="text-[10px] text-blue-500">EPSG:4326</span>
                  </div>

                  {/* Map body */}
                  <div className="relative h-56 bg-[#2a4a7a] overflow-hidden">
                    {/* Grid lines */}
                    <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 224">
                      {[0,80,160,240,320,400].map(x => <line key={x} x1={x} y1="0" x2={x} y2="224" stroke="#4a8fd9" strokeWidth="0.5" />)}
                      {[0,56,112,168,224].map(y => <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#4a8fd9" strokeWidth="0.5" />)}
                    </svg>

                    {/* Parcels */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 224">
                      <polygon points="40,60 120,55 125,120 38,118" fill="#4a9e5c" fillOpacity="0.6" stroke="#2d7a45" strokeWidth="1.5" />
                      <polygon points="130,52 220,48 225,115 128,118" fill="#e8a838" fillOpacity="0.7" stroke="#c88820" strokeWidth="1.5" />
                      <polygon points="228,50 310,54 312,108 226,112" fill="#5b8dd9" fillOpacity="0.5" stroke="#3a6db8" strokeWidth="1.5" />
                      <polygon points="42,125 130,122 132,185 40,182" fill="#2d7a45" fillOpacity="0.7" stroke="#1a5c32" strokeWidth="1.5" />
                      <polygon points="140,120 200,118 205,175 136,178" fill="#4a9e5c" fillOpacity="0.5" stroke="#2d7a45" strokeWidth="1.5" />
                      <polygon points="210,115 300,112 302,172 208,175" fill="#5ba8d9" fillOpacity="0.5" stroke="#3a88b8" strokeWidth="1.5" />
                      <polygon points="315,55 380,52 382,125 312,128" fill="#c47d3a" fillOpacity="0.6" stroke="#a05a1a" strokeWidth="1.5" />
                      <polygon points="305,135 380,132 382,195 303,197" fill="#4a9e5c" fillOpacity="0.5" stroke="#2d7a45" strokeWidth="1.5" />
                      {/* Highlight selected */}
                      <polygon points="130,52 220,48 225,115 128,118" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="4,2" />
                    </svg>

                    {/* Coordinates overlay */}
                    <div className="absolute bottom-2 left-2 bg-black/40 text-[10px] text-blue-200 px-2 py-1 rounded font-mono">
                      18.4550°N / 73.7300°E
                    </div>
                    <div className="absolute top-2 right-2 bg-black/40 text-[10px] text-blue-200 px-2 py-1 rounded">
                      Scale 1:50,000
                    </div>

                    {/* Layer legend */}
                    <div className="absolute bottom-2 right-2 bg-black/50 rounded p-2">
                      {[
                        { color: '#4a9e5c', label: 'Agricultural' },
                        { color: '#e8a838', label: 'Commercial' },
                        { color: '#5b8dd9', label: 'Residential' },
                        { color: '#2d7a45', label: 'Forest' },
                      ].map(l => (
                        <div key={l.label} className="flex items-center gap-1.5 mb-1 last:mb-0">
                          <div className="w-2.5 h-2.5 rounded-sm" style={{ background: l.color }} />
                          <span className="text-[9px] text-white">{l.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Parcel info */}
                  <div className="p-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-1">SELECTED PARCEL</p>
                      <p className="text-xs font-bold text-white">Survey 142/3-A · Khadakwasla</p>
                      <p className="text-[10px] text-blue-300 mt-0.5">Haveli, Pune · MH-PN-4091</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-right">
                      <div>
                        <p className="text-[9px] text-blue-400 uppercase">ULPIN</p>
                        <p className="text-[10px] text-white font-mono">1489-0821-9982</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-blue-400 uppercase">Area</p>
                        <p className="text-[10px] text-white font-bold">4.82 Ha</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-blue-400 uppercase">Class</p>
                        <p className="text-[10px] text-white">Commercial</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-blue-400 uppercase">Status</p>
                        <p className="text-[10px] text-green-400 font-bold">✓ Verified</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating chips */}
                <div className="absolute -top-3 -right-3 bg-[#1a6b3c] text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg">
                  LIVE GIS · DEMO
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-[#0f2d5c]">{s.value}</div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-[10px] text-gray-400 mt-4 font-medium uppercase tracking-wider">
            Prototype / Demonstration Data · Not Real Government Records
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="py-10 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="text-center mb-5">
              <div className="inline-flex items-center gap-1.5 bg-[#0f2d5c]/5 border border-[#0f2d5c]/10 rounded-full px-3 py-1 mb-3">
                <Database size={12} className="text-[#0f2d5c]" />
                <span className="text-[10px] font-bold text-[#0f2d5c] uppercase tracking-wider">UNIFIED CADASTRAL LOOKUP</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Search Land Records</h2>
              <p className="text-sm text-gray-500 mt-1">Enter ULPIN, Survey Number, Khasra or Village name</p>
            </div>

            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Enter ULPIN, Survey Number, Khasra or Village..."
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#0f2d5c] focus:ring-2 focus:ring-[#0f2d5c]/10"
                />
              </div>
              <button type="submit" disabled={searching}
                className="bg-[#0f2d5c] hover:bg-[#1a3f7a] text-white font-semibold px-5 py-3 rounded-lg text-sm transition-colors disabled:opacity-60 flex items-center gap-2">
                {searching ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Searching...</>
                ) : (
                  <><Search size={15} /> Search Registry</>
                )}
              </button>
            </form>

            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs text-gray-400">Try:</span>
              {exampleSearches.map(ex => (
                <button key={ex} onClick={() => setSearchQuery(ex)}
                  className="text-xs text-[#0f2d5c] border border-[#0f2d5c]/20 px-2 py-0.5 rounded hover:bg-[#0f2d5c]/5 transition-colors">
                  {ex}
                </button>
              ))}
            </div>

            {/* Results */}
            {searchError && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">{searchError}</p>
              </div>
            )}
            {searchResult && (
              <div className="mt-4 bg-[#f0f7f4] border border-[#1a6b3c]/30 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold text-[#1a6b3c] uppercase tracking-wider">PARCEL FOUND</span>
                      <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded border border-green-200">✓ {searchResult.status}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
                      <div><span className="text-gray-500 text-xs">Survey No</span><br /><span className="font-semibold text-gray-900">{searchResult.surveyNumber}</span></div>
                      <div><span className="text-gray-500 text-xs">Village</span><br /><span className="font-semibold text-gray-900">{searchResult.village}</span></div>
                      <div><span className="text-gray-500 text-xs">Taluka</span><br /><span className="font-semibold text-gray-900">{searchResult.taluka}</span></div>
                      <div><span className="text-gray-500 text-xs">District</span><br /><span className="font-semibold text-gray-900">{searchResult.district}</span></div>
                      <div><span className="text-gray-500 text-xs">Area</span><br /><span className="font-semibold text-gray-900">{searchResult.area} Ha</span></div>
                      <div><span className="text-gray-500 text-xs">Classification</span><br /><span className="font-semibold text-gray-900">{searchResult.classification}</span></div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => openParcel(searchResult)}
                  className="mt-3 flex items-center gap-2 bg-[#0f2d5c] hover:bg-[#1a3f7a] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                  Open Parcel 360 <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Platform Capabilities</h2>
            <p className="text-sm text-gray-500 mt-2">Integrated tools for land intelligence, citizen services and policy analysis</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className={`w-10 h-10 rounded-lg ${f.color === 'green' ? 'bg-[#1a6b3c]' : 'bg-[#0f2d5c]'} flex items-center justify-center mb-4`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{f.tag}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{f.desc}</p>
                  <Link to={f.to}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0f2d5c] hover:gap-2.5 transition-all">
                    {f.btnLabel} <ChevronRight size={16} />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Secondary features row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { icon: Bot, label: 'AI Research Assistant', to: '/research', desc: 'Natural-language land intelligence' },
              { icon: BarChart2, label: 'Land Analytics', to: '/analytics', desc: 'Spatial trends and insights' },
              { icon: FileCheck, label: 'Document Vault', to: '/documents', desc: 'Secure digital land documents' },
              { icon: Layers, label: 'Dev Suggestions', to: '/dev-suggestions', desc: 'AI parcel development analysis' },
            ].map((c, i) => {
              const Icon = c.icon;
              return (
                <Link key={i} to={c.to}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:border-[#0f2d5c]/30 hover:shadow-sm transition-all flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-[#0f2d5c]/5 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-[#0f2d5c]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">{c.label}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{c.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a1f42] text-blue-300 mt-8">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="h-8 w-8 rounded-lg bg-white p-0.5 shadow-sm overflow-hidden flex items-center justify-center">
                  <img src="/bhunirnay-logo.png" alt="BhuNirnay" className="h-full w-full object-contain" />
                </div>
                <div className="text-white font-bold text-base">BhuNirnay — Land Intelligence Platform</div>
              </div>
              <div className="text-xs">Ministry of Rural Development · Dept of Land Resources · Govt of India</div>
              <div className="text-[10px] mt-1 text-blue-500">SIH Problem Statement 26019 · Frontend Prototype · DEMO DATA ONLY</div>
            </div>
            <div className="flex flex-wrap gap-4 text-xs">
              <Link to="/gis" className="hover:text-white transition-colors">GIS Map</Link>
              <Link to="/research" className="hover:text-white transition-colors">AI Research</Link>
              {role === 'officer' && (
                <Link to="/policy" className="hover:text-white transition-colors">Policy</Link>
              )}
              <Link to="/my-land" className="hover:text-white transition-colors">Citizen Portal</Link>
              <Link to="/audit" className="hover:text-white transition-colors">Audit Log</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
