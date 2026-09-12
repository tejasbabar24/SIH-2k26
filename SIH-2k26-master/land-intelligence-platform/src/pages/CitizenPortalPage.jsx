import React, { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { User, Map, FolderOpen, ChevronRight, Download, Plus, Gift, ExternalLink, AlertCircle, Clock, CheckCircle2, FileText, X, ShieldAlert } from 'lucide-react';
import { PageLayout } from '../components/layout/Layout';
import { PageHeader, Card, GovButton, DemoBanner, Badge, InfoRow } from '../components/ui';
import { mockParcels, parcelGeoJSON } from '../data/parcels';
import { useApp } from '../App';
import { useNavigate } from 'react-router-dom';

const citizenParcels = [
  { ...mockParcels[0], nickname: 'Main Plot — Khadakwasla' },
  { ...mockParcels[4], nickname: 'Agri Plot — Nanded', area: '1.60', landUse: 'Agricultural' },
];

const quickDocs = [
  { name: 'Title Deed (Sale Certificate)', ref: 'Survey 142/3-A · Reg #49281-ND', icon: '📄', locked: true },
  { name: 'Tax Receipt (FY 2024-25)', ref: 'Survey 142/3-A · Paid & Verified', icon: '🧾', locked: false },
  { name: '7/12 Extract', ref: 'Survey 142/3-A · Latest', icon: '📋', locked: true },
];

const matchedScheme = {
  name: 'PM Krishi Sinchayee Yojana',
  reason: 'Your land holding is under 2 Ha — Eligible for micro-irrigation subsidy',
  category: 'Micro-Irrigation Subsidy',
  level: 'Taluka Level',
  status: 'Likely Eligible',
};

export default function CitizenPortalPage() {
  const { role, setLoginModal, showToast } = useApp();
  const navigate = useNavigate();
  const [activeParcel, setActiveParcel] = useState(0);
  const [showGrievanceModal, setShowGrievanceModal] = useState(false);
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [disputes, setDisputes] = useState([
    {
      id: 'DISP-2026-0412',
      title: 'Boundary Demarcation & Survey Correction',
      parcelId: 'MH-PN-4091',
      surveyNo: '142/3-A',
      date: '12 Jan 2026',
      status: 'Under Field Inspection',
      officer: 'Talathi Circle 4 (S. B. Jadhav)',
      stage: 3,
    }
  ]);

  if (!role || role !== 'citizen') {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
          <div className="w-20 h-20 bg-[#0f2d5c]/5 rounded-full flex items-center justify-center mb-4">
            <User size={36} className="text-[#0f2d5c]" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Citizen Portal</h2>
          <p className="text-sm text-gray-500 max-w-sm mb-6">
            Sign in as a Citizen to access your land dashboard, documents, and scheme recommendations.
          </p>
          <GovButton variant="primary" size="lg" onClick={() => setLoginModal(true)}>
            <User size={16} /> Sign In as Citizen
          </GovButton>
          <p className="text-xs text-gray-400 mt-4">Demo mode — no real authentication</p>
        </div>
      </PageLayout>
    );
  }

  const parcel = citizenParcels[activeParcel];
  const totalArea = citizenParcels.reduce((s, p) => s + parseFloat(p.area), 0).toFixed(2);

  const singleGeo = {
    type: 'FeatureCollection',
    features: parcelGeoJSON.features.filter(f => f.properties.id === parcel.id)
  };

  return (
    <PageLayout>
      <PageHeader
        label="OFFICIAL RECORD DOSSIER · ROR / JAMABANDI LINKED"
        title="My Land Dashboard"
        subtitle={`Welcome back, Rajesh Sharma · North Taluk Circle`}
        actions={
          <>
            <DemoBanner message="DEMO CITIZEN PORTAL" />
            <GovButton variant="outline" size="sm" onClick={() => showToast('Add parcel — demo mode', 'success')}>
              <Plus size={14} /> Add Parcel
            </GovButton>
            <GovButton variant="green" size="sm" onClick={() => { window.print(); showToast('Compiling official Land Profile Dossier (PDF)...', 'success'); }}>
              <Download size={14} /> Download Land Profile (PDF)
            </GovButton>
          </>
        }
      />

      {/* Alert bar */}
      <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center gap-3">
        <div className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">!</div>
        <p className="text-xs text-amber-800">
          <strong>Tax receipt expires in 12 days</strong> · FY 2024-25 North Taluk Revenue Assessment
        </p>
        <button onClick={() => setShowRenewalModal(true)} className="ml-auto text-xs text-amber-700 font-semibold hover:underline">Renew Online →</button>
      </div>

      <div className="p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* KPI row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">NUMBER OF PARCELS</p>
                <p className="text-2xl font-bold text-[#0f2d5c]">2 Active</p>
                <p className="text-xs text-gray-500 mt-1">Validated under Taluk Survey</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">TOTAL CADASTRAL AREA</p>
                <p className="text-2xl font-bold text-[#0f2d5c]">{totalArea} Ha</p>
                <p className="text-xs text-gray-500 mt-1">Across 2 revenue subdivisions</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">PRIMARY CLASSIFICATION</p>
                <p className="text-xl font-bold text-[#0f2d5c]">Agricultural</p>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded mt-1">✓ Verified</span>
              </div>
            </div>

            {/* Parcels */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-gray-900">Registered Parcels <span className="text-sm font-normal text-gray-400 ml-1">2</span></h2>
                <span className="text-xs text-gray-400">Survey Cadastre v2.4</span>
              </div>

              <div className="space-y-4">
                {citizenParcels.map((p, i) => (
                  <div key={i} className={`bg-white border-2 rounded-xl shadow-sm overflow-hidden cursor-pointer transition-all
                    ${activeParcel === i ? 'border-[#0f2d5c]' : 'border-gray-200 hover:border-gray-300'}`}
                    onClick={() => setActiveParcel(i)}>
                    <div className="flex">
                      {/* Mini map */}
                      <div className="w-40 h-32 shrink-0 relative overflow-hidden">
                        <MapContainer
                          center={[18.458, 73.735]}
                          zoom={12}
                          className="h-full w-full"
                          zoomControl={false}
                          attributionControl={false}
                          dragging={false}
                          scrollWheelZoom={false}
                        >
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <GeoJSON
                            data={parcelGeoJSON}
                            style={(f) => ({
                              fillColor: f.properties.id === p.id ? '#1a6b3c' : '#ccc',
                              fillOpacity: f.properties.id === p.id ? 0.7 : 0.2,
                              color: f.properties.id === p.id ? '#0f2d5c' : '#aaa',
                              weight: f.properties.id === p.id ? 2 : 0.5,
                            })}
                          />
                        </MapContainer>
                        <div className="absolute inset-0 flex items-end p-1.5">
                          <span className="bg-white/80 text-[9px] font-bold text-gray-700 px-1.5 py-0.5 rounded">{p.id}</span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">CADASTRAL LOCATION</p>
                            <p className="text-sm font-bold text-gray-900 mt-0.5">
                              {p.nickname}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">{p.village} · {p.taluka} Taluka</p>
                          </div>
                          <Badge color={p.landUse === 'Agricultural' ? 'green' : 'orange'}>
                            {p.landUse === 'Agricultural' ? 'Agricultural' : 'Mixed / Agro'}
                          </Badge>
                        </div>

                        <div className="mt-3">
                          <p className="text-[10px] text-gray-400 uppercase font-bold">Registered Area</p>
                          <p className="text-lg font-bold text-[#0f2d5c]">{p.area} Hectares</p>
                        </div>

                        <div className="flex gap-2 mt-3">
                          <GovButton variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/parcel360/${p.id}`); }}>
                            View Details →
                          </GovButton>
                          <GovButton variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate('/documents'); }}>
                            <FolderOpen size={13} /> Documents
                          </GovButton>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Land Dispute & Grievance Tracker */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <ShieldAlert size={18} className="text-[#0f2d5c]" />
                    Land Dispute & Grievance Tracker
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">Track land boundary disputes, mutation rectifications, and revenue objections</p>
                </div>
                <GovButton variant="outline" size="sm" onClick={() => setShowGrievanceModal(true)}>
                  <Plus size={13} /> Lodge Grievance
                </GovButton>
              </div>

              {disputes.map((d) => (
                <div key={d.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#0f2d5c] bg-blue-100 px-2 py-0.5 rounded">{d.id}</span>
                        <span className="text-sm font-bold text-gray-800">{d.title}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Parcel: {d.parcelId} · Survey {d.surveyNo} · Assigned: {d.officer}</p>
                    </div>
                    <Badge color="orange">● {d.status}</Badge>
                  </div>

                  {/* Stepper */}
                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-gray-200 text-center">
                    {[
                      { step: 1, label: 'Lodge Grievance' },
                      { step: 2, label: 'Talathi Scrutiny' },
                      { step: 3, label: 'Field Survey' },
                      { step: 4, label: 'Order / Rectification' },
                    ].map((s) => (
                      <div key={s.step} className="space-y-1">
                        <div className={`h-1.5 rounded-full ${s.step <= d.stage ? 'bg-[#1a6b3c]' : 'bg-gray-200'}`} />
                        <p className={`text-[10px] ${s.step === d.stage ? 'font-bold text-[#1a6b3c]' : 'text-gray-400'}`}>
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            {/* Doc vault quick access */}
            <Card>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <FolderOpen size={15} className="text-[#0f2d5c]" /> Document Vault Quick Access
                </h3>
                <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">🔒 Protected</span>
              </div>

              <div className="space-y-2">
                {quickDocs.map((d, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate('/documents')}>
                    <span className="text-xl">{d.icon}</span>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-800">{d.name}</p>
                      <p className="text-[10px] text-gray-400">{d.ref}</p>
                    </div>
                    <span className="text-gray-300">{d.locked ? '🔒' : '✓'}</span>
                  </div>
                ))}
              </div>

              <button onClick={() => navigate('/documents')}
                className="w-full mt-3 text-sm font-semibold text-[#0f2d5c] hover:text-[#1a3f7a] text-right flex items-center justify-end gap-1">
                Open Document Vault <ChevronRight size={14} />
              </button>
            </Card>

            {/* Scheme match */}
            <Card>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <Gift size={11} /> MATCHED SCHEME PREVIEW
                </p>
                <Badge color="green">Likely Eligible</Badge>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-[#1a6b3c] rounded-full flex items-center justify-center text-white text-lg">🏛️</div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{matchedScheme.name}</p>
                  <p className="text-[10px] text-gray-500">{matchedScheme.reason}</p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 bg-[#1a6b3c] rounded-full flex items-center justify-center">
                    <span className="text-white text-[10px]">✓</span>
                  </div>
                  <span className="text-xs text-green-800 font-medium">{matchedScheme.category}</span>
                </div>
                <span className="text-[10px] text-green-600">{matchedScheme.level}</span>
              </div>

              <button onClick={() => navigate('/schemes')}
                className="w-full mt-3 text-sm font-semibold text-[#0f2d5c] hover:text-[#1a3f7a] text-right flex items-center justify-end gap-1">
                View Application Process <ChevronRight size={14} />
              </button>
            </Card>

            {/* Quick links */}
            <Card>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">QUICK ACTIONS</p>
              <div className="space-y-2">
                {[
                  { label: 'View GIS Map', to: '/gis', icon: Map },
                  { label: 'Document Vault', to: '/documents', icon: FolderOpen },
                  { label: 'Govt Schemes', to: '/schemes', icon: Gift },
                  { label: 'Audit Trail', to: '/audit', icon: ExternalLink },
                ].map((link, i) => {
                  const Icon = link.icon;
                  return (
                    <button key={i} onClick={() => navigate(link.to)}
                      className="w-full flex items-center gap-2 text-sm text-gray-700 hover:text-[#0f2d5c] py-2 border-b border-gray-50 last:border-0 transition-colors">
                      <Icon size={14} className="text-gray-400" />
                      {link.label}
                      <ChevronRight size={13} className="ml-auto text-gray-300" />
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Grievance Lodging Modal */}
      {showGrievanceModal && (
        <div className="fixed inset-0 z-[9998] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="bg-[#0f2d5c] text-white px-5 py-4 rounded-t-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert size={18} />
                <h3 className="font-bold text-base">Lodge Land Dispute / Grievance</h3>
              </div>
              <button onClick={() => setShowGrievanceModal(false)} className="text-blue-200 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const newGrievance = {
                id: `DISP-2026-0${Math.floor(400 + Math.random() * 500)}`,
                title: 'Encroachment / Boundary Verification',
                parcelId: citizenParcels[activeParcel].id,
                surveyNo: citizenParcels[activeParcel].surveyNumber,
                date: 'Today',
                status: 'Submitted to Tehsildar',
                officer: 'Revenue Circle Office',
                stage: 1,
              };
              setDisputes([newGrievance, ...disputes]);
              setShowGrievanceModal(false);
              showToast('Grievance logged with official Token ID', 'success');
            }} className="p-5 space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Select Parcel</label>
                <select className="w-full border border-gray-300 rounded-lg p-2.5 text-xs">
                  {citizenParcels.map(p => (
                    <option key={p.id}>{p.id} · Survey {p.surveyNumber} ({p.nickname})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Dispute Classification</label>
                <select className="w-full border border-gray-300 rounded-lg p-2.5 text-xs">
                  <option>Boundary Demarcation & Area Correction (Hissa Survey)</option>
                  <option>Encroachment on Sovereign Right of Way (Panand Road)</option>
                  <option>Mutation Record Discrepancy (Ferfar Correction)</option>
                  <option>Heirship / Succession Name Rectification</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Details / Grounds for Objection</label>
                <textarea rows={3} placeholder="Provide survey coordinates, neighboring boundaries or discrepancy notes..." className="w-full border border-gray-300 rounded-lg p-2.5 text-xs" required />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <GovButton variant="ghost" type="button" onClick={() => setShowGrievanceModal(false)}>Cancel</GovButton>
                <GovButton variant="primary" type="submit">Submit to Taluk Office</GovButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tax Renewal Modal */}
      {showRenewalModal && (
        <div className="fixed inset-0 z-[9998] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="bg-[#1a6b3c] text-white px-5 py-4 rounded-t-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} />
                <h3 className="font-bold text-base">Renew Land Revenue Assessment</h3>
              </div>
              <button onClick={() => setShowRenewalModal(false)} className="text-green-200 hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-900 space-y-1">
                <p><strong>Assessment Period:</strong> FY 2025-26</p>
                <p><strong>Total Annual Cess:</strong> ₹1,240.00 (Haveli Circle)</p>
                <p><strong>Payer:</strong> Rajesh Sharma (Survey 142/3-A)</p>
              </div>
              <p className="text-xs text-gray-500">
                Direct integration with State Treasury e-Challan / MahaDBT Payment Gateway.
              </p>
              <div className="flex gap-2 justify-end">
                <GovButton variant="ghost" onClick={() => setShowRenewalModal(false)}>Cancel</GovButton>
                <GovButton variant="green" onClick={() => {
                  setShowRenewalModal(false);
                  showToast('Assessment paid & sealed receipt deposited into Document Vault', 'success');
                }}>
                  Pay via UPI / e-Challan (₹1,240)
                </GovButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
