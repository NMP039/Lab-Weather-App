import * as L from 'leaflet';
import { POI, Coordinates } from '../types/poi';

export class MapView {
    private map: L.Map | null = null;
    private markers: L.Marker[] = [];
    private container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
        this.initMap();
    }

    private initMap(): void {
        // Initialize map centered on Vietnam
        this.map = L.map(this.container).setView([16.0544, 108.0717], 6);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(this.map);
    }

    public updateMap(center: Coordinates, pois: POI[]): void {
        if (!this.map) return;

        // Clear existing markers
        this.markers.forEach(marker => marker.remove());
        this.markers = [];

        // Set view to center
        this.map.setView([center.lat, center.lon], 14);

        // Create custom icon
        const customIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        // Add markers for POIs
        pois.forEach((poi, index) => {
            const marker = L.marker([poi.latitude, poi.longitude], { icon: customIcon })
                .addTo(this.map!)
                .bindPopup(`
                    <div class="popup-content">
                        <h3>${index + 1}. ${poi.name}</h3>
                        <p><strong>Loại:</strong> ${this.translateType(poi.type)}</p>
                        <p><strong>Địa chỉ:</strong> ${poi.address || 'Không có thông tin'}</p>
                    </div>
                `);
            this.markers.push(marker);
        });

        // Fit bounds to show all markers
        if (pois.length > 0) {
            const bounds = L.latLngBounds(pois.map(poi => [poi.latitude, poi.longitude]));
            this.map.fitBounds(bounds, { padding: [50, 50] });
        }
    }

    private translateType(type: string): string {
        const translations: Record<string, string> = {
            'attraction': 'Điểm tham quan',
            'museum': 'Bảo tàng',
            'viewpoint': 'Điểm ngắm cảnh',
            'artwork': 'Tác phẩm nghệ thuật',
            'gallery': 'Phòng trưng bày',
            'monument': 'Di tích',
            'castle': 'Lâu đài',
            'place_of_worship': 'Nơi thờ cúng',
            'theatre': 'Nhà hát',
            'historic': 'Di tích lịch sử'
        };
        return translations[type] || type;
    }
}