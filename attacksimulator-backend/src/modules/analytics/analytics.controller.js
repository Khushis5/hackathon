import {
  getDashboardStats,
  getCampaignStats,
  getDepartmentStats,
  getCampaignTrends
} from './analytics.service.js';

export const dashboard = async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.status(200).json({ stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const campaignStats = async (req, res) => {
  try {
    const stats = await getCampaignStats(req.params.id);
    res.status(200).json({ stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const departmentStats = async (req, res) => {
  try {
    const stats = await getDepartmentStats();
    res.status(200).json({ stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const trends = async (req, res) => {
  try {
    const data = await getCampaignTrends();
    res.status(200).json({ trends: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};