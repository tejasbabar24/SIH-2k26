import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Shield, CheckCircle2, Clock, AlertTriangle, ArrowRight, RefreshCw,
  FileSpreadsheet, Sliders, Building2, MapPin, Eye, FileText, Check, X,
  UserCheck, Layers
} from 'lucide-react';
import { PageLayout } from '../components/layout/Layout';
import { PageHeader, Card, GovButton, DemoBanner, Badge } from '../components/ui';
import { mutationTrendData } from '../data/analytics';
import { useApp } from '../App';

export default function OfficerDashboardPage() {
  const { role, setRole, setLoginModal, showToast } = useApp();
  const navigate = useNavigate();
  const [personalView, setPersonalView] = useState(false);
  const [synced, setSynced] = useState(false);
  const [cases, setCases] = useState([
    { id: 'APP-2026-8901', applicant: 'Kishore Patil', parcel: 'Survey 144/2-C', type: 'Mutation Transfer', status: 'Pending Review', urgency: 'High', date: 'Today, 09:30 AM' },
    { id: 'APP-2026-8894', applicant: 'Sunita Joshi', parcel: 'Survey 152/1-A', type: 'NA Conversion (Commercial)', status: 'Inter-Dept NOC', urgency: 'Normal', date: 'Yesterday' },
    { id: 'APP-2026-8872', applicant: 'Deshmukh Agro Ltd', parcel: 'Survey 148/2-A', type: 'Industrial Boundary Verification', status: 'Field Surveyed', urgency: 'Urgent', date: '07 Oct 2026' },
  ]);

  const handleApprove = (id) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, status: 'Approved' } : c));
    showToast(`Case ${id} approved & forwarded to Sub-Registrar`, 'success');
  };

  const handleReject = (id) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, status: 'Returned with Queries' } : c));
    showToast(`Case ${id} returned for boundary clarification`, 'warning');
  };

  const handleSync = () => {
    setSynced(true);
    showToast('State Cadastre synchronised with NIC Central Registry', 'success');
    setTimeout(() => setSynced(false), 2000);
  };

  // Guard: Restrict access to Government Officers only
  if (role !== 'officer') {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center min-h-[65vh] text-center p-6">
          <div className="w-20 h-20 bg-blue-50 border border-blue-200 rounded-full flex items-center justify-center mb-4 shadow-sm">
            <Building2 size={36} className="text-[#0f2d5c]" />
          </div>
          <span className="text-xs font-bold text-blue-800 bg-blue-100 border border-blue-300 px-2.5 py-1 rounded uppercase tracking-wider mb-3">
            Administrative Portal
          </span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Government Officer Sign-In Required</h2>
          <p className="text-sm text-gray-500 max-w-md mb-6 leading-relaxed">
            The Regional Land Administration Dashboard is restricted to verified revenue officers, divisional magistrates, and authorized state administrators.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <GovButton variant="primary" size="lg" onClick={() => setLoginModal(true)}>
              Sign In as Government Officer
            </GovButton>
            <GovButton variant="outline" size="lg" onClick={() => navigate('/')}>
              Return to Home
            </GovButton>
          </div>
          <p className="text-xs text-gray-400 mt-5">Demo Mode · Switch to Govt Officer role in the login modal</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        label="ADMINISTRATION · PUNE REVENUE DIVISION"
        title="Regional Land Administration Dashboard"
        subtitle="Vikramaditya Singh, IAS · District Magistrate & Collector · Central Division, Zone 4"
        actions={
          <>
            <div className="hidden sm:flex items-center gap-2 text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-gray-700 font-semibold">GIS Node: Live</span>
              <span className="text-gray-400">· Q3-2026 Cycle</span>
            </div>
            <GovButton variant="outline" size="sm" onClick={handleSync}>
              <RefreshCw size={13} className={synced ? 'animate-spin' : ''} /> Sync Cadastre
            </GovButton>
            <GovButton variant="primary" size="sm" onClick={() => navigate('/policy-brief')}>
              <FileSpreadsheet size={13} /> Export Regional Brief
            </GovButton>
          </>
        }
      />

      <div className="p-6 space-y-6">
        {/* Top 3 KPI Cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {/* Card 1: Land-Use Breakdown */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase">
                <Layers size={14} className="text-[#1a6b3c]" /> Land-Use Breakdown
              </div>
              <span className="text-xs font-bold text-gray-900">184,200 Ha</span>
            </div>

            {/* Segmented bar */}
            <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex my-3">
              <div style={{ width: '62%' }} className="bg-[#1a6b3c] h-full" title="Agri 62%" />
              <div style={{ width: '24%' }} className="bg-[#2d7a45]/80 h-full" title="Forest 24%" />
              <div style={{ width: '14%' }} className="bg-[#e07b2a] h-full" title="Urban 14%" />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#1a6b3c]" />
                <span className="text-gray-600">Agri <strong>62%</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2d7a45]" />
                <span className="text-gray-600">Forest <strong>24%</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#e07b2a]" />
                <span className="text-gray-600">Urban <strong>14%</strong></span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
              <span>Zoning Master Rev. 2024</span>
              <span className="text-green-700 font-bold">✓ Verified</span>
            </div>
          </div>

          {/* Card 2: Cadastral Digitisation */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-gray-700 uppercase">Cadastral Digitisation</span>
              <span className="text-xs bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded">Target: 98%</span>
            </div>

            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-[#0f2d5c]">94.2%</span>
              <span className="text-xs text-gray-500 font-medium">128,450 / 136,360 Parcels</span>
            </div>

            {/* Progress bar with target tick */}
            <div className="relative h-2.5 w-full bg-gray-100 rounded-full my-3 overflow-hidden">
              <div className="bg-[#0f2d5c] h-full rounded-full" style={{ width: '94.2%' }} />
              <div className="absolute top-0 bottom-0 w-0.5 bg-red-500 left-[98%]" title="Target 98%" />
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
              <span className="text-green-700 font-semibold">↑ +3.8% vs last fiscal</span>
              <span>Annual Target: 98%</span>
            </div>
          </div>

          {/* Card 3: Pending Applications */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-gray-700 uppercase">Pending Applications</span>
              <span className="text-xs bg-red-50 text-red-700 border border-red-200 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                ● 3 Urgent
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-[#0f2d5c]">18</span>
              <span className="text-xs text-gray-500 font-medium">Files In Queue</span>
            </div>

            <p className="text-xs text-gray-600 mt-2 line-clamp-1">
              15 standard regulatory verification cases within permissible timelines.
            </p>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
              <span>Median processing: <strong>3.2 days</strong></span>
              <span className="text-green-700 font-bold">In Compliance</span>
            </div>
          </div>
        </div>

        {/* Middle row: Cadastral trend chart + Officer Personal Holdings */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Trend Chart (2 cols) */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Regional Cadastral Mutation & Registration Trend</h3>
                <p className="text-xs text-gray-500 mt-0.5">Last 6 months performance (May – Oct 2024)</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#1a6b3c] rounded-sm" />
                  <span className="text-gray-600">Resolved Registrations</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#c5d2e0] rounded-sm" />
                  <span className="text-gray-600">Lodged Applications</span>
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={mutationTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="lodged" fill="#c5d2e0" radius={[3, 3, 0, 0]} />
                <Bar dataKey="resolved" fill="#1a6b3c" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-4 p-3 bg-[#1a6b3c]/5 border border-[#1a6b3c]/20 rounded-lg flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#1a6b3c]" />
                <span className="font-semibold text-gray-800">Average 6-month resolution rate: <strong className="text-[#1a6b3c]">96.4%</strong></span>
              </div>
              <span className="text-gray-500">Statutory Threshold: &ge;90.0%</span>
            </div>
          </div>

          {/* Officer Personal Holdings card (1 col) */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  SECTION 2.2 · SUB-RECORD
                </span>
                <span className="text-[10px] font-bold bg-[#0f2d5c] text-white px-2 py-0.5 rounded">
                  Segregated Space
                </span>
              </div>

              <h3 className="text-sm font-bold text-gray-900">Officer Personal Holdings</h3>
              <p className="text-xs text-gray-500 mt-0.5">Segregated My Land Records · Conflict of Interest Clearance</p>

              {/* Personal view toggle switch */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck size={16} className="text-[#0f2d5c]" />
                  <span className="text-xs font-semibold text-gray-800">Personal View</span>
                </div>
                <button
                  onClick={() => setPersonalView(v => !v)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${personalView ? 'bg-[#1a6b3c]' : 'bg-gray-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform transform ${personalView ? 'translate-x-5' : 'translate-x-0.5'} mt-0.5`} />
                </button>
              </div>

              {/* Holding Details */}
              <div className="mt-4 border border-gray-200 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">PARCEL IDENTIFICATION</span>
                  <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                    ✓ Clean Title Verified
                  </span>
                </div>
                <p className="text-sm font-bold text-gray-900">Plot 12-B, Pune Rural</p>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-gray-400 text-[10px] block">HOLDINGS AREA</span>
                    <span className="font-bold text-gray-800">1.20 Hectares</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block">CLASSIFICATION</span>
                    <span className="font-bold text-gray-800">Agricultural</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                  <span>Reg #MH-PN-2021-881</span>
                  <span>Annual Declaration: <strong>Filed</strong></span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-2.5 bg-blue-50/50 border border-blue-100 rounded text-[10px] text-gray-500 leading-snug">
              Isolated under Civil Services Conduct Rules Rule 16(2). Certified autonomous from jurisdictional duty allocation.
            </div>
          </div>
        </div>

        {/* Action Systems: Policy Simulator & Area-Based Advisor */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
            JURISDICTIONAL DECISION SYSTEMS
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div
              onClick={() => navigate('/policy')}
              className="bg-white border border-gray-200 hover:border-[#0f2d5c] rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-[#0f2d5c]/10 text-[#0f2d5c] flex items-center justify-center shrink-0 mt-0.5">
                  <Sliders size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#0f2d5c] transition-colors">
                    Policy Simulator
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Model zoning changes and test agricultural to urban conversion impact.
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400 font-medium">
                    <span>Scenario Builder</span>
                    <span>·</span>
                    <span>Land-Use Yield Projection</span>
                  </div>
                </div>
              </div>
              <ArrowRight size={18} className="text-gray-400 group-hover:text-[#0f2d5c] group-hover:translate-x-1 transition-all" />
            </div>

            <div
              onClick={() => navigate('/dev-suggestions')}
              className="bg-white border border-gray-200 hover:border-[#1a6b3c] rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-[#1a6b3c]/10 text-[#1a6b3c] flex items-center justify-center shrink-0 mt-0.5">
                  <Building2 size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#1a6b3c] transition-colors">
                    Area-Based Infrastructure Advisor
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Select sector corridors to view autonomous spatial suggestions.
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400 font-medium">
                    <span>Buffer Optimization</span>
                    <span>·</span>
                    <span>Public Facility Alignment</span>
                  </div>
                </div>
              </div>
              <ArrowRight size={18} className="text-gray-400 group-hover:text-[#1a6b3c] group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </div>

        {/* Regulatory Queue Table */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Active Regulatory Verification Cases</h3>
              <p className="text-xs text-gray-500">Citizen submissions requiring Sub-Divisional Officer (SDO) attestation</p>
            </div>
            <span className="text-xs bg-gray-100 text-gray-600 font-medium px-2 py-1 rounded">
              3 Pending Attention
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-y border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Case ID</th>
                  <th className="py-2.5 px-3">Applicant</th>
                  <th className="py-2.5 px-3">Cadastral Parcel</th>
                  <th className="py-2.5 px-3">Request Type</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Attestation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cases.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#0f2d5c]">{c.id}</td>
                    <td className="py-3 px-3 font-medium text-gray-900">{c.applicant}</td>
                    <td className="py-3 px-3 text-gray-600">{c.parcel}</td>
                    <td className="py-3 px-3 text-gray-700">{c.type}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        c.urgency === 'Urgent' || c.urgency === 'High'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {c.urgency}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`font-semibold ${
                        c.status === 'Approved' ? 'text-green-700' : c.status.includes('Returned') ? 'text-orange-700' : 'text-gray-600'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {c.status === 'Approved' || c.status.includes('Returned') ? (
                        <span className="text-gray-400 italic">Disposed</span>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleApprove(c.id)}
                            className="p-1 text-green-700 hover:bg-green-50 rounded"
                            title="Approve mutation"
                          >
                            <Check size={15} />
                          </button>
                          <button
                            onClick={() => handleReject(c.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Return with queries"
                          >
                            <X size={15} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}

