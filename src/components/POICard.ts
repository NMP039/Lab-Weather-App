import { POI } from '../types/poi';

export class POICard {
    private container: HTMLElement;
    private poi: POI;
    private index: number;

    constructor(container: HTMLElement, poi: POI, index: number) {
        this.container = container;
        this.poi = poi;
        this.index = index;
        this.render();
    }

    private render(): void {
        this.container.className = 'poi-card';
        
        const header = document.createElement('div');
        header.className = 'poi-card-header';
        
        const title = document.createElement('h3');
        title.textContent = `${this.index}. ${this.poi.name}`;
        header.appendChild(title);

        const type = document.createElement('span');
        type.className = 'poi-type';
        type.textContent = this.translateType(this.poi.type);
        header.appendChild(type);

        const body = document.createElement('div');
        body.className = 'poi-card-body';

        const coords = document.createElement('p');
        coords.innerHTML = `<strong>📍 Tọa độ:</strong> ${this.poi.latitude.toFixed(6)}, ${this.poi.longitude.toFixed(6)}`;
        body.appendChild(coords);

        if (this.poi.address) {
            const address = document.createElement('p');
            address.innerHTML = `<strong>🏠 Địa chỉ:</strong> ${this.poi.address}`;
            body.appendChild(address);
        }

        // Add additional tags if available
        if (this.poi.tags) {
            const tagsDiv = document.createElement('div');
            tagsDiv.className = 'poi-tags';
            
            if (this.poi.tags.wikipedia) {
                const wikiLink = document.createElement('a');
                wikiLink.href = `https://vi.wikipedia.org/wiki/${this.poi.tags.wikipedia.split(':')[1]}`;
                wikiLink.target = '_blank';
                wikiLink.textContent = '📖 Wikipedia';
                wikiLink.className = 'poi-link';
                tagsDiv.appendChild(wikiLink);
            }
        }

        this.container.appendChild(header);
        this.container.appendChild(body);
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