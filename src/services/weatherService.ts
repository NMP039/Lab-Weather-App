import { CurrentWeather, WeatherForecast, ForecastItem } from '../types/weather';
import { BACKEND_API_URL } from '../config/apiConfig';

/**
 * Get current weather for a location through backend API
 */
export async function getCurrentWeather(lat: number, lon: number, cityName: string): Promise<CurrentWeather | null> {
    try {
        const response = await fetch(`${BACKEND_API_URL}/api/weather/current`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                lat: lat,
                lon: lon,
                city_name: cityName
            })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch current weather');
        }

        const data = await response.json();

        return {
            temperature: data.temperature,
            humidity: data.humidity,
            windSpeed: data.wind_speed,
            description: data.description,
            icon: data.icon,
            cityName: data.city_name
        };
    } catch (error) {
        console.error('Error fetching current weather:', error);
        return null;
    }
}

/**
 * Get weather forecast (next 5 periods, 3 hours apart) through backend API
 */
export async function getWeatherForecast(lat: number, lon: number): Promise<WeatherForecast | null> {
    try {
        const response = await fetch(`${BACKEND_API_URL}/api/weather/forecast`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                lat: lat,
                lon: lon
            })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch weather forecast');
        }

        const data = await response.json();

        const forecasts: ForecastItem[] = data.forecast.map((item: any) => ({
            date: new Date(item.time),
            temperature: item.temperature,
            humidity: 0, // Backend response doesn't include humidity in simplified version
            windSpeed: 0, // Backend response doesn't include windSpeed in simplified version
            description: item.description,
            icon: item.icon
        }));

        return { forecasts };
    } catch (error) {
        console.error('Error fetching weather forecast:', error);
        return null;
    }
}
