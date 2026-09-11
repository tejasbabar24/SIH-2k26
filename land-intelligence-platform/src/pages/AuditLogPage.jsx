import React, { useState } from 'react';
import {
  ClipboardList, Bell, ShieldCheck, Download, Filter, Search,
  CheckCircle, AlertOctagon, Lock, RefreshCw, Key, Globe
} from 'lucide-react';
import { PageLayout } from '../components/layout/Layout';
import { PageHeader, Card, GovButton, DemoBanner, Badge } from '../components/ui';
import { auditLogs } from '../data/documents';
import { useApp } from '../App';

export default function AuditLogPage() {
  const [activeTab, setActiveTab] = useState('logs'); // 'logs' | 'notifications'
  const [actorFilter, setActorFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [verifyingChain, setVerifyingChain] = useState(false);
  const { showToast } = useApp();

  const notifications = [
    { id: 1, title: 'Tax Assessment Renewal Pending', time: '10 mins ago', desc: 'FY 2024-25 North Taluk land revenue assessment is due for Survey 142/3-A.', type: 'alert', read: false },
    { id: 2, title: 'Document Verified by Circle Officer', time: '2 hours ago', desc: 'Digital seal applied to Cadastral Survey Map (Doc #DOC005).', type: 'success', read: false },
    { id: 3, title: 'Sub-Registrar Access Request', time: 'Yesterday', desc: 'Bank Officer (SBI Haveli) accessed Encumbrance Certificate under statutory loan consent.', type: 'info', read: true },
    { id: 4, title: 'Unauthorized Access Blocked', time: '3 days ago', desc: 'Geofence violation detected from outside state boundaries. Attempt denied.', type: 'danger', read: true },
  ];

  const handleVerifyChain = () => {
    setVerifyingChain(true);
    setTimeout(() => {
      setVerifyingChain(false);
      showToast('SHA-256 Merkle Root verified against State Blockchain Registry', 'success');
    }, 1400);
  };

  const handleExport = () => {
    showToast('Immutable audit log dossier exported (Signed CSV)', 'success');
  };

  const filteredLogs = auditLogs.filter(log => {
    if (actorFilter !== 'all' && log.actorRole !== actorFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        log.actor.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.document.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <PageLayout>
      <PageHeader
        label="SECURITY & TRANSPARENCY INFRASTRUCTURE"
        title="Transparent Access & Audit Trail"
        subtitle="Cryptographically sealed ledger of every administrative lookup, citizen document disclosure, and consent verification."
        actions={
          <>
            <DemoBanner message="BLOCKCHAIN IMMUTABLE AUDIT TRAIL · DEMO" />
            <GovButton variant="outline" size="sm" onClick={handleVerifyChain} disabled={verifyingChain}>
              <ShieldCheck size={13} className={verifyingChain ? 'animate-spin' : ''} />
              <span>{verifyingChain ? 'Verifying Chain...' : 'Verify Cryptographic Seal'}</span>
            </GovButton>
            <GovButton variant="primary" size="sm" onClick={handleExport}>
              <Download size={13} /> Export Audit Dossier
            </GovButton>
          </>
        }
      />

      <div className="p-6 space-y-6">
        {/* Top summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">TOTAL LOGGED EVENTS</span>
              <ClipboardList size={14} className="text-[#0f2d5c]" />
            </div>
            <p className="text-2xl font-bold text-[#0f2d5c]">1,842</p>
            <p className="text-[11px] text-green-700 font-medium mt-1">100% Cryptographically signed</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">ACTIVE DISCLOSURES</span>
              <Key size={14} className="text-[#1a6b3c]" />
            </div>
            <p className="text-2xl font-bold text-[#1a6b3c]">4</p>
            <p className="text-[11px] text-gray-500 mt-1">Authorized third-party links</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">SECURITY STATUS</span>
              <ShieldCheck size={14} className="text-blue-600" />
            </div>
            <p className="text-xl font-bold text-gray-900">Zero Breaches</p>
            <p className="text-[11px] text-green-700 font-medium mt-1">1 unauthorized query blocked</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">CONSENT COMPLIANCE</span>
              <Lock size={14} className="text-[#0f2d5c]" />
            </div>
            <p className="text-2xl font-bold text-[#0f2d5c]">DPDP Act</p>
            <p className="text-[11px] text-gray-500 mt-1">Statutory Consent Framework 2023</p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-gray-200 gap-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('logs')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'logs' ? 'border-[#0f2d5c] text-[#0f2d5c]' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <ClipboardList size={16} />
            <span>Immutable Access Ledger</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{filteredLogs.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'notifications' ? 'border-[#0f2d5c] text-[#0f2d5c]' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <Bell size={16} />
            <span>System Notifications</span>
            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">2 New</span>
          </button>
        </div>

        {/* Tab 1: Access Logs */}
        {activeTab === 'logs' && (
          <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 border border-gray-200 rounded-lg">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                  <Filter size={12} /> Filter Actor:
                </span>
                {[
                  { id: 'all', label: 'All Roles' },
                  { id: 'Citizen', label: 'Citizen' },
                  { id: 'Government Officer', label: 'Govt Officer' },
                  { id: 'System', label: 'System' },
                  { id: 'External', label: 'External / Bank' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActorFilter(f.id)}
                    className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-colors ${
                      actorFilter === f.id
                        ? 'bg-[#0f2d5c] text-white border-[#0f2d5c]'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-60">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search actor, action or doc..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:border-[#0f2d5c]"
                />
              </div>
            </div>

            {/* Audit Log Table */}
            <Card className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0f2d5c] text-white font-semibold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Event ID & Timestamp</th>
                      <th className="py-3 px-4">Actor</th>
                      <th className="py-3 px-4">Role Classification</th>
                      <th className="py-3 px-4">Action Performed</th>
                      <th className="py-3 px-4">Target Cadastral Record</th>
                      <th className="py-3 px-4">Origin IP</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-blue-50/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-mono text-[#0f2d5c] font-bold">{log.id}</div>
                          <div className="text-[11px] text-gray-500 mt-0.5">{log.timestamp}</div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-gray-900">{log.actor}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            log.actorRole === 'Citizen'
                              ? 'bg-green-50 text-green-800 border border-green-200'
                              : log.actorRole === 'Government Officer'
                              ? 'bg-blue-50 text-[#0f2d5c] border border-blue-200'
                              : log.actorRole === 'System'
                              ? 'bg-purple-50 text-purple-800 border border-purple-200'
                              : 'bg-orange-50 text-orange-800 border border-orange-200'
                          }`}>
                            {log.actorRole}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-800 font-medium">{log.action}</td>
                        <td className="py-3 px-4 font-mono text-gray-600">{log.document}</td>
                        <td className="py-3 px-4 font-mono text-gray-400 text-[11px]">{log.ip}</td>
                        <td className="py-3 px-4 text-right">
                          {log.status === 'Success' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                              <CheckCircle size={11} /> Success
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                              <AlertOctagon size={11} /> Blocked
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Tab 2: Notifications */}
        {activeTab === 'notifications' && (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`bg-white border rounded-xl p-4 shadow-sm flex items-start gap-3.5 transition-all ${
                  !n.read ? 'border-l-4 border-l-[#0f2d5c] bg-blue-50/20' : 'border-gray-200'
                }`}
              >
                <div className={`p-2 rounded-full mt-0.5 ${
                  n.type === 'alert' ? 'bg-amber-100 text-amber-700' :
                  n.type === 'danger' ? 'bg-red-100 text-red-700' :
                  n.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-[#0f2d5c]'
                }`}>
                  {n.type === 'alert' && <AlertOctagon size={16} />}
                  {n.type === 'danger' && <AlertOctagon size={16} />}
                  {n.type === 'success' && <CheckCircle size={16} />}
                  {n.type === 'info' && <Bell size={16} />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-gray-900">{n.title}</h4>
                    <span className="text-[11px] text-gray-400">{n.time}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{n.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}

