import { Router } from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import supabase from '../lib/supabase.js';
import { sendOtpEmail } from '../lib/mailer.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// ── DEMO OFFICER — pre-approved, no DB needed ────────────────────────────────
// Use this account to test the full 4-step flow instantly.
//
//   Email    : vikramaditya.singh@ias.gov.in
//   OTP      : 123456  (fixed, always works)
//   Name     : Vikramaditya Singh
//   Emp ID   : IAS-MH-2019-0047
//   Dept     : Department of Land Resources
//   Desig.   : District Magistrate / Collector
//   District : Pune, Maharashtra
//
const DEMO_OFFICER = {
  email:       'vikramaditya.singh@ias.gov.in',
  otp:         '123456',
  full_name:   'Vikramaditya Singh',
  employee_id: 'IAS-MH-2019-0047',
  department:  'Department of Land Resources',
  designation: 'District Magistrate / Collector',
  district:    'Pune, Maharashtra',
  status:      'approved',
  id:          'demo-officer-001',
};

function isDemoOfficer(email) {
  return email === DEMO_OFFICER.email;
}

// ── Rate limiters ────────────────────────────────────────────────────────────
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { error: 'Too many OTP requests. Please wait 10 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const verifyLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: { error: 'Too many verification attempts. Please wait 10 minutes.' },
});

// ── Helpers ──────────────────────────────────────────────────────────────────
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function isGovEmail(email) {
  return email.endsWith('.gov.in') || email.endsWith('.nic.in') || email.endsWith('.com');
}

function issueDashboardToken(officer) {
  return jwt.sign(
    { email: officer.email, officerId: officer.id, scope: 'dashboard', role: 'officer' },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );
}

