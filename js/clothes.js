/**
 * Clothing functionality for the Styler application
 * Handles clothing displays, outfit suggestions, and favorites
 */

class ClothesManager {
    constructor(dataManager, weatherManager) {
        this.dataManager = dataManager;
        this.weatherManager = weatherManager;
    }

    // Initialize clothing displays
    initClothes() {
        this.loadTodaysLook();
        this.loadFeaturedClothes();
        this.setupRetryButton();
    }

    // Load today's outfit suggestion
    loadTodaysLook() {
        const lookContainer = document.getElementById('todays-look');
        
        try {
            const outfit = this.dataManager.getTodaysOutfit();
            
            if (!outfit || !outfit.items || outfit.items.length === 0) {
                this.showLookError(lookContainer);
                return;
            }
            
            // Clear previous content
            lookContainer.innerHTML = '';
            
            // Create outfit display
            const outfitElement = document.createElement('div');
            outfitElement.className = 'outfit-display';
            
            // Add outfit image if available
            if (outfit.image) {
                const outfitImage = document.createElement('div');
                outfitImage.className = 'outfit-image';
                outfitImage.innerHTML = `<img src="images/outfits/${outfit.image}.svg" alt="${outfit.name}" 
                    onerror="this.onerror=null; this.style.display='none';">`;
                outfitElement.appendChild(outfitImage);
            }
            
            // Add outfit name
            const outfitName = document.createElement('h3');
            outfitName.className = 'outfit-name';
            outfitName.textContent = outfit.name;
            outfitElement.appendChild(outfitName);
            
            // Create items container
            const itemsContainer = document.createElement('div');
            itemsContainer.className = 'outfit-items';
            
            // Add each clothing item
            outfit.items.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'outfit-item';
                
                // Item icon
                const itemIcon = document.createElement('div');
                itemIcon.className = 'outfit-item-icon';
                const icon = document.createElement('i');
                
                // Choose icon based on item type
                switch(item.category) {
                    case 'علوي':
                        icon.className = 'fas fa-tshirt';
                        break;
                    case 'سفلي':
                        icon.className = 'fas fa-socks';
                        break;
                    case 'كامل':
                        icon.className = 'fas fa-user-tie';
                        break;
                    case 'أحذية':
                        icon.className = 'fas fa-shoe-prints';
                        break;
                    default:
                        icon.className = 'fas fa-tshirt';
                }
                
                itemIcon.appendChild(icon);
                itemElement.appendChild(itemIcon);
                
                // Item name
                const itemName = document.createElement('div');
                itemName.className = 'outfit-item-name';
                itemName.textContent = item.name;
                itemElement.appendChild(itemName);
                
                itemsContainer.appendChild(itemElement);
            });
            
            outfitElement.appendChild(itemsContainer);
            
            // Weather note
            const weatherNote = document.createElement('div');
            weatherNote.className = 'weather-note';
            weatherNote.innerHTML = `<i class="fas fa-${this.weatherManager.weatherInfo.current.icon}"></i> مناسب لطقس ${this.weatherManager.weatherInfo.current.condition} بدرجة حرارة ${this.weatherManager.weatherInfo.current.temperature}°`;
            outfitElement.appendChild(weatherNote);
            
