import { Coordinates } from '../types/poi';
import { BACKEND_API_URL } from '../config/apiConfig';

/**
 * Geocode location through backend API
 */
export const geocodeLocation = async (location: string): Promise<Coordinates | null> => {
    try {
        const response = await fetch(`${BACKEND_API_URL}/api/geocode`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                location: location
            })
        });

        if (!response.ok) {
            throw new Error('Geocoding failed');
        }

        const data = await response.json();
        return {
            lat: data.lat,
            lon: data.lon
        };
    } catch (error) {
        console.error('Error geocoding location:', error);
        return null;
    }
};