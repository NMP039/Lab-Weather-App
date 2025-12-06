import { CurrentWeather, WeatherForecast } from '../types/weather';

export class WeatherPanel {
    private container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
        this.render();
    }

    private render(): void {
        this.container.innerHTML = `
            <h2 class="weather-title">🌤️ Thời Tiết</h2>
            <div class="weather-content">
                <p class="weather-placeholder">Nhập địa điểm để xem thông tin thời tiết</p>
            </div>
        `;
    }

    public async updateWeather(currentWeather: CurrentWeather | null, forecast: WeatherForecast | null): Promise<void> {
        const weatherContent = this.container.querySelector('.weather-content');
        
        if (!weatherContent) return;

        if (!currentWeather) {
            weatherContent.innerHTML = '<p class="weather-error">Không thể tải thông tin thời tiết</p>';
            return;
        }

        const forecastHTML = forecast ? this.renderForecast(forecast) : '';

        weatherContent.innerHTML = `
            <div class="current-weather">
                <div class="weather-header">
                    <img 
                        src="https://openweathermap.org/img/wn/${currentWeather.icon}@2x.png" 
                        alt="${currentWeather.description}"
                        class="weather-icon"
                    />
                    <div class="weather-temp">
                        <span class="temp-value">${currentWeather.temperature}</span>
                        <span class="temp-unit">°C</span>
                    </div>
                </div>
                <p class="weather-description">${currentWeather.description}</p>
                <div class="weather-details">
                    <div class="detail-item">
                        <span class="detail-icon">💧</span>
                        <span class="detail-label">Độ ẩm:</span>
                        <span class="detail-value">${currentWeather.humidity}%</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-icon">💨</span>
                        <span class="detail-label">Gió:</span>
                        <span class="detail-value">${currentWeather.windSpeed} m/s</span>
                    </div>
                </div>
            </div>
            ${forecastHTML}
        `;
    }

    private renderForecast(forecast: WeatherForecast): string {
        if (!forecast.forecasts || forecast.forecasts.length === 0) {
            return '';
        }

        const forecastItems = forecast.forecasts.map(item => {
            const time = item.date.toLocaleTimeString('vi-VN', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            const date = item.date.toLocaleDateString('vi-VN', { 
                day: '2-digit', 
                month: '2-digit' 
            });

            return `
                <div class="forecast-item">
                    <div class="forecast-time">
                        <div class="forecast-date">${date}</div>
                        <div class="forecast-hour">${time}</div>
                    </div>
                    <img 
                        src="https://openweathermap.org/img/wn/${item.icon}.png" 
                        alt="${item.description}"
                        class="forecast-icon"
                    />
                    <div class="forecast-temp">${item.temperature}°C</div>
                    <div class="forecast-desc">${item.description}</div>
                </div>
            `;
        }).join('');

        return `
            <div class="weather-forecast">
                <h3 class="forecast-title">📅 Dự Báo</h3>
                <div class="forecast-list">
                    ${forecastItems}
                </div>
            </div>
        `;
    }

    public clear(): void {
        this.render();
    }
}
