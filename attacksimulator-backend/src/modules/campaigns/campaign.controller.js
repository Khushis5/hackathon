import {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  launchCampaign,
  pauseCampaign
} from './campaign.service.js';

export const create = async (req, res) => {
  try {
    const { name, type, templateId, targetGroup, scheduledAt, orgId } = req.body;
    if (!name || !type) {
      return res.status(400).json({ error: 'Name and type are required' });
    }
    const validTypes = ['PHISHING', 'CREDENTIAL_HARVEST', 'PASSWORD_TEST', 'INCIDENT_RESPONSE'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: `Type must be one of: ${validTypes.join(', ')}` });
    }
    const campaign = await createCampaign(
      { name, type, templateId, targetGroup, scheduledAt, orgId },
      req.user.userId
    );
    res.status(201).json({ message: 'Campaign created successfully', campaign });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const campaigns = await getAllCampaigns(req.user.userId, req.user.role);
    res.status(200).json({ campaigns });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOne = async (req, res) => {
  try {
    const campaign = await getCampaignById(req.params.id);
    res.status(200).json({ campaign });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const campaign = await updateCampaign(req.params.id, req.body);
    res.status(200).json({ message: 'Campaign updated successfully', campaign });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const result = await deleteCampaign(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const launch = async (req, res) => {
  try {
    const result = await launchCampaign(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const pause = async (req, res) => {
  try {
    const result = await pauseCampaign(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};