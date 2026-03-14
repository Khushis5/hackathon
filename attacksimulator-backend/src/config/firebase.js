import admin from 'firebase-admin';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    // Robust parsing: handles extra quotes or whitespace often added in cloud consoles
    const cleanJson = process.env.FIREBASE_SERVICE_ACCOUNT.trim().replace(/^['"]|['"]$/g, '');
    serviceAccount = JSON.parse(cleanJson);
  } catch (err) {
    console.error('[Firebase Config] Failed to parse FIREBASE_SERVICE_ACCOUNT env var:', err.message);
    throw err;
  }
} else {
  // Try several paths to be safe on different deployment structures
  const paths = [
    join(__dirname, '../../serviceAccountKey.json'),
    join(process.cwd(), 'serviceAccountKey.json'),
    '/opt/render/project/src/serviceAccountKey.json'
  ];
  
  let found = false;
  for (const p of paths) {
    if (fs.existsSync(p)) {
      serviceAccount = JSON.parse(fs.readFileSync(p, 'utf-8'));
      found = true;
      console.log(`[Firebase Config] Loaded credentials from: ${p}`);
      break;
    }
  }
  
  if (!found) {
    throw new Error('Firebase Service Account key not found in environment or file system.');
  }
}
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

export { admin, db };