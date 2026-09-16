import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail, Shield, User, Building2, MapPin, Clock, ChevronRight,
  ArrowLeft, CheckCircle2, Info, Lock, BadgeCheck, Loader2, RefreshCw
} from 'lucide-react';
import { Header } from '../components/layout/Layout';
import { useApp } from '../App';
import { sendOtp, verifyOtp, registerOfficer, getMe, demoApprove } from '../lib/api';

/* ──────────────────────────────────────────────────────────
   Step indicator
────────────────────────────────────────────────────────── */
const STEPS = [
  { label: 'Enter Email' },
  { label: 'Verify Identity' },
  { label: 'Complete Profile' },
  { label: 'Admin Verification' },
];

function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {STEPS.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
                ${done  ? 'bg-[#1a6b3c] border-[#1a6b3c] text-white'
                  : active ? 'bg-transparent border-[#4ade80] text-[#4ade80]'
                  : 'bg-transparent border-gray-600 text-gray-500'}`}>
                {done ? <CheckCircle2 size={18} /> : i + 1}
              </div>
              <span className={`mt-1.5 text-[10px] font-semibold whitespace-nowrap
                ${active ? 'text-[#4ade80]' : done ? 'text-[#1a6b3c]' : 'text-gray-500'}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 w-12 sm:w-20 mx-1 mb-5 transition-all
                ${done ? 'bg-[#1a6b3c]' : 'bg-gray-600'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Shared spinner button
────────────────────────────────────────────────────────── */
function SubmitBtn({ loading, children, disabled }) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="w-full bg-[#1a6b3c] hover:bg-[#228b4e] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : children}
    </button>
  );
}

/* ──────────────────────────────────────────────────────────
   Demo credentials constant (matches backend DEMO_OFFICER)
────────────────────────────────────────────────────────── */
const DEMO_EMAIL = 'vikramaditya.singh@ias.gov.in';
const DEMO_OTP   = '123456';
const DEMO_PROFILE = {
  name:        'Vikramaditya Singh',
  empId:       'IAS-MH-2019-0047',
  dept:        'Department of Land Resources',
  designation: 'District Magistrate / Collector',
  district:    'Pune, Maharashtra',
};

