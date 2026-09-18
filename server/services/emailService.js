import nodemailer from 'nodemailer';
import EmailLog from '../models/EmailLog.js';

/**
 * Creates and returns a Nodemailer transporter configured for Gmail SMTP.
 * Reads GMAIL_USER / EMAIL_USER and GMAIL_APP_PASSWORD / EMAIL_PASS from environment variables.
 */
export function getEmailTransporter() {
  const user = process.env.GMAIL_USER || process.env.EMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS;

  if (!user || !pass) {
    return null; // SMTP credentials not yet provided
  }

  // Gmail SMTP transporter with secure SSL
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: user.trim(),
      pass: pass.trim().replace(/\s+/g, '') // remove any accidental spaces in Google 16-char app password
    }
  });
}

/**
 * Checks Gmail SMTP configuration status
 */
export function getSmtpStatus() {
  const user = process.env.GMAIL_USER || process.env.EMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS;
  const configured = Boolean(user && pass && user.includes('@'));

  return {
    configured,
    user: configured ? user.trim() : null,
    provider: 'Gmail SMTP (smtp.gmail.com:465)',
    senderName: process.env.EMAIL_FROM_NAME || 'AlumniConnect Portal',
    fromAddress: user || 'noreply@alumniconnect.edu'
  };
}

/**
 * Helper to log dispatched emails to MongoDB EmailLog collection
 */
