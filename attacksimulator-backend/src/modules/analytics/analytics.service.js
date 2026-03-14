import { db } from '../../config/firebase.js';

// Get overall dashboard stats
export const getDashboardStats = async (orgId) => {
  const [campaignsSnap, usersSnap, templatesSnap, trackingSnap] = await Promise.all([
    db.collection('campaigns').get(),
    db.collection('users').get(),
    db.collection('templates').get(),
    db.collection('tracking').get()
  ]);

  const campaigns = campaignsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  const tracking = trackingSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter(c => c.status === 'RUNNING').length;
  const completedCampaigns = campaigns.filter(c => c.status === 'COMPLETED').length;

  const totalEvents = tracking.length;
  const clickEvents = tracking.filter(t => t.eventType === 'CLICKED').length;
  const submitEvents = tracking.filter(t => t.eventType === 'SUBMITTED').length;
  const reportEvents = tracking.filter(t => t.eventType === 'REPORTED').length;

  // Overall risk score
  const riskScore = calculateRiskScore(clickEvents, submitEvents, totalEvents);

  return {
    overview: {
      totalCampaigns,
      activeCampaigns,
      completedCampaigns,
      totalUsers: usersSnap.size,
      totalTemplates: templatesSnap.size
    },
    trackingStats: {
      totalEvents,
      clickEvents,
      submitEvents,
      reportEvents
    },
    riskScore
  };
};

// Get stats for a specific campaign
export const getCampaignStats = async (campaignId) => {
  const campaignDoc = await db.collection('campaigns').doc(campaignId).get();
  if (!campaignDoc.exists) throw new Error('Campaign not found');

  const campaign = { id: campaignDoc.id, ...campaignDoc.data() };

  const trackingSnap = await db.collection('tracking')
    .where('campaignId', '==', campaignId)
    .get();

  const events = trackingSnap.docs.map(d => d.data());

  const stats = {
    campaignName: campaign.name,
    campaignType: campaign.type,
    campaignStatus: campaign.status,
    totalTargets: campaign.targetGroup?.length || 0,
    totalEvents: events.length,
    emailsOpened: events.filter(e => e.eventType === 'OPENED').length,
    linksClicked: events.filter(e => e.eventType === 'CLICKED').length,
    formsSubmitted: events.filter(e => e.eventType === 'SUBMITTED').length,
    reported: events.filter(e => e.eventType === 'REPORTED').length,
  };

  stats.clickRate = stats.totalTargets > 0
    ? ((stats.linksClicked / stats.totalTargets) * 100).toFixed(1)
    : 0;

  stats.submitRate = stats.totalTargets > 0
    ? ((stats.formsSubmitted / stats.totalTargets) * 100).toFixed(1)
    : 0;

  stats.riskScore = calculateRiskScore(
    stats.linksClicked,
    stats.formsSubmitted,
    stats.totalTargets
  );

  return stats;
};

// Get risk score by department
export const getDepartmentStats = async () => {
  const trackingSnap = await db.collection('tracking').get();
  const events = trackingSnap.docs.map(d => d.data());

  // Group by department
  const departments = {};

  events.forEach(event => {
    const dept = event.department || 'Unknown';
    if (!departments[dept]) {
      departments[dept] = {
        department: dept,
        totalEvents: 0,
        clicked: 0,
        submitted: 0,
        reported: 0
      };
    }
    departments[dept].totalEvents++;
    if (event.eventType === 'CLICKED') departments[dept].clicked++;
    if (event.eventType === 'SUBMITTED') departments[dept].submitted++;
    if (event.eventType === 'REPORTED') departments[dept].reported++;
  });

  // Calculate risk score per department
  return Object.values(departments).map(dept => ({
    ...dept,
    riskScore: calculateRiskScore(dept.clicked, dept.submitted, dept.totalEvents)
  })).sort((a, b) => b.riskScore - a.riskScore);
};

// Get campaign trends over time
export const getCampaignTrends = async () => {
  const campaignsSnap = await db.collection('campaigns').get();
  const campaigns = campaignsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  // Group by month
  const trends = {};

  campaigns.forEach(campaign => {
    const date = new Date(campaign.createdAt);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!trends[month]) {
      trends[month] = {
        month,
        totalCampaigns: 0,
        phishing: 0,
        credentialHarvest: 0,
        passwordTest: 0,
        incidentDrill: 0
      };
    }

    trends[month].totalCampaigns++;
    if (campaign.type === 'PHISHING') trends[month].phishing++;
    if (campaign.type === 'CREDENTIAL_HARVEST') trends[month].credentialHarvest++;
    if (campaign.type === 'PASSWORD_TEST') trends[month].passwordTest++;
    if (campaign.type === 'INCIDENT_DRILL') trends[month].incidentDrill++;
  });

  return Object.values(trends).sort((a, b) => a.month.localeCompare(b.month));
};

// Risk score formula
const calculateRiskScore = (clicked, submitted, total) => {
  if (total === 0) return 0;
  const score = ((clicked * 0.4) + (submitted * 0.6)) / total * 100;
  return Math.min(100, parseFloat(score.toFixed(1)));
};