/* ──────────────────────────────────────────────────────────
   Step 1 — Enter Email
────────────────────────────────────────────────────────── */
function Step1({ onNext }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async (e) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) { setError('Please enter your government email.'); return; }
    if (!trimmed.endsWith('.gov.in') && !trimmed.endsWith('.nic.in') && !trimmed.endsWith('.com')) {
      setError('Only @gov.in, @nic.in, or .com email addresses are accepted.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await sendOtp(trimmed);
      // data.devOtp is only present in dev mode — show it for demo testing
      if (data.devOtp) {
        setError(`DEV MODE — OTP: ${data.devOtp} (use this to proceed)`);
      }
      onNext({ email: trimmed });
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 rounded-xl bg-[#1a3f7a] border border-blue-700 flex items-center justify-center mb-5 shadow-lg">
        <Building2 size={30} className="text-white" />
      </div>

      <h2 className="text-2xl font-bold text-white mb-1">Government Officer Login</h2>
      <p className="text-blue-300 text-sm mb-6 text-center">
        Access BhuNirnay with your official government credentials
      </p>

      {/* ── Demo credentials card ── */}
      <div className="w-full mb-6 bg-[#0a2a1a] border border-[#1a6b3c] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
          <span className="text-[10px] font-bold text-[#4ade80] uppercase tracking-widest">Demo Test Credentials</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs mb-3">
          <div><span className="text-blue-500">Email</span><br /><span className="text-white font-mono font-semibold">{DEMO_EMAIL}</span></div>
          <div><span className="text-blue-500">OTP</span><br /><span className="text-[#4ade80] font-mono font-bold text-lg">{DEMO_OTP}</span></div>
          <div><span className="text-blue-500">Name</span><br /><span className="text-white">{DEMO_PROFILE.name}</span></div>
          <div><span className="text-blue-500">Employee ID</span><br /><span className="text-white font-mono">{DEMO_PROFILE.empId}</span></div>
          <div><span className="text-blue-500">Department</span><br /><span className="text-white">{DEMO_PROFILE.dept}</span></div>
          <div><span className="text-blue-500">Designation</span><br /><span className="text-white">{DEMO_PROFILE.designation}</span></div>
        </div>
        <button
          type="button"
          onClick={() => { setEmail(DEMO_EMAIL); setError(''); }}
          className="w-full bg-[#1a6b3c]/40 hover:bg-[#1a6b3c]/70 border border-[#1a6b3c] text-[#4ade80] text-xs font-semibold py-2 rounded-lg transition-colors"
        >
          ↑ Auto-fill demo email
        </button>
      </div>

      <form onSubmit={handleContinue} className="w-full space-y-4">
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Official Government Email
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400" />
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              placeholder="Enter your @gov.in / @nic.in / .com email"
              className="w-full bg-[#1a3f7a] border border-blue-600 text-white placeholder-blue-400 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80]/30 transition-all"
            />
          </div>
          {error && (
            <p className={`mt-1.5 text-xs ${error.startsWith('DEV') ? 'text-yellow-400' : 'text-red-400'}`}>
              {error}
            </p>
          )}
        </div>

        <SubmitBtn loading={loading}>
          Continue <ChevronRight size={16} />
        </SubmitBtn>
      </form>

      <div className="flex items-center gap-3 w-full my-5">
        <div className="flex-1 h-px bg-blue-800" />
        <span className="text-xs text-gray-500">OR</span>
        <div className="flex-1 h-px bg-blue-800" />
      </div>

      <p className="text-sm text-blue-300">
        Need an account?{' '}
        <span className="text-[#4ade80] font-semibold">Register here</span>
      </p>

      <div className="mt-6 w-full bg-[#1a3f7a]/60 border border-blue-700 rounded-lg p-4 flex items-start gap-3">
        <Lock size={18} className="text-blue-400 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-300 leading-relaxed">
          For authorized government officials only.
          Access is subject to departmental verification and approval.
        </p>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Step 2 — Verify Identity (OTP)
────────────────────────────────────────────────────────── */
const OTP_RESEND_SECONDS = 30;

function Step2({ email, onNext, onResend }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(OTP_RESEND_SECONDS);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputs = useRef([]);
  const isDemo = email === DEMO_EMAIL;

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer(n => n - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    setError('');
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  // Auto-submit when all 6 digits are filled
  useEffect(() => {
    if (otp.every(d => d !== '')) {
      handleVerify();
    }
  }, [otp]);

  const handleVerify = async (e) => {
    e?.preventDefault();
    const code = otp.join('');
    if (code.length < 6) { setError('Please enter the complete 6-digit OTP.'); return; }

    setLoading(true);
    setError('');
    try {
      const data = await verifyOtp(email, code);
      // data.token is the 15-min registration JWT
      onNext({ token: data.token });
    } catch (err) {
      setError(err.message || 'Invalid OTP. Try again.');
      setOtp(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    try {
      const data = await sendOtp(email);
      setOtp(['', '', '', '', '', '']);
      setTimer(OTP_RESEND_SECONDS);
      inputs.current[0]?.focus();
      if (data.devOtp) setError(`DEV MODE — New OTP: ${data.devOtp}`);
    } catch (err) {
      setError(err.message || 'Could not resend OTP.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 rounded-xl bg-[#1a3f7a] border border-blue-700 flex items-center justify-center mb-5 shadow-lg">
        <Shield size={30} className="text-white" />
      </div>

      <h2 className="text-2xl font-bold text-white mb-1">Verify Government Identity</h2>
      <p className="text-blue-300 text-sm mb-8 text-center">
        Enter the OTP sent to your official government email
      </p>

      <form onSubmit={handleVerify} className="w-full space-y-5">
        {/* Verified email display */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">Government Email</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400" />
            <input
              readOnly value={email}
              className="w-full bg-[#1a3f7a] border border-blue-600 text-white rounded-lg pl-10 pr-10 py-3 text-sm focus:outline-none"
            />
            <CheckCircle2 size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4ade80]" />
          </div>
        </div>

        {/* 6-box OTP input */}
        <div>
          <label className="block text-sm font-semibold text-white mb-3">Enter OTP</label>

          {/* Demo hint */}
          {isDemo && (
            <div className="mb-3 flex items-center justify-between bg-[#0a2a1a] border border-[#1a6b3c] rounded-lg px-4 py-2.5">
              <span className="text-xs text-blue-300">Demo OTP (auto-fill):</span>
              <button
                type="button"
                onClick={() => {
                  const digits = DEMO_OTP.split('');
                  setOtp(digits);
                  setError('');
                }}
                className="text-[#4ade80] font-mono font-bold text-lg tracking-widest hover:opacity-80 transition-opacity"
              >
                {DEMO_OTP}
              </button>
            </div>
          )}
          <div className="flex gap-2 justify-between">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => inputs.current[i] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                disabled={loading}
                className="w-12 h-14 text-center text-xl font-bold bg-[#1a3f7a] border border-blue-600 text-white rounded-lg focus:outline-none focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80]/30 transition-all disabled:opacity-50"
              />
            ))}
          </div>

          {error && (
            <p className={`mt-2 text-xs ${error.startsWith('DEV') ? 'text-yellow-400' : 'text-red-400'}`}>
              {error}
            </p>
          )}

          <div className="mt-3 text-center space-y-1">
            <p className="text-xs text-blue-400">OTP sent to your official email</p>
            {timer > 0 ? (
              <p className="text-xs text-blue-500">Resend OTP (in {timer}s)</p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-xs text-[#4ade80] hover:underline font-semibold flex items-center gap-1 mx-auto"
              >
                {resending ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                Resend OTP
              </button>
            )}
          </div>
        </div>

        <SubmitBtn loading={loading}>
          Verify &amp; Continue <ChevronRight size={16} />
        </SubmitBtn>
      </form>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Step 3 — Complete Profile
────────────────────────────────────────────────────────── */
const DEPARTMENTS = [
  'Department of Land Resources',
  'Ministry of Rural Development',
  'Revenue & Disaster Management',
  'Department of Agriculture',
  'Urban Development Authority',
  'Forest Department',
];

const DESIGNATIONS = [
  'District Magistrate / Collector',
  'Sub-Divisional Magistrate',
  'Tehsildar / Naib Tehsildar',
  'Revenue Inspector',
  'Land Records Officer',
  'Survey & Settlement Officer',
  'IAS Officer',
];

const DISTRICTS = [
  'Pune, Maharashtra',
  'Mumbai, Maharashtra',
  'Nagpur, Maharashtra',
  'Delhi, Delhi NCT',
  'Bengaluru, Karnataka',
  'Chennai, Tamil Nadu',
  'Lucknow, Uttar Pradesh',
  'Jaipur, Rajasthan',
];

function Step3({ email, token, onNext, onDemoApproved }) {
  const isDemo = email === DEMO_EMAIL;
  const [form, setForm] = useState(
    isDemo
      ? { ...DEMO_PROFILE }   // auto-fill all fields for demo
      : { name: '', empId: '', dept: '', designation: '', district: '' }
  );
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name = 'Required';
    if (!form.empId.trim())   e.empId = 'Required';
    if (!form.dept)           e.dept = 'Required';
    if (!form.designation)    e.designation = 'Required';
    if (!form.district)       e.district = 'Required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setApiError('');
    setLoading(true);
    try {
      const data = await registerOfficer(form, token);
      // Demo officer: register returns approved + dashboard token immediately
      if (data.isDemo || data.status === 'approved') {
        onDemoApproved(data.token, data.officer);
        return;
      }
      // Real officer: go to pending step
      onNext(form, data.token);
    } catch (err) {
      setApiError(err.message || 'Could not save profile. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = k =>
    `w-full bg-[#1a3f7a] border ${errors[k] ? 'border-red-500' : 'border-blue-600'} text-white rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80]/30 transition-all placeholder-blue-400`;
  const selectCls = k =>
    `w-full bg-[#1a3f7a] border ${errors[k] ? 'border-red-500' : 'border-blue-600'} text-white rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80]/30 transition-all appearance-none`;

  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 rounded-xl bg-[#1a3f7a] border border-blue-700 flex items-center justify-center mb-4 shadow-lg">
        <User size={30} className="text-white" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-1">Complete Government Profile</h2>
      <p className="text-blue-300 text-sm mb-6 text-center">
        Please provide the following details to complete your account setup.
      </p>

      {apiError && (
        <div className="w-full mb-4 bg-red-900/40 border border-red-700 rounded-lg px-4 py-3 text-xs text-red-300">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full space-y-3.5">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-white mb-1.5">
            Full Name <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400" />
            <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
              placeholder="Enter your full name" className={inputCls('name')} />
          </div>
          {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
        </div>

        {/* Employee ID */}
        <div>
          <label className="block text-xs font-semibold text-white mb-1.5">
            Government Employee ID <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <BadgeCheck size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400" />
            <input type="text" value={form.empId} onChange={e => set('empId', e.target.value)}
              placeholder="Enter your employee ID" className={inputCls('empId')} />
          </div>
          {errors.empId && <p className="text-xs text-red-400 mt-1">{errors.empId}</p>}
        </div>

        {/* Department */}
        <div>
          <label className="block text-xs font-semibold text-white mb-1.5">
            Department <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Building2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" />
            <select value={form.dept} onChange={e => set('dept', e.target.value)} className={selectCls('dept')}>
              <option value="">Select Department</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <ChevronRight size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 rotate-90 text-blue-400 pointer-events-none" />
          </div>
          {errors.dept && <p className="text-xs text-red-400 mt-1">{errors.dept}</p>}
        </div>

        {/* Designation */}
        <div>
          <label className="block text-xs font-semibold text-white mb-1.5">
            Designation <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Shield size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" />
            <select value={form.designation} onChange={e => set('designation', e.target.value)} className={selectCls('designation')}>
              <option value="">Select Designation</option>
              {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <ChevronRight size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 rotate-90 text-blue-400 pointer-events-none" />
          </div>
          {errors.designation && <p className="text-xs text-red-400 mt-1">{errors.designation}</p>}
        </div>

        {/* District / State */}
        <div>
          <label className="block text-xs font-semibold text-white mb-1.5">
            District / State <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" />
            <select value={form.district} onChange={e => set('district', e.target.value)} className={selectCls('district')}>
              <option value="">Select District / State</option>
              {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <ChevronRight size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 rotate-90 text-blue-400 pointer-events-none" />
          </div>
          {errors.district && <p className="text-xs text-red-400 mt-1">{errors.district}</p>}
        </div>

        {/* Official Email (read-only, already verified) */}
        <div>
          <label className="block text-xs font-semibold text-white mb-1.5">Official Email</label>
          <div className="relative">
            <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400" />
            <input readOnly value={email}
              className="w-full bg-[#1a3f7a]/60 border border-blue-700 text-blue-300 rounded-lg pl-10 pr-10 py-2.5 text-sm focus:outline-none" />
            <CheckCircle2 size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4ade80]" />
          </div>
        </div>

        <SubmitBtn loading={loading}>
          Submit for Verification <ChevronRight size={16} />
        </SubmitBtn>
      </form>

      <div className="mt-4 w-full bg-[#1a3f7a]/60 border border-blue-700 rounded-lg p-3 flex items-start gap-2.5">
        <Info size={14} className="text-blue-400 shrink-0 mt-0.5" />
        <p className="text-[11px] text-blue-300 leading-relaxed">
          Your details will be verified by the respective department. You will be notified once the account is activated.
        </p>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Step 4 — Admin Verification Pending
────────────────────────────────────────────────────────── */
const POLL_INTERVAL_MS = 10_000;

function Step4({ profile, pendingToken, onApproved }) {
  const [polling, setPolling]     = useState(false);
  const [lastChecked, setLastChecked] = useState(null);
  const [approving, setApproving] = useState(false);

  const checkStatus = useCallback(async () => {
    if (!pendingToken) return;
    setPolling(true);
    try {
      const data = await getMe(pendingToken);
      setLastChecked(new Date().toLocaleTimeString());
      if (data.officer?.status === 'approved' && data.dashboardToken) {
        onApproved(data.dashboardToken, data.officer);
      }
    } catch { /* silent */ } finally {
      setPolling(false);
    }
  }, [pendingToken, onApproved]);

  useEffect(() => {
    checkStatus();
    const id = setInterval(checkStatus, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [checkStatus]);

  // One-click demo approval
  const handleDemoApprove = async () => {
    setApproving(true);
    try {
      const data = await demoApprove(pendingToken);
      if (data.dashboardToken) {
        onApproved(data.dashboardToken, data.officer);
      }
    } catch (err) {
      console.error('Demo approve error:', err);
    } finally {
      setApproving(false);
    }
  };

  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-[#1a3f7a] border border-blue-700 flex items-center justify-center mb-5 shadow-lg">
        <Clock size={30} className="text-yellow-400" />
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">Verification Pending</h2>
      <p className="text-blue-300 text-sm mb-8 leading-relaxed max-w-sm">
        Your government profile has been submitted for verification.<br />
        You will be notified once your account is approved.
      </p>

      {/* Details */}
      <div className="w-full bg-[#1a3f7a]/60 border border-blue-700 rounded-xl overflow-hidden mb-5">
        {[
          { icon: Building2, label: 'Department', value: profile?.dept || '—' },
          { icon: Shield,    label: 'Role',       value: profile?.designation || '—' },
          {
            icon: Clock, label: 'Status',
            value: (
              <span className="flex items-center gap-1.5 justify-end">
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                Pending Admin Approval
              </span>
            ),
            highlight: true,
          },
        ].map((row, i, arr) => {
          const Icon = row.icon;
          return (
            <div key={i} className={`flex items-center justify-between px-5 py-3.5 ${i < arr.length - 1 ? 'border-b border-blue-800' : ''}`}>
              <div className="flex items-center gap-2.5 text-sm text-blue-300">
                <Icon size={16} className="text-blue-400" />
                {row.label}
              </div>
              <div className={`text-sm font-semibold ${row.highlight ? 'text-yellow-400' : 'text-white'}`}>
                {row.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info box */}
      <div className="w-full bg-[#1a3f7a]/60 border border-blue-700 rounded-xl p-4 flex items-start gap-3 mb-5 text-left">
        <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-300 leading-relaxed">
          You will receive an email notification at your official government email once your account is verified.
        </p>
      </div>

      {/* Auto-poll indicator */}
      <div className="flex items-center gap-2 text-xs text-blue-500 mb-4">
        {polling
          ? <><Loader2 size={12} className="animate-spin text-blue-400" /> Checking status...</>
          : <><CheckCircle2 size={12} className="text-blue-600" /> Last checked: {lastChecked || '—'}</>
        }
      </div>

      {/* ── Demo: one-click approve ── */}
      <div className="w-full mb-3 bg-[#0a2a1a] border border-[#1a6b3c] rounded-xl p-4">
        <p className="text-[10px] font-bold text-[#4ade80] uppercase tracking-widest mb-2">
          Demo — Simulate Admin Approval
        </p>
        <p className="text-xs text-blue-400 mb-3">
          Click below to instantly approve this request and access the Officer Dashboard.
        </p>
        <button
          onClick={handleDemoApprove}
          disabled={approving}
          className="w-full bg-[#1a6b3c] hover:bg-[#228b4e] disabled:opacity-60 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
        >
          {approving
            ? <><Loader2 size={15} className="animate-spin" /> Approving...</>
            : <><CheckCircle2 size={15} /> Approve & Enter Officer Dashboard</>
          }
        </button>
      </div>

      {/* Manual refresh */}
      <button
        onClick={checkStatus}
        disabled={polling}
        className="w-full border border-blue-700 hover:border-blue-500 text-blue-300 hover:text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm disabled:opacity-50 mb-3"
      >
        <RefreshCw size={15} className={polling ? 'animate-spin' : ''} />
        Check Approval Status
      </button>

      <p className="text-[10px] text-blue-600">
        Page auto-checks every 10 seconds · You can safely close and return later
      </p>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Footer
────────────────────────────────────────────────────────── */
function OfficerLoginFooter() {
  return (
    <footer className="bg-[#0a1f42] border-t border-blue-900 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-white p-0.5 shadow-sm overflow-hidden flex items-center justify-center">
            <img src="/bhunirnay-logo.png" alt="BhuNirnay" className="h-full w-full object-contain" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">BhuNirnay</p>
            <p className="text-blue-400 text-[10px]">National Land Intelligence Platform</p>
          </div>
        </div>

        <div className="flex gap-4 text-xs text-blue-400">
          {['About', 'Privacy Policy', 'Terms of Use', 'Help & Support'].map((l, i, a) => (
            <React.Fragment key={l}>
              <button className="hover:text-white transition-colors">{l}</button>
              {i < a.length - 1 && <span>|</span>}
            </React.Fragment>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-800 border border-blue-600 flex items-center justify-center">
            <span className="text-[10px] text-blue-300">🇮🇳</span>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-blue-300 font-medium">Ministry of Rural Development</p>
            <p className="text-[9px] text-blue-500">Dept. of Land Resources, Government of India</p>
            <p className="text-[9px] text-blue-600 italic">सत्यमेव जयते</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ──────────────────────────────────────────────────────────
   Main page component
────────────────────────────────────────────────────────── */
export default function OfficerLoginPage() {
  const [step, setStep]               = useState(0);
  const [email, setEmail]             = useState('');
  const [regToken, setRegToken]       = useState('');   // 15-min registration JWT
  const [pendingToken, setPendingToken] = useState(''); // 7-day pending JWT
  const [profile, setProfile]         = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate  = useNavigate();
  const { setRole, showToast } = useApp();

  // Step 1 → 2: email validated, OTP sent
  const handleStep1 = ({ email: e }) => {
    setEmail(e);
    setStep(1);
  };

  // Step 2 → 3: OTP verified, registration token received
  const handleStep2 = ({ token }) => {
    setRegToken(token);
    setStep(2);
  };

  // Step 3 → 4: profile saved, pending token received
  const handleStep3 = (formData, pendingTok) => {
    setProfile(formData);
    if (pendingTok) setPendingToken(pendingTok);
    setStep(3);
  };

  // Step 4: admin approved → dashboard token received
  const handleApproved = (dashboardToken, officer) => {
    // Store dashboard token in sessionStorage for the session
    sessionStorage.setItem('bhunirnay_officer_token', dashboardToken);
    setRole('officer');
    showToast(`Access granted — Welcome, ${officer.full_name}`, 'success');
    navigate('/officer');
  };

  const backTo = () => {
    if (step === 0) navigate('/');
    else setStep(s => s - 1);
  };

  return (
    <div className="min-h-screen bg-[#0f2d5c] flex flex-col">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 pt-[88px] flex flex-col">
        <div className="flex-1 flex flex-col items-center px-4 py-10">

          {/* Back button */}
          <div className="w-full max-w-2xl mb-4">
            <button
              onClick={backTo}
              className="flex items-center gap-2 text-sm text-blue-300 hover:text-white transition-colors bg-white/10 hover:bg-white/15 px-4 py-2 rounded-lg"
            >
              <ArrowLeft size={15} />
              {step === 0 ? 'Back to Home' : 'Back'}
            </button>
          </div>

          {/* Card */}
          <div className="w-full max-w-2xl bg-[#112244] border border-blue-800 rounded-2xl shadow-2xl p-8">
            <StepIndicator current={step} />

            {step === 0 && (
              <Step1 onNext={handleStep1} />
            )}
            {step === 1 && (
              <Step2
                email={email}
                onNext={handleStep2}
                onBack={() => setStep(0)}
              />
            )}
            {step === 2 && (
              <Step3
                email={email}
                token={regToken}
                onNext={handleStep3}
                onDemoApproved={handleApproved}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <Step4
                profile={profile}
                pendingToken={pendingToken || regToken}
                onApproved={handleApproved}
              />
            )}
          </div>
        </div>
      </div>

      <OfficerLoginFooter />
    </div>
  );
}