// ── POST /api/auth/send-otp ──────────────────────────────────────────────────
router.post('/send-otp', otpLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required.' });
    }
    const normalised = email.trim().toLowerCase();
    if (!isGovEmail(normalised)) {
      return res.status(400).json({ error: 'Only @gov.in, @nic.in, or .com email addresses are accepted.' });
    }

    // ── DEMO OFFICER: fixed OTP, no DB or email needed ───────────────────────
    if (isDemoOfficer(normalised)) {
      console.log(`\n🎯 DEMO OFFICER — OTP is always: ${DEMO_OFFICER.otp}\n`);
      return res.json({
        success: true,
        message: `OTP sent to ${normalised}`,
        devOtp: DEMO_OFFICER.otp,   // always shown in UI for demo
        isDemo: true,
      });
    }

    // ── Real officer path ────────────────────────────────────────────────────
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error: dbErr } = await supabase
      .from('officer_otps')
      .upsert(
        { email: normalised, otp_code: otp, expires_at: expiresAt, verified: false },
        { onConflict: 'email' }
      );

    if (dbErr) {
      console.error('DB upsert error:', dbErr);
      return res.status(500).json({ error: 'Could not store OTP. Try again.' });
    }

    try {
      await sendOtpEmail(normalised, otp);
    } catch (mailErr) {
      console.error('Mailer error:', mailErr);
      if (process.env.NODE_ENV === 'production') {
        return res.status(500).json({ error: 'Failed to send OTP email. Try again.' });
      }
      console.log(`\n📬 DEV MODE — OTP for ${normalised}: ${otp}\n`);
    }

    return res.json({
      success: true,
      message: `OTP sent to ${normalised}`,
      ...(process.env.NODE_ENV !== 'production' && { devOtp: otp }),
    });
  } catch (err) {
    console.error('send-otp error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// ── POST /api/auth/verify-otp ────────────────────────────────────────────────
router.post('/verify-otp', verifyLimiter, async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required.' });
    }

    const normalised = email.trim().toLowerCase();
    const otpStr = otp.toString().trim();

    // ── DEMO OFFICER: fixed OTP bypass ───────────────────────────────────────
    if (isDemoOfficer(normalised)) {
      if (otpStr !== DEMO_OFFICER.otp) {
        return res.status(400).json({ error: 'Invalid OTP. Demo OTP is 123456.' });
      }
      // Demo officer is pre-approved — issue a registration token that skips step 3
      const token = jwt.sign(
        { email: normalised, scope: 'registration', isDemo: true },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );
      return res.json({ success: true, token, isDemo: true });
    }

    // ── Real path ─────────────────────────────────────────────────────────────
    const { data, error: dbErr } = await supabase
      .from('officer_otps')
      .select('*')
      .eq('email', normalised)
      .single();

    if (dbErr || !data) {
      return res.status(400).json({ error: 'No OTP found for this email. Request a new one.' });
    }
    if (data.verified) {
      return res.status(400).json({ error: 'OTP already used. Request a new one.' });
    }
    if (new Date(data.expires_at) < new Date()) {
      return res.status(400).json({ error: 'OTP has expired. Request a new one.' });
    }
    if (data.otp_code !== otpStr) {
      return res.status(400).json({ error: 'Invalid OTP. Check your email and try again.' });
    }

    await supabase.from('officer_otps').update({ verified: true }).eq('email', normalised);

    const token = jwt.sign(
      { email: normalised, scope: 'registration' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    return res.json({ success: true, token });
  } catch (err) {
    console.error('verify-otp error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// ── POST /api/auth/register-officer ─────────────────────────────────────────
router.post('/register-officer', requireAuth, async (req, res) => {
  try {
    if (req.officer.scope !== 'registration') {
      return res.status(403).json({ error: 'Invalid token scope.' });
    }

    const email = req.officer.email;

    // ── DEMO OFFICER: pre-approved, skip DB insert ───────────────────────────
    if (isDemoOfficer(email)) {
      const dashboardToken = issueDashboardToken(DEMO_OFFICER);
      return res.json({
        success: true,
        status: 'approved',
        isDemo: true,
        token: dashboardToken,      // dashboard-ready immediately
        officer: DEMO_OFFICER,
      });
    }

    // ── Real path ─────────────────────────────────────────────────────────────
    const { name, empId, dept, designation, district } = req.body;
    if (!name || !empId || !dept || !designation || !district) {
      return res.status(400).json({ error: 'All profile fields are required.' });
    }

    const { data: existing } = await supabase
      .from('officers')
      .select('id, status')
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      const pendingToken = jwt.sign(
        { email, officerId: existing.id, scope: 'pending', status: existing.status },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      return res.json({ success: true, status: existing.status, alreadyRegistered: true, token: pendingToken });
    }

    const { data: officer, error: insertErr } = await supabase
      .from('officers')
      .insert({
        email,
        full_name: name.trim(),
        employee_id: empId.trim(),
        department: dept,
        designation,
        district,
        status: 'pending_verification',
      })
      .select('id, status')
      .single();

    if (insertErr) {
      console.error('Insert error:', insertErr);
      return res.status(500).json({ error: 'Could not save profile. Try again.' });
    }

    const pendingToken = jwt.sign(
      { email, officerId: officer.id, scope: 'pending', status: 'pending_verification' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({ success: true, status: 'pending_verification', token: pendingToken });
  } catch (err) {
    console.error('register-officer error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// ── POST /api/auth/demo-approve ──────────────────────────────────────────────
// Instantly approves a real pending officer for demo purposes.
// In production this would be done by an admin UI.
router.post('/demo-approve', requireAuth, async (req, res) => {
  try {
    const { email } = req.officer;

    // Demo officer needs no DB update
    if (isDemoOfficer(email)) {
      const dashboardToken = issueDashboardToken(DEMO_OFFICER);
      return res.json({ success: true, dashboardToken, officer: DEMO_OFFICER });
    }

    // Real officer — flip status to approved in DB
    const { data: officer, error } = await supabase
      .from('officers')
      .update({ status: 'approved' })
      .eq('email', email)
      .select('id, full_name, email, department, designation, district, status')
      .single();

    if (error || !officer) {
      return res.status(404).json({ error: 'Officer not found.' });
    }

    const dashboardToken = issueDashboardToken(officer);
    return res.json({ success: true, dashboardToken, officer });
  } catch (err) {
    console.error('demo-approve error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// ── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get('/me', requireAuth, async (req, res) => {
  try {
    const { email } = req.officer;

    // ── DEMO OFFICER ─────────────────────────────────────────────────────────
    if (isDemoOfficer(email)) {
      const dashboardToken = issueDashboardToken(DEMO_OFFICER);
      return res.json({ success: true, officer: DEMO_OFFICER, dashboardToken });
    }

    // ── Real officer ──────────────────────────────────────────────────────────
    const { data: officer, error } = await supabase
      .from('officers')
      .select('id, full_name, email, department, designation, district, status, created_at')
      .eq('email', email)
      .single();

    if (error || !officer) {
      return res.status(404).json({ error: 'Officer profile not found.' });
    }

    let dashboardToken = null;
    if (officer.status === 'approved') {
      dashboardToken = issueDashboardToken(officer);
    }

    return res.json({ success: true, officer, dashboardToken });
  } catch (err) {
    console.error('me error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
