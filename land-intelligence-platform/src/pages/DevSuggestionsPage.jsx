import React, { useState } from 'react';
import { Lightbulb, CheckCircle, AlertTriangle, ChevronRight, Map, BarChart2 } from 'lucide-react';
import { PageLayout } from '../components/layout/Layout';
import { PageHeader, Card, GovButton, DemoBanner, Badge, RiskBadge } from '../components/ui';
import { mockParcels } from '../data/parcels';
import { useApp } from '../App';
import { useNavigate } from 'react-router-dom';

const analysisCards = [
  { label: 'Soil Type', value: 'Deep Black Cotton', icon: '🌱', detail: 'Suitable for Soybean, Jowar, Cotton', good: true },
  { label: 'Terrain', value: 'Flat / Gentle Slope', icon: '⛰️', detail: '0–3% gradient, stable', good: true },
  { label: 'Flood Risk', value: 'Low', icon: '🌊', detail: 'No historical inundation', good: true },
  { label: 'Road Connectivity', value: '0.8 km', icon: '🛣️', detail: 'State Highway 48 — Commercial Corridor', good: true },
  { label: 'Railway Proximity', value: '5.4 km', icon: '🚂', detail: 'Hadapsar Railway Station', good: true },
  { label: 'Water Proximity', value: '2.8 km', icon: '💧', detail: 'Khadakwasla Reservoir', good: true },
  { label: 'Urban Proximity', value: '28 km', icon: '🏙️', detail: 'Pune City Centre', good: true },
];

const suggestions = [
  {
    rank: 1,
    title: 'Logistics Hub',
    icon: '🏭',
    suitability: 82,
    pros: ['Highway connectivity', 'Railway proximity', 'Existing commercial activity', 'Adequate area (4.82 Ha)'],
    cons: ['Land conversion may be required (NA permission)', 'Environmental clearance for industrial use'],
    tag: 'High Suitability',
    tagColor: 'green',
    detail: 'The parcel\'s proximity to State Highway 48 and Hadapsar Railway Station makes it ideal for a last-mile logistics or warehousing hub. Flat terrain and black cotton soil provide stable construction foundation.'
  },
  {
    rank: 2,
    title: 'Commercial Development',
    icon: '🏢',
    suitability: 76,
    pros: ['Zoned Commercial C-2', 'Urban fringe location', 'Growing demand corridor'],
    cons: ['Road-widening required for access', 'Utility connections needed'],
    tag: 'Good Suitability',
    tagColor: 'blue',
    detail: 'Commercial zoning classification (C-2) allows retail, office, or mixed-use development. Proximity to Pune peri-urban growth corridor supports high commercial viability.'
  },
  {
    rank: 3,
    title: 'Community Agriculture',
    icon: '🌾',
    suitability: 64,
    pros: ['High-quality black cotton soil', 'Adequate groundwater (12m)', 'Low flood risk'],
    cons: ['Area below optimal farm size', 'Near commercial zone — not prime agri'],
    tag: 'Moderate Suitability',
    tagColor: 'orange',
    detail: 'Despite commercial zoning, the parcel\'s soil quality supports high-yield agriculture. Could be used for contract farming or urban agriculture initiatives pending zoning revision.'
  },
  {
    rank: 4,
    title: 'Urban Congestion Mitigation & Multi-Tier EV Parking',
    icon: '🚗',
    suitability: 89,
    pros: [
      'Mitigates high-density corridor bottlenecks (Dagdusheth / Core Market archetype)',
      '30% mandatory vertical greenery & stormwater harvesting reserve',
      'Smart multi-tier automated EV parking with pedestrianized transit plaza'
    ],
    cons: ['Requires inter-departmental NOC from Municipal Corporation and Traffic Police', 'Structured under Municipal Public-Private Partnership (PPP)'],
    tag: 'High Impact Priority',
    tagColor: 'green',
    detail: 'Spatial traffic & land-use composition analysis identifies severe peak bottlenecks. Proposes an automated multi-layer parking infrastructure with integrated ground-level pedestrian plazas, reducing street blockage by 44% and preserving local green cover.'
  },
];

