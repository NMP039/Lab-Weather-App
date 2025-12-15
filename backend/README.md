# Backend FastAPI - POI Vietnam App

Backend API proxy các dịch vụ bên thứ 3 và tích hợp Hugging Face chatbot.

## Cài đặt

1. Cài đặt dependencies:
```bash
pip install -r requirements.txt
```

2. Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

3. Cập nhật API keys trong file `.env`:
   - `OPENWEATHERMAP_API_KEY`: Lấy từ https://openweathermap.org/api
   - `HF_API_TOKEN`: Lấy từ https://huggingface.co/settings/tokens

## Chạy server

```bash
# Development mode (auto-reload)
uvicorn main:app --reload --port 8000

# Production mode
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Expose với ngrok (cho development)

```bash
# Cài ngrok: https://ngrok.com/download
ngrok http 8000
```

Hoặc dùng Pinggy:
```bash
ssh -p 443 -R0:localhost:8000 a.pinggy.io
```

## API Endpoints

### Health Check
- `GET /health` - Kiểm tra trạng thái server

### Translation
- `POST /api/translate` - Dịch văn bản
  ```json
  {
    "text": "Hello",
    "source_lang": "en",
    "target_lang": "vi"
  }
  ```

### Weather
- `POST /api/weather/current` - Lấy thời tiết hiện tại
- `POST /api/weather/forecast` - Lấy dự báo thời tiết

### Geocoding
- `POST /api/geocode` - Chuyển địa chỉ thành tọa độ

### POI
- `POST /api/poi` - Tìm điểm tham quan gần đó

### Chat (Hugging Face)
- `POST /api/chat` - Chat với AI bot
  ```json
  {
    "message": "Xin chào",
    "session_id": "user123"
  }
  ```

## Tài liệu API

Khi server đang chạy, truy cập:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
