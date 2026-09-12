import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../App';
import {
  Map, BarChart2, Layers, Search, Bell, HelpCircle, LogIn,
  Globe, FileText, Home, Bot, Sliders, BookOpen, Briefcase,
  FolderOpen, Gift, AlertTriangle, ClipboardList, ChevronDown,
  ChevronRight, LogOut, User, Shield, Menu, X
} from 'lucide-react';

const navLinks = [
  { label: 'Overview', to: '/' },
  { label: 'GIS Map', to: '/gis' },
  { label: 'Parcel 360', to: '/parcel360' },
  { label: 'Analytics', to: '/analytics' },
  { label: 'Research', to: '/research' },
  { label: 'Schemes', to: '/schemes' },
];

// Default / Guest sidebar (No Policy & Planning)
const sidebarSections = [
  {
    title: 'SPATIAL INTELLIGENCE',
    items: [
      { label: 'Public Dashboard', to: '/', icon: Home },
      { label: 'GIS Land Map', to: '/gis', icon: Map },
      { label: 'Parcel 360', to: '/parcel360', icon: Layers },
    ]
  },
  {
    title: 'INTELLIGENCE & RESEARCH',
    items: [
      { label: 'AI Research', to: '/research', icon: Bot },
      { label: 'Land Analytics', to: '/analytics', icon: BarChart2 },
    ]
  },
  {
    title: 'CITIZEN SERVICES',
    items: [
      { label: 'My Land', to: '/my-land', icon: Globe },
      { label: 'Document Vault', to: '/documents', icon: FolderOpen },
      { label: 'Govt Schemes', to: '/schemes', icon: Gift },
    ]
  },
  {
    title: 'SYSTEM',
    items: [
      { label: 'Notifications', to: '/notifications', icon: Bell },
      { label: 'Access Logs', to: '/audit', icon: ClipboardList },
    ]
  },
];

// Citizen-specific sidebar (No Policy & Planning)
const citizenSidebarSections = [
  {
    title: 'CITIZEN SERVICES',
    items: [
      { label: 'My Land Dashboard', to: '/my-land', icon: Globe },
      { label: 'Document Vault', to: '/documents', icon: FolderOpen },
      { label: 'Govt Schemes', to: '/schemes', icon: Gift },
    ]
  },
  {
    title: 'SPATIAL INTELLIGENCE',
    items: [
      { label: 'Public Dashboard', to: '/', icon: Home },
      { label: 'GIS Land Map', to: '/gis', icon: Map },
      { label: 'Parcel 360', to: '/parcel360', icon: Layers },
    ]
  },
  {
    title: 'SYSTEM',
    items: [
      { label: 'Notifications', to: '/notifications', icon: Bell },
      { label: 'Access Logs', to: '/audit', icon: ClipboardList },
    ]
  },
];

// Researcher-specific sidebar (No Policy & Planning)
const researcherSidebarSections = [
  {
    title: 'INTELLIGENCE & RESEARCH',
    items: [
      { label: 'AI Research Assistant', to: '/research', icon: Bot },
      { label: 'Land-Use Analytics', to: '/analytics', icon: BarChart2 },
    ]
  },
  {
    title: 'SPATIAL OBSERVATORY',
    items: [
      { label: 'GIS Cadastre Map', to: '/gis', icon: Map },
      { label: 'Parcel 360 Dossier', to: '/parcel360', icon: Layers },
      { label: 'Public Dashboard', to: '/', icon: Home },
    ]
  },
  {
    title: 'SYSTEM & AUDIT',
    items: [
      { label: 'Notifications', to: '/notifications', icon: Bell },
      { label: 'Cadastral Audit Logs', to: '/audit', icon: ClipboardList },
    ]
  },
];

// Officer-specific sidebar (ONLY role with Policy & Planning)
const officerSidebarSections = [
  {
    title: 'ADMINISTRATION',
    items: [
      { label: 'Regional Dashboard', to: '/officer', icon: Home },
      { label: 'GIS Land Map', to: '/gis', icon: Map },
      { label: 'Public Land Intelligence', to: '/analytics', icon: BarChart2 },
    ]
  },
  {
    title: 'POLICY & PLANNING',
    items: [
      { label: 'Policy Simulator', to: '/policy', icon: Sliders },
      { label: 'Policy Brief Generator', to: '/policy-brief', icon: FileText },
    ]
  },
  {
    title: 'CASE MANAGEMENT',
    items: [
      { label: 'Shared Documents', to: '/documents', icon: FolderOpen },
      { label: 'Notifications', to: '/notifications', icon: Bell },
      { label: 'Access Logs', to: '/audit', icon: ClipboardList },
    ]
  },
];