export default function DevSuggestionsPage() {
  const [selected, setSelected] = useState(null);
  const { role, selectedParcel, showToast } = useApp();
  const navigate = useNavigate();

  const parcel = selectedParcel || mockParcels[0];

  return (
    <PageLayout>
      <PageHeader
        label="AI DECISION SUPPORT"
        title="AI Land Development Suggestions"
        subtitle="Explore potential uses based on geographic, environmental and infrastructure context."
        actions={
          <>
            <DemoBanner message="AI DECISION SUPPORT · DEMO" />
          </>
        }
      />

      <div className="p-6 space-y-6">
        {/* Disclaimer */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-800">Important Disclaimer</p>
            <p className="text-xs text-amber-700 mt-0.5">
              This is a decision-support prototype. Suggestions do not constitute legal approval, zoning permission or statutory authorization. All development activities must comply with applicable land laws, zoning regulations, and require appropriate government permissions.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Parcel + Analysis */}
          <div className="space-y-4">
            {/* Selected parcel */}
            <Card>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">SELECTED PARCEL</p>
              <div className="bg-[#0f2d5c]/5 rounded-lg p-3 mb-3">
                <p className="text-sm font-bold text-[#0f2d5c]">{parcel.id}</p>
                <p className="text-xs text-gray-500">{parcel.village}, {parcel.taluka} · {parcel.surveyNumber}</p>
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div><p className="text-gray-400 text-[10px]">AREA</p><p className="font-bold">{parcel.area} Ha</p></div>
                  <div><p className="text-gray-400 text-[10px]">ULPIN</p><p className="font-mono text-[11px]">{parcel.ulpin}</p></div>
                  <div><p className="text-gray-400 text-[10px]">USE</p><p className="font-bold">{parcel.landUse}</p></div>
                  <div><p className="text-gray-400 text-[10px]">STATUS</p><p className="font-bold text-green-700">{parcel.status}</p></div>
                </div>
              </div>
              <div className="flex gap-2">
                <GovButton variant="outline" size="sm" onClick={() => navigate('/gis')} className="flex-1 justify-center">
                  <Map size={13} /> View Map
                </GovButton>
                <GovButton variant="outline" size="sm" onClick={() => navigate(`/parcel360/${parcel.id}`)} className="flex-1 justify-center">
                  <BarChart2 size={13} /> Parcel 360
                </GovButton>
              </div>
            </Card>

            {/* Analysis cards */}
            <Card>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">PARCEL ANALYSIS</p>
              <div className="space-y-2">
                {analysisCards.map((a, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{a.icon}</span>
                      <div>
                        <p className="text-xs font-medium text-gray-700">{a.label}</p>
                        <p className="text-[10px] text-gray-400">{a.detail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-gray-800">{a.value}</span>
                      {a.good && <CheckCircle size={12} className="text-green-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right: Recommendations */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Lightbulb size={18} className="text-amber-500" />
                Recommended Land Uses
              </h2>
              <span className="text-xs text-gray-500">Based on AI analysis · Demo prototype</span>
            </div>

            {suggestions.map((s, i) => (
              <div key={i}
                className={`bg-white border-2 rounded-xl shadow-sm overflow-hidden transition-all cursor-pointer
                  ${selected === i ? 'border-[#0f2d5c] shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
                onClick={() => setSelected(selected === i ? null : i)}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{s.icon}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-gray-400">#{s.rank}</span>
                          <h3 className="text-base font-bold text-gray-900">{s.title}</h3>
                          <Badge color={s.tagColor}>{s.tag}</Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{s.detail}</p>
                      </div>
                    </div>
                    {/* Suitability meter */}
                    <div className="text-right shrink-0 ml-4">
                      <p className="text-[10px] text-gray-400 uppercase font-bold">SUITABILITY</p>
                      <p className="text-2xl font-bold text-[#0f2d5c]">{s.suitability}<span className="text-sm">/100</span></p>
                      <div className="w-20 h-1.5 bg-gray-100 rounded-full mt-1 ml-auto">
                        <div className="h-full rounded-full bg-[#1a6b3c]" style={{ width: `${s.suitability}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Pros/Cons */}
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      {s.pros.map((p, j) => (
                        <div key={j} className="flex items-start gap-1.5 mb-1">
                          <CheckCircle size={12} className="text-green-500 mt-0.5 shrink-0" />
                          <span className="text-xs text-gray-600">{p}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      {s.cons.map((c, j) => (
                        <div key={j} className="flex items-start gap-1.5 mb-1">
                          <AlertTriangle size={12} className="text-orange-400 mt-0.5 shrink-0" />
                          <span className="text-xs text-gray-500">{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {selected === i && (
                  <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 flex items-center gap-3">
                    <GovButton variant="primary" size="sm" onClick={(e) => { e.stopPropagation(); showToast('Analysis report generated — demo', 'success'); }}>
                      View Full Analysis
                    </GovButton>
                    <GovButton variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); showToast('Options comparison — demo mode', 'success'); }}>
                      Compare Options
                    </GovButton>
                    {role === 'officer' && (
                      <GovButton variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate('/policy'); }}>
                        Run Policy Simulation →
                      </GovButton>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
