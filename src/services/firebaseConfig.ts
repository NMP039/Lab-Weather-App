import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { FIREBASE_CONFIG } from '../config/apiConfig';

// Initialize Firebase
const app: FirebaseApp = initializeApp(FIREBASE_CONFIG);
const auth: Auth = getAuth(app);

export { app, auth };
