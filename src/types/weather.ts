export interface CurrentWeather {
    temperature: number;
    humidity: number;
    windSpeed: number;
    description: string;
    icon: string;
    cityName: string;
}

export interface ForecastItem {
    date: Date;
    temperature: number;
    humidity: number;
    windSpeed: number;
    description: string;
    icon: string;
}

export interface WeatherForecast {
    forecasts: ForecastItem[];
}
