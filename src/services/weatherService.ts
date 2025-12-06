import { CurrentWeather, WeatherForecast, ForecastItem } from '../types/weather';
import { OPENWEATHERMAP_API_KEY } from '../config/apiConfig';

const API_KEY = OPENWEATHERMAP_API_KEY;
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';



/**
 * Get current weather for a location
 */
export async function getCurrentWeather(lat: number, lon: number, cityName: string): Promise<CurrentWeather | null> {
    try {
        const response = await fetch(
            `${WEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=vi`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch current weather');
        }

        const data = await response.json();

        return {
            temperature: Math.round(data.main.temp),
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            cityName: cityName
        };
    } catch (error) {
        console.error('Error fetching current weather:', error);
        return null;
    }
}

/**
 * Get weather forecast (next 5 periods, 3 hours apart)
 */
export async function getWeatherForecast(lat: number, lon: number): Promise<WeatherForecast | null> {
    try {
        const response = await fetch(
            `${WEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&cnt=5&appid=${API_KEY}&units=metric&lang=vi`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch weather forecast');
        }

        const data = await response.json();

        const forecasts: ForecastItem[] = data.list.map((item: any) => ({
            date: new Date(item.dt * 1000),
            temperature: Math.round(item.main.temp),
            humidity: item.main.humidity,
            windSpeed: item.wind.speed,
            description: item.weather[0].description,
            icon: item.weather[0].icon
        }));

        return { forecasts };
    } catch (error) {
        console.error('Error fetching weather forecast:', error);
        return null;
    }
}
