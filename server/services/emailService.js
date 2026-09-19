import nodemailer from 'nodemailer';
import EmailLog from '../models/EmailLog.js';

/**
 * Creates and returns a Nodemailer transporter configured for Gmail SMTP.
 * Reads GMAIL_USER / EMAIL_USER and GMAIL_APP_PASSWORD / EMAIL_PASS from environment variables.
 * Includes short timeouts (8s) so cloud firewalls (like Render Free Tier) fail fast rather than hanging.
 */
export function getEmailTransporter() {
  const user = process.env.GMAIL_USER || process.env.EMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS;

  if (!user || !pass) {
    return null; // SMTP credentials not yet provided
  }

  return nodemailer.createTransport({
    service: 'gmail',
    connectionTimeout: 8000, // 8s timeout to avoid 60s freeze on Render port blocks
    greetingTimeout: 8000,
    socketTimeout: 10000,
    auth: {
      user: user.trim(),
      pass: pass.trim().replace(/\s+/g, '') // strip accidental spaces in Google 16-char app password
    }
  });
}

/**
 * Checks email dispatcher configuration status across all supported providers:
 * 1. Brevo HTTPS API (Port 443)
 * 2. Resend HTTPS API (Port 443)
 * 3. SendGrid HTTPS API (Port 443)
 * 4. Gmail SMTP (Port 465)
 */
export function getSmtpStatus() {
  const brevoKey = process.env.BREVO_API_KEY || process.env.SIB_API_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const sendgridKey = process.env.SENDGRID_API_KEY;
  const user = process.env.GMAIL_USER || process.env.EMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS;

  if (brevoKey) {
    return {
      configured: true,
      activeProvider: 'brevo',
      user: user || process.env.BREVO_SENDER || 'Brevo Verified Sender',
      provider: 'Brevo HTTPS API (Port 443 • Cloud Native)',
      senderName: process.env.EMAIL_FROM_NAME || 'AlumniConnect Portal',
      fromAddress: user || process.env.BREVO_SENDER || 'noreply@alumniconnect.edu',
      isHttpsApi: true
    };
  }

  if (resendKey) {
    return {
      configured: true,
      activeProvider: 'resend',
      user: process.env.RESEND_FROM || 'onboarding@resend.dev',
      provider: 'Resend HTTPS API (Port 443 • Cloud Native)',
      senderName: process.env.EMAIL_FROM_NAME || 'AlumniConnect Portal',
      fromAddress: process.env.RESEND_FROM || 'onboarding@resend.dev',
      isHttpsApi: true
    };
  }

  if (sendgridKey) {
    return {
      configured: true,
      activeProvider: 'sendgrid',
      user: user || process.env.SENDGRID_FROM || 'SendGrid Verified Sender',
      provider: 'SendGrid HTTPS API (Port 443 • Cloud Native)',
      senderName: process.env.EMAIL_FROM_NAME || 'AlumniConnect Portal',
      fromAddress: user || 'noreply@alumniconnect.edu',
      isHttpsApi: true
    };
  }

  const configured = Boolean(user && pass && user.includes('@'));

  return {
    configured,
    activeProvider: configured ? 'gmail' : null,
    user: configured ? user.trim() : null,
    provider: 'Gmail SMTP (smtp.gmail.com:465)',
    senderName: process.env.EMAIL_FROM_NAME || 'AlumniConnect Portal',
    fromAddress: user || 'noreply@alumniconnect.edu',
    isHttpsApi: false,
    renderNotice: 'Render Free Tier blocks outbound SMTP ports 465/587. If test dispatch times out, add BREVO_API_KEY or RESEND_API_KEY in Render.'
  };
}

/**
 * Multi-Provider Email Dispatcher
 * Automatically routes through HTTPS APIs (Port 443) first, completely bypassing Render's SMTP port block.
 */
