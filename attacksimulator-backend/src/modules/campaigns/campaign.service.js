import { db } from '../../config/firebase.js';
import { sendPhishingEmail } from '../../utils/emailService.js';

export const createCampaign = async (data, userId) => {
  const campaign = {
    name: data.name,
    type: data.type,
    status: 'DRAFT',
    templateId: data.templateId || null,
    targetGroup: data.targetGroup || [],
    scheduledAt: data.scheduledAt || null,
    createdBy: userId,
    orgId: data.orgId || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  const ref = await db.collection('campaigns').add(campaign);
  return { id: ref.id, ...campaign };
};

export const getAllCampaigns = async (userId, role) => {
  let snapshot;
  if (role === 'SUPER_ADMIN' || role === 'CAMPAIGN_MANAGER') {
    snapshot = await db.collection('campaigns').get();
  } else {
    snapshot = await db.collection('campaigns')
      .where('createdBy', '==', userId)
      .get();
  }
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getCampaignById = async (id) => {
  const doc = await db.collection('campaigns').doc(id).get();
  if (!doc.exists) throw new Error('Campaign not found');
  return { id: doc.id, ...doc.data() };
};

export const updateCampaign = async (id, data) => {
  const ref = db.collection('campaigns').doc(id);
  const doc = await ref.get();
  if (!doc.exists) throw new Error('Campaign not found');
  const updated = { ...data, updatedAt: new Date().toISOString() };
  await ref.update(updated);
  return { id, ...doc.data(), ...updated };
};

export const deleteCampaign = async (id) => {
  const ref = db.collection('campaigns').doc(id);
  const doc = await ref.get();
  if (!doc.exists) throw new Error('Campaign not found');
  await ref.delete();
  return { message: 'Campaign deleted successfully' };
};



export const launchCampaign = async (id) => {
  const ref = db.collection('campaigns').doc(id);
  const doc = await ref.get();
  if (!doc.exists) throw new Error('Campaign not found');
  
  const campaign = doc.data();

  // If this is a phishing, malware or ransomware campaign, we need to send emails
  // Valid types: PHISHING, MALWARE, RANSOMWARE, CREDENTIAL_HARVEST, PASSWORD_TEST, INCIDENT_RESPONSE
  const validTypes = ['PHISHING', 'CREDENTIAL_HARVEST', 'PASSWORD_TEST', 'INCIDENT_RESPONSE', 'MALWARE', 'RANSOMWARE'];
  
  if (validTypes.includes(campaign.type.toUpperCase())) {
    try {
      // Get all targeted users
      const targetQuery = campaign.targetGroup?.length 
        ? db.collection('users').where('__name__', 'in', campaign.targetGroup)
        : db.collection('users');
      
      // Create attack-specific email templates
      // Detailed templates for each attack type
      const templates = {
        PHISHING: {
          hr: {
            subject: 'Action Required: Update Your Employee Profile',
            html: (user, link) => `<div style="font-family: sans-serif; padding: 20px;">
              <p>Dear ${user.name},</p>
              <p>Please click the link below to verify and update your employee profile information. This is required for our upcoming HR system migration.</p>
              <p><a href="${link}" style="background: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Update Profile</a></p>
              <p>Best regards,<br/>Human Resources Team</p>
            </div>`
          },
          it: {
            subject: 'Security Alert: Update Your Password Now',
            html: (user, link) => `<div style="font-family: sans-serif; padding: 20px;">
              <p>Dear Employee,</p>
              <p>We detected suspicious activity on your account. Please click below to verify your credentials and secure your account immediately.</p>
              <p><a href="${link}" style="background: #e74c3c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Verify Credentials</a></p>
              <p>If you did not request this, please contact IT.<br/>IT Security Team</p>
            </div>`
          },
          finance: {
            subject: 'Invoice Verification Required',
            html: (user, link) => `<div style="font-family: sans-serif; padding: 20px;">
              <p>Dear Colleague,</p>
              <p>We need you to verify an outstanding invoice. Please click the link below to review and confirm payment details.</p>
              <p><a href="${link}" style="background: #27ae60; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Review Invoice</a></p>
              <p>Thank you,<br/>Finance Department</p>
            </div>`
          },
          general: {
            subject: 'Important: System Maintenance Notice',
            html: (user, link) => `<div style="font-family: sans-serif; padding: 20px;">
              <p>Dear Team,</p>
              <p>We will be performing critical system maintenance this weekend. Click below to download the maintenance schedule and FAQs.</p>
              <p><a href="${link}" style="background: #7f8c8d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Download Schedule</a></p>
              <p>Thank you for your patience,<br/>IT Operations</p>
            </div>`
          }
        },
        MALWARE: {
          trojan: {
            subject: 'Important: System Security Update Required',
            html: (user, link) => `<div style="font-family: sans-serif; padding: 20px;">
              <p>Dear ${user.name},</p>
              <p>Our IT department has detected a potential security vulnerability on your workstation.</p>
              <p>Please download and run the attached Security_Scanner.exe to check for any issues.</p>
              <p><a href="${link}" style="color: #0066cc; font-weight: bold; text-decoration: underline;">Download Security_Scanner.exe (2.4 MB)</a></p>
              <p>Best regards,<br/>IT Security Team</p>
            </div>`
          },
          keylogger: {
            subject: 'New Employee Handbook - Please Review',
            html: (user, link) => `<div style="font-family: sans-serif; padding: 20px;">
              <p>Dear Team Member,</p>
              <p>We have updated our employee handbook with new policies and procedures for 2026.</p>
              <p>Please download and review the attached Employee_Handbook_2026.pdf.</p>
              <p><a href="${link}" style="color: #0066cc; font-weight: bold; text-decoration: underline;">Employee_Handbook_2026.pdf</a></p>
              <p>Thank you,<br/>HR Department</p>
            </div>`
          }
        },
        RANSOMWARE: {
          ransomware: {
            subject: 'Critical: Data Backup Verification Required',
            html: (user, link) => `<div style="font-family: sans-serif; padding: 20px; border: 2px solid #c0392b;">
              <h2 style="color: #c0392b;">⚠️ Urgent Action Needed</h2>
              <p>Dear ${user.name},</p>
              <p>As part of our new data protection policy, please authorize a backup verification on your workstation.</p>
              <p>Failure to verify by the end of today will result in temporary account lockout for security reasons.</p>
              <p><a href="${link}" style="background: #c0392b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Authorize Backup Verification</a></p>
              <p>Best regards,<br/>Data Protection Team</p>
            </div>`
          }
        }
      };

      const getAttackTemplate = (user, campaign) => {
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
        const trackingLink = `${backendUrl}/api/tracking/click?c=${id}&u=${user.id}`;
        const type = campaign.type.toUpperCase();
        const templateId = (campaign.templateId || 'general').toLowerCase();

        // Find the right category (Phishing, Malware, Ransomware)
        let category = 'PHISHING';
        if (type.includes('MALWARE')) category = 'MALWARE';
        if (type.includes('RANSOMWARE')) category = 'RANSOMWARE';

        const templateSet = templates[category] || templates.PHISHING;
        const selectedTemplate = templateSet[templateId] || Object.values(templateSet)[0];

        return {
          subject: selectedTemplate.subject,
          html: selectedTemplate.html(user, trackingLink)
        };
      };

      if (campaign.targetGroup?.length) {
         const usersSnap = await targetQuery.get();
         const users = usersSnap.docs.map(uDoc => ({ id: uDoc.id, ...uDoc.data() }));

         for (const user of users) {
           const template = getAttackTemplate(user, campaign);
           
           await sendPhishingEmail(
             user.email,
             template.subject,
             template.html
           );
           
           await db.collection('tracking').add({
             campaignId: id,
             userId: user.id,
             eventType: 'SENT',
             timestamp: new Date().toISOString()
           });
         }
      }
    } catch (err) {
      console.error('[Campaign Service] Failed to send campaign emails', err);
      throw new Error('Failed to dispatch campaign emails: ' + err.message);
    }
  }

  await ref.update({
    status: 'RUNNING',
    launchedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  
  return { id, status: 'RUNNING', message: 'Campaign launched and emails dispatched successfully' };
};

export const pauseCampaign = async (id) => {
  const ref = db.collection('campaigns').doc(id);
  const doc = await ref.get();
  if (!doc.exists) throw new Error('Campaign not found');
  await ref.update({
    status: 'PAUSED',
    updatedAt: new Date().toISOString()
  });
  return { id, status: 'PAUSED', message: 'Campaign paused successfully' };
};