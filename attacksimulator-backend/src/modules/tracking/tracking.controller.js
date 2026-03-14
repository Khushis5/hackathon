import {
  trackEvent,
  getTrackingByCampaign,
  getCampaignStats,
  getAllTrackingEvents
} from './tracking.service.js';
import { db } from '../../config/firebase.js';

export const track = async (req, res) => {
  try {
    const { campaignId, userId, email, eventType } = req.body;
    if (!campaignId || !eventType) {
      return res.status(400).json({ error: 'campaignId and eventType are required' });
    }
    const validEvents = ['EMAIL_OPENED', 'LINK_CLICKED', 'CREDENTIALS_SUBMITTED', 'REPORTED_PHISHING'];
    if (!validEvents.includes(eventType)) {
      return res.status(400).json({ error: `eventType must be one of: ${validEvents.join(', ')}` });
    }
    const event = await trackEvent({
      campaignId,
      userId,
      email,
      eventType,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    res.status(201).json({ message: 'Event tracked successfully', event });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const click = async (req, res) => {
  try {
    const { c: campaignId, u: userId } = req.query;
    if (!campaignId || !userId) {
      return res.status(400).send('<h1>Invalid Link</h1><p>The security simulation link is missing context.</p>');
    }

    // 1. Record the 'LINK_CLICKED' event in Firestore
    await trackEvent({
      campaignId,
      userId,
      eventType: 'LINK_CLICKED',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    // 2. Fetch campaign to know where to redirect
    const campaignDoc = await db.collection('campaigns').doc(campaignId).get();
    if (!campaignDoc.exists) {
      return res.status(404).send('<h1>Campaign Not Found</h1>');
    }
    
    const campaign = campaignDoc.data();
    const type = campaign.type.toLowerCase();
    
    let path = '/phishing-simulation';
    if (type.includes('malware')) path = '/malware-simulation';
    if (type.includes('ransomware')) path = '/ransomware-simulation';

    // 3. Redirect to frontend
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectUrl = `${frontendUrl}${path}?c=${campaignId}&u=${userId}&t=${campaign.templateId || 'default'}`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('[Tracking Controller] Error in click handler:', error);
    res.status(500).send('<h1>Internal Server Error</h1>');
  }
};

export const getByCampaign = async (req, res) => {
  try {
    const events = await getTrackingByCampaign(req.params.campaignId);
    res.status(200).json({ events });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const stats = await getCampaignStats(req.params.campaignId);
    res.status(200).json({ stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const events = await getAllTrackingEvents();
    res.status(200).json({ events });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};