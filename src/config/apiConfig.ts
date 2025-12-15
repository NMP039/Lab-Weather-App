/**
 * ===========================================
 * CẤU HÌNH API
 * ===========================================
 * 
 * Backend API URL: Thay đổi khi dùng ngrok/pinggy hoặc deploy
 * Firebase: Giữ nguyên cho authentication
 */

// ===========================================
// BACKEND API URL
// ===========================================
// Trong development với ngrok/pinggy, thay đổi URL này
// Ví dụ: https://abc123.ngrok.io hoặc https://randomid.a.pinggy.online
export const BACKEND_API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// ===========================================
// FIREBASE CONFIGURATION
// ===========================================
// Lấy config tại: https://console.firebase.google.com/
export const FIREBASE_CONFIG = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// ===========================================
// DEPRECATED - API keys giờ được quản lý ở backend
// ===========================================
// export const OPENWEATHERMAP_API_KEY = "...";
