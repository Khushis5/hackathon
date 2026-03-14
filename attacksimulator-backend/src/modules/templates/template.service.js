import { db } from '../../config/firebase.js';

export const createTemplate = async (data, userId) => {
  const template = {
    name: data.name,
    subject: data.subject,
    body: data.body,
    senderName: data.senderName || 'IT Support',
    senderEmail: data.senderEmail || 'it@company.com',
    type: data.type || 'PHISHING',
    createdBy: userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  const ref = await db.collection('templates').add(template);
  return { id: ref.id, ...template };
};

export const getAllTemplates = async () => {
  const snapshot = await db.collection('templates').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getTemplateById = async (id) => {
  const doc = await db.collection('templates').doc(id).get();
  if (!doc.exists) throw new Error('Template not found');
  return { id: doc.id, ...doc.data() };
};

export const updateTemplate = async (id, data) => {
  const ref = db.collection('templates').doc(id);
  const doc = await ref.get();
  if (!doc.exists) throw new Error('Template not found');
  const updated = { ...data, updatedAt: new Date().toISOString() };
  await ref.update(updated);
  return { id, ...doc.data(), ...updated };
};

export const deleteTemplate = async (id) => {
  const ref = db.collection('templates').doc(id);
  const doc = await ref.get();
  if (!doc.exists) throw new Error('Template not found');
  await ref.delete();
  return { message: 'Template deleted successfully' };
};