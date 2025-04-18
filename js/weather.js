/**
 * Weather functionality for the Styler application
 * Handles weather displays and updates
 */

class WeatherManager {
    constructor(dataManager) {
        this.dataManager = dataManager;
        this.weatherInfo = null;
    }

    // Initialize the weather display
    initWeather() {
        this.weatherInfo = this.dataManager.getWeather();
        this.updateWeatherDisplay();
        this.setupWeatherRefresh();
    }

    // Update the weather information displayed on the UI
    updateWeatherDisplay() {
        if (!this.weatherInfo) return;

        // Update current date and temperature
        document.getElementById('current-date').textContent = `${this.weatherInfo.current.day}، ${this.weatherInfo.current.date}`;
        document.getElementById('current-temp').textContent = this.weatherInfo.current.temperature;
        document.getElementById('current-weather-desc').textContent = this.weatherInfo.current.condition;

        // Update weather suggestion cards
        const suggestionCards = document.querySelectorAll('.suggestion-card');
        
        this.weatherInfo.forecast.forEach((day, index) => {
            if (index < suggestionCards.length) {
                const card = suggestionCards[index];
                
                // Update weather icon
                const iconElement = card.querySelector('.weather-icon i');
                iconElement.className = `fas fa-${day.icon}`;
                
                // Update temperature
                card.querySelector('.suggestion-temp').textContent = `${day.temperature}°`;
                
                // Update weather description
                card.querySelector('.suggestion-desc').textContent = day.condition;
                
                // Get clothing suggestion
                const suggestion = this.dataManager.getClothingSuggestion(day.temperature);
                card.querySelector('.clothing-suggestion').textContent = `اقتراح: ${suggestion}`;
            }
        });
    }

    // Setup weather refresh functionality
    setupWeatherRefresh() {
        const refreshBtn = document.getElementById('refresh-weather');
        
        refreshBtn.addEventListener('click', () => {
            // Add rotating animation
            refreshBtn.querySelector('i').classList.add('fa-spin');
            
            // Simulate API call delay
            setTimeout(() => {
                // Refresh weather data
                this.weatherInfo = this.dataManager.refreshWeather();
                
                // Update the display
                this.updateWeatherDisplay();
                
                // Stop rotation animation
                refreshBtn.querySelector('i').classList.remove('fa-spin');
                
                // Show temporary success message
                const messageElement = document.createElement('span');
                messageElement.className = 'refresh-message';
                messageElement.textContent = 'تم التحديث';
                refreshBtn.appendChild(messageElement);
                
                // Remove message after 2 seconds
                setTimeout(() => {
                    messageElement.remove();
                }, 2000);
            }, 800);
        });
    }

    // Get temperature for a specific day (0 = today, 1 = tomorrow, etc.)
    getTemperature(dayOffset = 0) {
        if (!this.weatherInfo || !this.weatherInfo.forecast[dayOffset]) {
            return null;
        }
        
        return this.weatherInfo.forecast[dayOffset].temperature;
    }

    // Get weather condition for a specific day
    getCondition(dayOffset = 0) {
        if (!this.weatherInfo || !this.weatherInfo.forecast[dayOffset]) {
            return null;
        }
        
        return this.weatherInfo.forecast[dayOffset].condition;
    }
}
