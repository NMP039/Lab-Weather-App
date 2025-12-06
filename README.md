Họ tên: **Nguyễn Minh Phát**
MSSV: **24127482**

## Hướng dẫn chạy

### Yêu cầu
- Node.js >= 16.x
- npm

### Các bước

1. **Cài đặt dependencies**
```bash
npm install
```

2. **Cấu hình API Keys** ⚙️
   
   Mở file **`src/config/apiConfig.ts`** và thay thế các giá trị `YOUR_...` bằng API keys thật:

   ```typescript
   // Firebase Config - Lấy từ Firebase Console
   export const FIREBASE_CONFIG = {
       apiKey: "YOUR_FIREBASE_API_KEY",
       authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_PROJECT_ID.appspot.com",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID"
   };

   // OpenWeatherMap API Key
   export const OPENWEATHERMAP_API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";
   ```

3. **Hướng dẫn lấy API Keys**

   #### 3.1. OpenWeatherMap API Key
   - Đăng ký tài khoản tại https://home.openweathermap.org/users/sign_up
   - Vào https://home.openweathermap.org/api_keys để lấy API key

   #### 3.2. Firebase Config (cho Đăng nhập Google)
   
   **Bước 1: Tạo Firebase Project**
   - Truy cập [Firebase Console](https://console.firebase.google.com/)
   - Nhấn **"Add project"** hoặc **"Create a project"**

   **Bước 2: Thêm Web App**
   - Trong Firebase Console, nhấn vào icon **</>** (Web) để thêm web app
   - Nhấn **"Register app"**
   - Copy cấu hình Firebase được hiển thị vào file `apiConfig.ts`

   **Bước 3: Bật Google Sign-In**
   - Trong Firebase Console, vào **Authentication** > **Sign-in method**
   - Nhấn **"Add new provider"** hoặc chọn **Google**
   - Bật **Enable**
   - Chọn **Project support email** (email hỗ trợ)
   - Nhấn **Save**

4. **Chạy development server**
```bash
npm run dev
```

5. **Mở trình duyệt**
   - Truy cập: http://localhost:3000/ (hoặc port hiển thị trên terminal)
   - Nhấn nút **"Đăng nhập với Google"** ở góc phải header để đăng nhập

6. **Build cho production** (optional)
```bash
npm run build
```