export function Header({ sidebarOpen, setSidebarOpen }) {
  const { role, setLoginModal, setRole, showToast } = useApp();
  const navigate = useNavigate();
  const [searchQ, setSearchQ] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) {
      navigate(`/gis?search=${encodeURIComponent(searchQ.trim())}`);
      setSearchQ('');
    }
  };

  const roleLabel = role === 'citizen' ? 'Citizen' : role === 'officer' ? 'Govt Officer' : role === 'researcher' ? 'Researcher' : null;
  const roleBg = role === 'citizen' ? 'bg-[#1a6b3c]' : role === 'officer' ? 'bg-[#0f2d5c]' : 'bg-purple-700';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f2d5c] border-b border-blue-900 shadow-lg">
      {/* Top bar */}
      <div className="flex items-center h-14 px-4 gap-3">
        {/* Hamburger (mobile) */}
        <button
          className="lg:hidden text-white/70 hover:text-white p-1"
          onClick={() => setSidebarOpen?.(o => !o)}
        >
          <Menu size={20} />
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="h-9 w-9 rounded-lg bg-white p-0.5 shadow-sm overflow-hidden flex items-center justify-center border border-white/20 group-hover:border-blue-300 transition-all">
            <img
              src="/bhunirnay-logo.png"
              alt="BhuNirnay Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="hidden sm:block">
            <div className="text-white font-bold text-sm leading-tight tracking-wide flex items-center gap-1.5">
              <span>BhuNirnay</span>
              <span className="text-[9px] bg-green-500/20 text-green-300 border border-green-400/30 px-1 py-0.2 rounded font-semibold uppercase">DPI</span>
            </div>
            <div className="text-blue-300 text-[9px] font-medium uppercase tracking-widest leading-tight">National Land Intelligence Platform</div>
          </div>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-sm mx-4 hidden md:block">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
            <input
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder="Search parcel, ULPIN, village..."
              className="w-full bg-white/10 border border-blue-700 text-white placeholder-blue-300 text-xs rounded-md pl-8 pr-3 py-2 focus:outline-none focus:border-blue-400 focus:bg-white/15"
            />
          </div>
        </form>

        {/* Nav links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map(n => (
            <Link key={n.to} to={n.to}
              className="text-blue-200 hover:text-white text-xs font-medium px-3 py-1.5 rounded hover:bg-white/10 transition-colors">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1" />

        {/* Status */}
        <div className="hidden md:flex items-center gap-1.5 bg-white/5 border border-blue-800 rounded px-2 py-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] text-blue-300 font-medium tracking-wider">NATIONAL CADASTRE NETWORK — DEMO</span>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-1 ml-2">
          <Link to="/notifications" className="relative text-blue-200 hover:text-white p-1.5 rounded hover:bg-white/10" title="Notifications">
            <Bell size={16} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-[#0f2d5c]"></span>
          </Link>
          <button className="text-blue-200 hover:text-white p-1.5 rounded hover:bg-white/10" title="Help">
            <HelpCircle size={16} />
          </button>
          {role ? (
            <div className="flex items-center gap-2">
              <span className={`${roleBg} text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider`}>
                {roleLabel}
              </span>
              <button
                onClick={() => { setRole(null); showToast('Signed out', 'success'); }}
                className="text-blue-200 hover:text-white p-1.5 rounded hover:bg-white/10"
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setLoginModal(true)}
              className="flex items-center gap-1.5 bg-[#1a6b3c] hover:bg-[#228b4e] text-white text-xs font-medium px-3 py-1.5 rounded transition-colors"
            >
              <LogIn size={14} />
              <span className="hidden sm:inline">Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub bar */}
      <div className="bg-[#0a1f42] border-t border-blue-900 px-4 py-1 flex items-center gap-2">
        <span className="text-[10px] text-blue-400 font-medium uppercase tracking-widest">
          BHUNIRNAY · PROPOSED NATIONAL LAND INTELLIGENCE PLATFORM · SIH 26019 · Ministry of Rural Development, Dept of Land Resources
        </span>
        <div className="ml-auto flex items-center gap-1">
          <span className="text-[10px] text-blue-500">DEMO / PROTOTYPE</span>
        </div>
      </div>
    </header>
  );
}

export function Sidebar({ open, setOpen }) {
  const { role } = useApp();
  const location = useLocation();

  let sections = sidebarSections;
  if (role === 'officer') {
    sections = officerSidebarSections;
  } else if (role === 'citizen') {
    sections = citizenSidebarSections;
  } else if (role === 'researcher') {
    sections = researcherSidebarSections;
  }

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <aside className={`fixed left-0 top-[88px] bottom-0 z-40 w-56 bg-white border-r border-gray-200 flex flex-col overflow-y-auto scrollbar-thin transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

        {sections.map((section) => (
          <div key={section.title} className="mt-4">
            <div className="px-4 py-1">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{section.title}</span>
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.to;
              return (
                <Link key={item.to + item.label} to={item.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 mx-2 rounded-lg text-sm transition-all
                    ${active
                      ? 'bg-[#0f2d5c] text-white font-semibold shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <Icon size={15} className={active ? 'text-white' : 'text-gray-400'} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}

        {/* Bottom */}
        <div className="mt-auto p-4 border-t border-gray-100">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">DEMO MODE</span>
            </div>
            <p className="text-[10px] text-amber-600">BhuNirnay Prototype · SIH 26019</p>
          </div>
        </div>
      </aside>
    </>
  );
}

export function PageLayout({ children, title, breadcrumb }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <main className="lg:ml-56 pt-[88px] min-h-screen">
        {children}
      </main>
    </div>
  );
}
