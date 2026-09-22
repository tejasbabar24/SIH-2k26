import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Download, Share2, Printer, CheckCircle, RefreshCw,
  AlertTriangle, BookOpen, Layers, ShieldCheck, Sparkles, Sliders
} from 'lucide-react';
import { PageLayout } from '../components/layout/Layout';
import { PageHeader, Card, GovButton, DemoBanner, Badge } from '../components/ui';
import { policyBriefTopics, policyRegions } from '../data/policy';
import { useApp } from '../App';

export default function PolicyBriefPage() {
  const { role, setLoginModal, showToast } = useApp();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(policyBriefTopics[0]);
  const [region, setRegion] = useState('Pune District');
  const [timePeriod, setTimePeriod] = useState('10 Years (2026-2036)');
  const [scenario, setScenario] = useState('Aggressive Urban Expansion (32% Conversion)');
  const [generating, setGenerating] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [hasGenerated, setHasGenerated] = useState(true);

  // Guard: Restrict access to Government Officers only
  if (role !== 'officer') {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center min-h-[65vh] text-center p-6">
          <div className="w-20 h-20 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center mb-4 shadow-sm">
            <FileText size={36} className="text-[#0f2d5c]" />
          </div>
          <span className="text-xs font-bold text-amber-700 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded uppercase tracking-wider mb-3">
            Institutional Access Only
          </span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Government Officer Authorization Required</h2>
          <p className="text-sm text-gray-500 max-w-md mb-6 leading-relaxed">
            The Automated Policy Brief Generator compiles statutory policy documents and is reserved exclusively for Government Administrative Officers.
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

  const handleGenerate = () => {
    setGenerating(true);
    setProgressMsg('Scanning cadastral satellite observations (ISRO Bhuvan)...');
    setTimeout(() => {
      setProgressMsg('Calculating regional multiplier effects & groundwater drawdown...');
    }, 800);
    setTimeout(() => {
      setProgressMsg('Formulating statutory zoning recommendations...');
    }, 1600);
    setTimeout(() => {
      setGenerating(false);
      setHasGenerated(true);
      showToast('Policy Brief updated successfully with live simulations', 'success');
    }, 2400);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    showToast('Policy Brief PDF compiled & downloaded (Statutory Format)', 'success');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Secure document token link copied to clipboard', 'success');
  };

  return (
    <PageLayout>
      <PageHeader
        label="STRATEGIC POLICY & REGULATORY ADVISORY"
        title="Automated Policy Brief Generator"
        subtitle="AI-synthesized institutional policy documents grounded in authoritative cadastral & satellite telemetry."
        actions={
          <>
            <DemoBanner message="AI POLICY SYNTHESIS · SIH 26019 DEMO" />
            <GovButton variant="outline" size="sm" onClick={handleShare}>
              <Share2 size={13} /> Share Link
            </GovButton>
            <GovButton variant="outline" size="sm" onClick={handlePrint}>
              <Printer size={13} /> Print
            </GovButton>
            <GovButton variant="green" size="sm" onClick={handleExportPDF}>
              <Download size={13} /> Export PDF
            </GovButton>
          </>
        }
      />

      <div className="p-6 space-y-6">
        {/* Generator Controls */}
        <Card className="bg-white border-blue-100 shadow-sm print:hidden">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-[#0f2d5c]" />
            <h3 className="text-sm font-bold text-gray-900">Brief Generation Parameters</h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Focus Policy Topic</label>
              <select
                value={topic}
                onChange={e => setTopic(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#0f2d5c]"
              >
                {policyBriefTopics.map((t, idx) => (
                  <option key={idx} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Jurisdiction / Region</label>
              <select
                value={region}
                onChange={e => setRegion(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#0f2d5c]"
              >
                <option>Pune District</option>
                <option>Haveli Taluka (Peri-Urban)</option>
                <option>Maval Growth Corridor</option>
                <option>Mulshi Agro-Ecological Basin</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Projection Horizon</label>
              <select
                value={timePeriod}
                onChange={e => setTimePeriod(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#0f2d5c]"
              >
                <option>5 Years (2026-2031)</option>
                <option>10 Years (2026-2036)</option>
                <option>25 Years (2026-2051)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Intervention Scenario</label>
              <select
                value={scenario}
                onChange={e => setScenario(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#0f2d5c]"
              >
                <option>Aggressive Urban Expansion (32% Conversion)</option>
                <option>Moderate Managed Growth (18% Conversion)</option>
                <option>Prime Agrarian Preservation (6% Conversion)</option>
                <option>Industrial Corridor Priority (25% Conversion)</option>
              </select>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Correlated with Maharashtra Land Revenue Code (Sec 44) & Regional Plan 2031
            </span>
            <GovButton variant="primary" size="sm" onClick={handleGenerate} disabled={generating}>
              {generating ? (
                <>
                  <RefreshCw size={13} className="animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles size={13} />
                  <span>Generate Policy Brief</span>
                </>
              )}
            </GovButton>
          </div>

          {generating && (
            <div className="mt-3 p-3 bg-blue-50/70 border border-blue-200 rounded-lg flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-[#0f2d5c] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-medium text-[#0f2d5c]">{progressMsg}</p>
            </div>
          )}
        </Card>

        {/* The Formal Document Paper */}
        <div className="max-w-4xl mx-auto bg-white border border-gray-300 rounded-lg shadow-md p-8 md:p-12 text-gray-800 space-y-6 print:shadow-none print:border-none print:p-0">
          {/* Document Header with Emblems */}
          <div className="border-b-2 border-[#0f2d5c] pb-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-[#0f2d5c] flex items-center justify-center text-white text-xs font-bold">
                🇮🇳
              </div>
              <div className="text-xs uppercase tracking-widest font-bold text-gray-500">
                Government of India · Department of Land Resources (DoLR)
              </div>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-[#0f2d5c] tracking-tight uppercase">
              Official Policy Brief
            </h1>
            <p className="text-sm font-semibold text-gray-700 mt-1">
              {topic} — Spatial Assessment & Regulatory Options
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 mt-3">
              <span><strong>Document ID:</strong> PB-2026-MH-4091</span>
              <span>·</span>
              <span><strong>Jurisdiction:</strong> {region}</span>
              <span>·</span>
              <span><strong>Horizon:</strong> {timePeriod}</span>
              <span>·</span>
              <span><strong>Classification:</strong> Statutory Advisory</span>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <section className="space-y-2">
            <h2 className="text-xs font-bold text-[#0f2d5c] uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-200 pb-1">
              <FileText size={14} /> 1. Executive Summary
            </h2>
            <p className="text-xs md:text-sm text-gray-700 leading-relaxed text-justify">
              This policy brief assesses the statutory implications of proposed agricultural land conversion within <strong>{region}</strong> under the <em>{scenario}</em> framework. Based on verified cadastre data (ULPIN registry) and multi-spectral satellite observations, the jurisdiction has registered a cumulative reduction of <strong>7.5% in cultivable holdings</strong> over the past decade. If unmanaged, conversion at the projected rate will yield an economic uplift of ₹340 Cr/annum (+24%) in secondary municipal services, but will concurrently produce a <strong>16% degradation in local grain self-sufficiency</strong> and a <strong>28% escalation in aquifer drawdown</strong> across critical sub-basins.
            </p>
          </section>

          {/* Section 2: Current Status & Evidence */}
          <section className="space-y-2">
            <h2 className="text-xs font-bold text-[#0f2d5c] uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-200 pb-1">
              <Layers size={14} /> 2. Current Land-Use Status & Data Evidence
            </h2>
            <div className="grid sm:grid-cols-3 gap-3 my-3">
              <div className="bg-gray-50 border border-gray-200 p-3 rounded text-center">
                <span className="text-[10px] text-gray-500 uppercase font-bold block">Current Agri Area</span>
                <span className="text-lg font-bold text-[#1a6b3c]">1,84,200 Ha</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">62% of regional cadastre</span>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-3 rounded text-center">
                <span className="text-[10px] text-gray-500 uppercase font-bold block">Annual Conversion Rate</span>
                <span className="text-lg font-bold text-[#e07b2a]">1,400 Ha/yr</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">3.4x rate since 2018</span>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-3 rounded text-center">
                <span className="text-[10px] text-gray-500 uppercase font-bold block">Aquifer Water Table</span>
                <span className="text-lg font-bold text-red-600">12m Depth</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">-2.1m drop over 5 years</span>
              </div>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed text-justify">
              Spatial cross-referencing against the Maharashtra Land Records database indicates that 68% of Non-Agricultural (NA) permissions were approved within a 3.5 km radius of major transport spines (NH-48 and Pune Ring Road alignments). Soil classification within 42% of converted zones belongs to Grade-I Deep Black Cotton soil, representing an irreversible extraction of high-fertility arable land.
            </p>
          </section>

          {/* Section 3: Policy Options */}
          <section className="space-y-2">
            <h2 className="text-xs font-bold text-[#0f2d5c] uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-200 pb-1">
              <Sliders size={14} /> 3. Strategic Policy Options
            </h2>
            <div className="space-y-2.5 pt-1">
              <div className="border-l-2 border-[#0f2d5c] pl-3 py-0.5">
                <span className="text-xs font-bold text-gray-900 block">Option A: Unrestricted Market-Driven Conversion (Status Quo)</span>
                <p className="text-xs text-gray-600 mt-0.5">Permit automated Section 44 NA conversion subject only to Ready Reckoner premium payments. High economic yield; acute water and food security vulnerability.</p>
              </div>
              <div className="border-l-2 border-[#1a6b3c] pl-3 py-0.5">
                <span className="text-xs font-bold text-[#1a6b3c] block">Option B: Agro-Ecological Growth Boundary (Recommended)</span>
                <p className="text-xs text-gray-600 mt-0.5">Impose a statutory Urban Growth Boundary (UGB) with strict preservation of Grade-I black soil parcels. Redirect commercial logistics to degraded land clusters and designated industrial parks.</p>
              </div>
              <div className="border-l-2 border-[#e07b2a] pl-3 py-0.5">
                <span className="text-xs font-bold text-gray-900 block">Option C: Transferable Development Rights (TDR) Compensation</span>
                <p className="text-xs text-gray-600 mt-0.5">Compensate agrarian landholders with transferable development rights in brownfield urban zones in exchange for perpetual green conservation easements.</p>
              </div>
            </div>
          </section>

          {/* Section 4: Expected Impact Assessment */}
          <section className="space-y-2">
            <h2 className="text-xs font-bold text-[#0f2d5c] uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-200 pb-1">
              <AlertTriangle size={14} /> 4. Multi-Sector Impact Matrix
            </h2>
            <table className="w-full text-xs text-left border border-gray-200 my-2">
              <thead className="bg-gray-100 text-gray-700 font-bold">
                <tr>
                  <th className="p-2 border-r border-gray-200">Dimension</th>
                  <th className="p-2 border-r border-gray-200">5-Year Projected</th>
                  <th className="p-2 border-r border-gray-200">10-Year Horizon</th>
                  <th className="p-2">Mitigation Feasibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-2 font-medium border-r border-gray-200">Economic Output</td>
                  <td className="p-2 text-green-700 border-r border-gray-200">+12% (₹1,590 Cr)</td>
                  <td className="p-2 text-green-700 border-r border-gray-200">+24% (₹1,760 Cr)</td>
                  <td className="p-2">High (Private investment)</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium border-r border-gray-200">Agricultural Yield</td>
                  <td className="p-2 text-red-600 border-r border-gray-200">-8% local production</td>
                  <td className="p-2 text-red-600 border-r border-gray-200">-16% local production</td>
                  <td className="p-2">Low (Soil irreversible)</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium border-r border-gray-200">Groundwater Depletion</td>
                  <td className="p-2 text-orange-600 border-r border-gray-200">+14% stress</td>
                  <td className="p-2 text-red-600 border-r border-gray-200">+28% stress</td>
                  <td className="p-2">Medium (Recharge mandates)</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Section 5: Statutory Recommendation */}
          <section className="space-y-2 bg-[#1a6b3c]/5 border border-[#1a6b3c]/20 p-4 rounded-lg">
            <h2 className="text-xs font-bold text-[#1a6b3c] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck size={16} /> 5. Institutional Recommendation
            </h2>
            <p className="text-xs text-gray-800 leading-relaxed font-medium">
              It is formally recommended that the District Land Use Committee and Divisional Commissioner approve <strong>Option B</strong>. Under this directive, applications for Section 44 NA conversion exceeding 2.0 Hectares within Haveli Taluka must mandate an autonomous <strong>Digital Soil & Groundwater Clearance (DSGC)</strong> generated by the BhuNirnay National Cadastre Platform prior to revenue adjudication.
            </p>
          </section>

          {/* Section 6: Sources & Verification */}
          <section className="space-y-2 pt-2 border-t border-gray-200 text-[11px] text-gray-500">
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase text-gray-600">Authoritative Sources:</span>
              <span className="text-green-700 font-bold">● 98.4% Telemetry Grounded</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Department of Land Resources (DoLR), MoRD — Cadastral Survey Registry 2024</li>
              <li>ISRO NRSC Bhuvan Spatial Observatory (LISS-IV Agro-Classification v3.1)</li>
              <li>Central Ground Water Board (CGWB) Western Zone Hydrogeological Bulletin</li>
              <li>Maharashtra Land Revenue Code 1966 & Regional Development Masterplan 2031</li>
            </ul>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}

