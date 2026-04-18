function getNodemailer() {
  try {
    return require('nodemailer');
  } catch {
    const err = new Error(
      'nodemailer is not installed. From the bn folder run: npm install nodemailer'
    );
    err.code = 'MODULE_NOT_FOUND';
    throw err;
  }
}

function createTransport() {
  const nodemailer = getNodemailer();
  return nodemailer.createTransport({
    host:   process.env.SMTP_HOST || 'smtp.gmail.com',
    port:   Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const FROM = `WorldNewsNow <${process.env.SMTP_USER || 'noreply@worldnewsnow.com'}>`;
const SITE = process.env.CLIENT_URL || 'https://worldnewsnow.vercel.app';

exports.sendVerificationEmail = async (email, token) => {
  const link = `${SITE}/verify-email?token=${token}`;
  const transport = createTransport();
  await transport.sendMail({
    from: FROM,
    to: email,
    subject: 'Verify your WorldNewsNow email',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#D4A853">WorldNewsNow</h2>
        <p>Click the link below to verify your email address. The link expires in 24 hours.</p>
        <a href="${link}" style="display:inline-block;background:#D4A853;color:#0A0C0F;padding:12px 24px;
          border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">
          Verify Email
        </a>
        <p style="color:#666;font-size:12px">Or copy: ${link}</p>
      </div>`,
  });
};

exports.sendPasswordResetEmail = async (email, token) => {
  const link = `${SITE}/reset-password?token=${token}`;
  const transport = createTransport();
  await transport.sendMail({
    from: FROM,
    to: email,
    subject: 'Reset your WorldNewsNow password',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#D4A853">WorldNewsNow</h2>
        <p>You requested a password reset. Click the link below — it expires in 1 hour.</p>
        <a href="${link}" style="display:inline-block;background:#D4A853;color:#0A0C0F;padding:12px 24px;
          border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">
          Reset Password
        </a>
        <p style="color:#666;font-size:12px">If you didn't request this, ignore this email.</p>
        <p style="color:#666;font-size:12px">Or copy: ${link}</p>
      </div>`,
  });
};
