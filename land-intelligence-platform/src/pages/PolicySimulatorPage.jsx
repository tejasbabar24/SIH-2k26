import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Sliders, AlertTriangle, TrendingUp, TrendingDown, Leaf, Droplets, Users, FileText, Play, RefreshCw, GitCompare } from 'lucide-react';
import { PageLayout } from '../components/layout/Layout';
import { PageHeader, Card, GovButton, DemoBanner } from '../components/ui';
import { policyRegions, policyTypes, timeHorizons, computeSimulation, policyBriefTopics } from '../data/policy';
import { useApp } from '../App';
import { useNavigate } from 'react-router-dom';

function KpiChange({ label, value, icon: Icon, direction = 'up', iconColor }) {
  const isUp = direction === 'up';
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        <Icon size={16} className={iconColor} />
      </div>
      <p className={`text-2xl font-bold ${isUp ? 'text-[#1a6b3c]' : 'text-red-600'}`}>{value}</p>
      <div className={`text-[10px] font-medium mt-1 ${isUp ? 'text-green-600' : 'text-red-500'}`}>
        {isUp ? '↑ Positive impact' : '↓ Negative impact'}
      </div>
    </div>
  );
}

export default function PolicySimulatorPage() {
  const { role, setLoginModal, showToast } = useApp();
  const navigate = useNavigate();
  const [region, setRegion] = useState('pune-peri');
  const [policyType, setPolicyType] = useState('agri-conversion');
  const [conversionPct, setConversionPct] = useState(32);
  const [timeHorizon, setTimeHorizon] = useState(10);
  const [simulating, setSimulating] = useState(false);
  const [results, setResults] = useState(null);
  const [hasRun, setHasRun] = useState(false);

  // Guard: Restrict access to Government Officers only
  if (role !== 'officer') {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center min-h-[65vh] text-center p-6">
          <div className="w-20 h-20 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center mb-4 shadow-sm">
            <Sliders size={36} className="text-[#0f2d5c]" />
          </div>
          <span className="text-xs font-bold text-amber-700 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded uppercase tracking-wider mb-3">
            Institutional Access Only
          </span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Government Officer Authorization Required</h2>
          <p className="text-sm text-gray-500 max-w-md mb-6 leading-relaxed">
            The Policy & Planning Suite (Land Policy Simulator) is restricted to verified Government Administrative Officers (Collectorates, Town Planning, and Revenue Authorities).
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

  // Compute live as slider moves
  const liveResults = computeSimulation(conversionPct, timeHorizon, region);

  const runSimulation = () => {
    setSimulating(true);
    setHasRun(false);
    setTimeout(() => {
      setResults(computeSimulation(conversionPct, timeHorizon, region));
      setSimulating(false);
      setHasRun(true);
    }, 1500);
  };

  const r = hasRun ? results : liveResults;

  const riskColors = {
    green: 'bg-green-50 border-green-300 text-green-800',
    yellow: 'bg-yellow-50 border-yellow-300 text-yellow-800',
    orange: 'bg-orange-50 border-orange-400 text-orange-800',
    red: 'bg-red-50 border-red-400 text-red-800',
  };

  return (
    <PageLayout>
      <PageHeader
        label="POLICY INTELLIGENCE SUITE"
        title="Land Policy Simulator"
        subtitle="Explore possible outcomes of proposed land-use interventions and policy scenarios."
        actions={
          <>
            <DemoBanner message="SIMULATION MODEL · DEMO · PROTOTYPE" />
            <GovButton variant="green" size="sm" onClick={() => navigate('/policy-brief')}>
              <FileText size={14} /> Generate Policy Brief
            </GovButton>
          </>
        }
      />

      <div className="p-6 grid lg:grid-cols-3 gap-6">
        {/* Left: Controls */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1">
              <Sliders size={12} /> SIMULATION PARAMETERS
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1.5">Target Region</label>
                <select value={region} onChange={e => setRegion(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#0f2d5c]">
                  {policyRegions.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1.5">Policy Intervention</label>
                <select value={policyType} onChange={e => setPolicyType(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#0f2d5c]">
                  {policyTypes.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-gray-700">Agricultural Land Conversion</label>
                  <span className="text-sm font-bold text-[#0f2d5c]">{conversionPct}%</span>
                </div>
                <input
                  type="range" min="5" max="75" step="1"
                  value={conversionPct}
                  onChange={e => setConversionPct(Number(e.target.value))}
                  className="w-full accent-[#0f2d5c] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>5%</span>
                  <span className="text-orange-500 font-medium">⚠ 20% threshold</span>
                  <span>75%</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1.5">Time Horizon</label>
                <div className="flex gap-2">
                  {timeHorizons.map(h => (
                    <button key={h} onClick={() => setTimeHorizon(h)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-md border transition-colors
                        ${timeHorizon === h ? 'bg-[#0f2d5c] text-white border-[#0f2d5c]' : 'bg-white text-gray-600 border-gray-300 hover:border-[#0f2d5c]/50'}`}>
                      {h}Y
                    </button>
                  ))}
                </div>
              </div>

              <GovButton variant="primary" size="lg" className="w-full justify-center" onClick={runSimulation} disabled={simulating}>
                {simulating ? (
                  <><RefreshCw size={16} className="animate-spin" /> Running Simulation...</>
                ) : (
                  <><Play size={16} /> Run Simulation</>
                )}
              </GovButton>

              <div className="grid grid-cols-2 gap-2">
                <GovButton variant="outline" size="sm" className="justify-center" onClick={() => showToast('Compare scenario feature — demo', 'success')}>
                  <GitCompare size={13} /> Compare
                </GovButton>
                <GovButton variant="outlineGreen" size="sm" className="justify-center" onClick={() => navigate('/policy-brief')}>
                  <FileText size={13} /> Brief
                </GovButton>
              </div>
            </div>
          </Card>

          {/* Warning */}
          {liveResults.showWarning && (
            <div className={`border-2 rounded-lg p-4 ${riskColors[liveResults.riskColor]}`}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={16} />
                <span className="text-sm font-bold uppercase tracking-wide">{liveResults.riskLevel}</span>
              </div>
              <p className="text-xs leading-relaxed">
                Proposed conversion at {conversionPct}% exceeds the recommended preservation threshold of 20%. Significant environmental and food security impacts expected.
              </p>
            </div>
          )}
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-2 space-y-4">
          {/* KPI impacts */}
          <div>
            <p className="text-sm font-bold text-gray-700 mb-3">Impact Assessment — {conversionPct}% Conversion · {timeHorizon}-Year Horizon</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">ECONOMIC YIELD</p>
                <p className="text-xs text-gray-500">₹{r.economicYieldBase} Cr/yr</p>
                <div className="flex items-center gap-1 my-1">
                  <div className="h-0.5 w-8 bg-gray-200" />
                  <TrendingUp size={14} className="text-green-600" />
                </div>
                <p className="text-lg font-bold text-[#0f2d5c]">₹{r.economicYield} Cr</p>
                <p className="text-xs font-bold text-green-600">{r.economicChange}</p>
              </div>
              <KpiChange label="Employment" value={r.employmentChange} icon={Users} direction="up" iconColor="text-[#1a6b3c]" />
              <KpiChange label="Food Security" value={r.foodSecurityChange} icon={Leaf} direction="down" iconColor="text-red-400" />
              <KpiChange label="Water Stress" value={r.waterStressChange} icon={Droplets} direction="down" iconColor="text-blue-400" />
            </div>

            {/* Biodiversity */}
            <div className={`mt-3 border rounded-lg p-3 flex items-center justify-between
              ${liveResults.riskColor === 'green' ? 'bg-green-50 border-green-200' : liveResults.riskColor === 'orange' ? 'bg-orange-50 border-orange-200' : 'bg-red-50 border-red-200'}`}>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">BIODIVERSITY IMPACT</p>
                <p className={`text-lg font-bold ${liveResults.riskColor === 'green' ? 'text-green-700' : liveResults.riskColor === 'orange' ? 'text-orange-700' : 'text-red-700'}`}>
                  {r.biodiversityImpact}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-500 uppercase">ENV. IMPACT</p>
                <p className="text-sm font-bold text-gray-800">{r.envImpact}</p>
              </div>
            </div>
          </div>

          {/* Affected area details */}
          {hasRun && results && (
            <Card>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">IMPACT DETAILS</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: 'Affected Area', value: `${results.affectedArea} Ha` },
                  { label: 'Agricultural Loss', value: `${results.agriLoss} Ha` },
                  { label: 'Population Affected', value: results.populationImpact },
                  { label: 'Water Stress Level', value: results.waterStressLevel },
                  { label: 'Environmental Impact', value: results.envImpact },
                  { label: 'Risk Classification', value: results.riskLevel },
                ].map((item, i) => (
                  <div key={i}>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">{item.label}</p>
                    <p className="text-sm font-bold text-gray-800 mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Scenario chart */}
          <Card>
            <p className="text-sm font-bold text-gray-700 mb-3">Scenario Projection — {timeHorizon}-Year Outlook</p>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={r.scenarioChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="economic" stroke="#1a6b3c" strokeWidth={2} dot={{ r: 3 }} name="Economic Index" />
                <Line type="monotone" dataKey="foodSecurity" stroke="#4a9e5c" strokeWidth={2} dot={{ r: 3 }} name="Food Security" strokeDasharray="4 2" />
                <Line type="monotone" dataKey="waterStress" stroke="#e07b2a" strokeWidth={2} dot={{ r: 3 }} name="Water Stress" strokeDasharray="4 2" />
                <Line type="monotone" dataKey="employment" stroke="#5b8dd9" strokeWidth={2} dot={{ r: 3 }} name="Employment" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Policy brief prompt */}
          <div className="bg-[#0f2d5c] text-white rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold">Generate Formal Policy Brief</p>
              <p className="text-xs text-blue-300 mt-0.5">Export simulation results as a structured policy document</p>
            </div>
            <GovButton variant="green" size="sm" onClick={() => navigate('/policy-brief')}>
              <FileText size={14} /> Generate Brief
            </GovButton>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
