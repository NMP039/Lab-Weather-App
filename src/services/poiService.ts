import { POI, Coordinates } from '../types/poi';
import { BACKEND_API_URL } from '../config/apiConfig';

/**
 * Fetch POIs through backend API
 */
export const fetchPOIs = async (coords: Coordinates, radius: number = 2000): Promise<POI[]> => {
    try {
        const response = await fetch(`${BACKEND_API_URL}/api/poi`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                lat: coords.lat,
                lon: coords.lon,
                radius: radius
            })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch POIs');
        }

        const data = await response.json();
        
        return data.pois.map((poi: any) => ({
            id: poi.id,
            name: poi.name,
            type: poi.type,
            latitude: poi.latitude,
            longitude: poi.longitude,
            address: poi.address,
            tags: poi.tags
        }));
    } catch (error) {
        console.error('Error fetching POIs:', error);
        return [];
    }
};