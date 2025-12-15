# 🗺️ POI Vietnam App

Ứng dụng tìm kiếm và khám phá điểm tham quan tại Việt Nam với AI chatbot, dịch thuật, và thông tin thời tiết.

**Họ tên:** Nguyễn Minh Phát  
**MSSV:** 24127482

---

## 🚀 Cài đặt nhanh

### Bước 1: Clone project

```bash
git clone <repository-url>
cd poi-vn-app
```

### Bước 2: Setup Backend (Python/FastAPI)

```bash
cd backend

# Cài đặt dependencies
pip install -r requirements.txt
```

**⚠️ QUAN TRỌNG: Cấu hình API Keys**

Mở file `backend/.env` và thay thế các placeholder bằng API keys thực:

```bash
# Windows
notepad backend\.env

# Mac/Linux
nano backend/.env
```

Trong file `.env`, tìm và thay thế:
- `your_openweathermap_key_here` → API key thật của bạn
- `your_huggingface_token_here` → Token thật của bạn

**Xem mục "🔑 Hướng dẫn lấy API Keys" bên dưới để biết cách lấy từng key.**

### Bước 3: Setup Frontend (TypeScript/Vite)

```bash
cd ..
npm install
```

### Bước 4: Chạy ứng dụng

**Terminal 1 - Backend:**
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Mở trình duyệt: http://localhost:......

---

## 🔑 Hướng dẫn lấy API Keys

### 1. OpenWeatherMap API Key (Bắt buộc - cho Weather)

1. Đăng ký tài khoản: https://home.openweathermap.org/users/sign_up
2. Xác nhận email
3. Vào https://home.openweathermap.org/api_keys
4. Copy API key và paste vào `backend/.env`:
   ```env
   OPENWEATHERMAP_API_KEY=abc123your_key_here
   ```

### 2. Hugging Face Token (Bắt buộc - cho AI Chat)

1. Đăng ký: https://huggingface.co/join
2. Vào settings: https://huggingface.co/settings/tokens
3. Click **New token**
4. Chọn type: **Read**
5. Copy token và paste vào `backend/.env`:
   ```env
   HF_API_TOKEN=hf_abc...your_token_here
   ```

### 3. Firebase Config (Bắt buộc - cho Google Login)

**Bước 1: Tạo Firebase Project**
1. Truy cập: https://console.firebase.google.com/
2. Click **"Add project"** hoặc **"Create a project"**
3. Đặt tên project và hoàn tất setup

**Bước 2: Thêm Web App**
1. Trong Firebase Console, click icon **</>** (Web)
2. Đặt tên app và click **"Register app"**
3. Copy toàn bộ config (firebaseConfig object)

**Bước 3: Bật Google Sign-In**
1. Vào **Authentication** > **Sign-in method**
2. Click **Google**
3. Bật **Enable**
4. Chọn **Project support email**
5. Click **Save**

**Bước 4: Cập nhật Frontend Config**

Mở file `src/config/apiConfig.ts` và thay thế:

```typescript
export const FIREBASE_CONFIG = {
    apiKey: "AIza...",  // Từ Firebase Console
    authDomain: "your-app.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-app.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456:web:abc123"
};
```

---

## 📁 Cấu trúc file .env

File `backend/.env` đã có sẵn trong project với placeholders. Bạn chỉ cần:

1. Mở file: `backend/.env`
2. Tìm các dòng có `your_xxx_here`
3. Thay thế bằng API keys thật của bạn

**Ví dụ - TRƯỚC khi sửa:**
```env
OPENWEATHERMAP_API_KEY=your_openweathermap_key_here
HF_API_TOKEN=your_huggingface_token_here
```

**SAU khi sửa:**
```env
OPENWEATHERMAP_API_KEY=abc123def456
HF_API_TOKEN=hf_abcdefghijklmnop
```

---

## ✅ Kiểm tra cấu hình

Sau khi setup xong, kiểm tra:

1. **Backend health check:**
   ```bash
   curl http://localhost:8000/health
   ```
   Response:
   ```json
   {
     "status": "healthy",
     "services": {
       "openweathermap": true,
       "huggingface": true
     }
   }
   ```

2. **API Documentation:**
   Mở http://localhost:8000/docs để xem Swagger UI

---

## 🛠️ Troubleshooting

### Lỗi: API key not configured
- Kiểm tra file `backend/.env` đã tồn tại
- Đảm bảo không có dấu ngoặc kép hoặc khoảng trắng thừa trong API keys

### Lỗi: 401 Unauthorized (Hugging Face)
- Token đã hết hạn → Tạo token mới
- Token không có quyền → Tạo token với type **Read**

### Lỗi: Firebase/Google Login không hoạt động
- Kiểm tra FIREBASE_CONFIG trong `src/config/apiConfig.ts` đúng chưa
- Đảm bảo Google Sign-In đã được Enable trong Firebase Console
- Kiểm tra domain của app đã được thêm vào Authorized domains

---

## 📚 Công nghệ sử dụng

- **Frontend:** Vite, TypeScript, Leaflet Maps
- **Backend:** FastAPI, Python
- **APIs:** OpenWeatherMap, Google Translate, Hugging Face, OSM Nominatim, Overpass
- **Auth:** Firebase Authentication