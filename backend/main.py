"""
FastAPI Backend for POI Vietnam App
Proxy các API bên thứ 3 và tích hợp Hugging Face chatbot
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import httpx
import os
from dotenv import load_dotenv
import logging
from datetime import datetime

# Load environment variables
load_dotenv()

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="POI Vietnam API",
    description="Backend API proxy và Hugging Face chatbot",
    version="1.0.0"
)

# CORS configuration - cho phép frontend gọi
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Trong production, thay bằng domain cụ thể
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Environment variables
OPENWEATHERMAP_API_KEY = os.getenv("OPENWEATHERMAP_API_KEY", "")
HF_API_TOKEN = os.getenv("HF_API_TOKEN", "")
HF_MODEL = os.getenv("HF_MODEL", "meta-llama/Llama-3.2-3B-Instruct")

# Session storage (in-memory, dùng Redis cho production)
chat_sessions: Dict[str, List[Dict]] = {}


# ==========================================
# MODELS (Request/Response schemas)
# ==========================================

class TranslateRequest(BaseModel):
    text: str
    source_lang: str
    target_lang: str


class TranslateResponse(BaseModel):
    original_text: str
    translated_text: str
    source_language: str
    target_language: str


class WeatherRequest(BaseModel):
    lat: float
    lon: float
    city_name: str


class WeatherResponse(BaseModel):
    temperature: int
    humidity: int
    wind_speed: float
    description: str
    icon: str
    city_name: str


class ForecastRequest(BaseModel):
    lat: float
    lon: float


class GeocodeRequest(BaseModel):
    location: str


class GeocodeResponse(BaseModel):
    lat: float
    lon: float


class POIRequest(BaseModel):
    lat: float
    lon: float
    radius: int = 2000


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = "default"


class ChatResponse(BaseModel):
    reply: str
    session_id: str
    timestamp: str


# ==========================================
# HEALTH CHECK
# ==========================================

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "openweathermap": bool(OPENWEATHERMAP_API_KEY),
            "huggingface": bool(HF_API_TOKEN)
        }
    }


# ==========================================
# TRANSLATION API (Google Translate proxy)
# ==========================================

@app.post("/api/translate", response_model=TranslateResponse)
async def translate_text(request: TranslateRequest):
    """Proxy Google Translate (sử dụng free endpoint)"""
    try:
        url = f"https://translate.googleapis.com/translate_a/single"
        params = {
            "client": "gtx",
            "sl": request.source_lang,
            "tl": request.target_lang,
            "dt": "t",
            "q": request.text
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, timeout=10.0)
            response.raise_for_status()
            data = response.json()
        
        # Parse response
        translated_text = ""
        if data[0]:
            for item in data[0]:
                if item[0]:
                    translated_text += item[0]
        
        detected_lang = data[2] if len(data) > 2 else request.source_lang
        
        return TranslateResponse(
            original_text=request.text,
            translated_text=translated_text,
            source_language=detected_lang,
            target_language=request.target_lang
        )
    
    except Exception as e:
        logger.error(f"Translation error: {e}")
        raise HTTPException(status_code=500, detail=f"Translation failed: {str(e)}")


# ==========================================
# WEATHER API (OpenWeatherMap proxy)
# ==========================================

@app.post("/api/weather/current", response_model=WeatherResponse)
async def get_current_weather(request: WeatherRequest):
    """Proxy OpenWeatherMap current weather API"""
    if not OPENWEATHERMAP_API_KEY:
        raise HTTPException(status_code=500, detail="OpenWeatherMap API key not configured")
    
    try:
        url = "https://api.openweathermap.org/data/2.5/weather"
        params = {
            "lat": request.lat,
            "lon": request.lon,
            "appid": OPENWEATHERMAP_API_KEY,
            "units": "metric",
            "lang": "vi"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, timeout=10.0)
            response.raise_for_status()
            data = response.json()
        
        return WeatherResponse(
            temperature=round(data["main"]["temp"]),
            humidity=data["main"]["humidity"],
            wind_speed=data["wind"]["speed"],
            description=data["weather"][0]["description"],
            icon=data["weather"][0]["icon"],
            city_name=request.city_name
        )
    
    except Exception as e:
        logger.error(f"Weather error: {e}")
        raise HTTPException(status_code=500, detail=f"Weather fetch failed: {str(e)}")


@app.post("/api/weather/forecast")
async def get_weather_forecast(request: ForecastRequest):
    """Proxy OpenWeatherMap forecast API"""
    if not OPENWEATHERMAP_API_KEY:
        raise HTTPException(status_code=500, detail="OpenWeatherMap API key not configured")
    
    try:
        url = "https://api.openweathermap.org/data/2.5/forecast"
        params = {
            "lat": request.lat,
            "lon": request.lon,
            "cnt": 5,
            "appid": OPENWEATHERMAP_API_KEY,
            "units": "metric",
            "lang": "vi"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, timeout=10.0)
            response.raise_for_status()
            data = response.json()
        
        # Parse forecast items
        forecast_items = []
        for item in data["list"]:
            forecast_items.append({
                "time": item["dt_txt"],
                "temperature": round(item["main"]["temp"]),
                "description": item["weather"][0]["description"],
                "icon": item["weather"][0]["icon"]
            })
        
        return {"forecast": forecast_items}
    
    except Exception as e:
        logger.error(f"Forecast error: {e}")
        raise HTTPException(status_code=500, detail=f"Forecast fetch failed: {str(e)}")


# ==========================================
# GEOCODING API (Nominatim proxy)
# ==========================================

@app.post("/api/geocode", response_model=GeocodeResponse)
async def geocode_location(request: GeocodeRequest):
    """Proxy Nominatim geocoding API"""
    try:
        url = "https://nominatim.openstreetmap.org/search"
        params = {
            "q": f"{request.location}, Vietnam",
            "format": "json",
            "limit": 1,
            "addressdetails": 1
        }
        headers = {
            "User-Agent": "POI-VN-App/1.0"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, headers=headers, timeout=10.0)
            response.raise_for_status()
            data = response.json()
        
        if not data or len(data) == 0:
            raise HTTPException(status_code=404, detail="Location not found")
        
        result = data[0]
        return GeocodeResponse(
            lat=float(result["lat"]),
            lon=float(result["lon"])
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Geocoding error: {e}")
        raise HTTPException(status_code=500, detail=f"Geocoding failed: {str(e)}")


# ==========================================
# POI API (Overpass API proxy)
# ==========================================

@app.post("/api/poi")
async def fetch_pois(request: POIRequest):
    """Proxy Overpass API for POI search"""
    try:
        query = f"""
        [out:json][timeout:25];
        (
            node["tourism"~"attraction|museum|viewpoint|artwork|gallery"](around:{request.radius},{request.lat},{request.lon});
            node["historic"](around:{request.radius},{request.lat},{request.lon});
            node["amenity"~"place_of_worship|theatre"](around:{request.radius},{request.lat},{request.lon});
        );
        out body 5;
        """
        
        url = "https://overpass-api.de/api/interpreter"
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, data=query, headers={"Content-Type": "text/plain"}, timeout=30.0)
            response.raise_for_status()
            data = response.json()
        
        # Parse POIs
        pois = []
        if data.get("elements"):
            for element in data["elements"][:5]:
                tags = element.get("tags", {})
                pois.append({
                    "id": str(element["id"]),
                    "name": tags.get("name") or tags.get("name:vi") or "Không có tên",
                    "type": tags.get("tourism") or tags.get("historic") or tags.get("amenity") or "place",
                    "latitude": element["lat"],
                    "longitude": element["lon"],
                    "address": format_address(tags),
                    "tags": tags
                })
        
        return {"pois": pois}
    
    except Exception as e:
        logger.error(f"POI fetch error: {e}")
        raise HTTPException(status_code=500, detail=f"POI fetch failed: {str(e)}")


def format_address(tags: dict) -> str:
    """Format address from tags"""
    parts = []
    if tags.get("addr:street"):
        parts.append(tags["addr:street"])
    if tags.get("addr:city"):
        parts.append(tags["addr:city"])
    if tags.get("addr:district"):
        parts.append(tags["addr:district"])
    return ", ".join(parts) if parts else "Địa chỉ không có sẵn"


# ==========================================
# HUGGING FACE CHATBOT
# ==========================================

@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_bot(request: ChatRequest):
    """
    Chat với AI qua Hugging Face Inference Providers
    Sử dụng OpenAI-compatible API format mới
    """
    if not HF_API_TOKEN or HF_API_TOKEN in ["YOUR_NEW_HUGGINGFACE_TOKEN_HERE", "YOUR_HUGGINGFACE_TOKEN_HERE"]:
        logger.warning("HF_API_TOKEN not configured")
        reply = f"Chat bot chưa được cấu hình. Câu hỏi: '{request.message}'"
        return ChatResponse(
            reply=reply,
            session_id=request.session_id,
            timestamp=datetime.now().isoformat()
        )
    
    try:
        # Lấy hoặc tạo session
        session_id = request.session_id
        if session_id not in chat_sessions:
            chat_sessions[session_id] = []
        
        # Thêm message vào history
        chat_sessions[session_id].append({"role": "user", "content": request.message})
        
        # Chuẩn bị messages theo format OpenAI (lấy 10 messages gần nhất)
        messages = []
        for msg in chat_sessions[session_id][-10:]:
            role = "user" if msg["role"] == "user" else "assistant"
            messages.append({"role": role, "content": msg["content"]})
        
        # Gọi Hugging Face với OpenAI-compatible API
        url = "https://router.huggingface.co/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {HF_API_TOKEN}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": HF_MODEL,
            "messages": messages,
            "max_tokens": 150,
            "temperature": 0.7,
            "stream": False
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, headers=headers, timeout=30.0)
            response.raise_for_status()
            data = response.json()
        
        # Parse response OpenAI format
        if "choices" in data and len(data["choices"]) > 0:
            reply = data["choices"][0]["message"]["content"].strip()
        else:
            reply = "Xin lỗi, tôi không thể trả lời lúc này."
        
        # Lưu reply vào history
        chat_sessions[session_id].append({"role": "assistant", "content": reply})
        
        # Giới hạn history (tối đa 20 messages)
        if len(chat_sessions[session_id]) > 20:
            chat_sessions[session_id] = chat_sessions[session_id][-20:]
        
        return ChatResponse(
            reply=reply,
            session_id=session_id,
            timestamp=datetime.now().isoformat()
        )
    
    except httpx.HTTPStatusError as e:
        status_code = e.response.status_code
        error_text = e.response.text
        logger.error(f"HF API error {status_code}: {error_text}")
        
        reply = "Xin lỗi, tôi gặp sự cố khi kết nối với AI. Vui lòng thử lại sau."
        if status_code == 401:
            reply = "API token không hợp lệ. Vui lòng kiểm tra cấu hình."
        elif status_code == 429:
            reply = "Quá nhiều yêu cầu. Vui lòng thử lại sau."
        
        return ChatResponse(
            reply=reply,
            session_id=request.session_id,
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        logger.exception("Chat error")
        return ChatResponse(
            reply="Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.",
            session_id=request.session_id,
            timestamp=datetime.now().isoformat()
        )


# ==========================================
# MAIN
# ==========================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
