import { db } from '../../config/firebase.js';

export const createOrg = async (data, userId) => {
  const org = {
    name: data.name,
    domain: data.domain || null,
    industry: data.industry || null,
    size: data.size || null,
    createdBy: userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  const ref = await db.collection('organizations').add(org);
  return { id: ref.id, ...org };
};

export const getAllOrgs = async () => {
  const snapshot = await db.collection('organizations').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getOrgById = async (id) => {
  const doc = await db.collection('organizations').doc(id).get();
  if (!doc.exists) throw new Error('Organization not found');
  return { id: doc.id, ...doc.data() };
};

export const updateOrg = async (id, data) => {
  const ref = db.collection('organizations').doc(id);
  const doc = await ref.get();
  if (!doc.exists) throw new Error('Organization not found');
  const updated = { ...data, updatedAt: new Date().toISOString() };
  await ref.update(updated);
  return { id, ...doc.data(), ...updated };
};

export const deleteOrg = async (id) => {
  const ref = db.collection('organizations').doc(id);
  const doc = await ref.get();
  if (!doc.exists) throw new Error('Organization not found');
  await ref.delete();
  return { message: 'Organization deleted successfully' };
};

export const getOrgMembers = async (orgId) => {
  const snapshot = await db.collection('users')
    .where('orgId', '==', orgId)
    .get();
  return snapshot.docs.map(doc => {
    const { password, ...data } = doc.data();
    return { id: doc.id, ...data };
  });
};