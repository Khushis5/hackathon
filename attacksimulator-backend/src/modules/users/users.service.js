import { db } from '../../config/firebase.js';
import bcrypt from 'bcryptjs';

// Get all users
export const getAllUsers = async () => {
  const snapshot = await db.collection('users').get();
  return snapshot.docs.map(doc => {
    const { password, ...data } = doc.data();
    return { id: doc.id, ...data };
  });
};

// Get single user by ID
export const getUserById = async (id) => {
  const doc = await db.collection('users').doc(id).get();
  if (!doc.exists) throw new Error('User not found');
  const data = doc.data();
  delete data.password;
  return { id: doc.id, ...data };
};

// Update user
export const updateUser = async (id, data) => {
  const ref = db.collection('users').doc(id);
  const doc = await ref.get();
  if (!doc.exists) throw new Error('User not found');

  // Don't allow password update here
  delete data.password;

  const updated = {
    ...data,
    updatedAt: new Date().toISOString()
  };

  await ref.update(updated);
  return { id, ...doc.data(), ...updated };
};

// Delete user
export const deleteUser = async (id) => {
  const ref = db.collection('users').doc(id);
  const doc = await ref.get();
  if (!doc.exists) throw new Error('User not found');
  await ref.delete();
  return { message: 'User deleted successfully' };
};

// Change password
export const changePassword = async (id, oldPassword, newPassword) => {
  const ref = db.collection('users').doc(id);
  const doc = await ref.get();
  if (!doc.exists) throw new Error('User not found');

  const user = doc.data();

  // Verify old password
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new Error('Old password is incorrect');

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await ref.update({
    password: hashedPassword,
    updatedAt: new Date().toISOString()
  });

  return { message: 'Password changed successfully' };
};