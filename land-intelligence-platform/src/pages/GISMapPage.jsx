import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { Layers, Eye, EyeOff, ChevronRight, Map, X, Maximize, Crosshair, BarChart2, Lightbulb } from 'lucide-react';
import { PageLayout } from '../components/layout/Layout';
import { PageHeader, Badge, GovButton, RiskBadge, InfoRow, DemoBanner, LoadingOverlay } from '../components/ui';
import { parcelGeoJSON, getParcelBySearch } from '../data/parcels';
import { useApp } from '../App';
import L from 'leaflet';

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const LAYERS_CONFIG = [
  { id: 'cadastral', label: 'Cadastral Boundaries', defaultOn: true },
  { id: 'landuse', label: 'Land Use', defaultOn: true },
  { id: 'agricultural', label: 'Agricultural Land', defaultOn: false },
  { id: 'forest', label: 'Forest & Eco Reserve', defaultOn: false },
  { id: 'water', label: 'Water Bodies', defaultOn: false },
  { id: 'roads', label: 'Roads', defaultOn: false },
  { id: 'flood', label: 'Flood Hazard', defaultOn: false },
];

const landUseColors = {
  'Agricultural': '#4a9e5c',
  'Forest': '#2d7a45',
  'Non-Agri / Commercial': '#e8a838',
  'Commercial': '#e8a838',
  'Non-Agri / Industrial': '#c47d3a',
  'Industrial': '#c47d3a',
  'Residential': '#5b8dd9',
  'Water Body': '#5ba8d9',
  'Forest / Eco Reserve': '#2d7a45',
};

