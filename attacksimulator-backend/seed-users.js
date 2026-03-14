import bcrypt from 'bcryptjs';
import { db } from './src/config/firebase.js';
import dotenv from 'dotenv';
dotenv.config();

const seedUsers = async () => {
  console.log('Seeding definitive users...');
  
  const users = [
    {
      name: 'Super Admin',
      email: 'admin@hackathon.com',
      password: 'Admin@2026',
      role: 'SUPER_ADMIN'
    },
    {
      name: 'Security Analyst',
      email: 'analyst@hackathon.com',
      password: 'Analyst@2026',
      role: 'ANALYST'
    }
  ];

  for (const u of users) {
    const existing = await db.collection('users').where('email', '==', u.email).get();
    if (existing.empty) {
      const hashedPassword = await bcrypt.hash(u.password, 12);
      await db.collection('users').add({
        name: u.name,
        email: u.email,
        password: hashedPassword,
        role: u.role,
        createdAt: new Date().toISOString()
      });
      console.log(`Created user: ${u.email}`);
    } else {
      console.log(`User already exists: ${u.email}`);
    }
  }
  
  console.log('Seeding complete.');
  process.exit(0);
};

seedUsers().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
