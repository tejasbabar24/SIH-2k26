import React, { useState } from 'react';
import { Gift, CheckCircle2, ChevronRight, FileText, ArrowRight, Filter, Search, Info, ExternalLink, HelpCircle } from 'lucide-react';
import { PageLayout } from '../components/layout/Layout';
import { PageHeader, Card, GovButton, DemoBanner, Badge } from '../components/ui';
import { schemes, states, districtsByState, purposeOptions } from '../data/schemes';
import { useApp } from '../App';

export default function SchemeFinderPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState('Pune');
  const [holdingSize, setHoldingSize] = useState('small'); // 'marginal' (<1 Ha), 'small' (1-2 Ha), 'medium' (2-10 Ha), 'large' (>10 Ha)
  const [selectedPurpose, setSelectedPurpose] = useState('Agriculture / Farming');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScheme, setSelectedScheme] = useState(null);
  const { showToast } = useApp();

  const holdingOptions = [
    { id: 'marginal', label: 'Marginal Farmer', sub: 'Up to 1.00 Hectare (2.47 Acres)' },
    { id: 'small', label: 'Small Farmer', sub: '1.00 to 2.00 Hectares (2.47 - 4.94 Acres)' },
    { id: 'medium', label: 'Semi-Medium / Medium', sub: '2.00 to 10.00 Hectares' },
    { id: 'large', label: 'Large Farmer / Corporate', sub: 'Above 10.00 Hectares' },
  ];

  // Filter schemes based on selections & search
  const filteredSchemes = schemes.filter(s => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    }
    // General match logic
    if (holdingSize === 'small' || holdingSize === 'marginal') {
      return true;
    }
    return s.category !== 'Housing' || selectedPurpose.includes('Housing');
  });

  const handleApply = (scheme) => {
    showToast(`Application draft initiated for ${scheme.shortName || scheme.name}`, 'success');
  };

  return (
    <PageLayout>
      <PageHeader
        label="DIRECT BENEFIT TRANSFER & INCENTIVES"
        title="Government Scheme Finder"
        subtitle="Discover national and state land-linked welfare schemes, subsidies and credit programs tailored to your holding."
        actions={<DemoBanner message="SCHEME DISCOVERY WIZARD · PROTOTYPE DATA" />}
      />

      <div className="p-6 space-y-6">
        {/* Wizard Stepper Card */}
        <Card className="bg-gradient-to-r from-white via-blue-50/20 to-white border-blue-100">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
            <div>
              <p className="text-[10px] font-bold text-[#0f2d5c] uppercase tracking-widest">WIZARD STEPS</p>
              <h2 className="text-base font-bold text-gray-800">Custom Eligibility Matcher</h2>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
              Step {currentStep} of 4
            </div>
          </div>

          {/* Stepper indicators */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {[
              { step: 1, title: 'State' },
              { step: 2, title: 'District' },
              { step: 3, title: 'Holding Size' },
              { step: 4, title: 'Purpose' },
            ].map((st) => (
              <button
                key={st.step}
                onClick={() => setCurrentStep(st.step)}
                className={`flex items-center gap-2 p-2.5 rounded-lg text-left transition-all border ${
                  currentStep === st.step
                    ? 'bg-[#0f2d5c] text-white border-[#0f2d5c] shadow-sm'
                    : currentStep > st.step
                    ? 'bg-green-50 text-green-800 border-green-200'
                    : 'bg-gray-50 text-gray-500 border-gray-200'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                    currentStep === st.step
                      ? 'bg-white text-[#0f2d5c]'
                      : currentStep > st.step
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {currentStep > st.step ? '✓' : st.step}
                </div>
                <div className="truncate text-xs font-semibold">{st.title}</div>
              </button>
            ))}
          </div>

          {/* Step content */}
          <div className="p-4 bg-white border border-gray-100 rounded-lg min-h-[120px] flex flex-col justify-center">
            {currentStep === 1 && (
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Step 1: Select State / Union Territory</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {states.map(st => (
                    <button
                      key={st}
                      onClick={() => { setSelectedState(st); setCurrentStep(2); }}
                      className={`px-3 py-2 text-xs rounded-md border text-left font-medium transition-colors ${
                        selectedState === st
                          ? 'bg-[#0f2d5c] text-white border-[#0f2d5c]'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-700">Step 2: Select District ({selectedState})</label>
                  <button onClick={() => setCurrentStep(1)} className="text-xs text-[#0f2d5c] hover:underline">Change State</button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(districtsByState[selectedState] || ['Pune', 'Nashik', 'Nagpur', 'Satara']).map(dist => (
                    <button
                      key={dist}
                      onClick={() => { setSelectedDistrict(dist); setCurrentStep(3); }}
                      className={`px-3 py-2 text-xs rounded-md border text-left font-medium transition-colors ${
                        selectedDistrict === dist
                          ? 'bg-[#0f2d5c] text-white border-[#0f2d5c]'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {dist}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-700">Step 3: Total Land Holding Size</label>
                  <button onClick={() => setCurrentStep(2)} className="text-xs text-[#0f2d5c] hover:underline">Change District</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {holdingOptions.map(h => (
                    <button
                      key={h.id}
                      onClick={() => { setHoldingSize(h.id); setCurrentStep(4); }}
                      className={`p-3 rounded-lg border text-left transition-colors ${
                        holdingSize === h.id
                          ? 'bg-[#1a6b3c]/10 border-[#1a6b3c] text-gray-900 ring-1 ring-[#1a6b3c]'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-xs font-bold">{h.label}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{h.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-700">Step 4: Primary Agricultural / Land Purpose</label>
                  <button onClick={() => setCurrentStep(3)} className="text-xs text-[#0f2d5c] hover:underline">Change Holding</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {purposeOptions.map(p => (
                    <button
                      key={p}
                      onClick={() => { setSelectedPurpose(p); showToast(`Criteria updated: ${p} in ${selectedDistrict}`, 'success'); }}
                      className={`px-3 py-2 text-xs rounded-md border font-medium transition-colors ${
                        selectedPurpose === p
                          ? 'bg-[#0f2d5c] text-white border-[#0f2d5c]'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Active criteria summary chips */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-gray-100 text-xs">
            <span className="text-gray-400 font-medium">Active Match Profile:</span>
            <span className="bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded text-[11px]">{selectedState}</span>
            <span className="bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded text-[11px]">{selectedDistrict}</span>
            <span className="bg-green-100 text-green-800 font-semibold px-2 py-0.5 rounded text-[11px]">
              {holdingOptions.find(h => h.id === holdingSize)?.label}
            </span>
            <span className="bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded text-[11px]">{selectedPurpose}</span>
          </div>
        </Card>

        {/* Search and Results Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Gift className="text-[#1a6b3c]" size={18} />
                Matched Government Schemes
                <span className="text-xs bg-green-100 text-[#1a6b3c] font-bold px-2 py-0.5 rounded-full">
                  {filteredSchemes.length} Available
                </span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Targeted subsidies and incentives based on verified cadastre classifications.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Filter schemes by keyword..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-300 text-xs rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:border-[#0f2d5c]"
              />
            </div>
          </div>

          {/* Scheme Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSchemes.map((sc) => (
              <div
                key={sc.id}
                className="bg-white border border-gray-200 hover:border-[#1a6b3c] rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-blue-50 text-[#0f2d5c] border border-blue-100">
                      {sc.category}
                    </span>
                    {sc.matched ? (
                      <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 size={10} /> High Match
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        General Scheme
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-gray-900 leading-snug mb-1">
                    {sc.name}
                  </h4>
                  <p className="text-[11px] text-gray-500 mb-3">{sc.department}</p>

                  <div className="bg-gray-50 rounded-lg p-3 space-y-2 mb-3 text-xs">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">BENEFIT MAXIMUM</p>
                      <p className="text-xs font-bold text-[#1a6b3c]">{sc.maxBenefit}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">ELIGIBILITY</p>
                      <p className="text-[11px] text-gray-700 line-clamp-2">{sc.eligibility}</p>
                    </div>
                  </div>

                  {sc.matchReason && (
                    <div className="bg-green-50/60 border border-green-200 rounded p-2 mb-3">
                      <p className="text-[11px] text-green-800 font-medium leading-tight">
                        💡 <strong>Why matched:</strong> {sc.matchReason}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">REQUIRED DOCUMENTS</p>
                    <div className="flex flex-wrap gap-1">
                      {sc.documents.map((d, i) => (
                        <span key={i} className="text-[10px] bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-600">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedScheme(sc)}
                    className="text-xs font-semibold text-[#0f2d5c] hover:underline flex items-center gap-1"
                  >
                    View Details <Info size={12} />
                  </button>
                  <GovButton variant="green" size="sm" onClick={() => handleApply(sc)}>
                    Apply Online →
                  </GovButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scheme Detail Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 z-[9998] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
            <div className="bg-[#0f2d5c] text-white px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-green-300 font-bold uppercase tracking-wider">OFFICIAL PROGRAM GUIDELINE</p>
                <h3 className="text-base font-bold">{selectedScheme.name}</h3>
                <p className="text-xs text-blue-200">{selectedScheme.department}</p>
              </div>
              <button onClick={() => setSelectedScheme(null)} className="text-blue-200 hover:text-white text-lg">✕</button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto text-sm">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">PROGRAM OVERVIEW & BENEFITS</p>
                <p className="text-gray-800 leading-relaxed">{selectedScheme.benefits}</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-[10px] font-bold text-[#0f2d5c] uppercase tracking-wider mb-0.5">MAXIMUM FINANCIAL ASSISTANCE</p>
                <p className="text-base font-bold text-[#0f2d5c]">{selectedScheme.maxBenefit}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">ELIGIBILITY CRITERIA</p>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">{selectedScheme.eligibility}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">MANDATORY VERIFICATION DOSSIER</p>
                <ul className="space-y-1.5">
                  {selectedScheme.documents.map((doc, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-gray-700">
                      <CheckCircle2 size={13} className="text-[#1a6b3c]" />
                      <span>{doc}</span>
                      <span className="text-[10px] text-gray-400 ml-auto">(Available in Document Vault)</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                📌 <strong>Submission Note:</strong> Digital land documents linked to your ULPIN will be auto-attached during submission.
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
              <GovButton variant="ghost" onClick={() => setSelectedScheme(null)}>Close</GovButton>
              <GovButton variant="green" onClick={() => { handleApply(selectedScheme); setSelectedScheme(null); }}>
                Proceed with Pre-Filled RoR
              </GovButton>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}

