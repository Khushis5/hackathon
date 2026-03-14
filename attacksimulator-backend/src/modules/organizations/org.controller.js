import {
  createOrg, getAllOrgs, getOrgById,
  updateOrg, deleteOrg, getOrgMembers
} from './org.service.js';

export const create = async (req, res) => {
  try {
    const { name, domain, industry, size } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const org = await createOrg({ name, domain, industry, size }, req.user.userId);
    res.status(201).json({ message: 'Organization created successfully', org });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const orgs = await getAllOrgs();
    res.status(200).json({ orgs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOne = async (req, res) => {
  try {
    const org = await getOrgById(req.params.id);
    res.status(200).json({ org });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const org = await updateOrg(req.params.id, req.body);
    res.status(200).json({ message: 'Organization updated successfully', org });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const result = await deleteOrg(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMembers = async (req, res) => {
  try {
    const members = await getOrgMembers(req.params.id);
    res.status(200).json({ members });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};