import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

export const sendPhishingEmail = async (targetEmail, campaignId, userId, campaignName) => {
  const trackingLink = `https://hackathon-qfty.onrender.com/track/click?campaignId=${campaignId}&userId=${userId}`;

  const mailOptions = {
    from: `"Security Team" <${process.env.GMAIL_USER}>`,
    to: targetEmail,
    subject: '⚠️ Urgent: Your Account Security Alert',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="background: #cc0000; padding: 15px; border-radius: 6px 6px 0 0;">
          <h2 style="color: white; margin: 0;">🔐 Security Alert — Immediate Action Required</h2>
        </div>
        <div style="padding: 20px; background: #fff;">
          <p>Dear Customer,</p>
          <p>We have detected <strong>suspicious activity</strong> on your account. Your UPI transaction limit has been temporarily suspended.</p>
          <p>To restore access, you must verify your identity within <strong>24 hours</strong> or your account will be permanently locked.</p>
          <a href="${trackingLink}" 
             style="display: inline-block; background: #cc0000; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin: 20px 0;">
            Verify My Account Now
          </a>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            This is a simulated phishing email sent as part of a cybersecurity awareness program by ${campaignName}.
          </p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};