import { SearchBar } from './components/SearchBar';
import { MapView } from './components/MapView';
import { POIList } from './components/POIList';
import { WeatherPanel } from './components/WeatherPanel';
import { TranslatePanel } from './components/TranslatePanel';
import { AuthPanel } from './components/AuthPanel';
import { ChatPanel } from './components/ChatPanel';
import { geocodeLocation } from './services/geocode';
import { fetchPOIs } from './services/poiService';
import { getCurrentWeather, getWeatherForecast } from './services/weatherService';
import { POI } from './types/poi';

export class App {
    private searchBar: SearchBar;
    private mapView: MapView;
    private poiList: POIList;
    private weatherPanel: WeatherPanel;
    private translatePanel: TranslatePanel;
    private authPanel: AuthPanel;
    private chatPanel: ChatPanel;
    private loadingElement: HTMLElement;

    constructor() {
        this.loadingElement = this.createLoadingElement();
        
        const searchContainer = document.getElementById('searchBar')!;
        const mapContainer = document.getElementById('map')!;
        const poiListContainer = document.getElementById('poiList')!;
        const weatherContainer = document.getElementById('weatherPanel')!;
        const translateContainer = document.getElementById('translatePanel')!;
        const authContainer = document.getElementById('authPanel')!;

        this.searchBar = new SearchBar(searchContainer, (location) => this.handleSearch(location));
        this.mapView = new MapView(mapContainer);
        this.poiList = new POIList(poiListContainer);
        this.weatherPanel = new WeatherPanel(weatherContainer);
        this.translatePanel = new TranslatePanel(translateContainer);
        this.authPanel = new AuthPanel(authContainer);
        
        // Initialize and append ChatPanel
        this.chatPanel = new ChatPanel();
        document.body.appendChild(this.chatPanel.getElement());
    }

    private createLoadingElement(): HTMLElement {
        const loading = document.createElement('div');
        loading.className = 'loading';
        loading.innerHTML = '<div class="spinner"></div><p>Đang tìm kiếm...</p>';
        loading.style.display = 'none';
        document.body.appendChild(loading);
        return loading;
    }

    private showLoading(): void {
        this.loadingElement.style.display = 'flex';
    }

    private hideLoading(): void {
        this.loadingElement.style.display = 'none';
    }

    private async handleSearch(locationName: string): Promise<void> {
        try {
            this.showLoading();
            
            // Step 1: Geocode the location
            const coords = await geocodeLocation(locationName);
            
            if (!coords) {
                alert(`Không tìm thấy địa điểm "${locationName}". Vui lòng thử lại với tên khác.`);
                this.hideLoading();
                return;
            }

            // Step 2: Fetch POIs near the location
            const pois = await fetchPOIs(coords);

            if (pois.length === 0) {
                alert(`Không tìm thấy điểm tham quan nào gần "${locationName}". Vui lòng thử địa điểm khác.`);
                this.hideLoading();
                return;
            }

            // Step 3: Fetch weather data
            const [currentWeather, forecast] = await Promise.all([
                getCurrentWeather(coords.lat, coords.lon, locationName),
                getWeatherForecast(coords.lat, coords.lon)
            ]);

            // Step 4: Update the map, list, and weather panel
            this.mapView.updateMap(coords, pois);
            this.poiList.render(pois);
            this.weatherPanel.updateWeather(currentWeather, forecast);

            this.hideLoading();
        } catch (error) {
            console.error('Error during search:', error);
            alert('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.');
            this.hideLoading();
        }
    }
}