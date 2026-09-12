import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Download, FileText, Filter, RefreshCw } from 'lucide-react';
import { PageLayout } from '../components/layout/Layout';
import { PageHeader, StatCard, Card, GovButton, DemoBanner, SectionHeader } from '../components/ui';
import { analyticsData, districts, districtLabels, talukas, mutationTrendData } from '../data/analytics';
import { useApp } from '../App';

const COLORS = ['#4a9e5c', '#2d7a45', '#5b8dd9', '#5ba8d9', '#a0a0a0'];

export default function AnalyticsPage() {
  const [selectedDistrict, setSelectedDistrict] = useState('pune');
  const [selectedTaluka, setSelectedTaluka] = useState('Haveli');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [loading, setLoading] = useState(false);
  const { showToast } = useApp();

  const data = analyticsData[selectedDistrict];

  const applyFilters = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 600);
    showToast('Filters applied', 'success');
  };

  const handleExport = () => {
    const headers = "Year,District,Agricultural_Cover_Ha,Forest_Canopy_Ha,Commercial_Ha,Residential_Ha,Water_Bodies_Ha\n";
    const trends = data?.trends || [];
    const rows = trends.map(r => `${r.year},${selectedDistrict},${r.agri},${r.forest},${r.commercial},${r.residential},${r.water}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `geosynk_land_analytics_${selectedDistrict}_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${selectedDistrict.toUpperCase()} land-use dataset (.CSV) for thesis/research`, 'success');
  };

  const handleReport = () => {
    showToast('Report generation simulated — navigating to Policy Brief', 'success');
  };

  return (
    <PageLayout>
      <PageHeader
        label="SPATIAL ANALYTICS"
        title="Land Analytics Dashboard"
        subtitle="Geospatial land-use trends, conversion statistics and agricultural intelligence for Maharashtra"
        actions={
          <>
            <DemoBanner message="PROTOTYPE DATA · DEMO" />
            <GovButton variant="outline" size="sm" onClick={handleExport}>
              <Download size={14} /> Export CSV
            </GovButton>
            <GovButton variant="green" size="sm" onClick={handleReport}>
              <FileText size={14} /> Generate Report
            </GovButton>
          </>
        }
      />

      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">State</label>
              <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#0f2d5c]">
                <option>Maharashtra</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">District</label>
              <select
                value={selectedDistrict}
                onChange={e => setSelectedDistrict(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#0f2d5c]"
              >
                {districts.map(d => <option key={d} value={d}>{districtLabels[d]}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Taluka</label>
              <select
                value={selectedTaluka}
                onChange={e => setSelectedTaluka(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#0f2d5c]"
              >
                {(talukas[selectedDistrict] || []).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Year</label>
              <select
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#0f2d5c]"
              >
                {['2020', '2021', '2022', '2023', '2024', '2025'].map(y => <option key={y}>{y}</option>)}
              </select>
            </div>
            <GovButton variant="primary" size="sm" onClick={applyFilters}>
              <Filter size={14} /> Apply Filters
            </GovButton>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.values(data.kpis).map((kpi, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{kpi.label}</p>
              <p className="text-xl font-bold text-[#0f2d5c]">{kpi.value} <span className="text-sm font-normal text-gray-500">{kpi.unit}</span></p>
              <div className={`text-xs font-semibold mt-1 flex items-center gap-1 ${kpi.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.change > 0 ? '↑' : '↓'} {Math.abs(kpi.change)}% YoY
              </div>
            </div>
          ))}
        </div>

        {/* Charts row 1 */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <SectionHeader title="Agricultural Land Change" subtitle="Area in hectares (2015–2025)" />
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.agriChange}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => [`${v.toLocaleString()} Ha`, 'Agricultural Area']} />
                <Line type="monotone" dataKey="area" stroke="#4a9e5c" strokeWidth={2} dot={{ r: 3 }} name="Agricultural Area (Ha)" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <SectionHeader title="Built-up Area Expansion" subtitle="Urban growth (Ha)" />
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.builtupExpansion}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => [`${v.toLocaleString()} Ha`, 'Built-up Area']} />
                <Line type="monotone" dataKey="area" stroke="#e07b2a" strokeWidth={2} dot={{ r: 3 }} name="Built-up Area (Ha)" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Charts row 2 */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <SectionHeader title="Forest Cover Trend" subtitle="Hectares (2015–2025)" />
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.forestCover}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => [`${v.toLocaleString()} Ha`, 'Forest Cover']} />
                <Line type="monotone" dataKey="area" stroke="#2d7a45" strokeWidth={2} dot={{ r: 3 }} name="Forest (Ha)" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <SectionHeader title="Land Conversion" subtitle="Ha converted by type (2015–2024)" />
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.landConversion}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="agriToUrban" name="Agri → Urban" fill="#e07b2a" radius={[2,2,0,0]} />
                <Bar dataKey="agriToForest" name="Agri → Forest" fill="#4a9e5c" radius={[2,2,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Charts row 3 */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <SectionHeader title="Urban Sprawl by Zone" subtitle="Area distribution by zone type" />
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.urbanSprawl} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="zone" tick={{ fontSize: 11 }} width={100} />
                <Tooltip formatter={(v) => [`${v.toLocaleString()} Ha`, 'Area']} />
                <Bar dataKey="area" fill="#5b8dd9" radius={[0,3,3,0]} name="Area (Ha)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <SectionHeader title="Land Use Distribution" subtitle={`${districtLabels[selectedDistrict]} ${selectedYear}`} />
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie data={data.landUsePie} dataKey="value" cx="50%" cy="50%" outerRadius={70} innerRadius={30}>
                    {data.landUsePie.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v}%`]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {data.landUsePie.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: item.color }} />
                    <span className="text-xs text-gray-600 flex-1">{item.name}</span>
                    <span className="text-xs font-bold text-gray-800">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Mutation trend */}
        <Card>
          <SectionHeader title="Cadastral Mutation & Registration Trend" subtitle="Last 6 months performance" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mutationTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="resolved" name="Resolved Registrations" fill="#1a6b3c" radius={[3,3,0,0]} />
              <Bar dataKey="lodged" name="Lodged Applications" fill="#c5d2e0" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-between mt-3 border-t border-gray-100 pt-3">
            <p className="text-sm font-semibold text-gray-700">Average 6-month resolution rate: <span className="text-[#1a6b3c]">96.4%</span></p>
            <p className="text-xs text-gray-500">Statutory Threshold: ≥90.0%</p>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