            lookContainer.appendChild(outfitElement);
            
        } catch (error) {
            console.error('Error loading today\'s look:', error);
            this.showLookError(lookContainer);
        }
    }

    // Show error message when today's look fails to load
    showLookError(container) {
        container.innerHTML = `
            <div class="error-container">
                <p class="error-message">حدث خطأ أثناء تحميل الإطلالة</p>
                <button class="retry-btn">إعادة المحاولة</button>
            </div>
        `;
    }

    // Setup retry button functionality
    setupRetryButton() {
        document.addEventListener('click', event => {
            if (event.target.classList.contains('retry-btn')) {
                this.loadTodaysLook();
            }
        });
    }

    // Load featured clothes based on weather
    loadFeaturedClothes() {
        const featuredContainer = document.getElementById('featured-clothes');
        
        try {
            const suitableClothes = this.dataManager.getSuitableClothes();
            
            if (!suitableClothes || suitableClothes.length === 0) {
                featuredContainer.innerHTML = '<p class="no-items-message">لا توجد ملابس مناسبة للطقس الحالي</p>';
                return;
            }
            
            // Clear previous content
            featuredContainer.innerHTML = '';
            
            // Display up to 6 suitable clothing items
            const itemsToShow = suitableClothes.slice(0, 6);
            
            itemsToShow.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'clothing-item';
                itemElement.dataset.id = item.id;
                
                const tempRange = `${item.minTemp}° - ${item.maxTemp}°`;
                
                itemElement.innerHTML = `
                    <div class="clothing-item-img">
                        ${item.image.includes('-') 
                            ? `<i class="fas fa-${item.image || 'tshirt'}"></i>`
                            : `<img src="images/clothes/${item.image}.svg" alt="${item.name}" onerror="this.onerror=null; this.innerHTML='<i class=\\'fas fa-${item.image}\\'></i>';">`
                        }
                    </div>
                    <div class="clothing-item-details">
                        <div class="clothing-item-name">${item.name}</div>
                        <div class="clothing-item-type">${item.type}</div>
                        <div class="clothing-item-temp">${tempRange}</div>
                    </div>
                `;
                
                featuredContainer.appendChild(itemElement);
            });
            
            // Add click event for clothing items
            this.setupClothingItemsEvents();
            
        } catch (error) {
            console.error('Error loading featured clothes:', error);
            featuredContainer.innerHTML = '<p class="error-message">حدث خطأ أثناء تحميل الملابس المقترحة</p>';
        }
    }

    // Setup events for clothing items
    setupClothingItemsEvents() {
        const clothingItems = document.querySelectorAll('.clothing-item');
        
        clothingItems.forEach(item => {
            item.addEventListener('click', () => {
                const itemId = parseInt(item.dataset.id);
                this.showClothingDetails(itemId);
            });
        });
    }

    // Show clothing item details
    showClothingDetails(itemId) {
        const allClothes = this.dataManager.getClothes();
        const item = allClothes.find(c => c.id === itemId);
        
        if (!item) return;
        
        // Create modal content
        const modalContent = `
            <div class="modal-content clothing-details">
                <span class="close-modal">&times;</span>
                <div class="clothing-image">
                    ${item.image.includes('-') 
                        ? `<i class="fas fa-${item.image || 'tshirt'} fa-4x"></i>`
                        : `<img src="images/clothes/${item.image}.svg" alt="${item.name}" onerror="this.onerror=null; this.innerHTML='<i class=\\'fas fa-${item.image} fa-4x\\'></i>';">`
                    }
                </div>
                <h3>${item.name}</h3>
                <div class="clothing-info">
                    <p><strong>النوع:</strong> ${item.type}</p>
                    <p><strong>الفئة:</strong> ${item.category}</p>
                    <p><strong>اللون:</strong> ${item.color}</p>
                    <p><strong>نطاق درجة الحرارة:</strong> ${item.minTemp}° - ${item.maxTemp}°</p>
                    <p><strong>مناسب للطقس:</strong> ${item.weather.join('، ')}</p>
                    ${item.description ? `<p><strong>الوصف:</strong> ${item.description}</p>` : ''}
                    ${item.price ? `<p><strong>السعر:</strong> ${item.price} ر.س</p>` : ''}
                </div>
                <div class="item-actions">
                    <button class="favorite-btn ${item.favorite ? 'active' : ''}">
                        <i class="fas fa-heart"></i>
                        <span>${item.favorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}</span>
                    </button>
                    <button class="share-item-btn">
                        <i class="fas fa-share-alt"></i>
                        <span>مشاركة</span>
                    </button>
                </div>
            </div>
        `;
        
        // Create and show modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = modalContent;
        
        document.body.appendChild(modal);
        
        // Show modal
        setTimeout(() => modal.style.display = 'block', 10);
        
        // Setup close functionality
        const closeModal = modal.querySelector('.close-modal');
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
            setTimeout(() => modal.remove(), 300);
        });
        
        // Setup favorite button
        const favoriteBtn = modal.querySelector('.favorite-btn');
        favoriteBtn.addEventListener('click', () => {
            // Toggle favorite status
            this.dataManager.toggleFavorite(itemId);
            
            // Toggle button appearance
            favoriteBtn.classList.toggle('active');
            const buttonText = favoriteBtn.querySelector('span');
            if (favoriteBtn.classList.contains('active')) {
                buttonText.textContent = 'إزالة من المفضلة';
            } else {
                buttonText.textContent = 'إضافة للمفضلة';
            }
        });
        
        // Setup share button
        const shareBtn = modal.querySelector('.share-item-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                // Show share UI
                const shareModal = document.createElement('div');
                shareModal.className = 'modal';
                shareModal.innerHTML = `
                    <div class="modal-content share-modal">
                        <span class="close-modal">&times;</span>
                        <h3>مشاركة ${item.name}</h3>
                        <p>شارك هذا المنتج مع أصدقائك</p>
                        <div class="share-options">
                            <button class="share-option" data-platform="whatsapp">
                                <i class="fab fa-whatsapp"></i>
                                <span>واتساب</span>
                            </button>
                            <button class="share-option" data-platform="facebook">
                                <i class="fab fa-facebook-f"></i>
                                <span>فيسبوك</span>
                            </button>
                            <button class="share-option" data-platform="twitter">
                                <i class="fab fa-twitter"></i>
                                <span>تويتر</span>
                            </button>
                            <button class="share-option" data-platform="email">
                                <i class="fas fa-envelope"></i>
                                <span>البريد الإلكتروني</span>
                            </button>
                            <button class="share-option" data-platform="copy">
                                <i class="fas fa-link"></i>
                                <span>نسخ الرابط</span>
                            </button>
                        </div>
                    </div>
                `;
                document.body.appendChild(shareModal);
                
                // Show modal
                setTimeout(() => shareModal.style.display = 'block', 10);
                
                // Setup close functionality
                const closeShareModal = shareModal.querySelector('.close-modal');
                closeShareModal.addEventListener('click', () => {
                    shareModal.style.display = 'none';
                    setTimeout(() => shareModal.remove(), 300);
                });
                
                // Setup share options
                const shareOptions = shareModal.querySelectorAll('.share-option');
                shareOptions.forEach(option => {
                    option.addEventListener('click', () => {
                        const platform = option.dataset.platform;
                        const itemUrl = `${window.location.origin}?item=${itemId}`;
                        
                        let shareUrl = '';
                        switch (platform) {
                            case 'whatsapp':
                                shareUrl = `https://wa.me/?text=${encodeURIComponent(`${item.name} - ${itemUrl}`)}`;
                                break;
                            case 'facebook':
                                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(itemUrl)}`;
                                break;
                            case 'twitter':
                                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${item.name}`)}&url=${encodeURIComponent(itemUrl)}`;
                                break;
                            case 'email':
                                shareUrl = `mailto:?subject=${encodeURIComponent(`${item.name}`)}&body=${encodeURIComponent(`${item.name} - ${itemUrl}`)}`;
                                break;
                            case 'copy':
                                // Copy to clipboard
                                navigator.clipboard.writeText(itemUrl).then(() => {
                                    alert('تم نسخ الرابط بنجاح!');
                                }).catch(err => {
                                    console.error('Error copying text: ', err);
                                });
                                break;
                        }
                        
                        if (shareUrl) {
                            window.open(shareUrl, '_blank');
                        }
                        
                        // Close share modal
                        shareModal.style.display = 'none';
                        setTimeout(() => shareModal.remove(), 300);
                    });
                });
            });
        }
    }

    // Show favorites for the current user
    showFavorites() {
        const featuredContainer = document.getElementById('featured-clothes');
        
        try {
            const favorites = this.dataManager.getFavorites();
            
            if (!favorites || favorites.length === 0) {
                featuredContainer.innerHTML = '<p class="no-items-message">لا توجد ملابس في المفضلة</p>';
                return;
            }
            
            // Clear previous content
            featuredContainer.innerHTML = '';
            
            favorites.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'clothing-item';
                itemElement.dataset.id = item.id;
                
                const tempRange = `${item.minTemp}° - ${item.maxTemp}°`;
                
                itemElement.innerHTML = `
                    <div class="clothing-item-img">
                        ${item.image.includes('-') 
                            ? `<i class="fas fa-${item.image || 'tshirt'}"></i>`
                            : `<img src="images/clothes/${item.image}.svg" alt="${item.name}" onerror="this.onerror=null; this.innerHTML='<i class=\\'fas fa-${item.image}\\'></i>';">`
                        }
                    </div>
                    <div class="clothing-item-details">
                        <div class="clothing-item-name">${item.name}</div>
                        <div class="clothing-item-type">${item.type}</div>
                        <div class="clothing-item-temp">${tempRange}</div>
                        <div class="favorite-indicator"><i class="fas fa-heart"></i></div>
                    </div>
                `;
                
                featuredContainer.appendChild(itemElement);
            });
            
            // Add click event for clothing items
            this.setupClothingItemsEvents();
            
        } catch (error) {
            console.error('Error loading favorites:', error);
            featuredContainer.innerHTML = '<p class="error-message">حدث خطأ أثناء تحميل المفضلة</p>';
        }
    }
}
