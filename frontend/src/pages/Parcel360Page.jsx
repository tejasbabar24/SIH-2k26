import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { Map, CheckCircle, AlertTriangle, Clock, ChevronRight, Download, BarChart2, Lightbulb, ArrowLeft } from 'lucide-react';
import { PageLayout } from '../components/layout/Layout';
import { PageHeader, Badge, GovButton, RiskBadge, InfoRow, DemoBanner, Card, LoadingOverlay } from '../components/ui';
import { parcelGeoJSON, mockParcels, getParcelById } from '../data/parcels';
import { useApp } from '../App';
import L from 'leaflet';

const history = [
  { year: '2019', event: 'Original Survey Record', icon: '📋', status: 'complete' },
  { year: '2021', event: 'Mutation Entry — Change of Ownership', icon: '📝', status: 'complete' },
  { year: '2023', event: 'Land Classification Updated (Non-Agri)', icon: '🏷️', status: 'complete' },
  { year: '2025', event: 'Survey Verification — Digital Cadastre', icon: '✅', status: 'complete' },
  { year: '2026', event: 'Current Active Record', icon: '⭐', status: 'current' },
];

export default function Parcel360Page() {
  const { id } = useParams();
  const { selectedParcel: globalParcel, setSelectedParcel: setGlobalParcel, showToast } = useApp();
  const navigate = useNavigate();
  const [parcel, setParcel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      let p = id ? getParcelById(id) : null;
      if (!p && globalParcel) p = globalParcel;
      if (!p) p = mockParcels[0];
      setParcel(p);
      setLoading(false);
    }, 700);
  }, [id, globalParcel]);

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-80">
          <LoadingOverlay message="Loading parcel data..." />
        </div>
      </PageLayout>
    );
  }

  if (!parcel) return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center h-80 text-gray-500">
        <Map size={48} className="mb-4 text-gray-200" />
        <p className="text-lg font-medium">Parcel Not Found</p>
        <Link to="/gis" className="mt-4 text-sm text-[#0f2d5c] underline">Return to GIS Map</Link>
      </div>
    </PageLayout>
  );

  const singleParcelGeo = {
    type: 'FeatureCollection',
    features: parcelGeoJSON.features.filter(f => f.properties.id === parcel.id)
  };

  const tabs = ['overview', 'environment', 'infrastructure', 'history'];

  return (
    <PageLayout>
      <PageHeader
        label="PARCEL 360 · FULL INTELLIGENCE VIEW"
        title={`Parcel 360 — ${parcel.id}`}
        breadcrumb={`Home / GIS Map / Parcel 360 / ${parcel.id}`}
        subtitle={`${parcel.village}, ${parcel.taluka} Taluka · ${parcel.district} District · ULPIN: ${parcel.ulpin}`}
        actions={
          <>
            <DemoBanner message="DEMO RECORD · SIH PROTOTYPE" />
            <GovButton variant="outline" size="sm" onClick={() => navigate('/gis')}>
              <ArrowLeft size={14} /> Back to Map
            </GovButton>
            <GovButton variant="green" size="sm" onClick={() => showToast('Land profile PDF download simulated', 'success')}>
              <Download size={14} /> Download Profile
            </GovButton>
          </>
        }
      />

      <div className="p-6 space-y-6">
        {/* Top identity cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { label: 'Parcel ID', value: parcel.id, mono: true },
            { label: 'ULPIN', value: parcel.ulpin, mono: true },
            { label: 'Survey Number', value: parcel.surveyNumber },
            { label: 'Area', value: `${parcel.area} Ha` },
            { label: 'Village', value: parcel.village },
            { label: 'District', value: parcel.district },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
              <p className={`text-sm font-bold text-[#0f2d5c] ${item.mono ? 'font-mono' : ''}`}>{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="bg-[#0f2d5c] text-white px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs font-semibold flex items-center gap-2"><Map size={14} /> Cadastral Map View</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span className="text-[10px] text-blue-300">EPSG:4326 · Scale 1:10,000</span>
                </div>
              </div>
              <div className="h-64">
                <MapContainer
                  center={[18.458, 73.734]}
                  zoom={14}
                  className="h-full w-full"
                  zoomControl={true}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <GeoJSON
                    data={parcelGeoJSON}
                    style={(feature) => ({
                      fillColor: feature.properties.id === parcel.id ? '#e8a838' : '#4a9e5c',
                      fillOpacity: feature.properties.id === parcel.id ? 0.8 : 0.3,
                      color: feature.properties.id === parcel.id ? '#0f2d5c' : '#888',
                      weight: feature.properties.id === parcel.id ? 3 : 1,
                    })}
                  />
                </MapContainer>
              </div>
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <p className="text-[10px] text-gray-500">Khadakwasla Basin · {parcel.district} District · Maharashtra</p>
                <span className="text-[10px] font-bold text-[#1a6b3c]">✓ ACTIVE PARCEL</span>
              </div>
            </div>
          </div>

          {/* Status card */}
          <div className="space-y-4">
            {/* Title status */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">TITLE STATUS</p>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={20} className="text-[#1a6b3c]" />
                <div>
                  <p className="text-sm font-bold text-[#1a6b3c]">Clear Sovereign Title</p>
                  <p className="text-xs text-gray-500">100% REGISTERED</p>
                </div>
              </div>
              <div className="space-y-1">
                <InfoRow label="Status" value={<span className="text-green-700 font-bold">{parcel.status}</span>} />
                <InfoRow label="Mutation" value={parcel.mutationStatus} />
                <InfoRow label="Encumbrance" value={parcel.encumbrance} />
              </div>
            </div>

            {/* Classification */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">CLASSIFICATION</p>
              <p className="text-sm font-bold text-gray-800">{parcel.landUse}</p>
              <p className="text-xs text-gray-500 mt-1">{parcel.zoning}</p>
              <div className="mt-3">
                <p className="text-[10px] text-gray-400 mb-1">AREA</p>
                <p className="text-xl font-bold text-[#0f2d5c]">{parcel.area} Ha</p>
                <p className="text-xs text-gray-500">{parcel.areaM2} m²</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div>
          <div className="flex border-b border-gray-200 mb-4 overflow-x-auto">
            {tabs.map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`px-5 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors whitespace-nowrap
                  ${activeTab === t ? 'border-[#0f2d5c] text-[#0f2d5c]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                {t}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">LAND INFORMATION</p>
                <InfoRow label="Ownership Status" value="Private" />
                <InfoRow label="Land Classification" value={parcel.classification} />
                <InfoRow label="Current Land Use" value={parcel.landUse} />
                <InfoRow label="Mutation Status" value={parcel.mutationStatus} />
                <InfoRow label="Encumbrance" value={parcel.encumbrance || 'None'} />
                <InfoRow label="Zoning" value={parcel.zoning} />
                <InfoRow label="Hissa No." value={parcel.hissa} />
                <InfoRow label="Survey No." value={parcel.surveyNumber} />
              </Card>
              <Card>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">OWNERSHIP DETAILS</p>
                <InfoRow label="Owner Name" value={parcel.ownerName} />
                <InfoRow label="ULPIN" value={parcel.ulpin} mono />
                <InfoRow label="Village" value={parcel.village} />
                <InfoRow label="Taluka" value={parcel.taluka} />
                <InfoRow label="District" value={parcel.district} />
                <InfoRow label="State" value="Maharashtra" />
                <InfoRow label="Registration" value="Verified · Digitally Sealed" />
              </Card>
            </div>
          )}

          {activeTab === 'environment' && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">SOIL & WATER</p>
                <InfoRow label="Soil Type" value={parcel.soil} />
                <InfoRow label="Groundwater Depth" value={parcel.groundwater} />
                <InfoRow label="Groundwater Quality" value="Fit for Agriculture" />
                <InfoRow label="Irrigation Source" value="Well + Bore Well" />
                <InfoRow label="Crop Suitability" value="Jowar, Wheat, Soybean" />
              </Card>
              <Card>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">RISK ASSESSMENT</p>
                <InfoRow label="Flood Risk" value={<RiskBadge level={parcel.floodRisk} />} />
                <InfoRow label="Drought Risk" value={<RiskBadge level="Low" />} />
                <InfoRow label="Landslide Risk" value={<RiskBadge level="Low" />} />
                <InfoRow label="Seismic Zone" value="Zone III (Moderate)" />
                <InfoRow label="Forest Distance" value="> 5 km" />
                <InfoRow label="Water Body Distance" value="2.8 km" />
              </Card>
            </div>
          )}

          {activeTab === 'infrastructure' && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">CONNECTIVITY</p>
                <InfoRow label="Nearest Road" value={parcel.nearestRoad} />
                <InfoRow label="Nearest Railway" value={parcel.nearestRailway} />
                <InfoRow label="Nearest Urban Centre" value="Pune City — 28 km" />
                <InfoRow label="Nearest Hospital" value="Khadakwasla PHC — 1.2 km" />
                <InfoRow label="Nearest School" value="ZP School — 0.9 km" />
              </Card>
              <Card>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">UTILITIES</p>
                <InfoRow label="Electricity Grid" value="Available (MSEDCL)" />
                <InfoRow label="Water Supply" value="Available (NMC)" />
                <InfoRow label="Sewage" value="Not connected" />
                <InfoRow label="Telecom" value="4G Coverage — Jio, Airtel" />
                <InfoRow label="Gas Pipeline" value="Not available" />
              </Card>
            </div>
          )}

          {activeTab === 'history' && (
            <Card>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">PARCEL HISTORY TIMELINE</p>
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
                <div className="space-y-4">
                  {history.map((h, i) => (
                    <div key={i} className="relative flex items-start gap-4 pl-12">
                      <div className={`absolute left-4 top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center text-[10px]
                        ${h.status === 'current' ? 'border-[#1a6b3c] bg-[#1a6b3c]' : 'border-gray-300 bg-white'}`}>
                        {h.status === 'current' && <span className="text-white text-[8px]">●</span>}
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{h.icon}</span>
                          <div>
                            <p className="text-xs font-bold text-gray-500">{h.year}</p>
                            <p className="text-sm font-medium text-gray-800">{h.event}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Bottom actions */}
        <div className="flex flex-wrap gap-3">
          <GovButton variant="primary" onClick={() => navigate('/gis')}>
            <Map size={14} /> View on GIS Map
          </GovButton>
          <GovButton variant="green" onClick={() => navigate('/analytics')}>
            <BarChart2 size={14} /> Analyze Land
          </GovButton>
          <GovButton variant="outline" onClick={() => { setGlobalParcel(parcel); navigate('/dev-suggestions'); }}>
            <Lightbulb size={14} /> Development Suggestions
          </GovButton>
          <GovButton variant="ghost" onClick={() => navigate('/documents')}>
            View Documents
          </GovButton>
        </div>
      </div>
    </PageLayout>
  );
}