async function recordEmailLog({
  recipientEmail,
  recipientName = '',
  subject,
  body,
  collegeId = 'col-1',
  type = 'verification',
  tempCredentials = '',
  status = 'Delivered'
}) {
  try {
    const log = new EmailLog({
      id: `email-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      recipientEmail: (recipientEmail || '').toLowerCase().trim(),
      recipientName,
      subject,
      body,
      status,
      sentAt: new Date(),
      collegeId,
      type,
      tempCredentials
    });
    await log.save();
    return log;
  } catch (err) {
    console.error('[EmailService] Failed to record email audit log:', err.message);
    return null;
  }
}

/**
 * Dispatches a styled Password Reset OTP Email
 */
export async function sendPasswordResetEmail({ to, name = 'User', otp, resetToken, expiresIn = '15 minutes' }) {
  const transporter = getEmailTransporter();
  const fromUser = process.env.GMAIL_USER || process.env.EMAIL_USER || 'noreply@alumniconnect.edu';
  const senderName = process.env.EMAIL_FROM_NAME || 'AlumniConnect Security';
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/login?token=${resetToken}`;

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Password Reset Request - AlumniConnect</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
      .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
      .header { background: linear-gradient(135deg, #1e3a8a, #3b82f6); padding: 32px 24px; text-align: center; color: #ffffff; }
      .header h1 { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
      .content { padding: 32px 28px; }
      .otp-box { background: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
      .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #1e3a8a; margin: 0; }
      .otp-hint { font-size: 12px; color: #64748b; margin-top: 8px; }
      .btn { display: inline-block; background: #2563eb; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px; margin-top: 16px; }
      .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
      .badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; background: #dbeafe; color: #1e40af; margin-bottom: 12px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <span class="badge">Security Notification</span>
        <h1>AlumniConnect Password Reset</h1>
      </div>
      <div class="content">
        <p style="font-size: 15px; margin-top: 0;">Hello <strong>${name}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.6; color: #475569;">
          We received a request to reset the password for your AlumniConnect account associated with <strong>${to}</strong>.
        </p>
        <p style="font-size: 14px; line-height: 1.6; color: #475569;">
          Use the 6-digit verification code below to complete your password reset:
        </p>
        
        <div class="otp-box">
          <div class="otp-code">${otp}</div>
          <div class="otp-hint">Expires in <strong>${expiresIn}</strong> • One-time use only</div>
        </div>

        <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
          If you are on the reset page, enter this 6-digit code along with your new password. Or, click below to open the portal:
        </p>

        <div style="text-align: center;">
          <a href="${resetUrl}" class="btn">Reset Password on Portal &rarr;</a>
        </div>

        <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 28px 0;" />
        
        <p style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin-bottom: 0;">
          🔒 If you didn't request this password reset, you can safely ignore this email. Your current password will remain unchanged.
        </p>
      </div>
      <div class="footer">
        AlumniConnect Institutional Platform &bull; Secure Gmail SMTP Dispatcher
      </div>
    </div>
  </body>
  </html>
  `;

  let sent = false;
  let deliveryStatus = 'Simulated / Logged';

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: `"${senderName}" <${fromUser}>`,
        to,
        subject: `🔑 ${otp} is your AlumniConnect password reset code`,
        html: htmlContent,
        text: `Hello ${name},\n\nYour 6-digit password reset code for AlumniConnect is: ${otp}\n\nThis code expires in ${expiresIn}.\n\nReset Link: ${resetUrl}\n\nIf you did not request this, please ignore this email.`
      });
      sent = true;
      deliveryStatus = 'Delivered (Gmail SMTP)';
      console.log(`[EmailService] Password reset OTP sent to ${to} via Gmail SMTP. MessageId: ${info.messageId}`);
    } catch (err) {
      console.error('[EmailService] Error sending email via Gmail SMTP:', err.message);
      deliveryStatus = `Failed (${err.message.substring(0, 40)})`;
    }
  } else {
    console.log(`[EmailService] SMTP not configured. Simulated OTP for ${to}: [${otp}]`);
  }

  // Record audit log in database
  await recordEmailLog({
    recipientEmail: to,
    recipientName: name,
    subject: `Password Reset OTP (${otp})`,
    body: `Dispatched 6-digit OTP: ${otp} for account ${to}. Valid for ${expiresIn}.`,
    type: 'password_reset',
    tempCredentials: `OTP: ${otp}`,
    status: deliveryStatus
  });

  return {
    success: true,
    sent,
    simulated: !transporter,
    deliveryStatus,
    otp,
    resetToken
  };
}

/**
 * Dispatches a Member Approval / Credential Dispatch Email
 */
export async function sendMemberApprovalEmail({
  to,
  name,
  collegeName = 'AlumniConnect',
  tempPassword = 'demo123',
  rollNumber = '',
  loginUrl = 'http://localhost:5173/login',
  customSubject,
  customBody
}) {
  const transporter = getEmailTransporter();
  const fromUser = process.env.GMAIL_USER || process.env.EMAIL_USER || 'noreply@alumniconnect.edu';
  const senderName = process.env.EMAIL_FROM_NAME || `${collegeName} Admin`;
  const isCustomTempPass = Boolean(tempPassword && tempPassword !== 'demo123' && !tempPassword.startsWith('$2'));
  const displayPassword = isCustomTempPass 
    ? tempPassword 
    : 'The secure password you created during registration';

  const subject = customSubject || `🎉 Welcome to ${collegeName} Alumni Portal - Your Account is Verified!`;

  const formattedBody = customBody || `Dear ${name},

Congratulations! Your registration request for ${collegeName} has been officially verified and approved.

Here are your account access details and login portal link:
--------------------------------------------------
• Portal Login Link: ${loginUrl}
• Username / Email: ${to}
• Roll Number / ID: ${rollNumber || 'N/A'}
• Password: ${displayPassword}
--------------------------------------------------

Please click the link above to log in to your portal. (If you forgot your password, you can click "Forgot Password?" on the login page to reset it with a 6-digit Gmail OTP).

Warm regards,
${collegeName} Administration`;

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
      .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
      .header { background: linear-gradient(135deg, #059669, #10b981); padding: 32px 24px; text-align: center; color: #ffffff; }
      .header h1 { margin: 0; font-size: 22px; font-weight: 700; }
      .content { padding: 32px 28px; }
      .credentials-box { background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 12px; padding: 20px; margin: 20px 0; }
      .cred-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #bbf7d0; font-size: 13px; }
      .cred-label { color: #166534; font-weight: 600; }
      .cred-val { font-family: monospace; font-weight: 700; color: #065f46; text-align: right; }
      .btn { display: inline-block; background: #059669; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px; margin-top: 16px; }
      .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Welcome to ${collegeName}</h1>
      </div>
      <div class="content">
        <p style="font-size: 15px; margin-top: 0;">Dear <strong>${name}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.6; color: #475569;">
          Your account has been officially verified and granted access to the <strong>${collegeName}</strong> portal.
        </p>

        <div class="credentials-box">
          <div style="font-size: 12px; font-weight: 700; color: #15803d; margin-bottom: 8px; text-transform: uppercase;">🔑 Official Login Credentials</div>
          <div class="cred-row"><span class="cred-label">Login URL:</span> <span class="cred-val">${loginUrl}</span></div>
          <div class="cred-row"><span class="cred-label">Username / Email:</span> <span class="cred-val">${to}</span></div>
          ${rollNumber ? `<div class="cred-row"><span class="cred-label">Roll Number / ID:</span> <span class="cred-val">${rollNumber}</span></div>` : ''}
          <div class="cred-row" style="border-bottom: none;"><span class="cred-label">Password:</span> <span class="cred-val" style="color: ${isCustomTempPass ? '#b91c1c' : '#047857'}; font-size: ${isCustomTempPass ? '14px' : '12px'}; font-weight: 700;">${displayPassword}</span></div>
        </div>

        <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
          💡 <em>If you ever forget your password, you can use the "Forgot Password?" link on the login page anytime to verify with a 6-digit OTP code sent to this email.</em>
        </p>

        <div style="text-align: center;">
          <a href="${loginUrl}" class="btn">Log In to Your Portal &rarr;</a>
        </div>
      </div>
      <div class="footer">
        Sent by ${collegeName} Administration via AlumniConnect Automated Dispatcher
      </div>
    </div>
  </body>
  </html>
  `;

  let deliveryStatus = 'Simulated / Logged';
  let messageId = null;

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: `"${senderName}" <${fromUser}>`,
        to,
        subject,
        html: htmlContent,
        text: formattedBody
      });
      deliveryStatus = 'Delivered (Gmail SMTP)';
      messageId = info.messageId;
      console.log(`[EmailService] Approval credentials sent to ${to}. MessageId: ${messageId}`);
    } catch (err) {
      console.error('[EmailService] Error sending approval email:', err.message);
      deliveryStatus = `Failed (${err.message.substring(0, 40)})`;
    }
  }

  // Record audit log
  await recordEmailLog({
    recipientEmail: to,
    recipientName: name,
    subject,
    body: formattedBody,
    type: 'verification',
    tempCredentials: `${isCustomTempPass ? `Pass: ${tempPassword}` : 'Password: [User Configured]'}${rollNumber ? ` | Roll: ${rollNumber}` : ''}`,
    status: deliveryStatus
  });

  return {
    success: true,
    status: deliveryStatus,
    messageId
  };
}

/**
 * Sends a live Test Email to verify Gmail SMTP configuration
 */
export async function sendTestEmail({ to }) {
  const transporter = getEmailTransporter();
  const fromUser = process.env.GMAIL_USER || process.env.EMAIL_USER;

  if (!transporter || !fromUser) {
    throw new Error('Gmail SMTP credentials are not configured in server/.env. Please add GMAIL_USER and GMAIL_APP_PASSWORD.');
  }

  const senderName = process.env.EMAIL_FROM_NAME || 'AlumniConnect System';
  const timestamp = new Date().toLocaleString();

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Gmail SMTP Test Email - AlumniConnect</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
      .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; text-align: center; }
      .icon { width: 56px; height: 56px; line-height: 56px; border-radius: 50%; background: #dcfce7; color: #16a34a; font-size: 28px; margin: 0 auto 16px; }
      h2 { margin: 0 0 8px; color: #0f172a; font-size: 20px; }
      p { font-size: 14px; color: #64748b; line-height: 1.6; }
      .info-box { background: #f1f5f9; border-radius: 8px; padding: 14px; margin: 20px 0; text-align: left; font-size: 12px; font-family: monospace; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="icon">✓</div>
      <h2>Gmail SMTP Connected Successfully!</h2>
      <p>This test email confirms that your AlumniConnect server is actively connected to Google Gmail SMTP servers and can dispatch emails in real time.</p>
      
      <div class="info-box">
        <div><strong>Sender:</strong> ${fromUser}</div>
        <div><strong>Recipient:</strong> ${to}</div>
        <div><strong>Dispatched At:</strong> ${timestamp}</div>
        <div><strong>Status:</strong> Live SMTP Verified</div>
      </div>

      <p style="font-size: 12px; color: #94a3b8;">You can now use Password Reset OTPs and Automated Verification Welcome Credentials with real Gmail delivery.</p>
    </div>
  </body>
  </html>
  `;

  const info = await transporter.sendMail({
    from: `"${senderName}" <${fromUser}>`,
    to,
    subject: `✅ AlumniConnect Gmail SMTP Test Successful (${timestamp})`,
    html: htmlContent,
    text: `Your AlumniConnect Gmail SMTP connection is working properly! Test dispatched from ${fromUser} at ${timestamp}.`
  });

  // Record audit log
  await recordEmailLog({
    recipientEmail: to,
    recipientName: 'Admin Tester',
    subject: '✅ Gmail SMTP Connection Test',
    body: `Test email successfully dispatched from ${fromUser} to ${to}.`,
    type: 'test_email',
    tempCredentials: 'SMTP Live Verification',
    status: 'Delivered (Gmail SMTP)'
  });

  return {
    success: true,
    messageId: info.messageId,
    timestamp
  };
}
