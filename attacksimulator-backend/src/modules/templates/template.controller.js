import {
  createTemplate,
  getAllTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate
} from './template.service.js';

export const create = async (req, res) => {
  try {
    const { name, subject, body, senderName, senderEmail, type } = req.body;
    if (!name || !subject || !body) {
      return res.status(400).json({ error: 'Name, subject and body are required' });
    }
    const validTypes = ['PHISHING', 'CREDENTIAL_HARVEST', 'PASSWORD_TEST', 'INCIDENT_RESPONSE'];
    if (type && !validTypes.includes(type)) {
      return res.status(400).json({ error: `Type must be one of: ${validTypes.join(', ')}` });
    }
    const template = await createTemplate(
      { name, subject, body, senderName, senderEmail, type },
      req.user.userId
    );
    res.status(201).json({ message: 'Template created successfully', template });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const templates = await getAllTemplates();
    res.status(200).json({ templates });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOne = async (req, res) => {
  try {
    const template = await getTemplateById(req.params.id);
    res.status(200).json({ template });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const template = await updateTemplate(req.params.id, req.body);
    res.status(200).json({ message: 'Template updated successfully', template });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const result = await deleteTemplate(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};