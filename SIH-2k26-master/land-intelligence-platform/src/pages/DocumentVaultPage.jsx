import React, { useState, useRef } from 'react';
import { FolderOpen, Upload, Eye, Download, Share2, Shield, CheckCircle, X, FileText, AlertTriangle, Bot, ChevronRight } from 'lucide-react';
import { PageLayout } from '../components/layout/Layout';
import { PageHeader, Card, GovButton, DemoBanner, Badge, InfoRow } from '../components/ui';
import { mockDocuments } from '../data/documents';
import { useApp } from '../App';

const iconColors = {
  green: 'bg-green-100 text-green-700',
  blue: 'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
  orange: 'bg-orange-100 text-orange-700',
  teal: 'bg-teal-100 text-teal-700',
  red: 'bg-red-100 text-red-700',
};

const docIcons = {
  'file-text': '📄',
  'edit': '✏️',
  'credit-card': '🪪',
  'receipt': '🧾',
  'map': '🗺️',
  'shield': '🛡️',
};

function DocumentCard({ doc, onView, onAI, onShare }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0 ${iconColors[doc.color] || 'bg-gray-100 text-gray-600'}`}>
            {docIcons[doc.icon] || '📄'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-bold text-gray-900">{doc.type}</p>
                <p className="text-xs text-gray-500">{doc.surveyNumber} · {doc.village}</p>
              </div>
              {doc.verified && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded shrink-0">
                  <CheckCircle size={10} /> Verified
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
              <span>{doc.date}</span>
              <span>·</span>
              <span>{doc.format}</span>
              <span>·</span>
              <span>{doc.size}</span>
            </div>

            {doc.digitalSignature && (
              <div className="flex items-center gap-1 mt-1.5">
                <Shield size={11} className="text-[#0f2d5c]" />
                <span className="text-[10px] text-[#0f2d5c]">{doc.digitalSignature}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-3 flex-wrap">
          <GovButton variant="outline" size="sm" onClick={() => onView(doc)}>
            <Eye size={12} /> View
          </GovButton>
          <GovButton variant="ghost" size="sm" onClick={() => onShare(doc)}>
            <Share2 size={12} /> Controlled Share
          </GovButton>
          <GovButton variant="green" size="sm" onClick={() => onAI(doc)}>
            <Bot size={12} /> AI Read
          </GovButton>
        </div>
      </div>
    </div>
  );
}

function UploadModal({ onClose }) {
  const [stage, setStage] = useState('select'); // select | uploading | processing | done
  const [fileName, setFileName] = useState('');
  const { showToast } = useApp();
  const fileRef = useRef();

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFileName(f.name);
    setStage('uploading');
    setTimeout(() => setStage('processing'), 1200);
    setTimeout(() => {
      setStage('done');
      showToast('Document uploaded successfully', 'success');
    }, 2800);
  };

  const stages = [
    { key: 'uploading', label: 'Document uploaded', done: ['processing', 'done'].includes(stage) },
    { key: 'processing', label: 'Text extracted', done: stage === 'done' },
    { key: 'done', label: 'Verification complete', done: stage === 'done' },
  ];

  return (
    <div className="fixed inset-0 z-[9998] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="bg-[#0f2d5c] text-white px-5 py-4 rounded-t-xl flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold">Upload Document</h2>
            <p className="text-xs text-blue-300">Secure Digital Vault · Encrypted</p>
          </div>
          <button onClick={onClose} className="text-blue-300 hover:text-white"><X size={18} /></button>
        </div>

        <div className="p-5">
          {stage === 'select' && (
            <div
              className="border-2 border-dashed border-gray-300 hover:border-[#0f2d5c] rounded-xl p-8 text-center cursor-pointer transition-colors"
              onClick={() => fileRef.current.click()}
            >
              <Upload size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-700">Click to select a document</p>
              <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG — Max 10 MB</p>
              <input ref={fileRef} type="file" className="hidden" onChange={handleFile} accept=".pdf,.jpg,.png" />
            </div>
          )}

          {stage !== 'select' && (
            <div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4 flex items-center gap-2">
                <FileText size={18} className="text-[#0f2d5c]" />
                <span className="text-sm font-medium text-gray-700 truncate">{fileName}</span>
              </div>

              <div className="space-y-3">
                {stages.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {s.done ? (
                      <CheckCircle size={18} className="text-[#1a6b3c] shrink-0" />
                    ) : (
                      <div className="w-4.5 h-4.5 border-2 border-[#0f2d5c] border-t-transparent rounded-full animate-spin shrink-0" style={{ width: 18, height: 18 }} />
                    )}
                    <span className={`text-sm ${s.done ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>{s.label}</span>
                  </div>
                ))}
              </div>

              {stage === 'done' && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 text-sm font-semibold text-green-800 text-center">
                  ✓ Document successfully added to your vault
                </div>
              )}
            </div>
          )}

          <div className="mt-4 flex gap-2 justify-end">
            <GovButton variant="ghost" onClick={onClose}>Cancel</GovButton>
            {stage === 'done' && <GovButton variant="green" onClick={onClose}>Done</GovButton>}
          </div>
        </div>
      </div>
    </div>
  );
}

