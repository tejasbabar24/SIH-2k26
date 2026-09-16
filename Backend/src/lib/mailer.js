import nodemailer from 'nodemailer';

// Gmail SMTP transporter — uses App Password (not OAuth)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,   // 16-char Gmail App Password
  },
});

/**
 * Send OTP email to a government officer
 * @param {string} to  - recipient email
 * @param {string} otp - 6-digit code
 */
export async function sendOtpEmail(to, otp) {
  await transporter.sendMail({
    from: `"BhuNirnay — National Land Intelligence Platform" <${process.env.SMTP_USER}>`,
    to,
    subject: 'BhuNirnay Officer Portal — Your OTP',
    text: `Your BhuNirnay verification code is: ${otp}\n\nValid for 10 minutes. Do not share this code.\n\nMinistry of Rural Development · Dept of Land Resources`,
    html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#0f2d5c;border-radius:12px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:28px 32px;border-bottom:1px solid #1a3f7a;">
              <p style="margin:0;color:#93c5fd;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">
                BHUNIRNAY · SIH 26019 · MINISTRY OF RURAL DEVELOPMENT
              </p>
              <h1 style="margin:6px 0 0;color:#ffffff;font-size:20px;font-weight:800;">
                Government Officer Verification
              </h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="color:#93c5fd;font-size:14px;margin:0 0 24px;">
                You requested access to the BhuNirnay National Land Intelligence Platform.<br>
                Use the OTP below to verify your official government identity.
              </p>

              <!-- OTP Box -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:24px;background:#1a3f7a;border-radius:10px;border:1px solid #2a5aaa;">
                    <p style="margin:0 0 8px;color:#93c5fd;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">
                      ONE-TIME PASSWORD
                    </p>
                    <p style="margin:0;color:#4ade80;font-size:42px;font-weight:900;letter-spacing:12px;font-family:monospace;">
                      ${otp}
                    </p>
                    <p style="margin:12px 0 0;color:#60a5fa;font-size:11px;">
                      Valid for <strong>10 minutes</strong> · Do not share this code
                    </p>
                  </td>
                </tr>
              </table>

              <p style="color:#6b88aa;font-size:12px;margin:24px 0 0;line-height:1.6;">
                If you did not request this, please ignore this email or contact your department administrator.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background:#0a1f42;border-top:1px solid #1a3f7a;">
              <p style="margin:0;color:#4a6a99;font-size:10px;">
                Ministry of Rural Development · Department of Land Resources · Government of India
              </p>
              <p style="margin:4px 0 0;color:#2a4a79;font-size:10px;font-style:italic;">
                सत्यमेव जयते
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  });
}
