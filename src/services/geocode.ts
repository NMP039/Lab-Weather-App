import axios from 'axios';
import { Coordinates } from '../types/poi';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

export const geocodeLocation = async (location: string): Promise<Coordinates | null> => {
    try {
        const response = await axios.get(NOMINATIM_URL, {
            params: {
                q: `${location}, Vietnam`,
                format: 'json',
                limit: 1,
                addressdetails: 1
            },
            headers: {
                'User-Agent': 'POI-VN-App/1.0'
            }
        });

        if (response.data && response.data.length > 0) {
            const result = response.data[0];
            return {
                lat: parseFloat(result.lat),
                lon: parseFloat(result.lon)
            };
        }
    } catch (error) {
        console.error('Error geocoding location:', error);
    }

    return null;
};