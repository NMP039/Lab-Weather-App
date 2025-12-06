import axios from 'axios';
import { POI, Coordinates } from '../types/poi';

const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

export const fetchPOIs = async (coords: Coordinates, radius: number = 2000): Promise<POI[]> => {
    const query = `
        [out:json][timeout:25];
        (
            node["tourism"~"attraction|museum|viewpoint|artwork|gallery"](around:${radius},${coords.lat},${coords.lon});
            node["historic"](around:${radius},${coords.lat},${coords.lon});
            node["amenity"~"place_of_worship|theatre"](around:${radius},${coords.lat},${coords.lon});
        );
        out body 5;
    `;

    try {
        const response = await axios.post(OVERPASS_API, query, {
            headers: {
                'Content-Type': 'text/plain'
            }
        });

        if (response.data && response.data.elements) {
            return response.data.elements.slice(0, 5).map((element: any) => ({
                id: element.id.toString(),
                name: element.tags?.name || element.tags?.['name:vi'] || 'Không có tên',
                type: element.tags?.tourism || element.tags?.historic || element.tags?.amenity || 'place',
                latitude: element.lat,
                longitude: element.lon,
                address: formatAddress(element.tags),
                tags: element.tags
            }));
        }
    } catch (error) {
        console.error('Error fetching POIs:', error);
    }

    return [];
};

function formatAddress(tags: any): string {
    const parts = [];
    if (tags?.['addr:street']) parts.push(tags['addr:street']);
    if (tags?.['addr:city']) parts.push(tags['addr:city']);
    if (tags?.['addr:district']) parts.push(tags['addr:district']);
    return parts.join(', ') || 'Địa chỉ không có sẵn';
}