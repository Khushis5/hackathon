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
      const getAttackTemplate = (user, campaign) => {
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
        const trackingLink = `${backendUrl}/api/tracking/click?c=${id}&u=${user.id}`;
        const type = campaign.type.toUpperCase();

        if (type.includes('PHISHING')) {
          return {
            subject: 'Action Required: Verify Your IT Credentials',
            html: `
              <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
                <div style="text-align: center; margin-bottom: 20px;">
                  <h2 style="color: #2c3e50;">Security Notification</h2>
                </div>
                <p>Dear ${user.name},</p>
                <p>Our security systems have flagged a potential synchronization issue with your corporate account.</p>
                <p>To prevent access lockout, please verify your credentials through our secure portal immediately:</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${trackingLink}" style="background-color: #3498db; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify My Account</a>
                </div>
                <p style="color: #7f8c8d; font-size: 0.9em;">Security Code: REF-${id.substring(0, 8).toUpperCase()}</p>
                <p>Thank you,<br/>IT Security Operations Team</p>
              </div>
            `
          };
        }

        if (type.includes('MALWARE')) {
          return {
            subject: 'Urgent: Invoice INV-88293 Payment Overdue',
            html: `
              <div style="font-family: Arial, sans-serif; color: #333;">
                <p>Hello,</p>
                <p>Attached is the overdue invoice for your recent service request. Please review the details and process payment by the end of the business day to avoid service interruption.</p>
                <p>You can download a digital copy of the invoice below:</p>
                <p><a href="${trackingLink}" style="color: #0066cc; font-weight: bold; text-decoration: underline;">Download_Invoice_INV88293.pdf.exe</a> (2.4 MB)</p>
                <p>Regards,<br/>Accounts Payable Department</p>
              </div>
            `
          };
        }

        if (type.includes('RANSOMWARE')) {
          return {
            subject: 'CRITICAL: Unauthorized Data Access Detected',
            html: `
              <div style="background-color: #f8d7da; padding: 20px; border: 1px solid #f5c6cb; font-family: sans-serif;">
                <h2 style="color: #721c24; margin-top: 0;">⚠️ Security Breach Alert</h2>
                <p>System monitoring has detected an unauthorized attempt to access sensitive files on your workstation.</p>
                <p><strong>Incident ID:</strong> ${id}</p>
                <p>We are initiating an emergency security scan and system lock. Please click below to authorize the scan and prevent data encryption:</p>
                <p><a href="${trackingLink}" style="background-color: #721c24; color: white; padding: 10px 20px; text-decoration: none; display: inline-block; border-radius: 4px;">Run Emergency Security Scan</a></p>
                <p style="font-size: 0.8em; color: #666;">If no action is taken within 10 minutes, your system will be automatically isolated from the network.</p>
              </div>
            `
          };
        }

        return {
          subject: 'Important Security Update',
          html: `<p>Dear ${user.name}, please click <a href="${trackingLink}">here</a> to verify your account.</p>`
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