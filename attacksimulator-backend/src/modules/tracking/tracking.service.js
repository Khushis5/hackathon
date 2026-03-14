import { db } from '../../config/firebase.js';

export const trackEvent = async (data) => {
  const event = {
    campaignId: data.campaignId,
    userId: data.userId || null,
    email: data.email || null,
    eventType: data.eventType,
    ipAddress: data.ipAddress || null,
    userAgent: data.userAgent || null,
    createdAt: new Date().toISOString()
  };
  const ref = await db.collection('tracking').add(event);

  // Update campaign stats in real-time
  const campaignRef = db.collection('campaigns').doc(data.campaignId);
  const campaignDoc = await campaignRef.get();

  if (campaignDoc.exists) {
    const updates = {};
    if (data.eventType === 'LINK_CLICKED') {
      updates.clicked = (campaignDoc.data().clicked || 0) + 1;
    } else if (data.eventType === 'CREDENTIALS_SUBMITTED') {
      updates.submitted = (campaignDoc.data().submitted || 0) + 1;
    } else if (data.eventType === 'EMAIL_OPENED') {
      updates.engaged = (campaignDoc.data().engaged || 0) + 1;
    }
    
    if (Object.keys(updates).length > 0) {
      await campaignRef.update(updates);
    }
  }

  return { id: ref.id, ...event };
};

export const getTrackingByCampaign = async (campaignId) => {
  const snapshot = await db.collection('tracking')
    .where('campaignId', '==', campaignId)
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getCampaignStats = async (campaignId) => {
  const snapshot = await db.collection('tracking')
    .where('campaignId', '==', campaignId)
    .get();

  const events = snapshot.docs.map(doc => doc.data());

  const stats = {
    campaignId,
    totalEvents: events.length,
    emailOpened: events.filter(e => e.eventType === 'EMAIL_OPENED').length,
    linkClicked: events.filter(e => e.eventType === 'LINK_CLICKED').length,
    credentialsSubmitted: events.filter(e => e.eventType === 'CREDENTIALS_SUBMITTED').length,
    reportedPhishing: events.filter(e => e.eventType === 'REPORTED_PHISHING').length,
  };

  stats.clickRate = stats.totalEvents > 0
    ? ((stats.linkClicked / stats.emailOpened) * 100).toFixed(2) + '%'
    : '0%';

  stats.submitRate = stats.totalEvents > 0
    ? ((stats.credentialsSubmitted / stats.emailOpened) * 100).toFixed(2) + '%'
    : '0%';

  return stats;
};

export const getAllTrackingEvents = async () => {
  const snapshot = await db.collection('tracking').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};