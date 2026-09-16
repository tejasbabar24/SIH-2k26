import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

// Pages
import HomePage from './pages/HomePage';
import OfficerLoginPage from './pages/OfficerLoginPage';
import GISMapPage from './pages/GISMapPage';
import Parcel360Page from './pages/Parcel360Page';
import AnalyticsPage from './pages/AnalyticsPage';  
import AIResearchPage from './pages/AIResearchPage';
import PolicySimulatorPage from './pages/PolicySimulatorPage';
import DevSuggestionsPage from './pages/DevSuggestionsPage';
import CitizenPortalPage from './pages/CitizenPortalPage';
import DocumentVaultPage from './pages/DocumentVaultPage';
import SchemeFinderPage from './pages/SchemeFinderPage';
import OfficerDashboardPage from './pages/OfficerDashboardPage';
import PolicyBriefPage from './pages/PolicyBriefPage';
import AuditLogPage from './pages/AuditLogPage';

// Context
export const AppContext = createContext(null);

export function useApp() {
  return useContext(AppContext);
}

export default function App() {
  const [role, setRole] = useState(null); // null | 'citizen' | 'officer' | 'researcher'
  const [loginModal, setLoginModal] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <AppContext.Provider value={{
      role, setRole,
      loginModal, setLoginModal,
      selectedParcel, setSelectedParcel,
      showToast
    }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/officer-login" element={<OfficerLoginPage />} />
          <Route path="/gis" element={<GISMapPage />} />
          <Route path="/parcel360" element={<Parcel360Page />} />
          <Route path="/parcel360/:id" element={<Parcel360Page />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/research" element={<AIResearchPage />} />
          <Route path="/policy" element={<PolicySimulatorPage />} />
          <Route path="/dev-suggestions" element={<DevSuggestionsPage />} />
          <Route path="/my-land" element={<CitizenPortalPage />} />
          <Route path="/documents" element={<DocumentVaultPage />} />
          <Route path="/schemes" element={<SchemeFinderPage />} />
          <Route path="/officer" element={<OfficerDashboardPage />} />
          <Route path="/policy-brief" element={<PolicyBriefPage />} />
          <Route path="/audit" element={<AuditLogPage />} />
          <Route path="/notifications" element={<AuditLogPage initialTab="notifications" />} />
        </Routes>
        {/* Global Toast */}
        {toast && (
          <div className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3 rounded-lg shadow-xl text-sm font-medium text-white transition-all
            ${toast.type === 'success' ? 'bg-[#1a6b3c]' : toast.type === 'error' ? 'bg-red-600' : 'bg-[#e07b2a]'}`}>
            {toast.type === 'success' && <span>✓</span>}
            {toast.type === 'error' && <span>✕</span>}
            {toast.type === 'warning' && <span>⚠</span>}
            {toast.message}
          </div>
        )}
        {/* Login Modal */}
        {loginModal && <LoginModal onClose={() => setLoginModal(false)} setRole={setRole} showToast={showToast} />}
      </BrowserRouter>
    </AppContext.Provider>
  );
}

function LoginModal({ onClose, setRole, showToast }) {
  const { setLoginModal } = useApp();
  const navigate = useNavigate();

  const handleRole = (r) => {
    if (r === 'officer') {
      // Officer goes through 4-step verification flow
      setLoginModal(false);
      navigate('/officer-login');
      return;
    }
    setRole(r);
    setLoginModal(false);
    showToast(`Signed in as ${r === 'citizen' ? 'Citizen (Rajesh Sharma)' : 'Researcher (Dr. S. Mukherjee)'}`, 'success');
  };

  return (
    <div className="fixed inset-0 z-[9998] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="bg-[#0f2d5c] text-white px-6 py-5 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white p-1 shadow flex items-center justify-center">
                <img src="/bhunirnay-logo.png" alt="BhuNirnay Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="text-xs text-blue-300 font-medium uppercase tracking-wider">BhuNirnay · DEMO MODE</p>
                <h2 className="text-lg font-bold">Choose Demo Experience</h2>
                <p className="text-xs text-blue-200">No real authentication required</p>
              </div>
            </div>
            <button onClick={onClose} className="text-blue-200 hover:text-white text-xl">✕</button>
          </div>
        </div>
        <div className="p-6 space-y-3">
          <button onClick={() => handleRole('citizen')}
            className="w-full text-left border-2 border-gray-100 hover:border-[#1a6b3c] rounded-lg p-4 transition-all group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-xl">👨‍🌾</div>
              <div>
                <div className="font-semibold text-gray-800 group-hover:text-[#1a6b3c]">Citizen — Rajesh Sharma</div>
                <div className="text-xs text-gray-500">Manage land records, documents and schemes</div>
              </div>
            </div>
          </button>
          <button onClick={() => handleRole('officer')}
            className="w-full text-left border-2 border-gray-100 hover:border-[#0f2d5c] rounded-lg p-4 transition-all group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-xl">🏛️</div>
              <div>
                <div className="font-semibold text-gray-800 group-hover:text-[#0f2d5c]">Government Officer — Vikramaditya Singh, IAS</div>
                <div className="text-xs text-gray-500">Analyze land data and simulate policies · 4-step verification</div>
              </div>
            </div>
          </button>
          <button onClick={() => handleRole('researcher')}
            className="w-full text-left border-2 border-gray-100 hover:border-purple-600 rounded-lg p-4 transition-all group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-xl">🔬</div>
              <div>
                <div className="font-semibold text-gray-800 group-hover:text-purple-700">Researcher — Dr. S. Mukherjee</div>
                <div className="text-xs text-gray-500">Explore GIS data, analytics and research</div>
              </div>
            </div>
          </button>
        </div>
        <div className="px-6 pb-5">
          <p className="text-xs text-center text-gray-400">
            BhuNirnay DEMO PROTOTYPE · SIH 26019 · Ministry of Rural Development
          </p>
        </div>
      </div>
    </div>
  );
}
