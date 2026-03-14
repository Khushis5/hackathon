import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../../config/firebase.js';

// Register a new user
export const registerUser = async (name, email, password, role = 'ANALYST') => {
  // Check if user already exists
  const existing = await db.collection('users')
    .where('email', '==', email)
    .get();

  if (!existing.empty) {
    throw new Error('User already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Save to Firestore
  const userRef = await db.collection('users').add({
    name,
    email,
    password: hashedPassword,
    role,
    createdAt: new Date().toISOString()
  });

  return { id: userRef.id, name, email, role };
};

// Login user
export const loginUser = async (email, password) => {
  // Find user
  const snapshot = await db.collection('users')
    .where('email', '==', email)
    .get();

  if (snapshot.empty) {
    throw new Error('Invalid credentials');
  }

  const userDoc = snapshot.docs[0];
  const user = { id: userDoc.id, ...userDoc.data() };

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // Generate tokens
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  };
};