async function sendViaAvailableProvider({ to, recipientName = '', subject, html, text }) {
  const brevoKey = process.env.BREVO_API_KEY || process.env.SIB_API_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const sendgridKey = process.env.SENDGRID_API_KEY;
  const gmailUser = process.env.GMAIL_USER || process.env.EMAIL_USER;
  const senderName = process.env.EMAIL_FROM_NAME || 'AlumniConnect Portal';

  // 1. Try Brevo HTTPS REST API (Port 443 - zero firewall blocks on Render)
  if (brevoKey) {
    try {
      const senderEmail = process.env.BREVO_SENDER || gmailUser || 'noreply@alumniconnect.edu';
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': brevoKey.trim(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: senderName, email: senderEmail },
          to: [{ email: to, name: recipientName || undefined }],
          subject,
          htmlContent: html,
          textContent: text
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Brevo API dispatch failed');
      }
      return { success: true, provider: 'Brevo HTTPS API', messageId: data.messageId };
    } catch (err) {
      console.error('[EmailService] Brevo API error:', err.message);
      throw err;
    }
  }

  // 2. Try Resend HTTPS REST API (Port 443 - zero firewall blocks on Render)
  if (resendKey) {
    try {
      const fromAddr = process.env.RESEND_FROM || `${senderName} <onboarding@resend.dev>`;
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromAddr,
          to: [to],
          subject,
          html,
          text
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Resend API dispatch failed');
      }
      return { success: true, provider: 'Resend HTTPS API', messageId: data.id };
    } catch (err) {
      console.error('[EmailService] Resend API error:', err.message);
      throw err;
    }
  }

  // 3. Try SendGrid HTTPS REST API (Port 443)
  if (sendgridKey) {
    try {
      const fromEmail = process.env.SENDGRID_FROM || gmailUser || 'noreply@alumniconnect.edu';
      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sendgridKey.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: fromEmail, name: senderName },
          subject,
          content: [
            { type: 'text/plain', value: text || subject },
            { type: 'text/html', value: html }
          ]
        })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.errors?.[0]?.message || 'SendGrid API dispatch failed');
      }
      return { success: true, provider: 'SendGrid HTTPS API', messageId: `sg-${Date.now()}` };
    } catch (err) {
      console.error('[EmailService] SendGrid API error:', err.message);
      throw err;
    }
  }

  // 4. Try Gmail / Custom SMTP via Nodemailer
  const transporter = getEmailTransporter();
  if (transporter && gmailUser) {
    try {
      const info = await transporter.sendMail({
        from: `"${senderName}" <${gmailUser}>`,
        to,
        subject,
        html,
        text
      });
      return { success: true, provider: 'Gmail SMTP', messageId: info.messageId };
    } catch (err) {
      console.error('[EmailService] Gmail SMTP error:', err.message);
      const isPortBlocked = err.code === 'ETIMEDOUT' || 
                            err.code === 'ECONNREFUSED' || 
                            err.code === 'ESOCKET' || 
                            err.message?.toLowerCase().includes('timeout');
      if (isPortBlocked) {
        throw new Error(
          `Render Free Tier blocked outbound SMTP (port 465/587). Render permanently blocks direct SMTP sockets on free services. Please add BREVO_API_KEY (from brevo.com) or RESEND_API_KEY (from resend.com) to your Render Environment to send emails over port 443.`
        );
      }
      throw err;
    }
  }

  return { success: false, simulated: true, provider: 'Simulated (No Credentials)' };
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
  const status = getSmtpStatus();
  const fromUser = status.fromAddress || 'noreply@alumniconnect.edu';
  const senderName = status.senderName;
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
        AlumniConnect Institutional Platform &bull; Automated Dispatcher
      </div>
    </div>
  </body>
  </html>
  `;

  const textContent = `Hello ${name},\n\nYour 6-digit password reset code for AlumniConnect is: ${otp}\n\nThis code expires in ${expiresIn}.\n\nReset Link: ${resetUrl}\n\nIf you did not request this, please ignore this email.`;

  let sent = false;
  let deliveryStatus = 'Simulated / Logged';

  try {
    const dispatchRes = await sendViaAvailableProvider({
      to,
      recipientName: name,
      subject: `🔑 ${otp} is your AlumniConnect password reset code`,
      html: htmlContent,
      text: textContent
    });

    if (dispatchRes.success) {
      sent = true;
      deliveryStatus = `Delivered (${dispatchRes.provider})`;
      console.log(`[EmailService] Password reset OTP sent to ${to} via ${dispatchRes.provider}. MessageId: ${dispatchRes.messageId}`);
    } else {
      console.log(`[EmailService] Credentials missing. Simulated OTP for ${to}: [${otp}]`);
    }
  } catch (err) {
    console.error('[EmailService] Error sending password reset email:', err.message);
    deliveryStatus = `Failed (${err.message.substring(0, 50)})`;
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
    simulated: !sent,
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
  const status = getSmtpStatus();
  const fromUser = status.fromAddress || 'noreply@alumniconnect.edu';
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
Institutional Portal: ${loginUrl}
Registered Email ID: ${to}
${rollNumber ? `Roll / PRN Number: ${rollNumber}\n` : ''}Account Password: ${displayPassword}
--------------------------------------------------

You can now log in, build your alumni profile, connect with mentors, browse institutional job openings, and participate in alumni events.

Warm regards,
${collegeName} Administration`;

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Account Verified - Welcome to ${collegeName}</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
      .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
      .header { background: linear-gradient(135deg, #0f766e, #0d9488); padding: 36px 24px; text-align: center; color: #ffffff; }
      .header h1 { margin: 0 0 6px; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
      .header p { margin: 0; font-size: 14px; opacity: 0.9; }
      .content { padding: 36px 32px; }
      .cred-card { background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 12px; padding: 20px; margin: 24px 0; }
      .cred-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #dcfce7; font-size: 13px; }
      .cred-row:last-child { border-bottom: none; }
      .cred-label { color: #166534; font-weight: 600; }
      .cred-val { font-family: monospace; font-weight: 700; color: #14532d; }
      .btn { display: inline-block; background: #0d9488; color: #ffffff !important; text-decoration: none; padding: 13px 32px; border-radius: 8px; font-weight: 600; font-size: 14px; margin: 20px 0 10px; }
      .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🎉 Welcome to ${collegeName}</h1>
        <p>Your institutional alumni profile has been verified and approved</p>
      </div>
      <div class="content">
        <p style="font-size: 15px; margin-top: 0;">Dear <strong>${name}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.6; color: #475569;">
          Great news! The administration of <strong>${collegeName}</strong> has reviewed and verified your account registration.
        </p>

        <div class="cred-card">
          <div class="cred-row">
            <span class="cred-label">Registered Email:</span>
            <span class="cred-val">${to}</span>
          </div>
          ${rollNumber ? `
          <div class="cred-row">
            <span class="cred-label">Roll / PRN Number:</span>
            <span class="cred-val">${rollNumber}</span>
          </div>` : ''}
          <div class="cred-row">
            <span class="cred-label">Account Password:</span>
            <span class="cred-val">${displayPassword}</span>
          </div>
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

  try {
    const dispatchRes = await sendViaAvailableProvider({
      to,
      recipientName: name,
      subject,
      html: htmlContent,
      text: formattedBody
    });

    if (dispatchRes.success) {
      deliveryStatus = `Delivered (${dispatchRes.provider})`;
      messageId = dispatchRes.messageId;
      console.log(`[EmailService] Approval credentials sent to ${to} via ${dispatchRes.provider}. MessageId: ${messageId}`);
    }
  } catch (err) {
    console.error('[EmailService] Error sending approval email:', err.message);
    deliveryStatus = `Failed (${err.message.substring(0, 50)})`;
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
 * Sends a live Test Email to verify email dispatcher configuration
 */
export async function sendTestEmail({ to }) {
  const status = getSmtpStatus();

  if (!status.configured) {
    throw new Error('No email provider is configured on your server. Please add BREVO_API_KEY (from brevo.com), RESEND_API_KEY (from resend.com), or GMAIL_USER/GMAIL_APP_PASSWORD in your Render Environment dashboard.');
  }

  const fromUser = status.fromAddress || 'noreply@alumniconnect.edu';
  const senderName = status.senderName;
  const timestamp = new Date().toLocaleString();

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Email Dispatcher Test - AlumniConnect</title>
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
      <h2>Email Dispatcher Connected Successfully!</h2>
      <p>This test email confirms that your AlumniConnect backend is connected to <strong>${status.provider}</strong> and can deliver emails to inboxes in real time.</p>
      
      <div class="info-box">
        <div><strong>Provider:</strong> ${status.provider}</div>
        <div><strong>Sender:</strong> ${fromUser}</div>
        <div><strong>Recipient:</strong> ${to}</div>
        <div><strong>Dispatched At:</strong> ${timestamp}</div>
        <div><strong>Status:</strong> Live Delivery Verified</div>
      </div>

      <p style="font-size: 12px; color: #94a3b8;">You can now use Password Reset OTPs and Automated Member Onboarding with real delivery.</p>
    </div>
  </body>
  </html>
  `;

  const dispatchRes = await sendViaAvailableProvider({
    to,
    recipientName: 'Admin Tester',
    subject: `✅ AlumniConnect Email Test Successful (${timestamp})`,
    html: htmlContent,
    text: `Your AlumniConnect email connection is working properly! Test dispatched via ${status.provider} at ${timestamp}.`
  });

  // Record audit log
  await recordEmailLog({
    recipientEmail: to,
    recipientName: 'Admin Tester',
    subject: `✅ Connection Test (${dispatchRes.provider})`,
    body: `Test email successfully dispatched via ${dispatchRes.provider} to ${to}.`,
    type: 'test_email',
    tempCredentials: `${dispatchRes.provider} Verified`,
    status: `Delivered (${dispatchRes.provider})`
  });

  return {
    success: true,
    provider: dispatchRes.provider,
    messageId: dispatchRes.messageId,
    timestamp
  };
}
