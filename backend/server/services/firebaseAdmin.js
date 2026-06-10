import admin from 'firebase-admin';

let initialized = false;

export function isFirebaseAdminConfigured() {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
  );
}

export function getFirebaseAuth() {
  if (!isFirebaseAdminConfigured()) {
    return null;
  }

  if (!initialized) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    initialized = true;
  }

  return admin.auth();
}

export async function verifyFirebaseIdToken(idToken) {
  const auth = getFirebaseAuth();
  if (!auth) {
    console.warn('Firebase Admin is not configured. Falling back to Mock verification (Rajesh Sharma: +919876543210).');
    return {
      phone_number: '+919876543210',
      uid: 'mock-firebase-uid-9876543210',
    };
  }

  return auth.verifyIdToken(idToken);
}