function AIReadModal({ doc, onClose }) {
  const [stage, setStage] = useState('processing');
  const steps = [
    { label: 'Document uploaded', done: true },
    { label: 'Text extracted', done: stage !== 'processing' || true },
    { label: 'Fields identified', done: true },
    { label: 'Analysis complete', done: true },
  ];

  React.useEffect(() => {
    setTimeout(() => setStage('done'), 1200);
  }, []);

  if (!doc) return null;
  const ai = doc.aiSummary;

  return (
    <div className="fixed inset-0 z-[9998] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        <div className="bg-[#0f2d5c] text-white px-5 py-4 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <Bot size={16} />
              <h2 className="text-base font-bold">AI Document Analysis</h2>
            </div>
            <p className="text-xs text-blue-300">{doc.type} · {doc.surveyNumber}</p>
          </div>
          <button onClick={onClose} className="text-blue-300 hover:text-white"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Processing steps */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">DOCUMENT PROCESSING</p>
            <div className="space-y-2">
              {steps.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-[#1a6b3c]" />
                  <span className="text-xs text-gray-700">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Extracted fields */}
          {stage === 'done' && (
            <>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">EXTRACTED FIELDS</p>
                <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
                  <InfoRow label="Owner Name" value={ai.ownerName} />
                  <InfoRow label="Survey Number" value={ai.surveyNumber} />
                  <InfoRow label="Area" value={ai.area} />
                  <InfoRow label="Village" value={ai.village} />
                  <InfoRow label="Taluka" value={ai.taluka} />
                  <InfoRow label="District" value={ai.district} />
                  <InfoRow label="Document Date" value={ai.documentDate} />
                  <InfoRow label="Classification" value={ai.classification} />
                  <InfoRow label="Encumbrance" value={ai.encumbrance} />
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Bot size={11} /> AI SUMMARY
                </p>
                <div className="bg-[#f8fafb] border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-800 leading-relaxed">{ai.summary}</p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                <AlertTriangle size={14} className="text-amber-600 mt-0.5 shrink-0" />
                <p className="text-[11px] text-amber-700">
                  AI-generated summary is for assistance only. Refer to the original official document for legal purposes.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="border-t border-gray-200 p-4 flex gap-2 shrink-0">
          <GovButton variant="ghost" onClick={onClose}>Close</GovButton>
          <GovButton variant="green" size="sm" onClick={onClose}>
            <Share2 size={13} /> Done
          </GovButton>
        </div>
      </div>
    </div>
  );
}

function ShareModal({ doc, onClose }) {
  const { showToast } = useApp();
  const [recipient, setRecipient] = useState('Sub-Registrar Office (Haveli)');
  const [validity, setValidity] = useState('48 Hours');
  const [allowDownload, setAllowDownload] = useState(false);
  const [watermark, setWatermark] = useState(true);
  const [shared, setShared] = useState(false);

  const handleShare = () => {
    setShared(true);
    showToast(`Access token generated for ${recipient} · Logged in Audit Trail`, 'success');
  };

  return (
    <div className="fixed inset-0 z-[9998] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="bg-[#0f2d5c] text-white px-5 py-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 size={16} />
            <div>
              <h2 className="text-base font-bold">Controlled Document Sharing</h2>
              <p className="text-xs text-blue-300">{doc.type} · Survey {doc.surveyNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-blue-300 hover:text-white"><X size={18} /></button>
        </div>

        <div className="p-5 space-y-4">
          {!shared ? (
            <>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Target Recipient / Authority</label>
                <select
                  value={recipient}
                  onChange={e => setRecipient(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#0f2d5c]"
                >
                  <option>Sub-Registrar Office (Haveli)</option>
                  <option>State Bank of India (Agri-Loan Cell)</option>
                  <option>District Town Planning Directorate</option>
                  <option>Designated Legal Counsel / Advocate</option>
                  <option>Private Buyer (Watermarked Preview)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Link Expiry Window</label>
                <div className="grid grid-cols-3 gap-2">
                  {['24 Hours', '48 Hours', '7 Days'].map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setValidity(v)}
                      className={`text-xs py-2 rounded-lg border font-medium transition-all ${validity === v ? 'border-[#0f2d5c] bg-[#0f2d5c]/5 text-[#0f2d5c] font-bold' : 'border-gray-200 text-gray-600'}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={watermark} onChange={e => setWatermark(e.target.checked)} className="accent-[#0f2d5c]" />
                  <span>Enforce dynamic sovereign watermark (Bearer-bound)</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={allowDownload} onChange={e => setAllowDownload(e.target.checked)} className="accent-[#0f2d5c]" />
                  <span>Allow raw document download (default: View-Only)</span>
                </label>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-[11px] text-blue-800">
                🛡️ <strong>Sovereign Audit Commitment:</strong> All access attempts (IP, timestamp, recipient ID) are cryptographically logged in the National Cadastre Audit Trail.
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <GovButton variant="ghost" onClick={onClose}>Cancel</GovButton>
                <GovButton variant="primary" onClick={handleShare}>
                  Generate Secure Token Link
                </GovButton>
              </div>
            </>
          ) : (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto text-2xl">
                ✓
              </div>
              <h3 className="font-bold text-gray-900 text-sm">Controlled Token Active</h3>
              <p className="text-xs text-gray-500">
                Expiring link generated for <strong>{recipient}</strong> (Valid for {validity}).
              </p>
              <div className="bg-gray-100 p-2.5 rounded-lg text-[10px] font-mono text-gray-700 break-all select-all">
                https://geosynk.gov.in/vault/verify?token=sec_7a9f4c82b1d0_{doc.id}
              </div>
              <GovButton variant="green" size="sm" className="w-full justify-center" onClick={() => {
                navigator.clipboard?.writeText(`https://geosynk.gov.in/vault/verify?token=sec_7a9f4c82b1d0_${doc.id}`);
                showToast('Share link copied to clipboard', 'success');
                onClose();
              }}>
                Copy Link & Done
              </GovButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DocumentVaultPage() {
  const { role, setLoginModal } = useApp();
  const [showUpload, setShowUpload] = useState(false);
  const [viewDoc, setViewDoc] = useState(null);
  const [aiDoc, setAiDoc] = useState(null);
  const [shareDoc, setShareDoc] = useState(null);
  const [filterParcel, setFilterParcel] = useState('all');

  if (!role) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
          <FolderOpen size={48} className="text-gray-200 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Secure Document Vault</h2>
          <p className="text-sm text-gray-500 max-w-sm mb-6">Sign in to access your digitally sealed land documents.</p>
          <GovButton variant="primary" size="lg" onClick={() => setLoginModal(true)}>
            Sign In to Access Vault
          </GovButton>
        </div>
      </PageLayout>
    );
  }

  const filtered = filterParcel === 'all' ? mockDocuments : mockDocuments.filter(d => d.parcelId === filterParcel);

  return (
    <PageLayout>
      <PageHeader
        label="SECURE DOCUMENT VAULT"
        title="Document Vault"
        subtitle="Digitally sealed land records and certificates for your registered parcels."
        actions={
          <>
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold text-green-700">DEMO SEALED</span>
            </div>
            <DemoBanner message="DEMO VAULT · SIMULATED ENCRYPTION" />
            <GovButton variant="green" size="sm" onClick={() => setShowUpload(true)}>
              <Upload size={14} /> Upload Document
            </GovButton>
          </>
        }
      />

      <div className="p-6 space-y-4">
        {/* Filter */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-gray-600">Filter by Parcel:</span>
          {['all', 'MH-PN-4091', 'MH-PN-4095'].map(f => (
            <button key={f} onClick={() => setFilterParcel(f)}
              className={`text-xs px-3 py-1.5 rounded-md border font-medium transition-colors
                ${filterParcel === f ? 'bg-[#0f2d5c] text-white border-[#0f2d5c]' : 'bg-white text-gray-600 border-gray-300 hover:border-[#0f2d5c]/50'}`}>
              {f === 'all' ? 'All Parcels' : f}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-400">{filtered.length} document{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Document grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onView={(d) => setViewDoc(d)}
              onAI={(d) => setAiDoc(d)}
              onShare={(d) => setShareDoc(d)}
            />
          ))}
        </div>

        {/* Document viewer modal */}
        {viewDoc && (
          <div className="fixed inset-0 z-[9998] bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
              <div className="bg-[#0f2d5c] text-white px-5 py-4 rounded-t-xl flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold">{viewDoc.type}</h2>
                  <p className="text-xs text-blue-300">{viewDoc.surveyNumber} · {viewDoc.village} · {viewDoc.date}</p>
                </div>
                <button onClick={() => setViewDoc(null)} className="text-blue-300 hover:text-white"><X size={18} /></button>
              </div>
              <div className="p-5">
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl h-48 flex flex-col items-center justify-center text-gray-400">
                  <div className="text-4xl mb-3">{docIcons[viewDoc.icon] || '📄'}</div>
                  <p className="text-sm font-medium text-gray-600">{viewDoc.type}</p>
                  <p className="text-xs mt-1">Survey {viewDoc.surveyNumber} · {viewDoc.format} · {viewDoc.size}</p>
                  <p className="text-[10px] mt-3 text-amber-600 bg-amber-50 px-3 py-1 rounded">
                    📌 Demo mode — actual document not available
                  </p>
                </div>
                <div className="mt-4 flex gap-2 justify-end">
                  <GovButton variant="green" size="sm" onClick={() => { setViewDoc(null); setAiDoc(viewDoc); }}>
                    <Bot size={13} /> AI Read
                  </GovButton>
                  <GovButton variant="ghost" onClick={() => setViewDoc(null)}>Close</GovButton>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
      {aiDoc && <AIReadModal doc={aiDoc} onClose={() => setAiDoc(null)} />}
      {shareDoc && <ShareModal doc={shareDoc} onClose={() => setShareDoc(null)} />}
    </PageLayout>
  );
}