function ParcelInfoPanel({ parcel, onClose, onViewParcel, onDev }) {
  if (!parcel) return null;
  const statusColor = parcel.status === 'Verified' ? 'green' : parcel.status === 'Protected' ? 'blue' : 'orange';

  return (
    <div className="absolute right-0 top-0 bottom-0 w-72 bg-white border-l border-gray-200 shadow-xl z-[1000] flex flex-col overflow-hidden">
      <div className="bg-[#0f2d5c] text-white px-4 py-3 flex items-start justify-between">
        <div>
          <p className="font-bold text-sm">#{parcel.id}</p>
          <p className="text-[10px] text-blue-300 mt-0.5">{parcel.village} · {parcel.taluka} Taluka</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${parcel.status === 'Verified' ? 'bg-green-500' : parcel.status === 'Protected' ? 'bg-blue-500' : 'bg-orange-500'}`}>
              ● {parcel.status}
            </span>
          </div>
        </div>
        <button onClick={onClose} className="text-blue-300 hover:text-white p-1"><X size={16} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
        {/* Location */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">LOCATION</p>
          <p className="text-sm font-semibold text-gray-800">{parcel.taluka} Taluka, Sector 14-B</p>
          <p className="text-xs text-gray-500">{parcel.district} District, Maharashtra</p>
        </div>

        {/* Key stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50 rounded-lg p-2.5">
            <p className="text-[9px] text-gray-400 uppercase font-bold">LAND AREA</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">{parcel.area} Ha</p>
            <p className="text-[10px] text-gray-500">{parcel.areaM2} m²</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2.5">
            <p className="text-[9px] text-gray-400 uppercase font-bold">SURVEY</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">{parcel.surveyNumber}</p>
            <p className="text-[10px] text-gray-500">Hissa {parcel.hissa}</p>
          </div>
        </div>

        {/* ULPIN */}
        <div className="bg-[#0f2d5c]/5 border border-[#0f2d5c]/10 rounded-lg p-2.5">
          <p className="text-[9px] text-gray-400 uppercase font-bold mb-0.5">ULPIN</p>
          <p className="font-mono text-sm font-bold text-[#0f2d5c]">{parcel.ulpin}</p>
        </div>

        {/* Details */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">LAND DETAILS</p>
          <InfoRow label="Land Use" value={parcel.landUse} />
          <InfoRow label="Soil Type" value={parcel.soil} />
          <InfoRow label="Groundwater" value={parcel.groundwater} />
          <InfoRow label="Flood Risk" value={<RiskBadge level={parcel.floodRisk} />} />
          <InfoRow label="Nearest Road" value={parcel.nearestRoad} />
          <InfoRow label="Nearest Railway" value={parcel.nearestRailway} />
        </div>

        {/* Ownership */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">OWNERSHIP</p>
          <InfoRow label="Owner" value={parcel.ownerName} />
          <InfoRow label="Mutation" value={parcel.mutationStatus} />
          <InfoRow label="Encumbrance" value={parcel.encumbrance} />
          <InfoRow label="Zoning" value={parcel.zoning} />
        </div>

        {/* Title status */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <p className="text-[10px] font-bold text-green-700 uppercase tracking-wider">TITLE STATUS</p>
          <p className="text-sm font-bold text-green-800 mt-1">Clear Sovereign Title</p>
          <p className="text-[10px] text-green-600">100% Registered · Verified</p>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-gray-200 p-3 space-y-2">
        <GovButton variant="primary" size="sm" className="w-full justify-center" onClick={() => onViewParcel(parcel)}>
          View Full Parcel 360
        </GovButton>
        <GovButton variant="outlineGreen" size="sm" className="w-full justify-center" onClick={() => onDev(parcel)}>
          <Lightbulb size={13} /> Dev Suggestions
        </GovButton>
      </div>
    </div>
  );
}

function MapContent({ selectedParcel, setSelectedParcel, layerStates }) {
  const map = useMap();

  const styleFeature = (feature) => {
    const isSelected = selectedParcel?.id === feature.properties.id;
    const color = landUseColors[feature.properties.landUse] || landUseColors[feature.properties.classification] || '#888';
    return {
      fillColor: color,
      fillOpacity: isSelected ? 0.85 : 0.5,
      color: isSelected ? '#ffffff' : color,
      weight: isSelected ? 3 : 1.5,
      dashArray: isSelected ? null : null,
    };
  };

  const onEachFeature = (feature, layer) => {
    layer.on('click', () => {
      setSelectedParcel(feature.properties);
      map.fitBounds(layer.getBounds(), { padding: [20, 20] });
    });
    layer.on('mouseover', () => {
      layer.setStyle({ fillOpacity: 0.75, weight: 2.5 });
      layer.bindTooltip(`<strong>${feature.properties.id}</strong><br/>${feature.properties.surveyNumber} · ${feature.properties.village}<br/>${feature.properties.area} Ha · ${feature.properties.landUse}`, { permanent: false, direction: 'top' }).openTooltip();
    });
    layer.on('mouseout', (e) => {
      if (selectedParcel?.id !== feature.properties.id) {
        layer.setStyle(styleFeature(feature));
      }
      layer.closeTooltip();
    });
  };

  return (
    <>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {layerStates.cadastral && (
        <GeoJSON
          key={selectedParcel?.id || 'none'}
          data={parcelGeoJSON}
          style={styleFeature}
          onEachFeature={onEachFeature}
        />
      )}
    </>
  );
}

export default function GISMapPage() {
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [layerStates, setLayerStates] = useState(
    Object.fromEntries(LAYERS_CONFIG.map(l => [l.id, l.defaultOn]))
  );
  const [showLayerPanel, setShowLayerPanel] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setSelectedParcel: setGlobalParcel } = useApp();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1200);
    const searchQ = searchParams.get('search');
    if (searchQ) {
      const found = getParcelBySearch(searchQ);
      if (found) setSelectedParcel(found);
    }
  }, []);

  const handleViewParcel = (p) => {
    setGlobalParcel(p);
    navigate(`/parcel360/${p.id}`);
  };

  const toggleLayer = (id) => {
    setLayerStates(s => ({ ...s, [id]: !s[id] }));
  };

  const landUseStats = [
    { label: 'Agricultural', pct: '62%', color: '#4a9e5c' },
    { label: 'Forest', pct: '15%', color: '#2d7a45' },
    { label: 'Commercial', pct: '10%', color: '#e8a838' },
    { label: 'Residential', pct: '8%', color: '#5b8dd9' },
    { label: 'Water', pct: '5%', color: '#5ba8d9' },
  ];

  return (
    <PageLayout>
      <PageHeader
        label="SPATIAL OBSERVATORY SUITE"
        title="GIS Land Map & Cadastral Observatory"
        subtitle="Interactive cadastral boundaries · Haveli Taluka, Pune District · EPSG:4326"
        actions={
          <>
            <DemoBanner message="DEMO GIS DATA · PROTOTYPE" />
            <GovButton variant="green" size="sm">
              <BarChart2 size={14} /> Select Region for Analytics
            </GovButton>
          </>
        }
      />

      <div className="flex h-[calc(100vh-175px)] relative">
        {/* Layer Panel */}
        {showLayerPanel && (
          <div className="w-56 bg-white border-r border-gray-200 flex flex-col overflow-y-auto shrink-0">
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                  <Layers size={12} /> LAYERS
                </span>
                <button onClick={() => setShowLayerPanel(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              </div>
            </div>

            <div className="flex-1 p-3 space-y-2">
              {LAYERS_CONFIG.map(layer => (
                <div key={layer.id} className="flex items-center justify-between py-1.5 border-b border-gray-50">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700">
                    <input
                      type="checkbox"
                      checked={layerStates[layer.id]}
                      onChange={() => toggleLayer(layer.id)}
                      className="w-3.5 h-3.5 accent-[#0f2d5c]"
                    />
                    {layer.label}
                  </label>
                </div>
              ))}
            </div>

            {/* Land use legend */}
            <div className="border-t border-gray-200 p-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">LAND CLASSES</p>
              {landUseStats.map(l => (
                <div key={l.label} className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm" style={{ background: l.color }} />
                    <span className="text-[11px] text-gray-600">{l.label}</span>
                  </div>
                  <span className="text-[11px] font-bold text-gray-700">{l.pct}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Map */}
        <div className="flex-1 relative">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center bg-[#2a4a7a] text-white gap-4">
              <div className="w-10 h-10 border-3 border-white/30 border-t-white rounded-full animate-spin" style={{ borderWidth: '3px' }} />
              <p className="text-sm font-medium">Loading cadastral data...</p>
            </div>
          ) : (
            <MapContainer
              center={[18.462, 73.740]}
              zoom={13}
              className="h-full w-full"
              zoomControl={true}
            >
              <MapContent
                selectedParcel={selectedParcel}
                setSelectedParcel={setSelectedParcel}
                layerStates={layerStates}
              />
            </MapContainer>
          )}

          {/* Map controls overlay */}
          {!showLayerPanel && (
            <button
              onClick={() => setShowLayerPanel(true)}
              className="absolute top-3 left-3 z-[999] bg-white border border-gray-200 shadow rounded-lg px-3 py-2 text-xs font-medium text-gray-700 flex items-center gap-2 hover:bg-gray-50"
            >
              <Layers size={14} /> Layers
            </button>
          )}

          {/* Stats overlay */}
          <div className="absolute bottom-3 left-3 z-[999] bg-white/95 border border-gray-200 rounded-lg shadow p-3 w-56">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">CADASTRAL SUMMARY</p>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Total Parcels</span>
                <span className="font-bold text-gray-800">12</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Total Area</span>
                <span className="font-bold text-gray-800">66.85 Ha</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Verified</span>
                <span className="font-bold text-green-700">8</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Protected</span>
                <span className="font-bold text-blue-700">3</span>
              </div>
            </div>
            <p className="text-[9px] text-gray-400 mt-2">Click parcel to view details</p>
          </div>

          {/* Coordinates */}
          <div className="absolute bottom-3 right-3 z-[999] bg-black/60 text-white text-[10px] font-mono px-2 py-1 rounded">
            18.4620°N / 73.7400°E · Zoom 13
          </div>
        </div>

        {/* Parcel info panel */}
        <div className="relative">
          {selectedParcel ? (
            <ParcelInfoPanel
              parcel={selectedParcel}
              onClose={() => setSelectedParcel(null)}
              onViewParcel={handleViewParcel}
              onDev={(p) => { setGlobalParcel(p); navigate('/dev-suggestions'); }}
            />
          ) : (
            <div className="w-64 bg-white border-l border-gray-200 flex flex-col items-center justify-center text-center p-6">
              <Map size={32} className="text-gray-200 mb-3" />
              <p className="text-sm font-medium text-gray-500">Click any parcel on the map</p>
              <p className="text-xs text-gray-400 mt-1">to view detailed cadastral information</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom stats bar */}
      <div className="bg-white border-t border-gray-200 px-6 py-3 flex items-center gap-8 text-xs text-gray-500 overflow-x-auto">
        <div>
          <span className="font-bold text-gray-700">1,482.40</span> sq.km Total Observed Area
        </div>
        <div>
          <span className="font-bold text-[#4a9e5c]">62%</span> Agricultural Cover
        </div>
        <div>
          <span className="font-bold text-[#2d7a45]">15%</span> Forest Canopy
        </div>
        <div>
          <span className="font-bold text-[#5b8dd9]">13%</span> Built-up
        </div>
        <div className="ml-auto text-[10px] text-gray-400">
          Active Cadastral Layer: National Cadastral Survey 2023-24 · Verified · Updated Dec 2024
        </div>
      </div>
    </PageLayout>
  );
}
