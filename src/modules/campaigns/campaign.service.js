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

  const emailPromises = campaign.targetGroup.map(async (target) => {
    try {
      await sendPhishingEmail(
        target.email,
        id,
        target.userId || target.email,
        campaign.name
      );
    } catch (err) {
      console.error(`Failed to send to ${target.email}:`, err);
    }
  });

  await Promise.all(emailPromises);

  await ref.update({
    status: 'RUNNING',
    launchedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  return { id, status: 'RUNNING', message: 'Campaign launched and emails sent successfully' };
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