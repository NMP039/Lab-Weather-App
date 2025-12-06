import { debounce } from '../utils/debounce';

export class SearchBar {
    private container: HTMLElement;
    private input: HTMLInputElement;
    private button: HTMLButtonElement;
    private onSearch: (location: string) => void;

    constructor(container: HTMLElement, onSearch: (location: string) => void) {
        this.container = container;
        this.onSearch = onSearch;
        this.input = document.createElement('input');
        this.button = document.createElement('button');
        this.render();
        this.attachEventListeners();
    }

    private render(): void {
        this.container.className = 'search-bar';
        
        this.input.type = 'text';
        this.input.placeholder = 'Nhập tên địa điểm ở Việt Nam (VD: Hà Nội, Đà Lạt, Hội An...)';
        this.input.className = 'search-input';

        this.button.textContent = '🔍 Tìm kiếm';
        this.button.className = 'search-button';

        this.container.appendChild(this.input);
        this.container.appendChild(this.button);
    }

    private attachEventListeners(): void {
        this.button.addEventListener('click', () => this.handleSearch());
        this.input.addEventListener('keypress', (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });
    }

    private handleSearch(): void {
        const value = this.input.value.trim();
        if (value) {
            this.onSearch(value);
        }
    }
}