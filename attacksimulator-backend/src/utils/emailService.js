import nodemailer from 'nodemailer';

// Create a transporter using Gmail.
// In a production environment, this should be OAuth2. 
// For this hackathon, we'll use an App Password.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'attacksimulator.noreply@gmail.com',
    pass: process.env.EMAIL_APP_PASSWORD || ''
  }
});

/**
 * Sends a phishing simulation email to a target
 * 
 * @param {string} to - The recipient's email address
 * @param {string} subject - The subject of the email
 * @param {string} htmlBody - The HTML content of the email
 * @returns {Promise<any>}
 */
export const sendPhishingEmail = async (to, subject, htmlBody) => {
  if (!process.env.EMAIL_APP_PASSWORD) {
    console.warn(`[Email Service] EMAIL_APP_PASSWORD not set. Email to ${to} was logged instead of sent.`);
    console.log(`[Email Mock] Subject: ${subject}`);
    console.log(`[Email Mock] Body: ${htmlBody}`);
    return { mock: true };
  }

  const mailOptions = {
    from: `"IT Security" <${process.env.EMAIL_USER || 'attacksimulator.noreply@gmail.com'}>`,
    to,
    subject,
    html: htmlBody
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Email sent securely to ${to}. Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`[Email Service] Error sending email to ${to}:`, error);
    throw error;
  }
};
