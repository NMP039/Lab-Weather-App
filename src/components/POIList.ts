import { POI } from '../types/poi';
import { POICard } from './POICard';

export class POIList {
    private container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    public render(pois: POI[]): void {
        this.container.innerHTML = '';

        if (pois.length === 0) {
            this.container.innerHTML = '<p class="no-results">Không tìm thấy điểm tham quan nào.</p>';
            return;
        }

        const title = document.createElement('h2');
        title.textContent = `Tìm thấy ${pois.length} điểm tham quan:`;
        title.className = 'poi-list-title';
        this.container.appendChild(title);

        const list = document.createElement('div');
        list.className = 'poi-cards-container';

        pois.forEach((poi, index) => {
            const cardElement = document.createElement('div');
            const card = new POICard(cardElement, poi, index + 1);
            list.appendChild(cardElement);
        });

        this.container.appendChild(list);
    }
}