export interface POI {
    id: string;
    name: string;
    type: string;
    latitude: number;
    longitude: number;
    address?: string;
    tags?: Record<string, string>;
}

export interface Coordinates {
    lat: number;
    lon: number;
}